import { createDefaultEntityModel } from "./entity-model/default-entity-model";
import { MODEL_VISUAL_TYPE, VisualEntity, VisualNode, isVisualNode } from "./visual-entity";
import { WritableVisualModel } from "./visual-model";
import { createDefaultVisualModelFactory } from "./visual-model-factory";

const factory = createDefaultVisualModelFactory();

test("Create default visual model.", async () => {
  const identifier = "abc";
  const model = await createModel(identifier);
  //
  expect(model.getIdentifier()).toBe(identifier);
});

async function createModel(identifier: string) : Promise<WritableVisualModel> {
  const internal = createDefaultEntityModel(MODEL_VISUAL_TYPE, identifier);
  const model = await factory.createVisualModel(internal);
  expect(model).not.toBeNull;
  // TypeScript does not infer the not null from previous line.
  return model as WritableVisualModel;
}

test("Set and delete model color.", async () => {
  const model = await createModel("abc");
  //
  expect(model.getModelColor("1234")).toBeNull();
  model.setModelColor("1234", "#00ff00");
  expect(model.getModelColor("1234")).toBe("#00ff00");
  model.deleteModelColor("1234");
  expect(model.getModelColor("1234")).toBeNull();
});

test("Set and delete visual entity.", async () => {
  const model = await createModel("abc");
  //
  expect(model.getVisualEntityForRepresented("s")).toBeNull();
  model.addVisualNode({
    representedEntity: "s",
    model: "m",
    content: [],
    visualModels: [],
    position: { x: 100, y: 200, anchored: null },
  });
  const actual = model.getVisualEntityForRepresented("s");
  expect(actual).not.toBeNull();
  expect(isVisualNode(actual as VisualEntity)).toBeTruthy();
  const visualNode = actual as VisualNode;
  expect(visualNode.representedEntity).toBe("s");
  model.deleteVisualEntity(visualNode.identifier);
  expect(model.getVisualEntityForRepresented("s")).toBeNull();
});
