import './select'
import 'svg.draggable.js'
import './resize'
import SVG from 'svg.js'
import CreateCommand from '../command/CreateCommand'
import MoveCommand from '../command/MoveCommand'
import ResizeCommand from '../command/ResizeCommand'
import ShapeUtils from './utils'
import Bus from '@/bus/Bus'
var drawdone = function () {
}
var drawstop = function () {
  imgLoaded.call(this)
  var draw = this.doc()
  draw.off('mousedown.drawdone')
}
var resizedone = function (attrs, m) {
  var _svg = this.remember('_svg')
  var selectorManager = _svg.selectorManager
  var shape = this
  selectorManager.selectShape(shape)
  var commandManager = _svg.commandManager
  let cmd = new ResizeCommand(attrs, m, shape)
  commandManager.executeCommand(cmd)
}
var imgLoaded = function () {
  var _svg = this.remember('_svg')
  var selectorManager = _svg.selectorManager
  var commandManager = _svg.commandManager
  var shapeManager = _svg.shapeManager
  var shape = this
  shapeManager.push(shape)
  selectorManager.selectShape(shape)
  shape.resize()
  shape.draggable()
  this.on('mousedown', mousedown)
  var attrs = this.attr()
  var m = new SVG.Matrix(shape)
  var box = ShapeUtils.getBox(shape)
  this.on('resizestart', function () {
    attrs = this.attr()
    m = new SVG.Matrix(shape)
    box = ShapeUtils.getBox(shape)
  })
  this.on('resizedone', function () {
    resizedone.call(this, attrs, m)
    attrs = this.attr()
    m = new SVG.Matrix(shape)
    box = ShapeUtils.getBox(this)
  })
  this.on('dragstart', function () {
    attrs = this.attr()
    m = new SVG.Matrix(shape)
    box = ShapeUtils.getBox(shape)
  })
  shape.on('dragend', function (e) {
    dragend(this, box)
    box = ShapeUtils.getBox(this)
    m = new SVG.Matrix(shape)
    attrs = this.attr()
  })
  if (!(shape instanceof SVG.G)) {
    let cmd = new CreateCommand(_svg, shape)
    commandManager.executeCommand(cmd)
  }
  Bus.$emit('createShape', this)
}
var mousedown = function (evt) {
  var selectorManager = this.remember('_svg').selectorManager
  var shape = this
  selectorManager.selectShape(shape)
  evt.stopPropagation()
}
var dragend = function (shape, box) {
  let cmd = new MoveCommand(shape, box)
  var _svg = shape.remember('_svg')
  var commandManager = _svg.commandManager
  commandManager.executeCommand(cmd)
}
export default {
  drawdone,
  drawstop,
  imgLoaded,
  resizedone,
  mousedown,
  dragend
}
