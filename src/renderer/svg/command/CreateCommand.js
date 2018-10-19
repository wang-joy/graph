import Command from './Command'

class CreateCommand extends Command {
  execute () {
    this.svg.draw.add(this.shape)
  }
  undo () {
    var shapeManager = this.svg.shapeManager
    var selectorManager = this.svg.selectorManager
    selectorManager.unSelectShape(this.shape)
    shapeManager.remove(this.shape)
  }
}
export default CreateCommand
