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
    }
    return attrs
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
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取折线相关的属性
  getPolylineAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取多边形相关的属性
  getPolygonAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getFill(shape), this.getFillOpacity(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  // 获取图片相关的属性
  getImgAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getImgPath(shape)]
  },
  // 获取曲线相关的属性
  getCurveAttrs (shape) {
    return [this.getLeft(shape), this.getTop(shape), this.getWidth(shape), this.getHeight(shape), this.getAngle(shape), this.getStroke(shape), this.getStrokeWidth(shape), this.getStrokeOpacity(shape), this.getStrokeDashArray(shape)]
  },
  createAttr (title, desc, val) {
    return {
      title: title,
      desc: desc,
      val: val
    }
  },
  getLeft (shape, desc = '左边') {
    return this.createAttr('left', desc, shape.bbox().x)
  },
  getTop (shape, desc = '上边') {
    return this.createAttr('top', desc, shape.bbox().y)
  },
  getWidth (shape, desc = '宽度') {
    return this.createAttr('width', desc, shape.bbox().width)
  },
  getHeight (shape, desc = '高度') {
    return this.createAttr('height', desc, shape.bbox().height)
  },
  getAngle (shape, desc = '旋转角度') {
    return this.createAttr('angle', desc, shape.transform('rotation'))
  },
  getRx (shape, desc = '圆角横向半径') {
    return this.createAttr('rx', desc, shape.rx())
  },
  getRy (shape, desc = '圆角纵向半径') {
    return this.createAttr('ry', desc, shape.ry())
  },
  getFill (shape, desc = '填充') {
    return this.createAttr('fill', desc, shape.attr('fill'))
  },
  getFillOpacity (shape, desc = '填充透明度') {
    return this.createAttr('fill-opacity', desc, shape.attr('fill-opacity'))
  },
  getStroke (shape, desc = '线条') {
    return this.createAttr('stroke', desc, shape.attr('stroke'))
  },
  getStrokeWidth (shape, desc = '线条宽度') {
    return this.createAttr('stroke-width', desc, shape.attr('stroke-width'))
  },
  getStrokeOpacity (shape, desc = '线条透明度') {
    return this.createAttr('stroke-opacity', desc, shape.attr('stroke-opacity'))
  },
  getStrokeDashArray (shape, desc = '线条类型') {
    return this.createAttr('stroke-dasharray', desc, shape.attr('stroke-dasharray'))
  },
  getRadius (shape, desc = '半径') {
    return this.createAttr('radius', desc, shape.attr('r'))
  },
  getImgPath (shape, desc = '路径') {
    return this.createAttr('path', desc, shape.attr('href'))
  }
}
