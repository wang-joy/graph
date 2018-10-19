import SVG from 'svg.js'
export default {
  isPolyline (shape) {
    return shape && shape.type === 'polyline'
  },
  isPolygon (shape) {
    return shape && shape.type === 'polygon'
  },
  transformPoint (x, y, m) {
    return {x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f}
  },
  isPolylineAndPolygon (shape) {
    return shape && (shape.type === 'polygon' || shape.type === 'polyline')
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
      if (shape.hasOwnProperty(attr)) copy[attr] = this.clone(shape[attr])
    }
    return copy
  }
}
