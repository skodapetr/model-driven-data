import {CoreOperation, CoreOperationResult} from "../../operation";
import {CoreResource} from "../../core-resource";
import {
  CreateNewIdentifier,
  CoreOperationExecutor,
  CoreExecutorResult,
} from "../../executor";
import {assert, assertNot} from "../../utilities/assert";
import {clone} from "../../utilities/clone";
import {CoreResourceReader} from "../../core-reader";
import {CoreResourceWriter} from "../../core-writer";

type ExecutorMap = { [type: string]: CoreOperationExecutor<any> };

export class MemoryStore implements CoreResourceReader, CoreResourceWriter {

  private readonly executors: ExecutorMap;

  private readonly createNewIdentifier: CreateNewIdentifier;

  private readonly baseIri: string;

  private readonly operations: CoreOperation[] = [];

  private resources: { [iri: string]: CoreResource } = {};

  protected constructor(
    baseIri: string,
    executors: ExecutorMap,
    createNewIdentifier: CreateNewIdentifier | null) {
    this.executors = executors;
    if (createNewIdentifier === null) {
      this.createNewIdentifier = (name) => {
        return this.baseIri + "/" + name + "/" + this.createUniqueIdentifier();
      };
    } else {
      this.createNewIdentifier = createNewIdentifier;
    }
  }

  static create(
    baseIri: string,
    executors: CoreOperationExecutor<any>[],
    createNewIdentifier: CreateNewIdentifier | null = null,
  ): MemoryStore {
    const executorForTypes: ExecutorMap = {};
    executors.forEach(executor => {
      assert(executorForTypes[executor.type] === undefined,
        `Only one executor can be declared for given type '${executor.type}'`);
      executorForTypes[executor.type] = executor;
    });
    return new MemoryStore(baseIri, executorForTypes, createNewIdentifier);
  }

  async listResources(): Promise<string[]> {
    return Object.keys(this.resources);
  }

  listResourcesOfType(typeIri: string): Promise<string[]> {
    const result: string[] = [];
    for (const [iri, resource] of Object.entries(this.resources)) {
      if (resource.types.includes(typeIri)) {
        result.push(iri);
      }
    }
    return Promise.resolve(result);
  }

  async readResource(iri: string): Promise<CoreResource> {
    // TODO: We may need to create a deep copy here.
    return this.resources[iri];
  }

  async applyOperation(operation: CoreOperation): Promise<CoreOperationResult> {
    const executor = this.findCoreExecutor(operation);

    const executorResult = await executor.execute(
      this, this.createNewIdentifier, operation);

    if (executorResult.failed) {
      throw new Error("Operation failed: " + executorResult.message);
    }

    // We add operation once it is cleared that it can be executed.
    const storedOperation = this.addOperation(operation);

    this.resources = {
      ...this.resources,
      ...executorResult.changed,
      ...executorResult.created,
    };
    executorResult.deleted.forEach((iri) => delete this.resources[iri]);
    return this.prepareOperationResult(executorResult, storedOperation);
  }

  protected findCoreExecutor(
    operation: CoreOperation,
  ): CoreOperationExecutor<any> {
    const candidates: CoreOperationExecutor<any>[] = [];
    operation.types.forEach(type => {
      const executor = this.executors[type];
      if (executor !== undefined) {
        candidates.push(executor);
      }
    });
    assert(
      candidates.length === 1,
      "Can't determine executor for given operation.",
    );
    return candidates[0];
  }

  protected addOperation<T extends CoreOperation>(operation: T): T {
    const result = clone(operation) as T;
    assertNot(this.baseIri === null, "Base IRI is not defined.");
    result.iri = this.createNewIdentifier("operation");
    if (this.operations.length > 0) {
      result.parent = this.operations[this.operations.length - 1].iri;
    }
    this.operations.push(result);
    return result;
  }

  protected createUniqueIdentifier(): string {
    return Date.now() + "-xxxx-xxxx-yxxx".replace(/[xy]/g, (pattern) => {
      const code = Math.random() * 16 | 0;
      const result = pattern == "x" ? code : (code & 0x3 | 0x8);
      return result.toString(16);
    });
  }

  protected prepareOperationResult(
    executorResult: CoreExecutorResult,
    operation: CoreOperation,
  ): CoreOperationResult {
    const result = executorResult.operationResult;
    result.operation = operation;
    result.created = Object.keys(executorResult.created);
    result.changed = Object.keys(executorResult.changed);
    result.deleted = executorResult.deleted;
    return result;
  }

}