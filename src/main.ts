#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import yaml from "yaml";
import * as fs from "node:fs";
import chalk from "chalk";
import clear from "clear";
import packageJSON from "../package.json";

const enumMap = new Map();

const arrayToEnum = (enums: string[], enumName: string) => {
  const enumString = enums.map((value) => `${value} = "${value}"`).join(',\n');
  const enumType = `export enum ${enumName} {
    ${enumString}
  };\n\n`;
  return enumType;
}

const collectEnums = (object: Record<string, any>, exclude?: string[]) => {
  let enums: Record<string, string[]> = {};
  for (const key in object) {
    if (typeof object[key] === "object" && object[key].hasOwnProperty("enum") && !exclude?.includes(key)) {
      const name = key.includes('Enum') ? key : `${key}Enum`;
      enums[name] = object[key].enum;
      enumMap.set(name, arrayToEnum(object[key].enum, name));
    }
  }
}

const program = new Command();
program.showHelpAfterError('(add --help for additional information)');

program
  .name("genum-openapi")
  .usage("[global options]")
  .version(packageJSON.version)
  .description("Simple CLI for generating Typescript enums from OpenApi document.")
  .option("-i, --input [file]", "Path to the OpenApi source file")
  .option("-x, --exclude [enumNames...]", "Names of enums to exclude from OpenApi")
  .parse(process.argv);

const options: { input?: string, exclude?: string[], version: boolean } = program.opts();

if (!options.version) {
  clear();
  console.log(chalk.blue(figlet.textSync("gENUM OpenApi")));
}

if (!!options.input) {
  const file = fs.readFileSync(options.input, 'utf-8');
  const parsedYaml = yaml.parse(file);
  const { components: { schemas }} = parsedYaml;

  collectEnums(schemas, options.exclude);

  let types = '';

  enumMap.forEach(function(enumType) {
    types += enumType;
  });

  fs.writeFileSync('./enums.ts', types, 'utf-8');
} else {
  console.log(chalk.red("No input file specified."));
}

