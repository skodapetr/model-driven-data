import { ExtendedSemanticModelClass, SemanticModelClass, SemanticModelEntity } from "@dataspecer/core-v2/semantic-model/concepts";
import { DataPsmClass, DataPsmContainer } from "@dataspecer/core/data-psm/model";
import { useFederatedObservableStore } from "@dataspecer/federated-observable-store-react/store";
import { useResource } from "@dataspecer/federated-observable-store-react/use-resource";
import AddIcon from "@mui/icons-material/Add";
import { MenuItem } from "@mui/material";
import React, { memo, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDialog } from "../../../dialog";
import { useDataPsmAndInterpretedPim } from "../../../hooks/use-data-psm-and-interpreted-pim";
import { useToggle } from "../../../hooks/use-toggle";
import { AddClassSurroundings } from "../../../operations/add-class-surroundings";
import { CreateNonInterpretedAssociationToClass } from "../../../operations/create-non-interpreted-association";
import { CreateContainer } from "../../../operations/create-container";
import { CreateInclude } from "../../../operations/create-include";
import { AddInterpretedSurroundingsDialog, WikidataAddInterpretedSurroundingsDialog } from "../../add-interpreted-surroundings";
import { ConfigurationContext } from "../../App";
import { AddSpecializationDialog } from "../add-specialization/add-specialization-dialog";
import { DataPsmBaseRow, RowSlots } from "../base-row";
import { DataPsmGetLabelAndDescription } from "../common/DataPsmGetLabelAndDescription";
import { InheritanceOrTree } from "../common/use-inheritance-or";
import { ClassPartContext, ObjectContext } from "../data-psm-row";
import { ReplaceAlongInheritanceDialog } from "../replace-along-inheritance/replace-along-inheritance-dialog";
import { Span, sxStyles } from "../styles";
import { DataPsmClassSubtree } from "../subtrees/class-subtree";

/**
 * Because classes and containers are so similar, they share this component to make implementation simpler.
 */
