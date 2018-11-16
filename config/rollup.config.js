// rollup.config.js

const common = require('./rollup.js')
const nodeResolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript')
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    // 如果不同时使用 export 与 export default 可打开legacy
    // legacy: true,
    banner: common.banner
  },
  plugins: [
    nodeResolve({
      main: true,
      extensions: [ '.ts', '.js' ]
    }),
    typescript({
      typescript: require('typescript'),
      exclude: 'node_modules/**'
    })
  ]
}
