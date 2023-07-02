import type { PresetAsset } from "presetter-types";
import { PresetContext } from "presetter-types";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * get the list of templates provided by this preset
 * @returns list of preset templates
 */
export default async function (context: PresetContext): Promise<PresetAsset> {
  const ignores = !context.custom.config?.official
    ? [".github/workflows/ci.yml"]
    : [];

  return {
    extends: [
      "@lumeweb/node-library-preset",
      "@lumeweb/presetter-preset-rollup",
    ],
    supplementaryIgnores: ignores,
    supplementaryConfig: {
      rollup: {
        output: {
          "0": {
            inlineDynamicImports: true,
          },
          "1": {
            browser: true,
            preferBuiltins: false,
          },
        },
        plugins: [
          [
            "@apply @rollup/plugin-wasm[default]",
            {
              targetEnv: "auto-inline",
            },
          ],
        ],
      },
      release: {
        plugins: {
          "3": ["@semantic-release/npm", { npmPublish: false }],
        },
      },
    },
  };
}
