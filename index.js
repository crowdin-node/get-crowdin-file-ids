const got = require('got')
const assert = require('assert')
const path = require('path')

async function getCrowdinFileIds (project, crowdinKey) {
  crowdinKey = crowdinKey || process.env.CROWDIN_KEY
  let url

  assert(project, '`project` must be the first argument')

  let method = 'post'

  if (project === 'electron') {
    url = 'https://electronjs.org/crowdin/info'
    method = 'get' // Fix: HTTPError: Response code 405 (Method Not Allowed)
                   // https://github.com/electron/electronjs.org/blob/f67079064ea071bee1ad46052d7940591e229a2c/routes/languages/proxy.js#L17
  } else {
    assert(crowdinKey, '`crowdinKey` must be the second argument or process.env.CROWDIN_KEY')
    url = `https://api.crowdin.com/api/project/${project}/info?key=${crowdinKey}&json`
  }

  const res = await got[method](url, {json: true})
  return resolveFile({}, res.body.files)
}

module.exports = getCrowdinFileIds

function resolveFile (acc, files, pathPrefix = []) {
  files.forEach(file => {
    switch (file.node_type) {
      case 'file':
        const fullpath = pathPrefix.concat(file.name).join(path.sep).replace(/\\/g, '/')
        acc[fullpath] = file.id
        break
      case 'directory':
      case 'branch':
        return resolveFile(acc, file.files, pathPrefix.concat(file.name))
    }
  })

  return acc
}
