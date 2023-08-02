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

function comparePdfs(actual, baseline) {
  let mask_example = [
    { pageIndex: 0, coordinates: { x0: 177, y0: 163, x1: 640, y1: 226 } },
  ]
  return (
    new comparePdf()

      .actualPdfFile(actual)
      .baselinePdfFile(baseline)
      // .addMasks(mask_example)
      .compare()
      .then((result) => {
        console.log({ actual, baseline, ...result })
      })
      .catch((err) => console.log(err))
  )
}

async function compareAllPairs() {
  const files = await getAllPdfPairs('./data/actualPdfs', './data/baselinePdfs')
  files.forEach((file) => {
    comparePdfs(file, file)
  })
}

compareAllPairs()
