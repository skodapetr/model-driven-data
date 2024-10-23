import { ExtendedSemanticModelClass, ExtendedSemanticModelRelationship } from '@dataspecer/core-v2/semantic-model/concepts';
import { SCHEMA } from "@dataspecer/core/data-psm/data-psm-vocabulary";
import { DataPsmAssociationEnd, DataPsmClass, DataPsmExternalRoot, DataPsmSchema } from "@dataspecer/core/data-psm/model";
import { useFederatedObservableStore } from "@dataspecer/federated-observable-store-react/store";
import { useResource } from "@dataspecer/federated-observable-store-react/use-resource";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { MenuItem } from "@mui/material";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { UseDialogOpenFunction } from "../../../dialog";
import { useAsyncMemo } from "../../../hooks/use-async-memo";
import { useDataPsmAndInterpretedPim } from "../../../hooks/use-data-psm-and-interpreted-pim";
import { ReplaceDataPsmAssociationEndWithReference } from "../../../operations/replace-data-psm-association-end-with-reference";
import { ReplaceAssociationWithReferenceDialog } from "./replace-association-with-reference-dialog";

export const ReplaceAssociationEndWithReference: React.FC<{dataPsmAssociationEnd: string, open: UseDialogOpenFunction<typeof ReplaceAssociationWithReferenceDialog>}> = ({dataPsmAssociationEnd, open}) => {
    const store = useFederatedObservableStore();
    const {t} = useTranslation("psm");

    const {relationshipEnd} = useDataPsmAndInterpretedPim<DataPsmAssociationEnd, ExtendedSemanticModelRelationship>(dataPsmAssociationEnd);
    const {resource: pimClass} = useResource<ExtendedSemanticModelClass>(relationshipEnd?.concept ?? null);

    // This method isn't ideal, does not refresh when
    const [availableReferences] = useAsyncMemo(async () => {
        const foundExistingDataPsms: string[] = [];

        if (pimClass?.iri) {
            // List all PSM schemas from linked stores
            const schemas = await store.listResourcesOfType(SCHEMA);

            for (const schemaIri of schemas) {
                const schema = await store.readResource(schemaIri) as DataPsmSchema;
                if (schema === null) continue;
                for (const rootIri of schema.dataPsmRoots) {
                    const root = await store.readResource(rootIri);

                    if (DataPsmClass.is(root)) {
                        if (root.dataPsmInterpretation === null) continue;
                        const pim = await store.readResource(root.dataPsmInterpretation) as ExtendedSemanticModelClass;
                        if (pim === null) continue;
                        if (pim.iri === pimClass.iri) {
                            foundExistingDataPsms.push(schemaIri);
                        }
                    } else if (DataPsmExternalRoot.is(root)) {
                        if (root.dataPsmTypes.length === 0) continue;
                        const pim = await store.readResource(root.dataPsmTypes[0]) as ExtendedSemanticModelClass;
                        if (pim === null) continue;
                        if (pim.iri === pimClass.iri) {
                            foundExistingDataPsms.push(schemaIri);
                        }
                    }
                }
            }
        }

        return foundExistingDataPsms;
    }, [pimClass]);

    const selected = useCallback((dataPsmSchemaIri: string) => {
        const op = new ReplaceDataPsmAssociationEndWithReference(dataPsmAssociationEnd, dataPsmSchemaIri);
        store.executeComplexOperation(op).then();
    }, [dataPsmAssociationEnd, store]);

    return <>
        {availableReferences && availableReferences.length > 0 &&
            <MenuItem
                onClick={() => open({roots: availableReferences as string[], onSelect: selected})}
                title={t("replace with reference")}
            ><AutorenewIcon /></MenuItem>
        }
    </>
}
