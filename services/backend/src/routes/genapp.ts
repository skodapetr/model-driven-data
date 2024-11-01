import z from "zod";
import express from "express";
import { resourceModel } from "../main";
import configuration from "../configuration";
import { asyncHandler } from "../utils/async-handler";
import { ApplicationGenerator, GenappConfiguration } from "@dataspecer/genapp";

export const getGeneratedApplication = asyncHandler(async (request: express.Request, response: express.Response) => {
    const querySchema = z.object({
        zipname: z.string().min(1),
    });

    const query = querySchema.parse(request.query);

    if (!(request.body as string)) {
        response.status(400).json({ error: "Missing application graph" });
        return;
    }

    const inputArgs: GenappConfiguration = {
        serializedGraph: request.body.serializedGraph as string,
        backendHost: configuration.host,
        tmpOutDir: "generated",
        tmpOutZipname: "out.zip",
    };

    try {
        const appGenerator = new ApplicationGenerator(inputArgs);
        const generatedApplicationZipBuffer = await appGenerator.generate();

        if (generatedApplicationZipBuffer.byteLength === 0) {
            response.statusMessage = "An empty application has been generated. Check if application graph is not empty.";
            response.type("application/zip")
                .send(generatedApplicationZipBuffer);
            return;
        }

        response.type("application/zip")
            .send(generatedApplicationZipBuffer);
        return;
    } catch (error) {
        const errorMsg = "An error occured while generating application prototype. See console for more details.";
        response.statusMessage = errorMsg;
        response.status(500).send({
            "error": error,
            "message": errorMsg
        })
        return;
    }
});

export const getGenerateApplicationByModelId = asyncHandler(async (request: express.Request, response: express.Response) => {
    const querySchema = z.object({
        iri: z.string().min(1),
    });
    const query = querySchema.parse(request.query);

    const modelStore = await resourceModel.getOrCreateResourceModelStore(query.iri);
    const data = await modelStore.getJson();

    const inputArgs: GenappConfiguration = {
        serializedGraph: JSON.stringify(data),
        backendHost: configuration.host,
        tmpOutDir: "generated",
        tmpOutZipname: `out.zip`,
    };

    try {
        const appGenerator = new ApplicationGenerator(inputArgs);
        const generatedApplicationZipBuffer = await appGenerator.generate();

        if (generatedApplicationZipBuffer.byteLength === 0) {
            response.statusMessage = "An empty application has been generated. Check if application graph is not empty.";
            response.type("application/zip")
                .send(generatedApplicationZipBuffer);
            return;
        }

        response.type("application/zip")
            .send(generatedApplicationZipBuffer);
        return;
    } catch (error) {
        const errorMsg = "An error occured while generating application prototype. See console for more details.";
        response.statusMessage = errorMsg;
        response.status(500).send({
            "error": error,
            "message": errorMsg
        })
        return;
    }
});
