import ShapeUtils from '../shape/utils'
class MoveCommand {
  constructor (shape, box) {
    this.box = box
    this.shape = shape
  }
  execute () {
    var box = this.box
    this.box = ShapeUtils.getBox(this.shape)
    this.shape.move(box.x, box.y)
  }
  undo () {
    this.execute()
  }
}
export default MoveCommand
