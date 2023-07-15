import { Command } from "commander";
import chalk from "chalk";
import yaml from "yaml";
import * as fs from "node:fs";
import { Options, Replacer } from "./types";
import { OpenAPIV3 } from "openapi-types";
import { error } from "./utils";
import path from "node:path";

const packageJSON = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

let filepath = "";

const program = new Command();
program.showHelpAfterError("(add --help for additional information)");
program.version(packageJSON.version, "-v, --version", "output the current version");

program
  .name("genum-openapi")
  .usage("[global options]")
  .description("Simple CLI for generating Typescript enums from OpenAPI document.")
  .argument("<file>", "OpenAPI source file")
  .option("-x, --exclude <enumNames...>", "names of enums to exclude from OpenAPI document")
  .option("-p, --prefix <prefix>", "place specified prefix at the beginning of the enum name")
  .option(
    "-s, --suffix [suffix]",
    "place specified suffix at the end of the enum name if does not exists (default suffix if empty option provided: Enum)"
  )
  .option(
    "-n, --normalize",
    "normalize enums keys that are not valid (ie. change . to __ and - or / to _)"
  )
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

  if (options.normalize) {
    replacers.forEach(({ regExp, replaceWith }) => {
      inputValue = inputValue.replace(regExp, replaceWith);
    });
  }

  return inputValue;
};

const parseYAML = (schema: string) => {
  try {
    return yaml.parse(schema);
  } catch (err) {
    error("Error parsing YAML file");
    throw err;
  }
};

const parseJSON = (schema: string) => {
  try {
    return JSON.parse(schema);
  } catch (err) {
    error("Error parsing JSON file");
    throw err;
  }
};

const arrayToEnum = (enums: string[], enumName: string) => {
  const enumString = enums
    .map((value) => {
      return `${parseValue(value)} = "${value}"`;
    })
    .join(",\n  ");

  let name = options.prefix ? `${options.prefix}${enumName}` : enumName;
  if (options.suffix) {
    const enumSuffix = typeof options.suffix === "string" ? options.suffix : "Enum";
    name = name.includes(enumSuffix) ? name : `${name}${enumSuffix}`; // TODO: better checking of suffix existence at the end of name
  }

  const enumType = `export enum ${name} {\n  ${enumString}\n}\n\n`;

  return enumType;
};

const readAndParseFile = () => {
  try {
    const localPath = fs.realpathSync(filepath);

    if (fs.statSync(localPath).isDirectory()) {
      throw new Error(`${localPath} is a directory`);
    }

    const ext = path.extname(localPath).toLowerCase();

    const file = fs.readFileSync(localPath, "utf-8");

    if (ext === ".json") {
      return parseJSON(file);
    } else if (ext === ".yml" || ext === ".yaml") {
      return parseYAML(file);
    } else {
      throw new Error("File extension not recognized");
    }
  } catch (e) {
    console.error(chalk.red("Error while reading and parsing the file"));
    throw e;
  }
};

const getDocumentSchemas = (parsedFile: OpenAPIV3.Document) => {
  if (parseInt(parsedFile.openapi) !== 3) {
    throw new Error("OpenAPI v2 is not supported.");
  }

  const { components } = parsedFile;
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
  const fileData = readAndParseFile();
  // Parse OpenAPI document
  const schemas = getDocumentSchemas(fileData);
  // Gather all enums from the JSON
  const enumsMap = collectEnums(schemas);
  // Convert gathered enums to the TS enum records
  const enums = generateEnums(enumsMap);
  // Save enums to the file
  saveFile(enums);
};

main();
