export default {
  /**
   * 获取元素类型
   */
  getType (shape) {
    return shape.attr('type')
  },
  // 根据类型，获取属性
  getAttrs (shape) {
    var attrs = []
    switch (this.getType(shape)) {
      case 'rect':
        attrs = this.getRectAttrs(shape)
        break
      case 'circle':
        attrs = this.getCircleAttrs(shape)
        break
      case 'ellipse':
        attrs = this.getEllipseAttrs(shape)
        break
      case 'line':
        attrs = this.getLineAttrs(shape)
        break
      case 'polygon':
        attrs = this.getPolygonAttrs(shape)
        break
      case 'polyline':
        attrs = this.getPolylineAttrs(shape)
        break
      case 'image':
        attrs = this.getImgAttrs(shape)
        break
      case 'curve':
        attrs = this.getCurveAttrs(shape)
        break
      case 'g':
        attrs = this.getGroupAttrs(shape)
        break
    }
    return attrs
  },
  getShapesAttrs (shapes) {
    var attrs1 = this.getAttrs(shapes[0])
    for (let i = 1; i < shapes.length; i++) {
      var attrs = []
      const shape = shapes[i]
      var attrs2 = this.getAttrs(shape)
      attrs2.forEach(attr => {
        var item = this.indexOf(attrs1, attr)
        if (item !== null) {
          attrs.push(attr)
        }
      })
      attrs1 = attrs
    }
    return attrs1
  },
  indexOf (arr, item) {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i]
      if (item.title === element.title && item.desc === element.desc) {
        if (item.val !== element.val) {
          item.val = ''
        }
        return item
      }
    }
    return null
  },
  // 获取矩形相关的属性
  getRectAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getRx(shape), this.getRy(shape), this.getFill(shape), this.getFillOpacity(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取圆形相关的属性
  getCircleAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getRadius(shape), this.getFill(shape), this.getFillOpacity(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取椭圆相关的属性
  getEllipseAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getRx(shape, 'x半轴'), this.getRy(shape, 'y半轴'), this.getFill(shape), this.getFillOpacity(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取直线相关的属性
  getLineAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getAngle(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取折线相关的属性
  getPolylineAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getAngle(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取多边形相关的属性
  getPolygonAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getAngle(shape), this.getFill(shape), this.getFillOpacity(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取图片相关的属性
  getImgAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getImgPath(shape)]
  },
  // 获取曲线相关的属性
  getCurveAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取组合相关的属性
  getGroupAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getAngle(shape)]
  },
  createAttr (title, desc, val, setter) {
    return {
      title: title,
      desc: desc,
      val: val,
      setter: setter
    }
  },
  getLeft (shape, desc = '左边') {
    return this.createAttr('left', desc, shape.bbox().x, this.setLeft)
  },
  getTop (shape, desc = '上边') {
    return this.createAttr('top', desc, shape.bbox().y, this.setTop)
  },
  getWidth (shape, desc = '宽度') {
    return this.createAttr('width', desc, shape.bbox().width, this.setWidth)
  },
  getHeight (shape, desc = '高度') {
    return this.createAttr('height', desc, shape.bbox().height, this.setHeight)
  },
  getAngle (shape, desc = '旋转角度') {
    return this.createAttr('angle', desc, shape.transform('rotation'), this.setAngle)
  },
  getRx (shape, desc = '圆角横向半径') {
    return this.createAttr('rx', desc, shape.rx(), this.setRx)
  },
  getRy (shape, desc = '圆角纵向半径') {
    return this.createAttr('ry', desc, shape.ry(), this.setRy)
  },
  getFill (shape, desc = '填充') {
    return this.createAttr('fill', desc, shape.attr('fill').toUpperCase(), this.setFill)
  },
  getFillOpacity (shape, desc = '填充透明度') {
    return this.createAttr('fill-opacity', desc, shape.attr('fill-opacity'), this.setFillOpacity)
  },
  getStroke (shape, desc = '线条') {
    return this.createAttr('stroke', desc, shape.attr('stroke').toUpperCase(), this.setStroke)
  },
  getStrokeWidth (shape, desc = '线条宽度') {
    return this.createAttr('stroke-width', desc, shape.attr('stroke-width'), this.setStrokeWidth)
  },
  getStrokeOpacity (shape, desc = '线条透明度') {
    return this.createAttr('stroke-opacity', desc, shape.attr('stroke-opacity'), this.setStrokeOpacity)
  },
  getStrokeDashArray (shape, desc = '线条类型') {
    return this.createAttr('stroke-dasharray', desc, '' + shape.attr('stroke-dasharray'), this.setStrokeDashArray)
  },
  getRadius (shape, desc = '半径') {
    return this.createAttr('radius', desc, shape.attr('r'), this.setRadius)
  },
  getImgPath (shape, desc = '路径') {
    return this.createAttr('path', desc, shape.attr('href'))
  },
  setLeft (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.x(parseFloat(val)))
    }
  },
  setTop (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.y(parseFloat(val)))
    }
  },
  setWidth (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.width(parseFloat(val)))
    }
  },
  setHeight (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.height(parseFloat(val)))
    }
  },
  setAngle (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.rotate(parseFloat(val)))
    }
  },
  setRx (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.rx(parseFloat(val)))
    }
  },
  setRy (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.ry(parseFloat(val)))
    }
  },
  setFill (shapes, val) {
    shapes.forEach(shape => shape.fill(val))
  },
  setFillOpacity (shapes, val) {
    shapes.forEach(shape => shape.fill({opacity: val}))
  },
  setStroke (shapes, val) {
    shapes.forEach(shape => shape.stroke({color: val}))
  },
  setStrokeWidth (shapes, val) {
    shapes.forEach(shape => shape.stroke({width: val}))
  },
  setStrokeOpacity (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.stroke({opacity: parseFloat(val)}))
    }
  },
  setStrokeDashArray (shapes, val) {
    shapes.forEach(shape => shape.stroke({dasharray: val}))
  },
  setRadius (shapes, val) {
    if (!isNaN(parseFloat(val))) {
      shapes.forEach(shape => shape.radius(2 * parseFloat(val)))
    }
  }
}
