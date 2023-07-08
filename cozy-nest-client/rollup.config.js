/**
 * Using a separate build cycle for scripts that must live and be able to be loaded
 * outside the cozy-nest-client context, (basically even if CozyNest=No).
 */

import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: './main/cozy-utils-standalone.js',
  output: [
    {
      file: '../client/assets/cozy-utils.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser({
        compress: {
          arguments: true,
          drop_console: true,
          hoist_funs: true,
          hoist_props: true,
          hoist_vars: true,
          inline: true,
          keep_fargs: false,
          keep_fnames: false,
          keep_infinity: false,
          loops: true,
          passes: 3,
          pure_funcs: [],
          pure_getters: true,
          reduce_vars: true,
          sequences: true,
          unused: true,
        },
        format: {
          comments: false,
        },
      })]
    }
  ],
  plugins: [json()]
};