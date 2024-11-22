import { Dispatch, SetStateAction, useState } from "react";
import { createExtendSelectionState, ExtendSelectionState, useExtendSelectionController } from "./extend-selection-dialog-controller";
import { DialogProps, DialogWrapper } from "../dialog-api";
import { useActions } from "../../action/actions-react-binding";
import { ExtensionType } from "../../action/extend-selection-action";
import { Selections } from "../../action/filter-selection-action";

/**
 * Represents one concrete extension/filter data used to render checkbox for the extension/filter.
 */
type CheckboxData = {
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>;
    checkboxText: string;
    checkboxTooltip: string;
}

/**
 * {@link CheckboxData} but with one additional property for the type of extension it represents
 */
type ExtensionData = {
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>;
    checkboxText: string;
    checkboxTooltip: string;
    extensionType: ExtensionType;
}

/**
 * Creates element of type {@link ExtensionData} from given arguments and puts it at the end of {@link checkboxStates} parameter.
 * @returns The created element
 */
const useCreateExtensionDataStateAndSaveIt = (checkboxStates: ExtensionData[], defaultStateValue: boolean, checkboxText: string,
                                                checkboxTooltip:string, extensionType: ExtensionType): ExtensionData => {
    const [checked, setChecked] = useState<boolean>(defaultStateValue);
    const checkboxData = {
        checked,
        setChecked,
        checkboxText,
        checkboxTooltip,
        extensionType
    };
    checkboxStates.push(checkboxData);

    return checkboxData;
};


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export const createExtendSelectionDialog = (
    onConfirm: (state: ExtendSelectionState) => void | null,
    onClose: () => void,
    selections: Selections,
    setSelectionsInDiagram: (newSelection: Selections) => void,
  ): DialogWrapper<ExtendSelectionState> => {
    return {
      label: "extend-selection-dialog.label",
      component: CreateExtendSelectionDialog,
      state: createExtendSelectionState(selections, setSelectionsInDiagram),
      confirmLabel: "extend-selection-dialog.btn-ok",
      cancelLabel: "extend-selection-dialog.btn-cancel",
      validate: null,
      onConfirm,
      onClose: onClose,
      dialogClassNames: "bg-white bg-opacity-80 mt-0",     // ChatGPT and https://stackoverflow.com/questions/73925255/how-can-the-html-dialog-element-be-positioned-according-to-normal-flow-when-op
    };
  };


export const CreateExtendSelectionDialog = (props: DialogProps<ExtendSelectionState>) => {
    const state = props.state;
    const controller = useExtendSelectionController(props);

    const extensionCheckboxStates: ExtensionData[] = [];

    // TODO: Maybe should be part of state? in similiar fashion to the filter selection, but for now it can be here, since the create part of dialog doesn't need it
    const {checked: extendByAssociationTargets,
        setChecked: setExtendByAssociationTargets} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, true,
                                                                                            "🔵⭢🔴", "Extend by association targets", "ASSOCIATION-TARGET");
    const {checked: extendByAssociationSources,
            setChecked: setExtendByAssociationSources} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, true,
                                                                                            "🔴⭢🔵", "Extend by association sources", "ASSOCIATION-SOURCE");

    const {checked: extendByGeneralizationParents,
        setChecked: setExtendByGeneralizationParents} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, false,
                                                                                            "🔵⇒🔴", "Extend by generalization parents", "GENERALIZATION-PARENT");
    const {checked: extendByGeneralizationChildren,
        setChecked: setExtendByGeneralizationChildren} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, false,
                                                                                            "🔴⇒🔵", "Extend by generalization children", "GENERALIZATION-CHILD");


    const {checked: extendByProfiledEdgesTargets,
        setChecked: setExtendByProfiledEdgesTargets} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, false,
                                                                                          "🔵⇢🔴", "Extend by profiled edge targets", "PROFILE-EDGE-TARGET");
    const {checked: extendByProfiledEdgesSources,
        setChecked: setExtendByProfiledEdgesSources} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, false,
                                                                                           "🔴⇢🔵", "Extend by profiled edge sources", "PROFILE-EDGE-SOURCE");

        const {checked: extendByClassProfileParents,
        setChecked: setExtendByClassProfileParents} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, false,
                                                                                            "🟦⇢🟥", "Extend by class profile parents TODO: Rename", "PROFILE-CLASS-PARENT");
    const {checked: extendByClassProfileChildren,
        setChecked: setExtendByClassProfileChildren} = useCreateExtensionDataStateAndSaveIt(extensionCheckboxStates, false,
                                                                                            "🟥⇢🟦", "Extend by class profile children TODO: Rename", "PROFILE-CLASS-CHILD");

    // Maybe should be part of state?
    const { extendSelection } = useActions();


    /**
     * Component which renders given {@link CheckboxData} as checkbox.
     * @param checkboxData
     * @returns
     */
    const extensionOptionCheckboxComponent = (checkboxData: CheckboxData) => {
        return <div>
                    <label title={checkboxData.checkboxTooltip}>
                        <input type="checkbox"
                                checked={checkboxData.checked}
                                onChange={(event) => {
                                    checkboxData.setChecked(event.target.checked);
                                }}>
                        </input>
                        {checkboxData.checkboxText}
                    </label>
        </div>;
    };




    // Method generated by ChatGPT
    /**
     * Represent grid based style which places elements at columns of size 2.
     */
    const gridContainerStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateRows: "repeat(2, auto)",
        gap: "0px",
        columnGap: "50px",
        justifyContent: "start",
    };


    /**
     * Component representing the part of dialog with the extension settings
     * @returns
     */
    const SelectorPanel = () => (
        <div>
            <h4 className="text-xl font-bold">Extend current selection:</h4>
            <div className="cursor-help" title="Blue color (🔵) indicates selected element, Red color (🔴) indicates element which was not selected, but will be. For example:
🔵⭢🔴=Extend current selection by association targets">
                                ℹ
            </div>
            <div className="flex flex-row">
                <div style={gridContainerStyle}>
                    {extensionCheckboxStates.map(checkboxState => {
                        return extensionOptionCheckboxComponent(checkboxState);
                    })}

                </div>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-4 border border-blue-700 rounded ml-12"
                        // Should be in controller?, but then most of the data should be part of state, so it can be actually in controller
                        onClick={e => {
                            const relevantExtensionTypes = extensionCheckboxStates.map(checkboxState => {
                                if(checkboxState.checked) {
                                    return checkboxState.extensionType;
                                }
                                return null;
                            }).filter(e => e !== null);

                            extendSelection(state.selections.nodeSelection, relevantExtensionTypes, "ONLY-VISIBLE", null).then(extension => {
                                    controller.setSelections({
                                        nodeSelection: state.selections.nodeSelection.concat(extension.nodeSelection),
                                        edgeSelection: state.selections.edgeSelection.concat(extension.edgeSelection),
                                    })
                                }).catch(console.error);
                        }}>
                    Extend
                </button>
            </div>
        </div>
    );

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    const SimpleHorizontalLineSeparator = () => {
        // Kinda generated by ChatGPT
        return <div className="mb-2 mt-2 border-t border-gray-300"></div>;
    };


    /**
     * Component with the main content of dialog. So everything except header and footer.
     */
    const DialogContent = () => {
        return <div>
            <SelectorPanel></SelectorPanel>
            <SimpleHorizontalLineSeparator/>
        </div>;
    };


    return <DialogContent/>;
};
