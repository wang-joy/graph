import {Ellipse} from 'svg.js'
import EllipseAttr from '../attrs/ellipse'
var func = function (svg) {
  var ellipse = new Ellipse()
  ellipse.attr(EllipseAttr)
  ellipse.remember('_svg', svg)
  return ellipse
}
export default func
