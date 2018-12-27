<template>
  <div>
    <el-tabs  type="card" closable v-model="val" @tab-remove="openMessageBox" @tab-click='clickTab'>
      <el-tab-pane v-for="item of tabList" :name="item.name" :key="item.name" class="tab-pane" :style="{height:(height-126)+'px', width: width-450+'px'}" lazy>
        <span class="label" :class="{'is-changed': item.changed}" slot="label">{{item.label}}</span>
        <obr-pane :id="item.name" :tab-name = "item.label" :path="item.path" @change="change"></obr-pane>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import 'svg.draggable.js'
import '../../svg/shape/resize'
import svgManager from '@/svg/SvgManager'
import copyManager from '@/svg/copyManager'
import shapeUtils from '@/svg/shape/utils'
import ObrPane from './ObrCenter/ObrPane'
import {mapState} from 'vuex'
import electronutil from '../../../utils/electronutil'
import fileutil from '../../../utils/fileutil'
import Bus from '../../bus/Bus'
import settings from 'electron-settings'
import path from 'path'
import fs from 'fs'
export default {
  data () {
    return {
      val: '0',
      tabList: [],
      count: 0,
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
        isNew: true,
        path: '',
        changed: true
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
      let fileHistory = settings.get('file-history') || settings.set('file-history', [])
      settings.set('file-history', fileHistory.filter(file => file.name !== targetName))
    },
    clickTab () {
      var svgId = 'svg' + this.val
      svgManager.setCurrentSVG(svgId)
    },
    saveTab (e, tabName) {
      var currentSvg = svgManager.currentSVG
      let activeName = this.val
      if (tabName) {
        activeName = tabName
        currentSvg = svgManager.getSvgById('svg' + tabName)
      }
      if (currentSvg) {
        let tab = this.getTabByName(activeName)
        var shapeManager = currentSvg.shapeManager
        var shapes = shapeManager.getShapes()
        let imgs = []
        var svgContent = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs">\n'
        shapes.forEach(function (shape) {
          var shapeContent = shape.svg()
          if (shape.attr('type') === 'image' || shape.type === 'image') {
            imgs.push(shape.attr('href') || shape.attr('xlink:href'))
          }
          svgContent += '\t' + shapeContent + '\n'
        })
        let fileHistory = settings.get('file-history')
        svgContent += '</svg>'
        if (tab && (!tab.isNew)) {
          let filePath = tab.path
          fileutil.writeFile(filePath, svgContent)
          this.saveImgs(imgs, filePath)
        } else {
          electronutil.saveFile(fileName => {
            if (fileName) {
              fileutil.writeFile(fileName, svgContent)
              this.saveImgs(imgs, fileName)
              tab.isNew = false
              tab.path = fileName
              tab.label = fileutil.getName(fileName)
              fileHistory.push({name: activeName, fileName: fileutil.getName(fileName), filePath: fileName})
              settings.set('file-history', fileHistory)
            }
          })
        }
        tab.changed = false
      }
    },
    openTab () {
      var that = this
      electronutil.openSvgFile(function (fileNames) {
        if (fileNames) {
          var fileName = fileNames[0]
          let tab = that.getTabByFileName(fileName)
          if (tab) {
            that.val = tab.name
            svgManager.setCurrentSVG('svg' + tab.name)
          } else {
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
            let fileHistory = settings.get('file-history')
            fileHistory.push({name: that.val, fileName: fileutil.getName(fileName), filePath: fileName})
            settings.set('file-history', fileHistory)
          }
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
        cmdManager.undo()
        Bus.$emit('setCurrentSVG', currentSvg)
      }
    },
    redo () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let cmdManager = currentSvg.commandManager
        cmdManager.redo()
        Bus.$emit('setCurrentSVG', currentSvg)
      }
    },
    cut () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let selectorManager = currentSvg.selectorManager
        let shapes = selectorManager.shapes
        if (shapes.length > 0) {
          copyManager.cut(currentSvg, shapes)
          Bus.$emit('setCurrentSVG', currentSvg)
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
          Bus.$emit('setCurrentSVG', currentSvg)
        }
      }
    },
    paste () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        copyManager.paste(currentSvg)
        Bus.$emit('setCurrentSVG', currentSvg)
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
        Bus.$emit('selectShapes', shapes)
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
        Bus.$emit('selectShapes', shapes)
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
        Bus.$emit('selectShapes', shapes)
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
        Bus.$emit('selectShapes', shapes)
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
          Bus.$emit('setCurrentSVG', currentSvg)
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
          Bus.$emit('setCurrentSVG', currentSvg)
        }
      }
    },
    change (name) {
      let tab = this.getTabByName(name)
      tab.changed = true
    },
    openMessageBox (tabName) {
      let tab = this.getTabByName(tabName)
      if (tab.changed) {
        this.$confirm('文件已修改，是否保存', '保存', {
          type: 'warning',
          distinguishCancelAndClose: true,
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(() => {
          this.saveTab(null, tabName)
          this.removeTab(tabName)
        }).catch(action => {
          if (action === 'cancel') {
            this.removeTab(tabName)
          }
        })
      } else {
        this.removeTab(tabName)
      }
    },
    saveImgs (imgs, filePath) {
      // let filePathBaseName = path.basename(filePath)
      // let fileName = filePathBaseName.substring(0, filePathBaseName.lastIndexOf('.'))
      let imgDir = path.win32.dirname(filePath) + path.sep + 'imgs' + path.sep
      fs.access(imgDir, err => {
        if (err && err.code === 'ENOENT') {
          fs.mkdir(imgDir, err => {
            if (err) throw err
          })
        }
      })
      imgs.forEach(img => {
        fs.readFile(img, function (err, data) {
          if (err) throw err
          let imgBaseName = path.win32.basename(img)
          fs.writeFile(imgDir + imgBaseName, data, err => {
            if (err) throw err
          })
        })
      })
    },
    getTabByFileName (fileName) {
      let tabs = this.tabList
      let len = tabs.length
      let tab = null
      for (let i = 0; i < len; i++) {
        if (tabs[i].path === fileName) {
          tab = tabs[i]
          break
        }
      }
      return tab
    },
    saveAsTab () {
      var currentSvg = svgManager.currentSVG
      if (currentSvg) {
        let activeName = this.val
        let tab = this.getTabByName(activeName)
        let shapeManager = currentSvg.shapeManager
        var shapes = shapeManager.getShapes()
        let imgs = []
        var svgContent = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs">\n'
        shapes.forEach(function (shape) {
          var shapeContent = shape.svg()
          if (shape.attr('type') === 'image' || shape.type === 'image') {
            imgs.push(shape.attr('href') || shape.attr('xlink:href'))
          }
          svgContent += '\t' + shapeContent + '\n'
        })
        svgContent += '</svg>'
        electronutil.saveFile(fileName => {
          if (fileName) {
            fileutil.writeFile(fileName, svgContent)
            this.saveImgs(imgs, fileName)
            let fileHistory = settings.get('file-history')
            if (tab.isNew) {
              fileHistory.push({name: activeName, fileName: fileutil.getName(fileName), filePath: fileName})
              settings.set('file-history', fileHistory)
            } else {
              let record = fileHistory.find(e => e.name === activeName)
              record.fileName = fileutil.getName(fileName)
              record.filePath = fileName
              let index = fileHistory.indexOf(record)
              fileHistory.splice(index, 1, record)
              settings.set('file-history', fileHistory)
            }
            tab.isNew = false
            tab.path = fileName
            tab.label = fileutil.getName(fileName)
          }
        })
        tab.changed = false
      }
    }
  },
  mounted () {
    var that = this
    this.$electron.ipcRenderer.on('createNewFile', that.createTab)
    this.$electron.ipcRenderer.on('saveFile', that.saveTab)
    this.$electron.ipcRenderer.on('saveAsFile', that.saveAsTab)
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
    let fileHistory = settings.get('file-history') || settings.set('file-history', [])
    let newFileHistory = fileHistory.map(file => {
      that.count++
      let tab = {
        label: file.fileName,
        name: '' + that.count,
        isNew: false,
        path: file.filePath,
        changed: false
      }
      this.tabList.push(tab)
      this.val = '' + that.count
      file.name = '' + that.count
      return file
    })
    settings.set('file-history', newFileHistory)
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
<style scoped>
.label {
  font-size: 16px;
}
.label.is-changed::after{
  display: inline-block;
  content: '*';
  line-height:40px;
  padding-left: 5px;
}
</style>

