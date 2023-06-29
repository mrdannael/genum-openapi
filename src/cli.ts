import { Command } from "commander";
import chalk from "chalk";
import { parse } from "yaml";
import * as fs from "node:fs";
import { Options, Replacer } from "./types";
import { OpenAPIV3 } from "openapi-types";
import { error } from "./utils";

const packageJSON = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

let filepath = "";

const program = new Command();
program.showHelpAfterError("(add --help for additional information)");
program.version("0.1.3", "-v, --version", "output the current version");

program
  .name("genum-openapi")
  .usage("[global options]")
  .description("Simple CLI for generating Typescript enums from OpenAPI document.")
  .argument("<file>", "OpenAPI source file")
  .option("-x, --exclude <enumNames...>", "names of enums to exclude from OpenAPI document")
  .option(
    "-s, --suffix [suffix]",
    "place specified suffix at the end of the enum name if does not exists (default suffix if empty option provided: Enum)"
  )
  .option("-p, --parse", "parse enums keys that are not valid (ie. change . to __ and - or / to _)")
  .option("-u, --uppercase", "parse all enums keys to be uppercase")
  .option("-o, --output <file>", "path of the output file", "stdout")
  .action((path) => {
    filepath = path;
  })
  .parse(process.argv);

const options: Options = program.opts();

const timeStart = process.hrtime();

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
    .join(",\n  ");

  let name = enumName;
  if (options.suffix) {
    const enumSuffix = typeof options.suffix === "string" ? options.suffix : "Enum";
    name = enumName.includes(enumSuffix) ? enumName : `${enumName}${enumSuffix}`;
  }

  const enumType = `export enum ${name} {\n  ${enumString}\n}\n\n`;

  return enumType;
};

const readFile = () => {
  try {
    const localPath = fs.realpathSync(filepath);

    if (fs.statSync(localPath).isDirectory()) {
      throw new Error(`${localPath} is a directory`);
    }

    const file = fs.readFileSync(localPath, "utf-8");
    return file;
  } catch (e) {
    console.error(chalk.red("Error reading file"));
    throw e;
  }
};

const getDocumentSchemas = (file: string) => {
  const parsedYaml = parse(file) as OpenAPIV3.Document;

  if (parseInt(parsedYaml.openapi) !== 3) {
    throw new Error("OpenAPI v2 is not supported.");
  }

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
    if (options.output !== "stdout") {
      fs.writeFileSync(options.output, data, "utf-8");

      const timeEnd = process.hrtime(timeStart);
      const time = timeEnd[0] + Math.round(timeEnd[1] / 1e6);
      console.log(`🚢 ${chalk.green("Enums generated successfully!")} ${chalk.dim(`[${time}ms]`)}`);
    } else {
      process.stdout.write(data);
    }
  } catch (err) {
    error("Error occurred while saving the file");
    throw err;
  }
};

const main = () => {
  if (options.output !== "stdout") {
    console.info(chalk.bold(`🔥 genum-openapi v${packageJSON.version}`));
  }
  // Read the file
  const file = readFile();
  // Parse OpenAPI document
  const schemas = getDocumentSchemas(file);
  // Gather all enums from the JSON
  const enumsMap = collectEnums(schemas);
  // Convert gathered enums to the TS enum records
  const enums = generateEnums(enumsMap);
  // Save enums to the file
  saveFile(enums);
};

main();
