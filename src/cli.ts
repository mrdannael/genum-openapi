import { Command } from "commander";
import { parse } from "yaml";
import * as fs from "node:fs";
// eslint-disable-next-line node/no-missing-import
import { Options, Replacer } from "./types";
import { OpenAPIV3 } from "openapi-types";

const program = new Command();
program.showHelpAfterError("(add --help for additional information)");

program
  .name("genum-openapi")
  .usage("[global options]")
  .version("0.1.0")
  .description(
    "Simple CLI for generating Typescript enums from OpenApi document."
  )
  .requiredOption("-i, --input <file>", "path to the OpenApi source file")
  .option(
    "-x, --exclude <enumNames...>",
    "names of enums to exclude from OpenApi document"
  )
  .option(
    "-s, --suffix [suffix]",
    "place specified suffix at the end of the enum name if does not exists (default suffix if empty option provided: Enum"
  )
  .option(
    "-p, --parse",
    "parse enums keys that are not valid (ie. change . to __ and - or / to _)"
  )
  .option("-u, --uppercase", "parse all enums keys to be uppercase")
  .option("-o, --output <file>", "path of the output file", "./enums.ts")
  .parse(process.argv);

const options: Options = program.opts();

const replacers: Replacer[] = [
  { regExp: /[-/]/g, replaceWith: "_" },
  { regExp: /[.]/g, replaceWith: "__" },
];

const parseValue = (value: string) => {
  let inputValue = value;

  if (options.uppercase) {
    inputValue = inputValue.toUpperCase();
  }

  if (options.parse) {
    replacers.forEach(({ regExp, replaceWith }) => {
      inputValue = inputValue.replace(regExp, replaceWith);
    });
  }

  return inputValue;
};

const arrayToEnum = (enums: string[], enumName: string) => {
  const enumString = enums
    .map((value) => {
      return `${parseValue(value)} = "${value}"`;
    })
    .join(",\n");

  let name = enumName;
  if (options.suffix) {
    const enumSuffix =
      typeof options.suffix === "string" ? options.suffix : "Enum";
    name = enumName.includes(enumSuffix)
      ? enumName
      : `${enumName}${enumSuffix}`;
  }

  const enumType = `export enum ${name} {
  ${enumString}
  }\n\n`;

  return enumType;
};

const readFile = () => {
  let file = "";
  try {
    file = fs.readFileSync(options.input, "utf-8");
  } catch (err) {
    console.error(err);
  }

  return file;
};

const getYamlSchemas = (file: string) => {
  const parsedYaml = parse(file) as OpenAPIV3.Document;
  const { components } = parsedYaml;
  const { schemas } = components || {};

  return schemas;
};

const collectEnums = (schemas: OpenAPIV3.ComponentsObject["schemas"]) => {
  const enumsMap = new Map<string, string>();

  for (const key in schemas) {
    if (
      typeof schemas[key] === "object" &&
      !("$ref" in schemas[key]) &&
      "enum" in schemas[key] &&
      !options.exclude?.includes(key)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enumsMap.set(key, arrayToEnum((schemas[key] as any).enum, key)); // TODO: FIXME TS
    }
  }

  return enumsMap;
};

const generateEnums = (enumsMap: Map<string, string>) => {
  let types = "";
  enumsMap.forEach(function (enumType) {
    types += enumType;
  });
  return types;
};

const saveFile = (data: string) => {
  try {
    fs.writeFileSync(options.output, data, "utf-8");
  } catch (err) {
    console.error(err);
  }
};

const main = () => {
  // Read the file
  const file = readFile();
  // Transform yaml document into JSON
  const schemas = getYamlSchemas(file);
  // Gather all enums from the JSON
  const enumsMap = collectEnums(schemas);
  // Convert gathered enums to the TS enum records
  const enums = generateEnums(enumsMap);
  // Save enums to the file
  saveFile(enums);
};

main();
