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
  },
  flipX (shape) {
    var rotation = shape.transform('rotation')
    var box = this.getBox(shape)
    var cx = box.cx
    var cy = box.cy
    var m = new SVG.Matrix()
    var _flipX = shape.remember('_flipX')
    var _flipY = shape.remember('_flipY')
    if (!_flipX) {
      if (_flipY) {
        m = m.scale(-1, -1, cx, cy).rotate(180 - rotation, cx, cy)
        shape.transform(m)
      } else {
        m = m.scale(-1, 1, cx, 0)
        shape.transform(m).rotate(rotation, cx, cy)
      }
      shape.remember('_flipX', true)
    } else {
      if (_flipY) {
        m = m.scale(1, -1, 0, cy).rotate(180 + rotation, cx, cy)
        shape.transform(m)
      } else {
        shape.transform(m).rotate(-rotation, cx, cy)
      }
      shape.forget('_flipX')
    }
  },
  flipY (shape) {
    var rotation = shape.transform('rotation')
    var m = new SVG.Matrix()
    var box = this.getBox(shape)
    var cx = box.cx
    var cy = box.cy
    var _flipX = shape.remember('_flipX')
    var _flipY = shape.remember('_flipY')
    if (!_flipY) {
      if (_flipX) {
        m = m.scale(-1, -1, cx, cy).rotate(-rotation, cx, cy)
      } else {
        m = m.scale(1, -1, 0, cx).rotate(rotation, cy, cx)
      }
      shape.transform(m)
      shape.remember('_flipY', true)
    } else {
      if (_flipX) {
        m = m.scale(-1, 1, cx, 0).rotate(180 + rotation, cx, cy)
      } else {
        m = m.rotate(180 - rotation, cx, cy)
      }
      shape.transform(m)
      shape.forget('_flipY')
    }
  },
  justify (shapes, type, draw) {
    var minAndMaxPoint = this.getMinAndMaxPoint(shapes, draw)
    shapes.forEach(shape => {
      var p = this.getMovePoint(shape, type, minAndMaxPoint, draw)
      shape.move(p.x, p.y)
    })
  },
  getMinAndMaxPoint (shapes, draw) {
    var minX, minY, maxX, maxY
    shapes.forEach(shape => {
      var box = shape.rbox()
      var p1 = draw.point(box.x, box.y)
      var p2 = draw.point(box.x2, box.y2)
      if (typeof minX === 'undefined') {
        minX = p1.x
        minY = p1.y
        maxX = p2.x
        maxY = p2.y
      } else {
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
      }
    })
    return {minX: minX, minY: minY, maxX: maxX, maxY: maxY}
  },
  getMovePoint (shape, type, minAndMaxPoint, draw) {
    var bbox = shape.bbox()
    var rbox = shape.rbox()
    var m = new SVG.Matrix(shape)
    var p = this.transformPoint(bbox.x, bbox.y, m)
    var point = null
    var p1 = null
    switch (type) {
      case 'top':
        p1 = draw.point(rbox.x, rbox.y)
        point = this.transformPoint(p.x, p.y + minAndMaxPoint.minY - p1.y, m.inverse())
        break
      case 'left':
        p1 = draw.point(rbox.x, rbox.y)
        point = this.transformPoint(p.x + minAndMaxPoint.minX - p1.x, p.y, m.inverse())
        break
      case 'right':
        p1 = draw.point(rbox.x2, rbox.y2)
        point = this.transformPoint(p.x + minAndMaxPoint.maxX - p1.x, p.y, m.inverse())
        break
      case 'bottom':
        p1 = draw.point(rbox.x2, rbox.y2)
        point = this.transformPoint(p.x, p.y + minAndMaxPoint.maxY - p1.y, m.inverse())
        break
    }
    return point
  }
}
