import SVG from 'svg.js'
class ResizeCommand {
  constructor (attrs, m, shape) {
    this.attrs = attrs
    this.shape = shape
    this.m = m
  }
  execute () {
    let attrs = this.attrs
    let m = this.m
    this.attrs = this.shape.attr()
    this.m = new SVG.Matrix(this.shape)
    this.shape.attr(attrs)
    this.shape.transform(m)
  }
  undo () {
    this.execute()
  }
}

export default ResizeCommand
