import chalk from "chalk";
import { OpenAPIV3 } from "openapi-types";

type SchemaObject = OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject;
type ReferenceObject = OpenAPIV3.ReferenceObject;

export function error(msg: string) {
  console.error(chalk.red(` ✘  ${msg}`));
}

export const isReferenceObject = (obj: object): obj is ReferenceObject => {
  return obj && typeof obj === "object" && "$ref" in obj;
};

export const getCombinedSchemas = (
  schemas: (SchemaObject | ReferenceObject) | (SchemaObject | ReferenceObject)[]
) => {
  return Array.isArray(schemas)
    ? schemas.filter((item) => item !== undefined)
    : [schemas].filter((item) => item !== undefined);
};
