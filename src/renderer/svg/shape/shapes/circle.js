import {Circle} from 'svg.js'
import CircleAttr from '../attrs/circle'
var func = function (svg) {
  var circle = new Circle()
  circle.attr(CircleAttr)
  circle.remember('_svg', svg)
  return circle
}
export default func
