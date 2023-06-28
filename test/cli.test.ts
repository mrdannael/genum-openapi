import { execa } from "execa";
import fs from "node:fs";
import { URL } from "node:url";
import { describe, test, expect } from "vitest";

const cwd = new URL("../", import.meta.url);
const cmd = "./bin/cli.js";

describe("CLI", () => {
  describe("flags", () => {
    test("--help", async () => {
      const { stdout } = await execa(cmd, ["--help"], { cwd });
      expect(stdout).toEqual(expect.stringMatching(/^Usage: genum-openapi \[global options\]/g));
    });

    test("--version", async () => {
      const { stdout } = await execa(cmd, ["--version"], { cwd });
      expect(stdout).toBe("0.1.0");
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

    test("--parse", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_5.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_2.yaml", "--parse"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("--uppercase (with --parse)", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_6.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_2.yaml", "--parse", "--uppercase"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });
  });
});
