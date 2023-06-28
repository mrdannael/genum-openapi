# gEnum OpenAPI

![node ci](https://github.com/mrdannael/genum-openapi/actions/workflows/nodejs.yaml/badge.svg)
![npm](https://img.shields.io/npm/v/genum-openapi)
![npm](https://img.shields.io/npm/dm/genum-openapi)

#

[![Tech used](https://skills.thijs.gg/icons?i=nodejs,ts)](https://skills.thijs.gg)

## About

**genum-openapi** is a simple Node.js CLI tool for creating TypeScript enums from [OpenAPI](https://spec.openapis.org/oas/latest.html) document. This package is inspired by another tool named [openapi-typescript](https://github.com/drwpow/openapi-typescript/blob/main/packages/openapi-typescript). Toghether with mentioned package, developers should be able to generate TypeScript interfaces (using openapi-typescript) and enums (using genum-openapi) within their projects with the same YAML file as an input.

**Features**

- Supports OpenAPI 3.x
- Generate **TypeScript enums**
- Load schemas from YAML, locally
- Native Node.js code used to write this tool

## Usage

Generate local file with Typescript enums by running `npx genum-openapi`:

```bash
npx genum-openapi ./path/to/the/schema.yaml -o ./path/to/generated/enums.ts
```

:warning: Make sure that all your schemas are [validated](https://redocly.com/docs/cli/commands/lint/) before using them with this tool.

Then you can import the enums from the generated file:

```ts
import { StatusEnum } from "./path/to/generated/enums";

export const App = () => {
  if (status === StatusEnum.SUCCESS) {
    console.log("Enum successfully generated and used");
  } else {
    console.log("Enum failed to generate");
  }
};
```

### :gear: Options

Following flags are available for the CLI tool.

| Option        | Alias | Default  | Description                                                                         |
| :------------ | :---- | :------: | :---------------------------------------------------------------------------------- |
| `--help`      | `-h`  |          | Display help for command                                                            |
| `--version`   | `-v`  |          | Output the current version                                                          |
| `--output`    | `-o`  | (stdout) | Path of the output file                                                             |
| `--exclude`   | `-e`  |          | Names of enums from OpenAPI document to exclude                                     |
| `--suffix`    | `-s`  |   Enum   | Put suffix at the end of the enum name if it does not already exists                |
| `--parse`     | `-p`  |          | Parse enum keys that can be invalid (replace `.` with `__` and `-` or `/` with `_`) |
| `--uppercase` | `-u`  |          | Parse all enum keys to be uppercase (commonly used with `--parse` option)           |

### :book: Examples

Let's say that our OpenAPI document looks like this:

```yaml
openapi: 3.0.3
info:
  title: Example OpenApi description
  version: 0.0.0
components:
  schemas:
    Status:
      enum:
        - ACTIVE
        - INACTIVE
      type: string
    ColorsEnum:
      enum:
        - GREEN
        - RED
      type: string
    InvalidCase:
      enum:
        - SOME/WEIRD-Strings
        - annother.weird.string
      type: string
```

1. By providing [`--exclude Status InvalidCase`] option, generated file should contain only _ColorsEnum_:

```ts
export enum ColorsEnum {
  GREEN = "GREEN",
  RED = "RED",
}
```

2. [`--suffix`] option should add provided string at the end of the enums name:

```ts
export enum StatusEnum {
  [...]
}

export enum ColorsEnum {
  [...]
}

export enum InvalidCaseEnum {
  [...]
}
```

3. With [`--parse`] and [`--exclude`] options, generated file should contain parsed values of enum keys:

```ts
[...]
export enum InvalidCase {
  SOME_WEIRD_STRINGS = "SOME/WEIRD-Strings",
  ANOTHER__WEIRD__STRING = "another.weird.string"
}
```

## :couple_with_heart: Contributing

PRs are welcome!
