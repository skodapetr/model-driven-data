import { MemoryStore } from "@dataspecer/core/core";
import { dataPsmExecutors } from "@dataspecer/core/data-psm/data-psm-executors";
import { DataPsmCreateSchema } from "@dataspecer/core/data-psm/operation";
import { DataSpecification } from "@dataspecer/core/data-specification/model";
import { pimExecutors } from "@dataspecer/core/pim/executor";
import { PimCreateSchema } from "@dataspecer/core/pim/operation";
import { FederatedObservableStore } from "@dataspecer/federated-observable-store/federated-observable-store";
import { useMemo } from "react";
import { DefaultClientConfiguration } from "../../../configuration";
import { useAsyncMemo } from "../../hooks/use-async-memo";
import { OperationContext } from "../../operations/context/operation-context";
import { Configuration, useProvidedSourceSemanticModel } from "../configuration";

/**
 * Creates a configuration, that is purely local and does not require any
 * connection to the server. Purpose of this configuration is to be used for
 * testing purposes.
 * @param enabled
 */
export const useLocalConfiguration = (
    enabled: boolean,
): Configuration | null => {
    const store = useMemo(() => enabled ? new FederatedObservableStore() : null, [enabled]);
    const sourceSemanticModel = useProvidedSourceSemanticModel(null, null);
    const operationContext = useMemo(() => {
        const context = new OperationContext();
        context.labelRules = {
            languages: [DefaultClientConfiguration.technicalLabelLanguages],
            namingConvention: DefaultClientConfiguration.technicalLabelCasingConvention,
            specialCharacters: DefaultClientConfiguration.technicalLabelSpecialCharacters,
        };
        return context;
    }, []);

    const [dataSpecification] = useAsyncMemo(async () => {
        if (enabled && store) {
            const memoryStore = MemoryStore.create("https://ofn.gov.cz", [...dataPsmExecutors, ...pimExecutors]);

            const createPimSchema = new PimCreateSchema();
            const createPimSchemaResult = await memoryStore.applyOperation(createPimSchema);
            const pimSchemaIri = createPimSchemaResult.created[0];

            const createDataPsmSchema = new DataPsmCreateSchema();
            const createDataPsmSchemaResult = await memoryStore.applyOperation(createDataPsmSchema);
            const dataPsmSchemaIri = createDataPsmSchemaResult.created[0];

            const dataSpecification = new DataSpecification();
            dataSpecification.iri = "http://default-data-specification"
            dataSpecification.pim = pimSchemaIri;
            dataSpecification.psms = [dataPsmSchemaIri];

            store.addStore(memoryStore);

            return dataSpecification;
        }
    }, [enabled, store]);

    if (enabled) {
        return {
            store: store as FederatedObservableStore,
            dataSpecifications: dataSpecification ? { [dataSpecification.iri as string]: dataSpecification } : {},
            dataSpecificationIri: dataSpecification?.iri ?? null,
            dataPsmSchemaIri: dataSpecification?.psms[0] ?? null,
            sourceSemanticModel,
            operationContext,
        };
    } else {
        return null;
    }
}
