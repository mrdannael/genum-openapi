import { execa } from "execa";
import fs from "node:fs";
import { URL } from "node:url";
import { vi, describe, test, expect } from "vitest";

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
          "Email.Status",
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

    test("--normalize (all)", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_5.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_2.yaml", "--normalize"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("--normalize-keys", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_12.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_7.yaml", "--normalize-keys"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("--normalize-names", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_13.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_8.yaml", "--normalize-names"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("--custom-replacers (with --normalize)", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_11.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        [
          "test/fixtures/input/fixture_6.yaml",
          "--custom-replacers",
          // eslint-disable-next-line quotes
          '[{ "regExp":"[{}]", "replaceWith": "empty" }]',
          "--normalize",
        ],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("--uppercase (all)", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_14.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_9.yaml", "--uppercase"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("--uppercase-keys", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_6.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_9.yaml", "--uppercase-keys"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("--uppercase-names", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_15.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_9.yaml", "--uppercase-names"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("with allowed --prenum", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_10.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_5.yaml", "--prenum", "$"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("should collect nested enums", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_16.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(cmd, ["test/fixtures/input/fixture_10.yaml"], {
        cwd,
      });
      expect(stdout.trim()).toEqual(expected);
    });

    test("should collect nested enums and preserve parent name with --with-parent flag", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_17.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_10.yaml", "--with-parent"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test("should collect nested enums within anyOf, oneOf, allOf and not and preserve parent name with --with-parent flag", async () => {
      const expected = fs
        .readFileSync(new URL("./fixtures/output/enums_18.ts", import.meta.url), "utf-8")
        .trim();
      const { stdout } = await execa(
        cmd,
        ["test/fixtures/input/fixture_11.yaml", "--with-parent", "-n"],
        {
          cwd,
        }
      );
      expect(stdout.trim()).toEqual(expected);
    });

    test.todo("with not allowed --prenum", async () => {
      vi.mock("chalk", () => ({
        red: (text: string) => text,
      }));

      expect(async () => {
        await execa(cmd, ["test/fixtures/input/fixture_5.yaml", "--prenum", "-"], {
          cwd,
        });
      }).toThrowError("Forbidden prenum provided. Only _, $, or letters are allowed");
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
