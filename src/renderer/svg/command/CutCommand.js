class CutCommand {
  constructor (svg, shapes) {
    this.svg = svg
    this.shapes = shapes
  }
  execute () {
    let shapeManager = this.svg.shapeManager
    let selectorManager = this.svg.selectorManager
    this.shapes.forEach(shape => {
      selectorManager.unSelectShape(shape)
      shapeManager.remove(shape)
    })
  }
  undo () {
    let shapeManager = this.svg.shapeManager
    this.shapes.forEach(shape => { shapeManager.push(shape) })
  }
}
export default CutCommand
