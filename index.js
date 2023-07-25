var fs = require('fs')
var comparePdf = require('./comparePdf-service')

function getAllFiles(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) reject(err)
      else {
        resolve(files)
      }
    })
  })
}

async function getAllPdfPairs(path1, path2) {
  const folder1 = await getAllFiles(path1)
  const folder2 = await getAllFiles(path2)

  const files = []
  folder1.forEach((file) => {
    if (folder2.includes(file)) {
      files.push(file)
    }
  })
  return files
}

function comparePdfs(file1, file2) {
  return (
    new comparePdf()
      .actualPdfFile(file1)
      .baselinePdfFile(file2)
      // .addMask(0, { x0: 35, y0: 70, x1: 145, y1: 95 })
      // .cropPage(0, { width: 467, height: 368, x: 223, y: 300 })
      // .onlyPageIndexes([1])
      // .skipPageIndexes([0])
      .compare()
      .then((result) => {
        return result
      })
      .catch((err) => console.log(err))
  )
}

// finds all pdfs with the same name from 'actualPdfs' folder and 'baselinePdfs' and compares them.
async function compareAllPairs() {
  const files = await getAllPdfPairs('./data/actualPdfs', './data/baselinePdfs')

  files.forEach((file) => {
    comparePdfs(file, file).then((result) =>
      console.log({ file: file, ...result })
    )
  })
}

compareAllPairs()
