import SVG from 'svg.js'
import shapeEvts from './ShapeEvents'
import 'svg.draggable.js'
export default {
  isPolyline (shape) {
    return shape && shape.type === 'polyline'
  },
  isPolygon (shape) {
    return shape && shape.type === 'polygon'
  },
  isCurve (shape) {
    return shape && shape.attr('type') === 'curve'
  },
  transformPoint (x, y, m) {
    return {x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f}
  },
  isPolylineAndPolygon (shape) {
    return shape && (shape.type === 'polygon' || shape.type === 'polyline' || shape.attr('type') === 'curve')
  },
  isRboxIntersect (shape1, shape2) {
    var rbox1 = shape1.rbox()
    var rbox2 = shape2.rbox()
    if (rbox1.x2 < rbox2.x || rbox2.x2 < rbox1.x || rbox1.y2 < rbox2.y || rbox2.y2 < rbox1.y) {
      return false
    } else {
      return true
    }
  },
  getBox (shape) {
    var box = shape.bbox()
    if (shape instanceof SVG.Nested) box = shape.rbox()
    if (shape instanceof SVG.G || shape instanceof SVG.Use || shape instanceof SVG.Nested) {
      box.x = shape.x()
      box.y = shape.y()
    }
    return box
  },
  clone (shape) {
    var copy = {}
    for (var attr in shape) {
      if (shape.hasOwnProperty(attr)) {
        copy[attr] = this.clone(shape[attr])
      } else {
        copy[attr] = shape[attr]
      }
    }
    return copy
  },
  flipX (shape) {
    var rotation = shape.transform('rotation')
    var _flipX = shape.remember('_flipX')
    var _flipY = shape.remember('_flipY')
    var m = new SVG.Matrix()
    var box = shape.bbox()
    if (!_flipX) {
      if (!_flipY) {
        m = m.scale(-1, 1)
        shape.transform({rotation: -rotation}, true)
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x, p.y)
        var box2 = shape.bbox()
        shape.dx(-2 * box2.cx).rotate(rotation)
      } else {
        m = m.scale(-1, -1)
        shape.transform({rotation: rotation - 180}, true)
        rotation = -rotation
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x, p.y - box.height)
        let box2 = shape.bbox()
        shape.dmove(-2 * box2.cx, -2 * box2.cy).rotate(rotation)
      }
      shape.remember('_flipX', true)
    } else {
      if (!_flipY) {
        rotation = -rotation
        shape.transform({rotation: -rotation}, true)
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x - box.width, p.y).rotate(rotation)
      } else {
        m = m.scale(1, -1)
        shape.transform({rotation: -rotation}, true)
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x, p.y)
        let box2 = this.getBox(shape)
        shape.dy(-2 * box2.cy).rotate(rotation)
      }
      shape.forget('_flipX')
    }
  },
  flipY (shape) {
    var rotation = shape.transform('rotation')
    var _flipX = shape.remember('_flipX')
    var _flipY = shape.remember('_flipY')
    var m = new SVG.Matrix()
    var box = this.getBox(shape)
    if (!_flipY) {
      if (!_flipX) {
        m = m.scale(1, -1)
        shape.transform({rotation: -rotation}, true)
        rotation = 180 + rotation
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x, p.y)
        let box2 = this.getBox(shape)
        shape.dy(-2 * box2.cy).rotate(rotation)
      } else {
        m = m.scale(-1, -1)
        shape.transform({rotation: rotation}, true)
        rotation = 180 - rotation
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x - box.width, p.y)
        let box2 = this.getBox(shape)
        shape.dmove(-2 * box2.cx, -2 * box2.cy).rotate(rotation)
      }
      shape.remember('_flipY', true)
    } else {
      if (!_flipX) {
        shape.transform({rotation: 180 + rotation}, true)
        rotation = 180 - rotation
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x, p.y - box.height).rotate(rotation)
      } else {
        m = m.scale(-1, 1)
        shape.transform({rotation: -rotation}, true)
        rotation = 180 + rotation
        let shapeM = new SVG.Matrix(shape)
        let p = this.transformPoint(box.x, box.y, shapeM)
        shape.transform(m).move(p.x, p.y)
        var box2 = this.getBox(shape)
        shape.dx(-2 * box2.cx).rotate(rotation)
      }
      shape.forget('_flipY')
    }
  },
  justify (shapes, type, draw) {
    var minAndMaxPoint = this.getMinAndMaxPoint(shapes, draw)
    shapes.forEach(shape => {
      var p = this.getMovePoint(shape, type, minAndMaxPoint, draw)
      if (shape.attr('type') === 'g' || shape instanceof SVG.G) {
        shape.transform({x: p.gx, y: p.gy}, true)
      } else {
        shape.move(p.x, p.y)
      }
    })
  },
  getMinAndMaxPoint (shapes, draw) {
    var minX = Infinity
    var minY = Infinity
    var maxX = -Infinity
    var maxY = -Infinity
    shapes.forEach(shape => {
      var box = shape.rbox()
      var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      var p1 = {x: box.x - scrollLeft, y: box.y - scrollTop}
      var p2 = {x: box.x2 - scrollLeft, y: box.y2 - scrollTop}
      if (minX > p1.x) {
        minX = p1.x
      }
      if (maxX < p2.x) {
        maxX = p2.x
      }
      if (minY > p1.y) {
        minY = p1.y
      }
      if (maxY < p2.y) {
        maxY = p2.y
      }
    })
    return {minX: minX, minY: minY, maxX: maxX, maxY: maxY}
  },
  getMovePoint (shape, type, minAndMaxPoint, draw) {
    var bbox = this.getBox(shape)
    var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    var rbox = shape.rbox()
    var m = shape.node.getScreenCTM().inverse()
    switch (type) {
      case 'top': {
        let startPoint = this.transformPoint(rbox.x - scrollLeft, rbox.y - scrollTop, m)
        let endPoint = this.transformPoint(rbox.x - scrollLeft, minAndMaxPoint.minY, m)
        return {x: bbox.x + endPoint.x - startPoint.x, y: bbox.y + endPoint.y - startPoint.y, gx: endPoint.x - startPoint.x, gy: endPoint.y - startPoint.y}
      }
      case 'left': {
        let startPoint = this.transformPoint(rbox.x - scrollLeft, rbox.y - scrollTop, m)
        let endPoint = this.transformPoint(minAndMaxPoint.minX, rbox.y - scrollTop, m)
        return {x: bbox.x + endPoint.x - startPoint.x, y: bbox.y + endPoint.y - startPoint.y, gx: endPoint.x - startPoint.x, gy: endPoint.y - startPoint.y}
      }
      case 'right': {
        let startPoint = this.transformPoint(rbox.x2 - scrollLeft, rbox.y2 - scrollTop, m)
        let endPoint = this.transformPoint(minAndMaxPoint.maxX, rbox.y2 - scrollTop, m)
        return {x: bbox.x + endPoint.x - startPoint.x, y: bbox.y + endPoint.y - startPoint.y, gx: endPoint.x - startPoint.x, gy: endPoint.y - startPoint.y}
      }
      case 'bottom': {
        let startPoint = this.transformPoint(rbox.x2 - scrollLeft, rbox.y2 - scrollTop, m)
        let endPoint = this.transformPoint(rbox.x2 - scrollLeft, minAndMaxPoint.maxY, m)
        return {x: bbox.x + endPoint.x - startPoint.x, y: bbox.y + endPoint.y - startPoint.y, gx: endPoint.x - startPoint.x, gy: endPoint.y - startPoint.y}
      }
      case 'horizontal': {
        let startPoint = this.transformPoint(rbox.cx - scrollLeft, rbox.cy - scrollTop, m)
        let endPoint = this.transformPoint(rbox.cx - scrollLeft, (minAndMaxPoint.minY + minAndMaxPoint.maxY) / 2, m)
        return {x: bbox.x + endPoint.x - startPoint.x, y: bbox.y + endPoint.y - startPoint.y, gx: endPoint.x - startPoint.x, gy: endPoint.y - startPoint.y}
      }
      case 'vertical': {
        let startPoint = this.transformPoint(rbox.cx - scrollLeft, rbox.cy - scrollTop, m)
        let endPoint = this.transformPoint((minAndMaxPoint.minX + minAndMaxPoint.maxX) / 2, rbox.cy - scrollTop, m)
        return {x: bbox.x + endPoint.x - startPoint.x, y: bbox.y + endPoint.y - startPoint.y, gx: endPoint.x - startPoint.x, gy: endPoint.y - startPoint.y}
      }
    }
  },
  group (shapes, svg) {
    var draw = svg.draw
    var g = draw.group().attr('id', this.getNextId('group', svg)).attr('type', 'g')
    var shapeManager = svg.shapeManager
    shapes.forEach(shape => {
      g.add(shape)
      // shape.remember('_m', new SVG.Matrix(shape))
      shape.off('mousedown')
      shapeManager.remove(shape, true)
    })
    g.remember('_svg', svg)
    shapeEvts.drawstop.call(g)
  },
  ungroup (g, svg) {
    var shapeManager = svg.shapeManager
    var selectorManager = svg.selectorManager
    var children = []
    g.each(function () {
      var shape = this
      // var m = shape.remember('_m')
      shape.draggable().on('mousedown', shapeEvts.mousedown)
      shapeManager.push(shape)
      children.push(shape)
    })
    selectorManager.unSelectShape(g)
    shapeManager.remove(g)
    selectorManager.multiSelect(children)
  },
  getNextId (type, svg) {
    var draw = svg.draw
    var key = '_' + type + '_n'
    var n = 1
    if (draw.remember(key)) {
      n = 1 + svg.draw.remember(key)
    }
    svg.draw.remember(key, n)
    return type + n
  },
  getTopParent (shape) {
    if (shape.parent() && !(shape.parent() instanceof SVG.Doc)) {
      shape = this.getTopParent(shape.parent())
    }
    return shape
  },
  fillGradient (gradient, shape) {
  }
}
