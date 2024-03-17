const path = require('path')
const fs = require('fs')
const fileSave = require('file-save')

const dir = process.argv[2]
const jsPath = path.resolve(__dirname, `../${dir}/index.js`)
const tsPath = path.resolve(__dirname, `../${dir}/index.d.ts`)

let jsFlie = fs.readFileSync(jsPath, "utf8");
jsFlie = jsFlie.replace(/scss/g, () => {
  return `css`;
});

fileSave(jsPath)
  .write(jsFlie, "utf-8")
  .end("\n");

let tsFile = fs.readFileSync(tsPath, "utf8");
tsFile = tsFile.replace(/scss/g, () => {
  return `css`;
});
fileSave(tsPath)
  .write(tsFile, "utf-8")
  .end("\n");