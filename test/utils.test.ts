import { vi, describe, test, expect } from "vitest";
import { error, getCombinedSchemas, isReferenceObject } from "../src/utils";
import chalk from "chalk";
import { OpenAPIV3 } from "openapi-types";

vi.mock("chalk");

const notObject: OpenAPIV3.SchemaObject = {
  type: "string",
  enum: ["NOT_ALLOWED1", "NOT_ALLOWED2"],
};

const anyOfArray: (OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject)[] = [
  {
    type: "string",
    enum: ["DETAIL_STRING1", "DETAIL_STRING2"],
  },
  {
    $ref: "#/components/schemas/NestedObject",
  },
];

describe("utils", () => {
  test("error", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    const msg = "error message";

    error(msg);

    expect(chalk.red).toHaveBeenCalledWith(` ✘  ${msg}`);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`RED( ✘  ${msg})`);
  });

  test("isReferenceObject", () => {
    expect(isReferenceObject({ $ref: "#/components/schemas/ComplexObject" })).toBe(true);
    expect(
      isReferenceObject({
        type: "object",
        properties: {
          testResult: {
            type: "string",
            enum: ["SUCCESSFUL", "ABORTED", "FAILED", "IN_PROGRESS"],
          },
        },
      })
    ).toBe(false);
  });

  test("getCombinedSchemas", () => {
    expect(getCombinedSchemas(notObject)).toEqual([notObject]);
    expect(getCombinedSchemas(anyOfArray)).toEqual([
      {
        type: "string",
        enum: ["DETAIL_STRING1", "DETAIL_STRING2"],
      },
      {
        $ref: "#/components/schemas/NestedObject",
      },
    ]);
  });
});
