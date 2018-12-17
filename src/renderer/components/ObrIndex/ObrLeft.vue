<template>
  <div class="obr-left">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="shape in shapes" :key="shape.name" :title="shape.desc" :name="shape.name"  class="my-el-collapse-item">
        <a v-for="item in shape.list" :key="item.id" @click.stop="createShape(item.type)" class="shape"><ObrIcon :type="item.icon"></ObrIcon></a>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import svgManager from '@/svg/SvgManager'
import 'svg.draw.js'
import '../../svg/shape/draw'
import utils from '@/svg/shape/utils'
import ObrIcon from '../icon/ObrIcon'
export default {
  data () {
    return {
      text: '',
      activeNames: ['1'],
      shapes: [
        {
          name: '1',
          desc: '基本图形',
          list: [
            {
              id: '00001',
              type: 'rect',
              desc: '矩形',
              icon: 'zhengfangxing'
            },
            {
              id: '00002',
              type: 'circle',
              desc: '圆形',
              icon: 'yuanxing'
            },
            {
              id: '00003',
              type: 'ellipse',
              desc: '椭圆',
              icon: 'tuoyuan'
            },
            {
              id: '00004',
              type: 'line',
              desc: '直线',
              icon: 'zhixian'
            },
            {
              id: '00005',
              type: 'polyline',
              desc: '折线',
              icon: 'zhexian'
            },
            {
              id: '00006',
              type: 'polygon',
              desc: '多边形',
              icon: 'duobianxing'
            },
            {
              id: '00007',
              type: 'image',
              desc: '图片',
              icon: 'tupian'
            },
            {
              id: '00008',
              type: 'text',
              desc: '文本',
              icon: 'wenben'
            },
            {
              id: '00009',
              type: 'curve',
              desc: '曲线',
              icon: 'quxian'
            }
          ]
        }
      ]
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
  },
  components: {ObrIcon}
}
</script>
<style>
.my-el-collapse-item{
  background-color: #eee;
}
.my-el-collapse-item .el-collapse-item__header{
  background-color: #eee;
  text-align: center;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace
}
.my-el-collapse-item .el-collapse-item__header.is-active{
  border-bottom-color: transparent;
}
.my-el-collapse-item .el-collapse-item__wrap{
  background-color: #eee;
  border-bottom: 1px solid #ccc;
}
.my-el-collapse-item .el-collapse-item__content{
  padding-bottom: 15px;
}
</style>

<style scoped>
.shape{
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin-left: 15px;
  margin-top: 10px;
  cursor: pointer;
  box-sizing:border-box;
  border: 1px solid transparent;
}
.shape:nth-child(4n+1) {
  margin-left: 15px;
}
.shape:hover{
  background: #fff;
  border-color: #409EFF;
}
.obr-left{
  background: #eee;
}
</style>
