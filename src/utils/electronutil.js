import {remote} from 'electron'
var openFile = function (callback) {
  var opts = {
    title: '图片',
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
    ],
    properties: [ 'openFile' ]
  }
  return remote.dialog.showOpenDialog(opts)
}
var saveFile = function (callback) {
  var opts = {
    title: '保存',
    filters: [ { name: 'svg', extensions: ['svg'] } ]
  }
  remote.dialog.showSaveDialog(opts, callback)
}
var openSvgFile = function (callback) {
  var opts = {
    title: '打开',
    filters: [ { name: 'svg', extensions: ['svg'] } ],
    properties: [ 'openFile' ]
  }
  remote.dialog.showOpenDialog(opts, callback)
}
export default {
  openFile,
  saveFile,
  openSvgFile
}
