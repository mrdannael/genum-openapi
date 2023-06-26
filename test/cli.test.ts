import { execa } from "execa";
// import fs from "node:fs";
// import { URL } from "node:url";
import { describe, test, expect } from "vitest";

const cwd = process.cwd();
const cmd = "./bin/cli.js";

describe("CLI", () => {
  describe("flags", () => {
    test("--help", async () => {
      const { stdout } = await execa(cmd, ["--help"], { cwd });
      expect(stdout).toEqual(
        expect.stringMatching(/^Usage: genum-openapi \[global options\]/g)
      );
    });

    test("--version", async () => {
      const { stdout } = await execa(cmd, ["--version"], { cwd });
      expect(stdout).toBe("0.1.0");
    });

    // eslint-disable-next-line vitest/no-commented-out-tests
    // test("--input", async () => {
    //   const expected = fs.readFileSync(new URL("./fixtures/enums_1.ts", import.meta.url), "utf-8").trim();
    //   const { stdout } = await execa(cmd, ["-i ./fixtures/fixture_1.yaml"],);
    //   expect(stdout).toEqual(expected);
    // });
  });
});
