<template>
  <div>
    <button v-for="item of baseShapes.list" :key="item.id"  v-on:click.stop="createShape(item.type)">{{item.desc}}</button>
  </div>
</template>

<script>
import svgManager from '@/svg/SvgManager'
import 'svg.draw.js'
import '../../svg/shape/draw'
import utils from '@/svg/shape/utils'
export default {
  data () {
    return {
      text: '',
      baseShapes: {
        desc: '基本图形',
        list: [
          {
            id: '00001',
            type: 'rect',
            desc: '矩形'
          },
          {
            id: '00002',
            type: 'circle',
            desc: '圆形'
          },
          {
            id: '00003',
            type: 'ellipse',
            desc: '椭圆'
          },
          {
            id: '00004',
            type: 'line',
            desc: '直线'
          },
          {
            id: '00005',
            type: 'polyline',
            desc: '折线'
          },
          {
            id: '00006',
            type: 'polygon',
            desc: '多边形'
          },
          {
            id: '00007',
            type: 'image',
            desc: '图片'
          },
          {
            id: '00008',
            type: 'text',
            desc: '文本'
          },
          {
            id: '00009',
            type: 'curve',
            desc: '曲线'
          }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    createShape: function (type) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        var draw = currentSVG.draw
        var shapeManager = currentSVG.shapeManager
        var shape = shapeManager.createShape(type, currentSVG)
        if (type === 'image') {
          draw.add(shape)
        } else {
          draw.off('click.draw')
          draw.on('click.draw', function (event) {
            draw.add(shape)
            shape.draw(event)
          })
          draw.on('mousedown.drawdone', function (event) {
            if (utils.isPolylineAndPolygon(shape) && event.button === 2) {
              shape.draw('done')
            }
          })
        }
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
