import Svg from './Svg'
import Bus from '../bus/Bus'
class SvgManager {
  constructor () {
    this.svgs = []
    this.currentSVG = null
  }

  createSVG (id, tabName) {
    var svg = new Svg(id, tabName)
    this.svgs.push(svg)
    this.currentSVG = svg
    this.setCurrentSVG(undefined, svg)
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
    if (typeof this.currentSVG === 'undefined') {
      this.currentSVG = null
    }
    this.setCurrentSVG(undefined, this.currentSVG)
    this.svgs = this.svgs.filter((svg) => svg.id !== id)
  }
  setCurrentSVG (id, svg) {
    if (typeof id !== 'undefined' && this.svgs.length !== 0) {
      this.currentSVG = (this.svgs.filter((svg) => svg.id === id))[0]
    }
    if (typeof svg !== 'undefined') {
      this.currentSVG = svg
    }
    Bus.$emit('setCurrentSVG', this.currentSVG)
  }
}
var svgManager = (function () {
  return new SvgManager()
})()
export default svgManager
