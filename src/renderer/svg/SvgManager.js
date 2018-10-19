import Svg from './Svg'
class SvgManager {
  constructor () {
    this.svgs = []
    this.currentSVG = null
  }

  createSVG (id) {
    var svg = new Svg(id)
    this.svgs.push(svg)
    this.currentSVG = svg
    return svg
  }
  removeSVG (id) {
    if (this.svgs.length !== 0) {
      this.svgs.forEach((svg, index) => {
        if (svg.id === id) {
          this.currentSVG = this.svgs[index + 1] || this.svgs[index - 1]
        }
      })
    }
    if (this.currentSVG === 'undefined') {
      this.currentSVG = null
    }
    this.svgs = this.svgs.filter((svg) => svg.id !== id)
  }
  setCurrentSVG (id) {
    if (this.svgs.length !== 0) {
      this.currentSVG = (this.svgs.filter((svg) => svg.id === id))[0]
    }
  }
}
var svgManager = (function () {
  return new SvgManager()
})()
export default svgManager
