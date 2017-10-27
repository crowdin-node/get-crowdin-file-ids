const {post} = require('got')
const assert = require('assert')
const path = require('path')

async function getCrowdinFileIds (project, crowdinKey) {
  crowdinKey = crowdinKey || process.env.CROWDIN_KEY

  assert(project, '`project` must be the first argument')
  assert(crowdinKey, '`crowdinKey` must be the second argument or process.env.CROWDIN_KEY')

  const url = `https://api.crowdin.com/api/project/${project}/info?key=${crowdinKey}&json`
  const res = await post(url, {json: true})
  return resolveFile({}, res.body.files)
}

module.exports = getCrowdinFileIds

function resolveFile (acc, files, pathPrefix = []) {
  files.forEach(file => {
    switch (file.node_type) {
      case 'file':
        const fullpath = pathPrefix.concat(file.name).join(path.sep)
        acc[fullpath] = file.id
        break
      case 'directory':
      case 'branch':
        return resolveFile(acc, file.files, pathPrefix.concat(file.name))
    }
  })

  return acc
}
