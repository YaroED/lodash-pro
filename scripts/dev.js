const { build } = require('esbuild')
const execa = require('execa')
const { resolve, relative } = require('path')
const target = 'core'
const outfileEsm = resolve(__dirname, `../packages/${target}/dist/index.esm.prod.js`)
const outfileCjs = resolve(__dirname, `../packages/${target}/dist/index.cjs.prod.js`)
const relativeOutfileEsm = relative(process.cwd(), outfileEsm)
const relativeOutfileCjs = relative(process.cwd(), outfileCjs)

Promise.all([
  build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.js`)],
    outfile: outfileEsm,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    watch: {
      onRebuild(error) {
        if (!error) console.log(`rebuilt: ${relativeOutfileEsm}`)
      }
    }
  }),
  build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.js`)],
    outfile: outfileCjs,
    bundle: true,
    format: 'cjs',
    platform: 'browser',
    watch: {
      onRebuild(error) {
        if (!error) console.log(`rebuilt: ${relativeOutfileCjs}`)
      }
    }
  })
]).then(() => {
  execa.sync('pnpm', ['format'], { stdio: 'inherit' })
})
