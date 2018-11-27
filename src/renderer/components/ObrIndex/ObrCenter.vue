<template>
  <div>
    <el-tabs  type="card" closable v-model="val" @tab-remove="removeTab" @tab-click='clickTab'>
      <el-tab-pane v-for="item of tabList" :name="item.name" :label="item.label" :key="item.name" class="tab-pane" :style="{height:(height-126)+'px', width: width-400+'px'}">
        <obr-pane :id="item.name"></obr-pane>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SVG from 'svg.js'
import 'svg.draggable.js'
import '../../svg/shape/resize'
import svgManager from '@/svg/SvgManager'
import shapeEvts from '@/svg/shape/ShapeEvents'
import copyManager from '@/svg/copyManager'
import shapeUtils from '@/svg/shape/utils'
import ObrPane from './ObrCenter/ObrPane'
import {mapState} from 'vuex'
import electronutil from '../../../utils/electronutil'
import fileutil from '../../../utils/fileutil'
import fs from 'fs'
export default {
  data () {
    return {
      val: '0',
      tabList: [],
      count: 0,
      svgs: [],
      shape: null
    }
  },
  components: {ObrPane},
  methods: {
    createTab () {
      this.count++
      let tab = {
        label: 'New File ' + this.count,
        name: '' + this.count,
        isNew: true
      }
      this.val = tab.name
      this.tabList.push(tab)
    },
    removeTab (targetName) {
      let tabs = this.tabList
      let activeName = this.val
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.val = activeName
      this.tabList = tabs.filter(tab => tab.name !== targetName)
      this.val = this.tabList.length > 0 ? this.val : '0'
    },
    clickTab () {
      var svgId = 'svg' + this.val
      svgManager.setCurrentSVG(svgId)
    },
    saveTab () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let activeName = this.val
        let tab = this.getTabByName(activeName)
        var shapeManager = currentSvg.shapeManager
        var shapes = shapeManager.getShapes()
        var svgContent = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs">'
        shapes.forEach(function (shape) {
          var shapeContent = shape.svg()
          svgContent += shapeContent
        })
        svgContent += '</svg>'
        if (tab && (!tab.isNew)) {
          let filePath = tab.path
          fileutil.writeFile(filePath, svgContent)
        } else {
          electronutil.saveFile(function (fileName) {
            fileutil.writeFile(fileName, svgContent)
            tab.isNew = false
            tab.path = fileName
            tab.label = fileutil.getName(fileName)
          })
        }
      }
    },
    openTab () {
      var that = this
      electronutil.openSvgFile(function (fileNames) {
        if (fileNames) {
          var fileName = fileNames[0]
          var buffer = fs.readFileSync(fileName, 'utf-8')
          var svgContent = buffer.toString()
          svgContent = svgContent.substring('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs">'.length, svgContent.indexOf('</svg>'))
          var name = fileutil.getName(fileName)
          that.count++
          let tab = {
            label: name,
            name: '' + that.count,
            isNew: false,
            path: fileName
          }
          that.val = tab.name
          that.tabList.push(tab)
          setTimeout(function () {
            var currentSvg = svgManager.currentSVG
            var shapeManager = currentSvg.shapeManager
            var draw = currentSvg.draw
            draw.svg(svgContent)
            var shapes = draw.children()
            if (shapes && shapes.length > 0) {
              shapes.forEach(function (shape) {
                if (!(shape instanceof SVG.Defs)) {
                  shape.remember('_svg', currentSvg)
                  shapeEvts.drawstop.call(shape)
                  shapeManager.shapes.push(shape)
                }
              })
            }
          }, 10)
        }
      })
    },
    getTabByName (name) {
      return this.tabList.filter((tab) => tab.name === name)[0]
    },
    undo () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let cmdManager = currentSvg.commandManager
        console.log(cmdManager)
        cmdManager.undo()
      }
    },
    redo () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let cmdManager = currentSvg.commandManager
        cmdManager.redo()
      }
    },
    cut () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.shapes
        if (shapes.length > 0) {
          copyManager.cut(currentSvg, shapes)
        }
      }
    },
    copy () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.shapes
        if (shapes.length > 0) {
          copyManager.copy(shapes)
        }
      }
    },
    paste () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        copyManager.paste(currentSvg)
      }
    },
    selectAll () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let shapeManager = currentSvg.shapeManager
        let selectorManager = currentSvg.selectorManager
        let shapes = shapeManager.getShapes()
        selectorManager.multiSelect(shapes)
      }
    },
    selectInvert () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let shapeManager = currentSvg.shapeManager
        let selectorManager = currentSvg.selectorManager
        let shapes = shapeManager.getShapes()
        selectorManager.selectInvert(shapes)
      }
    },
    rotate (evt, degree) {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.getSelectedShapes()
        shapes.forEach(shape => {
          shape.transform({rotation: degree, relative: true})
        })
      }
    },
    flipX () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.getSelectedShapes()
        shapes.forEach(shape => {
          shapeUtils.flipX(shape)
        })
      }
    },
    flipY () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.getSelectedShapes()
        shapes.forEach(shape => {
          shapeUtils.flipY(shape)
        })
      }
    },
    justify (evts, type) {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.getSelectedShapes()
        if (shapes.length >= 2) {
          let draw = currentSvg.draw
          shapeUtils.justify(shapes, type, draw)
        }
      }
    },
    arrange (evt, type) {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.getSelectedShapes()
        if (shapes.length === 1) {
          (shapes[0])[type]()
        }
      }
    },
    group () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.getSelectedShapes()
        if (shapes.length > 1) {
          shapeUtils.group(shapes, currentSvg)
        }
      }
    },
    ungroup () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.getSelectedShapes()
        if (shapes.length >= 1) {
          shapes.forEach(shape => shapeUtils.ungroup(shape, currentSvg))
        }
      }
    }
  },
  mounted () {
    var that = this
    this.$electron.ipcRenderer.on('createNewFile', that.createTab)
    this.$electron.ipcRenderer.on('saveFile', that.saveTab)
    this.$electron.ipcRenderer.on('openFile', that.openTab)
    this.$electron.ipcRenderer.on('undo', that.undo)
    this.$electron.ipcRenderer.on('redo', that.redo)
    this.$electron.ipcRenderer.on('cut', that.cut)
    this.$electron.ipcRenderer.on('copy', that.copy)
    this.$electron.ipcRenderer.on('paste', that.paste)
    this.$electron.ipcRenderer.on('selectAll', that.selectAll)
    this.$electron.ipcRenderer.on('selectInvert', that.selectInvert)
    this.$electron.ipcRenderer.on('rotate', that.rotate)
    this.$electron.ipcRenderer.on('flipX', that.flipX)
    this.$electron.ipcRenderer.on('flipY', that.flipY)
    this.$electron.ipcRenderer.on('justify', that.justify)
    this.$electron.ipcRenderer.on('arrange', that.arrange)
    this.$electron.ipcRenderer.on('group', that.group)
    this.$electron.ipcRenderer.on('ungroup', that.ungroup)
  },
  computed: {...mapState({height: state => state.ObrWin.height, width: state => state.ObrWin.width})}
}
</script>
<style>
 .el-tabs__header{
   margin: 0;
 }
  .tab-pane{
    overflow: hidden;
  }
</style>
