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