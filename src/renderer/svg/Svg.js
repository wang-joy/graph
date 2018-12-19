import SVG from 'svg.js'
import 'svg.select.js'
import 'svg.resize.js'
import 'svg.draggable.js'
import SelectorManager from './selector/SelectorManager'
import ShapeManager from './shape/ShapeManager'
import shapeUtils from './shape/utils'
import CommandManager from './command/CommandManager'
import Bus from '@/bus/Bus'
class Svg {
  constructor (id, tabName, vue) {
    this.draw = SVG(id).size('100%', '100%')
    this.id = id
    this.tabName = tabName
    var selectorManager = new SelectorManager()
    var shapeManager = new ShapeManager(this.draw)
    var commandManager = new CommandManager(10)
    this.selectorManager = selectorManager
    this.shapeManager = shapeManager
    this.commandManager = commandManager
    this.vue = vue
    let that = this
    this.draw.on('mousedown.clearSelect', function () {
      selectorManager.clearSelect()
      Bus.$emit('selectSvg', that)
    })
    this.draw.on('mousedown.multiSelect', function (e) {
      if (e.button === 2) {
        var selectArea = this.rect().fill('blue').opacity(0.5)
        selectArea.draw(e)
        this.on('mouseup', function (e) {
          if (selectArea.width() === 0 && selectArea.height() === 0) {
            selectArea.remove()
          } else {
            selectArea.draw(e)
          }
        })
        selectArea.on('drawstop', function () {
          var children = shapeManager.getShapes()
          var shapes = []
          children.forEach(function (shape) {
            var isRboxIntersect = shapeUtils.isRboxIntersect(shape, selectArea)
            if (isRboxIntersect) {
              shapes.push(shape)
            }
          })
          selectorManager.multiSelect(shapes)
          this.remove()
        })
      }
    })
  }
}
export default Svg
