# get-crowdin-file-ids

> Generate deep links to your content on [Crowdin]

## Why?

Imagine you're serving up some [Crowdin]-translated content on your website and you want to add a link to each page that lets
translators jump right into translating that content on the Crowdin site. Unfortunately, the URLs on Crowdin's translation pages are a bit cryptic. Here's an example:

```
https://crowdin.com/translate/electron/56/en-fr
```

Here `56` refers to Crowdin's internal `id` property for a given file.

This module creates a mapping between your filenames
 and their internal ids on Crowdin by fetching data from Crowdin's
[Project Details API](https://support.crowdin.com/api/info/)
and parsing its arcane response structure into a simple file-to-id 
map.

## Installation

This module requires node 7 or greater because it uses async functions.

```sh
npm install get-crowdin-file-ids --save
```

## Usage

Require the module:

```js
const getIds = require('get-crowdin-file-ids')
```

The function expects a project name and Crowdin API key,
and returns a promise:

```
const ids = await getIds('electron`, 'crowdinKey123')
```

If no API key is specified, it will fall back to the `process.env.CROWDIN_KEY` environment variable.

The result is an object mapping filenames to ids:


```js
{
  'master/content/en-US/docs/glossary.md': '8',
  'master/content/en-US/docs/styleguide.md': '9',
  'master/content/en-US/docs/tutorial/about.md': '30'
}
```

Note how the paths above start with `master`. The Crowdin API
returns a tree that includes the branch name as the top-level directory.

The ids can then be used to assemble URLs like this:


```js
const url = `https://crowdin.com/project/${project}/${id}/${sourceLocale}-${targetLocale}`
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [got](https://github.com/sindresorhus/got): Simplified HTTP requests

## Dev Dependencies

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [nock](https://github.com/node-nock/nock): HTTP Server mocking for Node.js
- [standard](https://github.com/standard/standard): JavaScript Standard Style
- [standard-markdown](https://github.com/zeke/standard-markdown): Test your Markdown files for Standard JavaScript Style™


## License

MIT


[Crowdin]: https://crowdin.com
