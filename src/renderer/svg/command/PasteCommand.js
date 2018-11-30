import shapeEvts from '../shape/ShapeEvents'
import ShapeUtils from '../shape/utils'
class PasteCommand {
  constructor (svg, shapes, isClone) {
    this.svg = svg
    this.shapes = shapes
    this.cloneShapes = []
    this.isClone = isClone
  }

  execute () {
    let cloneShapes = this.cloneShapes
    let svg = this.svg
    let shapeManager = svg.shapeManager
    let isClone = this.isClone
    this.shapes.forEach(function (shape) {
      var type = shape.attr('type')
      if (isClone) {
        let cloneShape = shape.clone()
        cloneShape.attr('id', ShapeUtils.getNextId(type, svg))
        cloneShape.dmove(5, 5)
        cloneShape.remember('_svg', svg)
        shapeEvts.drawstop.call(cloneShape)
        cloneShapes.push(cloneShape)
      } else {
        shapeManager.push(shape)
        shape.attr('id', ShapeUtils.getNextId(type, svg))
      }
      // shapeManager.push(shape)
    })
  }
  undo () {
    let selectorManager = this.svg.selectorManager
    let shapeManager = this.svg.shapeManager
    this.cloneShapes.forEach(function (shape) {
      selectorManager.unSelectShape(shape)
      shapeManager.remove(shape)
    })
    this.cloneShapes = []
  }
}

export default PasteCommand
