import SVG from 'svg.js'
import '../shape/select'
import 'svg.draggable.js'
import ShapeUtils from '../shape/utils'
import Bus from '@/bus/Bus'
class SelectorManager {
  constructor () {
    this.shapes = []
  }
  selectShape (shape, callback) {
    var index = this.shapes.indexOf(shape)
    var multiSelect = shape.remember('multiSelect')
    if (!multiSelect) {
      this.clearSelect(index)
      this.shapes.push(shape)
      var this_ = this
      shape.selectize(true, {deepSelect: this_._isDeepSelect(shape)})
      if (typeof callback === 'function') {
        callback.call(this)
      }
      Bus.$emit('selectShapes', this.shapes)
    }
  }
  clearSelect (i) {
    var this_ = this
    this.shapes.forEach((shape, index) => {
      if (i === 'undefined' || i !== index) {
        shape.selectize(false, {deepSelect: this_._isDeepSelect(shape)})
        shape.forget('multiSelect')
        shape.off('dragmove')
      }
    })
    this.shapes = []
  }
  _isDeepSelect (shape) {
    return shape && (shape.type === 'polygon' || shape.type === 'polyline' || shape.type === 'line' || shape.attr('type') === 'curve')
  }
  multiSelect (shapes) {
    this.clearSelect()
    var this_ = this
    shapes.forEach(function (shape) {
      shape.selectize(true, {deepSelect: this_._isDeepSelect(shape)})
      this_.shapes.push(shape)
      shape.remember('multiSelect', true)
    })

    this_.shapes.forEach(function (shape) {
      var point = null
      shape.on('dragstart', function (e) {
        var p = e.detail.p
        var m = e.detail.m
        point = p.matrixTransform(m.inverse())
      })
      shape.on('dragmove', function (e) {
        e.preventDefault()
        var p = e.detail.p
        var m = e.detail.m
        p = p.matrixTransform(m.inverse())
        this_.shapes.forEach(function (s) {
          var matrix = new SVG.Matrix(s)
          var box = ShapeUtils.getBox(s)
          var newPoint = point.matrixTransform(matrix.inverse().native())
          var newP = p.matrixTransform(matrix.inverse().native())
          var x = box.x + newP.x - newPoint.x
          var y = box.y + newP.y - newPoint.y
          if (s.attr('type') === 'g' || s instanceof SVG.G) {
            s.transform({x: newP.x - newPoint.x, y: newP.y - newPoint.y}, true)
          } else {
            s.move(x, y)
          }
        })
        point = p
      })
    })
    Bus.$emit('selectShapes', this.shapes)
  }
  unSelectShape (shape) {
    var this_ = this
    shape.selectize(false, {deepSelect: this_._isDeepSelect(shape)})
    shape.forget('multiSelect')
    this.shapes = this.shapes.filter((item) => item !== shape)
  }
  selectInvert (shapes) {
    var selectedShapes = this.shapes
    var unSelectedShapes = []
    if (shapes.length > 0) {
      shapes.forEach(shape => {
        if (selectedShapes.indexOf(shape) < 0) {
          unSelectedShapes.push(shape)
        }
      })
    }
    this.multiSelect(unSelectedShapes)
  }
  getSelectedShapes () {
    return this.shapes
  }
}
export default SelectorManager
