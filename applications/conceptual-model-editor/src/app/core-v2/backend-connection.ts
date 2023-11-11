import { type EntityModel } from "@dataspecer/core-v2/entity-model";
import { BackendPackageService } from "@dataspecer/core-v2/project";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { createClass } from "@dataspecer/core-v2/semantic-model/operations";
import { createRdfsModel, createSgovModel } from "@dataspecer/core-v2/semantic-model/simplified";
import { httpFetch } from "@dataspecer/core/io/fetch/fetch-browser";
import { useMemo } from "react";

export const useBackendConnection = () => {
    const BACKEND_URL = "http://localhost:3100";
    const service = useMemo(() => new BackendPackageService(BACKEND_URL, httpFetch), []);

    const getPackageFromBackend = async (packageId: string) => {
        const pckg = await service.getPackage(packageId);
        return pckg;
    };

    const getModelsFromBackend = async (packageId: string) => {
        const models = await constructSemanticModelPackageModelsMock(packageId); //service.constructSemanticModelPackageModels(packageId);
        return models;
    };

    const updateSemanticModelPackageModels = async (packageId: string, models: EntityModel[]) => {
        await service.updateSemanticModelPackageModels(packageId, models);
        console.log(`updated models for package ${packageId}`, models);
    };

    const listPackages = () => {
        return ["zvířátkový-package", "package-xyz", "testovací-package"];
    };

    return { service, getPackageFromBackend, updateSemanticModelPackageModels, listPackages, getModelsFromBackend };
};

const constructSemanticModelPackageModelsMock = async (packageId: string) => {
    if (packageId == "") {
        return [] as EntityModel[];
    }

    const sgov = createSgovModel("https://slovník.gov.cz/sparql", httpFetch);
    sgov.allowClass("https://slovník.gov.cz/datový/turistické-cíle/pojem/turistický-cíl");
    sgov.allowClass("https://slovník.gov.cz/generický/bezbariérové-přístupy/pojem/bezbariérový-přístup");

    const dcterms = await createRdfsModel(
        ["https://mff-uk.github.io/demo-vocabularies/original/dublin_core_terms.ttl"],
        httpFetch
    );
    dcterms.fetchFromPimStore();

    const local = new InMemorySemanticModel();
    local.executeOperation(
        createClass({
            name: { cs: "fejk-třída-pes" },
            iri: "https://my-fake.iri.com/fejk-třída-pes",
        })
    );
    local.executeOperation(
        createClass({
            name: { cs: "fejk-třída-kočka" },
            iri: "https://my-fake.iri.com/fejk-třída-kočka",
        })
    );

    const models = [sgov, dcterms, local] as EntityModel[];
    return models;
};
