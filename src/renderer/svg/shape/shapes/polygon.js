import {Polygon} from 'svg.js'
import PolygonAttr from '../attrs/polygon'
var func = function (svg) {
  var polygon = new Polygon()
  polygon.attr(PolygonAttr)
  polygon.remember('_svg', svg)
  return polygon
}
export default func
