import { Image } from 'svg.js'
import ImageAttr from '../attrs/Image'
import electronutil from '../../../../utils/electronutil'
import fileutil from '../../../../utils/fileutil'
import path from 'path'
function _createImage (filename, svg) {
  // var extname = path.extname(filename)
  // var date = Date.now()
  var baseName = path.win32.basename(filename)
  var imgDir = path.join(__dirname, '../../../../../imgs/')
  if (process.env.NODE_ENV === 'production') {
    imgDir = path.join(process.resourcesPath, '../imgs/')
  }
  var filePath = imgDir + '\\' + baseName
  fileutil.readLocalFile(filename, filePath)
  var img = new Image()
  img.attr(ImageAttr)
  img.load(filePath)
  img.remember('_svg', svg)
  return img
}
var func = function (svg) {
  var filenames = electronutil.openFile()
  if (filenames && filenames.length > 0) {
    return _createImage(filenames[0], svg)
  }
  return null
}
export default func
