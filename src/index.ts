import type { PresetAsset } from "presetter-types";
import { PresetContext } from "presetter-types";

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { loadFile, resolveDirective, template } from "presetter";

const DIR = fileURLToPath(dirname(import.meta.url));

// paths to the template directory
const TEMPLATES = resolve(DIR, "..", "templates");

/** List of configurable variables */
export type Variable = {
  /** the directory containing all source code (default: source) */
  source: string;
  /** the directory containing all the compiled files (default: lib) */
  output: string;
  buildSource: string;
};

export const DEFAULT_VARIABLE: Variable = {
  source: "build",
  output: "lib",
  buildSource: "src",
};

function buildOptions(context: PresetContext) {
  const opts = context.custom.config?.vite as any;
  if (!opts) {
    throw new Error("vite options missing!");
  }

  const define = opts.define;
  const build = opts.build;
  const resolve = opts.resolve;
  const optimize = opts.optimize;
  const polyfill = opts.polyfill;

  return {
    viteDefine: resolveDirective(define, context).stringifiedConfig,
    viteBuild: resolveDirective(build, context).stringifiedConfig,
    viteResolve: resolveDirective(resolve, context).stringifiedConfig,
    viteOptimize: resolveDirective(optimize, context).stringifiedConfig,
    vitePolyfill: resolveDirective(polyfill, context).stringifiedConfig,
  };
}

/**
 * get the list of templates provided by this preset
 * @returns list of preset templates
 */
export default async function (context: PresetContext): Promise<PresetAsset> {
  const ignores = !context.custom.config?.official
    ? [".github/workflows/ci.yml"]
    : [];

  return {
    extends: ["@lumeweb/node-library-preset"],
    template: {
      /* eslint-disable @typescript-eslint/naming-convention */
      "vite.config.js": (context) => {
        const content = loadFile(resolve(TEMPLATES, "vite.config.js"), "text");
        const variable = buildOptions(context);

        return template(content, variable);
        /* eslint-enable @typescript-eslint/naming-convention */
      },
      ".prettierignore": resolve(TEMPLATES, "prettierignore"),
    },
    supplementaryIgnores: ignores,
    supplementaryConfig: {
      "release": {
        plugins: {
          "3": ["@semantic-release/npm", { npmPublish: false }],
        },
      },
      "vite": {
        define: {
          "window.": "globalThis.",
        },
        build: {
          outDir: "{output}",
          lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: "{source}/index.js",
            name: "main",
            formats: ["cjs"],
            fileName: "index",
          },
          minify: false,
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
        },
        resolve: {
          dedupe: [
            "@lumeweb/libportal",
            "@lumeweb/libweb",
            "@lumeweb/libkernel",
          ],
        },
        optimize: {
          "node-fetch":
            "const e = undefined; export default e;export {e as Response, e as FormData, e as Blob};",
        },
        polyfill: {
          exclude: ["fs"],
          globals: {
            Buffer: true,
            global: true,
            process: true,
          },
        },
      },
      "tsconfig.build": {
        include: ["{buildSource}"],
        compilerOptions: {
          outDir: "{source}",
        },
      },
    },
    scripts: resolve(TEMPLATES, "scripts.yaml"),
    variable: DEFAULT_VARIABLE,
    noSymlinks: ["vite.config.js"],
  };
}
