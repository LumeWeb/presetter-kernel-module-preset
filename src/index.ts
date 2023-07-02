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
    extends: [
      "@lumeweb/node-library-preset",
      "@lumeweb/presetter-preset-rollup",
    ],
    supplementaryIgnores: ignores,
    supplementaryConfig: {
      // @ts-ignore
      browser: true,
      release: {
        plugins: {
          "3": ["@semantic-release/npm", { npmPublish: false }],
        },
      },
    },
  };
}
