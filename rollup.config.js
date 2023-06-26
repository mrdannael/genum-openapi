// eslint-disable-next-line node/no-unpublished-import
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/cli.ts",
  output: {
    dir: "./bin",
    format: "es",
    banner: "#!/usr/bin/env node",
  },
  plugins: [typescript()],
};
