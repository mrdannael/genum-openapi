import { execa } from "execa";
// import fs from "node:fs";
// import { URL } from "node:url";
import { describe, test, expect } from "vitest";

const cwd = process.cwd();
const cmd = "./bin/cli.js";

describe("CLI", () => {
  //       const expected = fs.readFileSync(new URL("./examples/stripe-api.ts", cwd), "utf8").trim();
  //       const input = fs.readFileSync(new URL("./examples/stripe-api.yaml", cwd));
  //       const { stdout } = await execa(cmd, { input });
  //       expect(stdout).toBe(expected);

  console.log(cwd);

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
  });
});
