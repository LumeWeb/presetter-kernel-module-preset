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
  };
}
