// rollup.config.js

const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript')

const common = require('./rollup.js')

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.aio.js',
    format: 'umd',
    // 如果不同时使用 export 与 export default 可打开legacy
    // legacy: true,
    name: common.name,
    banner: common.banner
  },
  plugins: [
    nodeResolve({
      main: true,
      extensions: [ '.ts', '.js' ]
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    typescript({
      typescript: require('typescript'),
      exclude: 'node_modules/**'
    })
  ]
}
