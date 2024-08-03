import data from '../python/estoque.json'

const str = JSON.stringify(data)

const escapedJsonStr = str.replace(/"/g, '\\"');

console.log(escapedJsonStr)
