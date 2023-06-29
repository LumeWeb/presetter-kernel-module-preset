import type { PresetAsset } from "presetter-types";
import { PresetContext } from "presetter-types";

/**
 * get the list of templates provided by this preset
 * @returns list of preset templates
 */
export default async function (context: PresetContext): Promise<PresetAsset> {
  const ignores = !context.custom.config?.official
    ? [".github/workflows/ci.yml"]
    : [];

  return {
    extends: ["presetter-preset-rollup", "@lumeweb/node-library-preset"],
    supplementaryIgnores: ignores,
    supplementaryConfig: {
      rollup: {
        output: { file: "{output}/index.js", format: "cjs", sourcemap: true },
        plugins: {
          "@apply @rollup/plugin-json[default]": {},
          "@apply rollup-plugin-ts[default]": {},
          "@apply rollup-plugin-tsconfig-paths[default]": {},
          "@apply @rollup/plugin-node-resolve[default]": {},
          "@apply @rollup/plugin-commonjs[default]": {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
          },
          "@apply @rollup/plugin-wasm[default]": {
            targetEnv: "auto-inline",
          },
        },
      },
    },
  };
}
