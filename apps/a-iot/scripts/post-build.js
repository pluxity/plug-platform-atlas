import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

// Move dist/aiot/cesium to dist/cesium
const aiotCesiumPath = path.join(distDir, 'aiot', 'cesium')
const cesiumPath = path.join(distDir, 'cesium')

if (fs.existsSync(aiotCesiumPath)) {
  console.log('Moving cesium from dist/aiot/cesium to dist/cesium...')

  // Create dist/cesium if it doesn't exist
  if (!fs.existsSync(cesiumPath)) {
    fs.mkdirSync(cesiumPath, { recursive: true })
  }

  // Copy all files from aiot/cesium to cesium
  fs.cpSync(aiotCesiumPath, cesiumPath, { recursive: true })

  // Remove aiot/cesium
  fs.rmSync(aiotCesiumPath, { recursive: true, force: true })

  // Remove aiot folder if it's empty
  const aiotPath = path.join(distDir, 'aiot')
  const aiotContents = fs.readdirSync(aiotPath)
  if (aiotContents.length === 0) {
    fs.rmdirSync(aiotPath)
    console.log('Removed empty aiot folder')
  }

  console.log('Cesium moved successfully!')
} else {
  console.log('No aiot/cesium folder found, skipping...')
}
