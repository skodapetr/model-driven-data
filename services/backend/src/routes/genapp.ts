import z from "zod";
import express from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApplicationGenerator, GenappInputArguments } from "@dataspecer/genapp";

export const getGeneratedApplication = asyncHandler(async (request: express.Request, response: express.Response) => {
    const querySchema = z.object({
        zipname: z.string().min(1),
    });

    const query = querySchema.parse(request.query);

    if (!(request.body as string)) {
        response.status(400).json({ error: "Missing application graph" });
        return;
    }

    const inputArgs: GenappInputArguments = {
        serializedGraph: request.body.serializedGraph as string
    };

    try {
        const appGenerator = new ApplicationGenerator(inputArgs);
        const generatedApplicationZip = await appGenerator.generate();

        response.type("application/zip").send(generatedApplicationZip);
    } catch (error) {
        response.status(500).json({
            "message": "Unable to generate application",
            error
        });
    }
});