export const DataPsmClassItem: React.FC<{
  iri: string,
  inheritanceOrTree?: InheritanceOrTree
} & RowSlots & (ObjectContext | ClassPartContext)> = memo((props) => {
  const {t} = useTranslation("psm");

  // Decide on the type of the entity
  let type: string | null = null;
  const {resource: bareEntity} = useResource(props.iri);
  if (bareEntity && DataPsmClass.is(bareEntity)) { type = "class"; }
  if (bareEntity && DataPsmContainer.is(bareEntity)) { type = "container"; }
  const container = bareEntity as DataPsmContainer;
  const objectContext = props as ObjectContext;
  const partContext = props as ClassPartContext;

  const {operationContext} = useContext(ConfigurationContext);

  const {dataPsmResource: dataPsmClass, pimResource: pimClass} = useDataPsmAndInterpretedPim<DataPsmClass, ExtendedSemanticModelClass>(type === "class" ? props.iri : (type === "container" ? partContext.parentDataPsmClassIri : null));
  const readOnly = false;
  const isCodelist = pimClass?.isCodelist ?? false;
  const cimClassIri = pimClass?.iri;

  const AddSurroundings = useDialog(false ? WikidataAddInterpretedSurroundingsDialog : AddInterpretedSurroundingsDialog, ["dataPsmClassIri", "forPimClassIri"]);

  const store = useFederatedObservableStore();
  const include = useCallback(() =>
      props.iri && store.executeComplexOperation(new CreateInclude(prompt("Insert data-psm class iri") as string, props.iri))
    , [store, props.iri]);
  const addNonInterpretedAssociationClass = useCallback(() =>
    props.iri && store.executeComplexOperation(new CreateNonInterpretedAssociationToClass(props.iri))
  , [store, props.iri, operationContext]);
  const addContainer = useCallback((type: string) => store.executeComplexOperation(new CreateContainer(props.iri, type)), [store, props.iri]);

  const collapseSubtree = useToggle(objectContext.contextType !== "reference");

  const thisStartRow = <>
    {type === "class" &&
        <>
            <DataPsmGetLabelAndDescription dataPsmResourceIri={props.iri}>
              {(label, description) =>
                <Span sx={sxStyles.class} title={description}>{label ?? "[unnamed class]"}</Span>
              }
            </DataPsmGetLabelAndDescription>

          {typeof dataPsmClass.dataPsmTechnicalLabel === "string" && dataPsmClass.dataPsmTechnicalLabel.length > 0 &&
              <> (<Span sx={sxStyles.technicalLabel}>{dataPsmClass.dataPsmTechnicalLabel}</Span>)</>
          }
        </>
    }
    {type === "container" &&
      <Span sx={sxStyles.container}>{container.dataPsmContainerType}{" "}{t("container")}</Span>
    }
  </>;

  const psmClassForSurroundings = (objectContext?.contextType === "association" && !pimClass) ? objectContext.parentDataPsmClassIri : dataPsmClass?.iri;
  const {pimResource: pimClassForSurroundings} = useDataPsmAndInterpretedPim<DataPsmClass, SemanticModelClass>(psmClassForSurroundings);
  const pimClassIdForSurroundings = pimClassForSurroundings?.id;

  const addSurroundings = (operation: {
    resourcesToAdd: [string, boolean][],
    sourcePimModel: SemanticModelEntity[],
    forDataPsmClass: DataPsmClass,
  }) => {
    const addClassSurroundings = new AddClassSurroundings(operation.forDataPsmClass, pimClassForSurroundings, operation.sourcePimModel, operation.resourcesToAdd);
    addClassSurroundings.setContext(operationContext);
    store.executeComplexOperation(addClassSurroundings).then();
  };

  const thisMenu = <>
    {pimClassIdForSurroundings && !readOnly && !isCodelist && <MenuItem onClick={() => AddSurroundings.open({
      selected: addSurroundings
    })} title={t("button add")}><AddIcon/></MenuItem>}
  </>;

  const ReplaceAlongHierarchy = useDialog(ReplaceAlongInheritanceDialog);
  const AddSpecialization = useDialog(AddSpecializationDialog, ["wrappedOrIri"]);

  const thisHiddenMenu = useMemo(() => (close: () => void) => <>
    <MenuItem
      onClick={() => {
        close();
        dataPsmClass?.iri && ReplaceAlongHierarchy.open({dataPsmClassIri: dataPsmClass.iri});
      }}
      title={t("button replace along inheritance")}>
      {t("button replace along inheritance")}
    </MenuItem>
    <MenuItem
      onClick={() => {
        close();
        dataPsmClass?.iri && AddSpecialization.open({dataPsmClassIri: dataPsmClass.iri});
      }}
      title={t("button add specialization")}>
      {t("button add specialization")}
    </MenuItem>
    <MenuItem
      onClick={() => {
        close();
        include();
      }}>
      {t("Add import")}
    </MenuItem>
    <MenuItem onClick={() => { close(); addNonInterpretedAssociationClass(); }}>{t("Add non-interpreted class")}</MenuItem>
    <MenuItem onClick={() => { close(); addContainer("sequence"); }}>{t("Add xs:sequence container")}</MenuItem>
    <MenuItem onClick={() => { close(); addContainer("choice"); }}>{t("Add xs:choice container")}</MenuItem>
    {/* <MenuItem onClick={() => { close(); addContainer("all"); }}>{t("Add xs:all container")}</MenuItem> */}
  </>, [t, dataPsmClass?.iri, ReplaceAlongHierarchy, AddSpecialization, include]);

  const startRow = props.startRow ? [...props.startRow, thisStartRow] : [thisStartRow];
  const menu = props.menu ? [thisMenu, ...props.menu] : [thisMenu];
  const hiddenMenu = props.hiddenMenu ? [...props.hiddenMenu, thisHiddenMenu] : [thisHiddenMenu];

  const iris = useMemo(() => [...props.iris ?? [], props.iri as string], [props.iris, props.iri]);

  return <>
    <DataPsmBaseRow
      {...props}
      startRow={startRow}
      subtree={<DataPsmClassSubtree {...props as ObjectContext} iri={props.iri} parentDataPsmClassIri={dataPsmClass.iri} isOpen={collapseSubtree.isOpen} inheritanceOrTree={props.inheritanceOrTree ?? undefined} />}
      collapseToggle={collapseSubtree}
      menu={menu}
      hiddenMenu={hiddenMenu}
      iris={iris}
    />

    <AddSurroundings.Component dataPsmClassIri={props.iri} forPimClassIri={pimClassIdForSurroundings} />
    <ReplaceAlongHierarchy.Component />
    <AddSpecialization.Component wrappedOrIri={objectContext.contextType === "or" ? objectContext.parentDataPsmOrIri : undefined} />
  </>;
});
