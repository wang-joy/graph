import PasteCommand from './command/PasteCommand'
import CutCommand from './command/CutCommand'
class CopyManager {
  constructor () {
    this.shapes = []
    this.isClone = true
  }
  cut (svg, shapes) {
    this.shapes = shapes
    let cmd = new CutCommand(svg, shapes)
    var commandManager = svg.commandManager
    cmd.execute()
    commandManager.executeCommand(cmd)
    this.isClone = false
  }
  copy (shapes) {
    this.shapes = shapes
  }
  paste (svg) {
    console.log(this.shapes)
    let cmd = new PasteCommand(svg, this.shapes, this.isClone)
    var commandManager = svg.commandManager
    cmd.execute()
    commandManager.executeCommand(cmd)
    this.isClone = true
  }
}
var copyManger = new CopyManager()
export default copyManger
