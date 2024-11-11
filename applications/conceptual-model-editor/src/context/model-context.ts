import React, { useContext } from "react";

import { SemanticModelAggregator, type SemanticModelAggregatorView } from "@dataspecer/core-v2/semantic-model/aggregator";
import type { EntityModel } from "@dataspecer/core-v2/entity-model";
import type { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { type WritableVisualModel } from "@dataspecer/core-v2/visual-model";

import { randomColorFromPalette } from "../util/color-utils";
import { createWritableVisualModel } from "../util/visual-model-utils";

// This is to compile with TypeScript as we can not use
// the type directly for aggregator.
const SemanticModelAggregatorType = new SemanticModelAggregator();

export type ModelGraphContextType = {

    aggregator: typeof SemanticModelAggregatorType;

    aggregatorView: SemanticModelAggregatorView;

    setAggregatorView: React.Dispatch<React.SetStateAction<SemanticModelAggregatorView>>;

    models: Map<string, EntityModel>;

    setModels: React.Dispatch<React.SetStateAction<Map<string, EntityModel>>>;

    visualModels: Map<string, WritableVisualModel>;

    setVisualModels: React.Dispatch<React.SetStateAction<Map<string, WritableVisualModel>>>;
};

export const ModelGraphContext = React.createContext(null as unknown as ModelGraphContextType);

export interface UseModelGraphContextType {

    aggregator: typeof SemanticModelAggregatorType;

    aggregatorView: SemanticModelAggregatorView;

    setAggregatorView: React.Dispatch<React.SetStateAction<SemanticModelAggregatorView>>;

    models: Map<string, EntityModel>;

    visualModels: Map<string, WritableVisualModel>;

    setVisualModels: React.Dispatch<React.SetStateAction<Map<string, WritableVisualModel>>>;

    //

    addModel: (...models: EntityModel[]) => void;

    addVisualModel: (...models: WritableVisualModel[]) => void;

    setModelAlias: (alias: string | null, model: EntityModel) => void;

    setModelIri: (iri: string, model: InMemorySemanticModel) => void;

    cleanModels: () => void;

    replaceModels: (entityModels: EntityModel[], visualModels: WritableVisualModel[]) => void;

    removeModel: (modelId: string) => void;

    removeVisualModel: (modelId: string) => void;

}

/**
 * provides all models and visual models we work with
 * also provides model manipulating functions (eg add, remove, set alias, ..)
 */
export const useModelGraphContext = (): UseModelGraphContextType => {
    const { aggregator, aggregatorView, setAggregatorView, models, setModels, visualModels, setVisualModels } =
        useContext(ModelGraphContext);

    const addModel = (...models: EntityModel[]) => {
        // Make sure there is a view model.
        if (!aggregatorView.getActiveVisualModel()) {
            const visualModel = createWritableVisualModel();
            addVisualModel(visualModel);
            aggregatorView.changeActiveVisualModel(visualModel.getId());
        }
        // Add models.
        for (const model of models) {
            aggregator.addModel(model);
            setModels((previous) => previous.set(model.getId(), model));
            // Set color for all visual models.
            for (const [_, visualModel] of visualModels) {
                visualModel.setModelColor(model.getId(), randomColorFromPalette());
            }
        }
    };

    const addVisualModel = (...models: WritableVisualModel[]) => {
        for (const model of models) {
            aggregator.addModel(model);
            setVisualModels((previous) => previous.set(model.getId(), model));
        }
    };

    const setModelAlias = (alias: string | null, model: EntityModel) => {
        model.setAlias(alias);
        setModels((prev) => {
            return new Map(prev.set(model.getId(), model));
        });
    };

    const setModelIri = (iri: string, model: InMemorySemanticModel) => {
        model.setBaseIri(iri);
        setModels((prev) => {
            return new Map(prev.set(model.getId(), model));
        });
    };

    const cleanModels = () => {
        for (const [_, m] of models) {
            aggregator.deleteModel(m);
        }
        for (const [_, m] of visualModels) {
            aggregator.deleteModel(m);
        }
        setModels(new Map());
        setVisualModels(new Map());
    };

    const replaceModels = (entityModels: EntityModel[], visualModels: WritableVisualModel[]) => {
        // Remove old models.
        for (const [_, model] of models) {
            aggregator.deleteModel(model);
        }
        for (const model of visualModels) {
            aggregator.deleteModel(model);
        }

        // Set new models.
        for (const model of visualModels) {
            aggregator.addModel(model);
        }
        for (const model of entityModels) {
            aggregator.addModel(model);
        }

        setVisualModels(new Map(visualModels.map((m) => [m.getId(), m])));
        setModels(new Map(entityModels.map((m) => [m.getId(), m])));
    };

    const removeModel = (modelId: string) => {
        const model = models.get(modelId);
        if (!model) {
            alert(`No model with id: ${modelId} found.`);
            return;
        }
        aggregator.deleteModel(model);
        models.delete(modelId);
        setModels(new Map(models));
    };

    const removeVisualModel = (modelId: string) => {
        const visualModel = visualModels.get(modelId);
        if (!visualModel) {
            alert(`No model with id: ${modelId} found`);
            return;
        }
        aggregator.deleteModel(visualModel);
        visualModels.delete(modelId);
        setVisualModels(new Map(visualModels));
        setAggregatorView(aggregator.getView());
    };

    return {
        aggregator,
        aggregatorView,
        setAggregatorView,
        models,
        visualModels,
        setVisualModels,
        //
        addModel,
        addVisualModel,
        setModelAlias,
        setModelIri,
        cleanModels,
        replaceModels,
        removeModel,
        removeVisualModel,
    };
};
