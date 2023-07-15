import { execa } from "execa";
import fs from "node:fs";
import { URL } from "node:url";
import { describe, test, expect } from "vitest";

const cwd = new URL("../", import.meta.url);
const cmd = "./bin/cli.js";

const packageJSON = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

describe("CLI", () => {
  describe("flags", () => {
    test("--help", async () => {
      const { stdout } = await execa(cmd, ["--help"], { cwd });
      expect(stdout).toEqual(expect.stringMatching(/^Usage: genum-openapi \[global options\]/g));
    });

    test("--version", async () => {
      const { stdout } = await execa(cmd, ["--version"], { cwd });
      expect(stdout).toBe(packageJSON.version);
    });

    // eslint-disable-next-line vitest/no-commented-out-tests
    test("<filepath> argument", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_1.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_1.yaml"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("--exclude", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_2.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        [
          "test/fixtures/input/fixture_2.yaml",
          "--exclude",
          "AgencyServiceTypeEnum",
          "AgencyStatus",
        ],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("--prefix 'I'", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_8.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_1.yaml", "--prefix", "I"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("--suffix (default 'Enum')", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_3.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_3.yaml", "--suffix"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("--suffix 'TSEnum'", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_4.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_3.yaml", "--suffix", "TSEnum"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("--normalize", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_5.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_2.yaml", "--normalize"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("--uppercase (with --normalize)", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_6.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_2.yaml", "--normalize", "--uppercase"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("all at once", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_9.ts", import.meta.url), "utf-8")
        .trim();

      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_2.yaml", "-uns", "-p", "I", "-x", "AgencyRevenueType"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });
  });

  describe("format", () => {
    test("JSON file", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_7.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_4.json"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });
  });
});
