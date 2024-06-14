import { vi, describe, test, expect } from "vitest";
import { error } from "../src/utils";
import chalk from "chalk";

vi.mock("chalk");

describe("utils", () => {
  test("error", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    const msg = "error message";

    error(msg);

    expect(chalk.red).toHaveBeenCalledWith(` ✘  ${msg}`);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`RED( ✘  ${msg})`);
  });
});