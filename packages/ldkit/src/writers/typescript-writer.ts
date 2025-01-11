import { printNode } from "ts-morph";
import {
    factory,
    Expression,
    Node,
    NodeFlags,
    SyntaxKind,
    VariableDeclaration,
    VariableDeclarationList,
    ObjectLiteralElementLike
} from "typescript";
import { LdkitSchema, LdkitSchemaProperty } from "../ldkit-schema-model";
import { convertToKebabCase, wellKnownTypesMap } from "../utils/utils";
import { SourceCodeWriter } from "./source-code-writer-model";
import { AggregateMetadata } from "../readers/aggregate-data-provider-model";

export class TypescriptWriter implements SourceCodeWriter {

    fileExtension: string = "ts";
    private readonly ldkitImports = new Set<string>();

    generateSourceFilePath(directoryPath: string, outputFileName: string) {
        const kebabCaseOutputFileName = convertToKebabCase(`${outputFileName} ldkitschema`);

        const finalOutputFilePath: string = directoryPath + [kebabCaseOutputFileName, this.fileExtension].join(".");
        console.log(`Output filepath: ${finalOutputFilePath}`);

        return finalOutputFilePath;
    }

    getSourceCodeFromMetadata(aggregateMetadata: AggregateMetadata): string {
        const ldkitSchemaRootNode = this.getLdkitSchemaRootNode(aggregateMetadata);
        const initImportStatement = this.getLdkitDefaultImportStatement();

        const printedImport: string = printNode(initImportStatement);
        const printedSchema: string = printNode(ldkitSchemaRootNode);

        return [printedImport, printedSchema].join("\n");
    }

    private getLdkitSchemaRootNode(metadata: AggregateMetadata): Node {

        const ldkitSchemaDeclaration = factory.createVariableDeclaration(
            `${metadata.aggregateName}Schema`,
            undefined,
            undefined,
            this.getSchemaAsObjectLiteral(metadata.dataSchema)
        );

        const declaration = factory.createVariableDeclarationList(
            [ldkitSchemaDeclaration],
            NodeFlags.Const
        );

        return this.getExportStatement(declaration);
    }

    private getLdkitDefaultImportStatement(): Node {
        const ldkitLibraryImportPath: string = "ldkit/namespaces";

        return factory.createImportDeclaration(
            undefined,
            factory.createImportClause(
                false,
                undefined,
                factory.createNamedImports(
                    Array.from(this.ldkitImports)
                        .map(importId => factory.createImportSpecifier(
                            false,
                            undefined,
                            factory.createIdentifier(importId)
                        ))
                )
            ),
            factory.createStringLiteral(ldkitLibraryImportPath),
            undefined
        );
    }

    private getExportStatement(node: readonly VariableDeclaration[] | VariableDeclarationList) {
        return factory.createVariableStatement(
            [factory.createToken(SyntaxKind.ExportKeyword)],
            node
        );
    }

    private getSchemaAsObjectLiteral(schema: LdkitSchema) {

        if (!("@type" in schema)) {
            throw new Error("Schema object does not contain required \"@type\" attribute.");
        }

        let properties: ObjectLiteralElementLike[] = this.getObjectLiteral(schema);

        return factory.createAsExpression(
            factory.createObjectLiteralExpression(properties, true),
            factory.createTypeReferenceNode(
                factory.createIdentifier("const"),
                undefined
            )
        );
    }

    private getObjectLiteral(targetObject: LdkitSchema): ObjectLiteralElementLike[] {

        const properties: ObjectLiteralElementLike[] = [];

        Object.entries(targetObject).map(attr => {
            const [propName, prop] = attr;
            const propertyValueNode: Expression = this.getPropertyValueExpression(prop);
            const propertyNameNode: string = this.getPropertyNameNode(propName);

            properties.push(
                factory.createPropertyAssignment(propertyNameNode, propertyValueNode)
            );
        });

        return properties;
    }

    private getPropertyNameNode(name: string): string {
        if (!name) {
            throw new Error("Attepmting to use non-valid string as property name");
        }

        return `"${factory.createStringLiteral(name).text}"`;
    }

    private getPropertyValueExpression(propertyValue: LdkitSchemaProperty | string | readonly string[] | any): Expression {

        switch (typeof propertyValue) {
            case "string":
                if (Object.values(wellKnownTypesMap).includes(propertyValue)) {
                    const [namespace, name] = propertyValue.split(".", 2);

                    this.ldkitImports.add(namespace!);
                    return factory.createPropertyAccessExpression(
                        factory.createIdentifier(namespace!),
                        factory.createIdentifier(name!)
                    );
                }

                return factory.createStringLiteral(propertyValue);
            case "boolean":
                return propertyValue
                    ? factory.createTrue()
                    : factory.createFalse();
            case "object":
                return factory.createObjectLiteralExpression(this.getObjectLiteral(propertyValue), true);
            default:
                console.log("Not supported yet: ", propertyValue);
                throw Error(`Not implemented yet for ${propertyValue}`)
        }
    }
}