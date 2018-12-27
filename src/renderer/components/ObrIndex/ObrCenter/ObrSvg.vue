<template>
  <div :id="id"></div>
</template>

<script>
import svgManager from '@/svg/SvgManager'
import Bus from '../../../bus/Bus'
import shapeEvts from '@/svg/shape/ShapeEvents'
import fs from 'fs'
import SVG from 'svg.js'
import fileutil from '../../../../utils/fileutil'
import path from 'path'
// import ready from '@/assets/js/MutationObserver'
export default {
  props: ['id', 'tab-name', 'path'],
  methods: {
    readSvg (svg, filePath) {
      fs.open(filePath, 'r', (err, fd) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.error('文件不存在')
            return
          }
          throw err
        }
        let buffer = fs.readFileSync(filePath, 'utf-8')
        let svgContent = buffer.toString()
        let draw = svg.draw
        svgContent = svgContent.substring('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs">'.length, svgContent.indexOf('</svg>'))
        draw.svg(svgContent)
        var shapes = draw.children()
        if (shapes && shapes.length > 0) {
          shapes.forEach(function (shape) {
            if (!(shape instanceof SVG.Defs)) {
              if (shape instanceof SVG.Image) {
                var imgPath = shape.attr('href') || shape.attr('xlink:href')
                var baseName = path.win32.basename(imgPath)
                var imgDir = path.join(__dirname, '../../../../../imgs/')
                if (process.env.NODE_ENV === 'production') {
                  imgDir = path.join(process.resourcesPath, '../imgs/')
                }
                var fileName = imgDir + path.sep + baseName
                fileutil.readLocalFile(path.dirname(filePath) + path.sep + imgPath, fileName)
                shape.load(fileName)
              }
              shape.remember('_svg', svg)
              shapeEvts.drawstop.call(shape)
              // console.log(shapeManager.shapes)
              // shapeManager.shapes.push(shape)
            }
          })
        }
      })
    },
    observer () {
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      var target = this.$el
      var _this = this
      var observer = new MutationObserver(function (mutations) {
        _this.$emit('change')
      })
      var config = { attributes: true, childList: true, characterData: true, subtree: true }
      observer.observe(target, config)
    }
  },
  mounted () {
    var svgId = this.id
    var tabName = this.tabName
    var path = this.path
    var svg = svgManager.createSVG(svgId, tabName, this)
    var draw = svg.draw
    if (path !== '') {
      this.readSvg(svg, path)
    }
    draw.on('mousemove', function (e) {
      var point = this.point(e.screenX, e.screenY)
      Bus.$emit('updateCursor', point)
    })
    this.observer()
  },
  destroyed () {
    var svgId = this.id
    svgManager.removeSVG(svgId)
  }
}
</script>

<style lang='stylus' scoped>
</style>
