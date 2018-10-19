import { Image } from 'svg.js'
import ImageAttr from '../attrs/Image'
import electronutil from '../../../../utils/electronutil'
import fileutil from '../../../../utils/fileutil'
import path from 'path'
function _createImage (filename, svg) {
  var extname = path.extname(filename)
  var date = Date.now()
  var filePath = path.join(__dirname, `../../../assets/uploads/imgs/${date.toString()}${extname}`)
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
