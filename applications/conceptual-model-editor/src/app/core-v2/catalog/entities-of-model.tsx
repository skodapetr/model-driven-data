import { EntityModel } from "@dataspecer/core-v2/entity-model";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { ExternalSemanticModel } from "@dataspecer/core-v2/semantic-model/simplified";
import { useEffect, useState } from "react";
import { useClassesContext } from "../context/classes-context";
import { shortenStringTo } from "../util/utils";
import { EntityRow } from "./entity-catalog-row";
import { useModelGraphContext } from "../context/graph-context";
import { SemanticModelClass } from "@dataspecer/core-v2/semantic-model/concepts";
import { useEntityDetailDialog } from "../dialogs/entity-detail-dialog";
import { getRandomName } from "~/app/utils/random-gen";
import { useModifyEntityDialog } from "../dialogs/modify-entity-dialog";
import { ColorPicker } from "../util/color-picker";
import { randomColorFromPalette, tailwindColorToHex } from "~/app/utils/color-utils";
import { useCreateClassDialog } from "../dialogs/create-class-dialog";

export const EntitiesOfModel = (props: { model: EntityModel }) => {
    const { classes, allowedClasses, setAllowedClasses } = useClassesContext();
    const { aggregatorView, addClassToModel } = useModelGraphContext();
    const { isEntityDetailDialogOpen, EntityDetailDialog, openEntityDetailDialog } = useEntityDetailDialog();
    const { isModifyEntityDialogOpen, ModifyEntityDialog, openModifyEntityDialog } = useModifyEntityDialog();
    const { isCreateClassDialogOpen, CreateClassDialog, openCreateClassDialog } = useCreateClassDialog();

    const [isOpen, setIsOpen] = useState(true);
    const { model } = props;
    const activeVisualModel = aggregatorView.getActiveVisualModel();
    const [backgroundColor, setBackgroundColor] = useState(activeVisualModel?.getColor(model.getId()) || "#000001");

    useEffect(() => {
        console.log("entities-of-model, use-effect: ", activeVisualModel, model.getId());
        // fixme: move it elsewhere
        let color = activeVisualModel?.getColor(model.getId());
        if (!color) {
            color = randomColorFromPalette();
            activeVisualModel?.setColor(model.getId(), color);
        }
        //
        setBackgroundColor(color ?? "#ff00ff");
    }, [activeVisualModel]);

    const modelId = model.getId();
    let clses: JSX.Element[];

    const toggleAllow = async (model: EntityModel, classId: string) => {
        console.log("in toggle allow", aggregatorView, model, classId, allowedClasses);
        if (!(model instanceof ExternalSemanticModel)) return;

        if (allowedClasses.includes(classId)) {
            console.log("in toggle allow, removing from allowed classes");
            setAllowedClasses(allowedClasses.filter((allowed) => allowed !== classId));
            await model.releaseClassSurroundings(classId);
        } else {
            console.log("in toggle allow, adding to allowed classes");
            setAllowedClasses([...allowedClasses, classId]);
            await model.allowClassSurroundings(classId);
        }
    };

    const handleOpenDetail = (cls: SemanticModelClass) => {
        openEntityDetailDialog(cls);
    };

    const handleAddConcept = (model: InMemorySemanticModel) => {
        openCreateClassDialog(model);
    };

    const handleAddClassToActiveView = (classId: string) => {
        const updateStatus = activeVisualModel?.updateEntity(classId, { visible: true });
        if (!updateStatus) {
            aggregatorView?.getActiveVisualModel()?.addEntity({ sourceEntityId: classId });
        }
    };

    const handleRemoveClassFromActiveView = (classId: string) => {
        aggregatorView?.getActiveVisualModel()?.updateEntity(classId, { visible: false });
    };

    const handleOpenModification = (model: InMemorySemanticModel, cls: SemanticModelClass) => {
        openModifyEntityDialog(model, cls);
    };

    const classesLength = classes.size;
    if (model instanceof ExternalSemanticModel) {
        clses = [...classes.entries()]
            .filter(([_, cwo]) => cwo.origin == modelId)
            .map(([clsId, cwo]) => (
                // expandable-row, e.g. slovník.gov.cz
                <EntityRow
                    cls={cwo}
                    key={clsId + aggregatorView.getActiveVisualModel()?.getId() + classesLength}
                    expandable={{
                        toggleHandler: () => toggleAllow(model, clsId),
                        expanded: () => allowedClasses.includes(clsId),
                    }}
                    openDetailHandler={() => handleOpenDetail(cwo.cls)}
                    modifiable={null}
                    addToViewHandler={() => handleAddClassToActiveView(clsId)}
                    removeFromViewHandler={() => handleRemoveClassFromActiveView(clsId)}
                    isVisibleOnCanvas={() =>
                        aggregatorView.getActiveVisualModel()?.getVisualEntity(clsId)?.visible ?? false
                    }
                />
            ));
    } else if (model instanceof InMemorySemanticModel) {
        clses = [...classes.entries()]
            .filter(([_, cwo]) => cwo.origin == model.getId())
            .map(([clsId, cwo]) => (
                // modifiable-row, e.g. local
                <EntityRow
                    cls={cwo}
                    key={clsId + aggregatorView.getActiveVisualModel()?.getId() + classesLength}
                    expandable={null}
                    openDetailHandler={() => handleOpenDetail(cwo.cls)}
                    modifiable={{ openModificationHandler: () => handleOpenModification(model, cwo.cls) }}
                    addToViewHandler={() => handleAddClassToActiveView(clsId)}
                    removeFromViewHandler={() => handleRemoveClassFromActiveView(clsId)}
                    isVisibleOnCanvas={() =>
                        aggregatorView.getActiveVisualModel()?.getVisualEntity(clsId)?.visible ?? false
                    }
                />
            ))
            .concat(
                <div key="add-a-concept-" className="flex flex-row justify-between whitespace-nowrap">
                    Add a concept
                    <button className="ml-2 bg-teal-300 px-1" onClick={() => handleAddConcept(model)}>
                        Add
                    </button>
                </div>
            );
    } else {
        clses = [...classes.values()]
            .filter((v) => v.origin == model.getId())
            .map((v) => (
                // non-expandable, e.g. dcat
                <EntityRow
                    cls={v}
                    key={v.cls.id + aggregatorView.getActiveVisualModel()?.getId() + classesLength}
                    expandable={null}
                    openDetailHandler={() => openEntityDetailDialog(v.cls)}
                    modifiable={null}
                    addToViewHandler={() => handleAddClassToActiveView(v.cls.id)}
                    removeFromViewHandler={() => handleRemoveClassFromActiveView(v.cls.id)}
                    isVisibleOnCanvas={() =>
                        aggregatorView.getActiveVisualModel()?.getVisualEntity(v.cls.id)?.visible ?? false
                    }
                />
            ));
    }

    return (
        <>
            <li key={modelId} style={{ backgroundColor: tailwindColorToHex(backgroundColor) }}>
                <div className="flex flex-row justify-between">
                    <h4>Ⓜ {shortenStringTo(modelId)}</h4>
                    <div className="flex flex-row">
                        <ColorPicker
                            currentColor={backgroundColor}
                            saveColor={(color) => {
                                console.log(color, activeVisualModel);
                                setBackgroundColor(color);
                                activeVisualModel?.setColor(modelId, color);
                            }}
                        />
                        <button onClick={() => setIsOpen((prev) => !prev)}>{isOpen ? "🔼" : "🔽"}</button>
                    </div>
                </div>
                {isOpen && <ul className="ml-1">{clses}</ul>}
            </li>
            {isEntityDetailDialogOpen && <EntityDetailDialog />}
            {isModifyEntityDialogOpen && <ModifyEntityDialog />}
            {isCreateClassDialogOpen && <CreateClassDialog />}
        </>
    );
};