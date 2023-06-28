import chalk from "chalk";

export function error(msg: string) {
  console.error(chalk.red(` ✘  ${msg}`));
}
