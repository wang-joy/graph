import fs from 'fs'
import path from 'path'
export default {
  /**
   * 读取文件到项目文件中
   * @param {string} localFile 文件的绝对路径
   * @param {string} projectFile 文件的相对路径
   */
  readLocalFile (localFile, projectFile) {
    var buffer = fs.readFileSync(localFile)
    fs.writeFileSync(projectFile, buffer)
    return projectFile
  },
  /**
   * 创建文件夹
   * @param {string} dir 项目路径
   */
  createDir (dir) {
    var dirPath = path.join(__dirname, dir)
    if (fs.mkdirSync(dirPath)) {
      return dirPath
    }
    return null
  },
  /**
   * 创建文件
   * @param {string} filePath 文件路径
   */
  createFile (filePath) {
    filePath = path.join(__dirname, filePath)
    if (fs.createFile(filePath)) {
      return filePath
    }
    return null
  },
  writeFile (filePath, data) {
    fs.writeFileSync(filePath, data)
  },
  getName (fileName) {
    // var lastIndex
    var pathObj = path.parse(fileName)
    return pathObj.name
  }
}
