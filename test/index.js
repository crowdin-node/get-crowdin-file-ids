require('chai').should()

const {describe, it} = require('mocha')
const nock = require('nock')
const getCrowdinFileIds = require('..')

const crowdin = nock('https://api.crowdin.com/api')

nock.disableNetConnect()
process.env.CROWDIN_KEY = 'abc'

describe('getCrowdinFileIds', () => {
  it('is a function', () => {
    getCrowdinFileIds.should.be.a('function')
  })

  it('expects project name and Crowdin API key as arguments', async () => {
    crowdin.post('/project/foo-project/info?key=xyz&json')
      .once()
      .reply(200, require('./fixture.json'))

    const urls = await getCrowdinFileIds('foo-project', 'xyz')
    const paths = Object.keys(urls)

    urls.should.be.an('object')
    paths.should.include('master/content/en-US/docs/api/browser-window.md')
    paths.should.include('master/content/en-US/docs/api/structures/point.md')

    Object.values(urls).every(id => Number(id) > 0).should.eq(true)
  })

  it('falls back to CROWDIN_KEY env var', async () => {
    crowdin.post('/project/bar-project/info?key=abc&json')
      .once()
      .reply(200, require('./fixture.json'))

    const urls = await getCrowdinFileIds('bar-project')
    urls.should.be.an('object')
  })

  it('uses the unauthenticated website proxy for the `electron` project', async () => {
    nock('https://electronjs.org/crowdin')
      .get('/info')
      .once()
      .reply(200, require('./fixture.json'))

    const urls = await getCrowdinFileIds('electron')
    urls.should.be.an('object')
  })
})
