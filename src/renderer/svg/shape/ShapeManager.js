import shapes from './shapes/index'
import ShapeEvents from '@/svg/shape/ShapeEvents'
import shapeUtils from './utils'
class ShapeManager {
  constructor (draw) {
    this.shapes = []
    this.draw = draw
  }

  createShape (type, svg) {
    var shape = shapes[type](svg)
    // this.push(shape)
    if (type === 'image') {
      shape.loaded(ShapeEvents.imgLoaded)
    } else {
      shape.on('drawstop', ShapeEvents.drawstop)
    }
    shape.attr('id', shapeUtils.getNextId(type, svg)).attr('type', type)
    return shape
  }

  push (shape) {
    this.shapes.push(shape)
    this.draw.add(shape)
  }

  remove (shape, flag) {
    var index = this.shapes.indexOf(shape)
    if (index >= 0) {
      if (!flag) {
        shape.remove()
      }
      this.shapes = this.shapes.filter((shape, i) => i !== index)
    }
  }
  clear () {
    this.shapes = []
    this.draw.clear()
  }
  getShapes () {
    return this.shapes
  }
}

export default ShapeManager
