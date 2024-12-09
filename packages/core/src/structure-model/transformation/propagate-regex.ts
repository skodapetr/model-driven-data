import {ConceptualModel, ConceptualModelPrimitiveType} from "../../conceptual-model";
import {StructureModel} from "../model";
import {clone} from "../../core";
import {buildPropertyMap} from "../../conceptual-model/utils";

/**
 * Add regex from {@link ConceptualModel} if they are missing.
 */
export function propagateRegex(
  conceptual: ConceptualModel,
  structure: StructureModel
): StructureModel {
  const result = clone(structure) as StructureModel;
  const classes = result.getClasses();
  const propertyMap = buildPropertyMap(conceptual);
  for (const classData of classes) {
    const conceptualClass = conceptual.classes[classData.pimIri];
    if (conceptualClass === null || conceptualClass === undefined) {
      continue;
    }
    classData.regex = classData.regex ?? conceptualClass.regex ?? null;
    classData.properties.forEach(property => {
      const conceptualProperty = propertyMap[property.pimIri];
      if (conceptualProperty) {
        for (const dataType of property.dataTypes) {
          if (dataType.isAttribute()) {
            dataType.regex = dataType.regex ?? (conceptualProperty.dataTypes[0] as ConceptualModelPrimitiveType)?.regex ?? null;
          }
        }
      }

    });
  }
  return result;
}
