<template>
  <div class="obr-right">
    <div class="obr-info" @click="showTree">
      <span class="obr-title">{{label}}</span>
    </div>
    <transition name="fade">
      <el-tree :data="shapes" node-key="id" highlight-current :current-node-key = 'currentId' @node-click="nodeClick" v-show="isShowTree" class="obr-tree"></el-tree>
		</transition>
    <div class="obr-attr">
      <div class="obr-input" v-for=" item in attrs" :key="item.title">
        <label :for="item.title">{{item.desc}}</label>
        <template v-if="item.title === 'fill'">
          <div class="color">
            <span class="val">{{item.val}}</span>
            <color-container class="color-container" v-model="item.val" @ok="fill"></color-container>
          </div>
        </template>
        <template v-else-if="item.title === 'stroke'">
          <div class="color">
            <span class="val">{{item.val}}</span>
          </div>
        </template>
        <template v-else>
          <el-input :name="item.title" v-model="item.val" @blur="blur(item.setter)" @keyup.enter.native="blur(item.setter)"  :size="size" :id="item.title" class="obr-el-input"></el-input>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '../../bus/Bus'
import svgManager from '@/svg/SvgManager'
import ShapeUtils from '@/svg/shape/utils'
import SVG from 'svg.js'
import AttrUtils from '@/svg/shape/attrs/utils'
import ColorContainer from '../color-picker/ColorContainer'
export default {
  data () {
    return {
      shapes: [],
      isShowTree: false,
      label: '',
      currentId: '',
      size: 'mini',
      attrs: []
    }
  },
  components: {ColorContainer},
  methods: {
    showTree () {
      this.isShowTree = !this.isShowTree
    },
    nodeClick (node) {
      this.label = node.label
      this.currentId = node.id
      this.select(this.currentId)
      this.isShowTree = false
    },
    blur (setter) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        var selectorManager = currentSVG.selectorManager
        var shapes = selectorManager.getSelectedShapes()
        setter.call(AttrUtils, shapes, event.target.value)
        this.onSelectShapes(shapes)
      }
    },
    getChildren (shape) {
      var obj = { id: shape.attr('id'), label: shape.attr('id'), children: [] }
      var self = this
      if (shape.children && shape.children() && shape.children().length > 0) {
        shape.children().forEach(function (item) {
          obj.children.push({ id: item.attr('id'), label: item.attr('id'), children: self.getChildren(item) })
        })
      }
      return obj
    },
    onSetCurrentSVG (currentSVG) {
      var _this = this
      if (currentSVG) {
        var shapeManager = currentSVG.shapeManager
        var selectorManager = currentSVG.selectorManager
        var seletedShapes = selectorManager.getSelectedShapes()
        if (seletedShapes.length > 0) {
          this.onSelectShapes(seletedShapes)
        } else {
          this.label = currentSVG.tabName
          this.currentId = currentSVG.id
        }
        var shapes = shapeManager.getShapes()
        this.shapes = [ { id: currentSVG.id, label: currentSVG.tabName, children: [] } ]
        var children = this.shapes[0].children
        shapes.forEach(shape => {
          if (shape.type !== 'defs') {
            children.push(_this.getChildren(shape))
          }
        })
      } else {
        this.label = ''
        this.shapes = []
      }
    },
    onSelectShapes (shapes) {
      if (shapes.length > 0) {
        if (shapes.length === 1) {
          this.label = shapes[0].attr('id')
          this.currentId = shapes[0].attr('id')
        } else if (shapes.length > 1) {
          this.label = 'shapes ( ' + shapes.length + '个 )'
        }
        this.attrs = AttrUtils.getShapesAttrs(shapes)
      }
    },
    onCreateShape (shape) {
      this.shapes[0].children.push({id: shape.attr('id'), label: shape.attr('id')})
    },
    select (id) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        // var shapeManager = currentSVG.shapeManager
        var selectorManager = currentSVG.selectorManager
        if (currentSVG.id === id) {
          selectorManager.clearSelect()
        } else {
          var shape = ShapeUtils.getTopParent(SVG.get(id))
          // this.onSelectShapes([shape])
          selectorManager.selectShape(shape)
        }
      }
    },
    fill (val) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        var selectorManager = currentSVG.selectorManager
        var shapes = selectorManager.getSelectedShapes()
        AttrUtils.setFill(shapes, val)
        this.onSelectShapes(shapes)
      }
    }
  },
  mounted () {
    var _this = this
    Bus.$on('setCurrentSVG', _this.onSetCurrentSVG)
    Bus.$on('selectShapes', _this.onSelectShapes)
    Bus.$on('createShape', _this.onCreateShape)
  }
}
</script>

<style>
.obr-right{
  position: relative;
}
.obr-info{
	border-bottom:1px solid rgb(228, 231, 237);
	cursor: pointer;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  font-size: 14px;
}
.obr-tree{
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	position:absolute;
	top:40;
	left:0;
	z-index: 1;
	min-height: 200px;
	max-height: 500px;
	overflow: auto;
  border-bottom:1px solid rgb(228, 231, 237)
}
.obr-attr .obr-input{
  padding: 0 5px;
  font-size: 12px;
  border-bottom: 1px solid #dcdfe6;
}
.obr-attr .obr-input label{
  display: inline-block;
  width: 100px;
  height: 28px;
  line-height: 28px;
  /* text-align: right; */
  padding: 0 5px;
}
.obr-attr .obr-input .obr-el-input{
  width: 120px;
  border: none
}
.obr-attr .obr-input .obr-el-input .el-input__inner{
  padding: 0 2px;
  border: none;
  border-left: 1px solid #dcdfe6;
  border-radius: 0;
}
.color{
  position: relative;
  display: inline-block;
  width: 120px;
  height: 28px;
  line-height: 28px;
  border-left: 1px solid #dcdfe6;
}
.color .val{
  display: block;
  width: 120px;
  height: 28px;
  line-height: 28px;
  padding: 0 2px;
}
.color .color-container {
  position: absolute;
  width: 260px;
  top:28px;
  left: -145px;
  background: #fff;
  z-index: 1;
  border: 1px solid #ccc;
}
</style>
