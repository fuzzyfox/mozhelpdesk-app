require('dotenv').config()

const PKG = require('../package.json')

const COMMIT_SHORT_HASH = (() => {
  try {
    return require('child_process')
      .execSync('git rev-parse --short HEAD')
      .toString()
      .trim()
      .slice(0, 7)
  } catch (error) {
    console.warn(error)
    return 'nocommit'
  }
})()

const TIMESTAMP36 = (new Date())
  .getTime()
  .toString(36)

module.exports = {
  NODE_ENV: `"production"`,
  APP_BUILD_ID: `"${COMMIT_SHORT_HASH}-${TIMESTAMP36}"`,
  APP_VERSION: `"${PKG.version}"`,
  APP_NAME: `"${PKG.name}"`,
  APP_DESCRIPTION: `"${PKG.description}"`,
  API_ROOT: `"${process.env.API_ROOT || 'http://localhost:3000'}"`
}
