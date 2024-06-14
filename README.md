# gEnum OpenAPI

![ci](https://github.com/mrdannael/genum-openapi/actions/workflows/nodejs.yaml/badge.svg)
![npm](https://img.shields.io/npm/v/genum-openapi)
![npm](https://img.shields.io/npm/dm/genum-openapi)

#

[![Tech used](https://skills.thijs.gg/icons?i=nodejs,ts)](https://skills.thijs.gg)

## About

**genum-openapi** is a simple Node.js CLI tool for creating TypeScript enums from [OpenAPI](https://spec.openapis.org/oas/latest.html) document. This package is inspired by another tool named [openapi-typescript](https://github.com/drwpow/openapi-typescript/blob/main/packages/openapi-typescript). Toghether with mentioned package, developers should be able to generate TypeScript interfaces (using openapi-typescript) and enums (using genum-openapi) within their projects with the same YAML file as an input.

**Features**

- Supports OpenAPI 3.x
- Generate **TypeScript enums**
- Load schemas from local YAML or JSON file
- Native Node.js code used to write this tool

## Usage

Generate local file with Typescript enums by running `npx genum-openapi`:

```bash
npx genum-openapi ./path/to/the/schema.yaml -o ./path/to/generated/enums.ts
```

:warning: Make sure that all your schemas are validated before using them with [this](https://redocly.com/docs/cli/commands/lint/) tool.

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

| Option              | Alias | Default   | Description                                                                                                                |
| :------------------ | :---- | :-------: | :------------------------------------------------------------------------------------------------------------------------- |
| `--help`            | `-h`  |           | Display help for the command                                                                                               |
| `--version`         | `-v`  |           | Output the current version                                                                                                 | 
| `--output`          | `-o`  | (stdout)  | Path of the output file                                                                                                    |
| `--exclude`         | `-e`  |           | Names of enums from the OpenAPI document to exclude                                                                        |
| `--prefix`          | `-p`  |           | Add a prefix to the beginning of the enum name                                                                             |
| `--suffix`          | `-s`  |   Enum    | Add a suffix to the end of the enum name if it does not already exist                                                      |
| `--prenum`          |       |     _     | Add a specified prefix before the enum exported name that starts with a number (underscore by default if not provided)     |
| `--normalize`       | `-n`  |   false   | Normalize exported enum names and keys that are not valid (replace `.` with `__` and `-` or `/` with `_`)                  |
| `--normalize-keys`  |       |   false   | Normalize only enum keys that are not valid                                                                                |
| `--normalize-names` |       |   false   | Normalize only exported enum names that are not valid                                                                      |
| `--uppercase`       | `-u`  |   false   | Convert exported enum names and keys to uppercase (commonly used with the `--normalize` option)                            |
| `--uppercase-keys`  |       |   false   | Convert only enum keys to uppercase                                                                                        |
| `--uppercase-names` |       |   false   | Convert only exported enum names to uppercase                                                                              |
| `--custom-replacers`|       |           | Custom replacers applied during the normalization process, in JSON format, e.g., `'[{"regExp":"[-/]","replaceWith":"_"}]'` |

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
        - another.weird.string
        - just(another)weird string
      type: string
    StartWithNumber:
      enum:
        - 250x330
        - 70x40
        - OTHER
      type: string
    WithCurlyBrackets:
      enum:
        - "{INSIDE_CURLY_BRACKETS}"
```

1. By providing [`--exclude Status InvalidCase StartWithNumber WithCurlyBrackets`] option, generated file should contain only _ColorsEnum_:

```ts
export enum ColorsEnum {
  GREEN = "GREEN",
  RED = "RED",
}
```

2. [`--prefix I`] option should add provided string at the beggining of the enums names:

```ts
export enum IStatus {
  [...]
}

export enum IColorsEnum {
  [...]
}

export enum IInvalidCase {
  [...]
}

export enum IStartWithNumber {
  [...]
}

export enum IWithCurlyBrackets {
  [...]
}
```

3. [`--suffix`] option should add provided string at the end of the enums names (when not provided `Enum` is used by default):

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

export enum StartWithNumberEnum {
  [...]
}

export enum WithCurlyBracketsEnum {
  [...]
}
```

4. With [`--normalize`] and [`--uppercase`] options, generated file should contain parsed values of enum keys:

```ts
[...]
export enum INVALIDCASE {
  SOME_WEIRD_STRINGS = "SOME/WEIRD-Strings",
  ANOTHER__WEIRD__STRING = "another.weird.string"
  JUST_ANOTHER_WEIRD_STRING = "just(another)weird string"
}
[...]
```

5. With [`--prenum $`] option, keys of enums should be prefixed with a `$` sign (by default enum keys that starts with a number are prefixed with an underscore):

```ts
[...]
export enum StartWithNumber {
  $250x330 = "250x330",
  $70x40 = "70x40",
  OTHER = "OTHER"
}
[...]
```

6. You can pass custom replacers to the cli with [`--custom-replacers '[{ "regExp":"[{}]", "replaceWith": "empty" }]'`] to replace any strings as you like. Keep in mind that in the provided example we want to replace `{}` with `""`, but due to `JSON.parse` used as the parsing method, we cannot simply pass `""` as a `replaceWith` property, instead we pass `"empty"` to handle replacing `{}` with `""`.

```ts
[...]
export enum WithCurlyBrackets {
  INSIDE_CURLY_BRACKETS = "{INSIDE_CURLY_BRACKETS}"
}
[...]
```

## :mega: Goals

1. Fetching schema from remote resource (with Auth header if needed)
2. Parsing multiple schemas at once (with globbing)

## :couple_with_heart: Contributing

PRs are welcome!
