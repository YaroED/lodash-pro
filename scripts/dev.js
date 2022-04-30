const { build } = require('esbuild')
const execa = require('execa')
const { resolve, relative } = require('path')
const target = 'core'
const outfile = resolve(__dirname, `../packages/${target}/dist/index.esm.prod.js`)
const relativeOutfile = relative(process.cwd(), outfile)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.js`)],
  outfile,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  watch: {
    onRebuild(error) {
      if (!error) console.log(`rebuilt: ${relativeOutfile}`)
    }
  }
}).then(() => {
  console.log(`watching: ${relativeOutfile}`)
})
