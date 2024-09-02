import { SemanticModelClass } from '@dataspecer/core-v2/semantic-model/concepts';
import {PimClass} from "@dataspecer/core/pim/model";
import {PimCreateClass} from "@dataspecer/core/pim/operation";
import {copyPimPropertiesFromResourceToOperation} from "./copyPimPropertiesFromResourceToOperation";
import {FederatedObservableStore} from "@dataspecer/federated-observable-store/federated-observable-store";

export async function createPimClassIfMissing(
    resource: SemanticModelClass,
    pimSchema: string,
    store: FederatedObservableStore,
): Promise<string> {
    const existingPimIri = await store.getPimHavingInterpretation(resource.id as string, PimClass.TYPE, pimSchema);

    if (existingPimIri) {
        // todo it does not perform any checks
        return existingPimIri;
    }

    const pimCreateClass = new PimCreateClass();
    copyPimPropertiesFromResourceToOperation(resource, pimCreateClass);
    pimCreateClass.pimIsCodelist = false;
    const pimCreateClassResult = await store.applyOperation(pimSchema, pimCreateClass);
    return pimCreateClassResult.created[0] as string;
}
