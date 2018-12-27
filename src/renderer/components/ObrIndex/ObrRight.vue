<template>
  <div class="obr-right">
    <div class="obr-info" @click="showTree">
      <span class="obr-title">{{label}}</span>
    </div>
    <transition name="fade">
      <el-tree :data="shapes" node-key="id" highlight-current :current-node-key = 'currentId' @node-click="nodeClick" v-show="isShowTree" class="obr-tree"></el-tree>
		</transition>
    <div class="obr-attr">
      <div class="obr-input" v-for=" item in attrs" :key="currentId+'_'+item.title">
        <label :for="item.title" class="item-desc">{{item.desc}}</label>
        <template v-if="item.title === 'fill'">
          <div class="color" v-clickoutside='hideFill' ref="fill">
            <span class="val" @click="showFill">{{item.val}}</span>
            <i class="el-icon-caret-bottom caret" @click="showFill"></i>
            <color-container class="color-container"  v-model="showFillColor" :color-value="item.val" @change="fill" @show-gradient="showGradient" transparent gradient></color-container>
          </div>
        </template>
        <template v-else-if="item.title === 'stroke'">
          <div class="color" v-clickoutside='hideStroke'>
            <span class="val" @click="showStroke">{{item.val}}</span>
            <i class="el-icon-caret-bottom caret" @click="showStroke"></i>
            <color-container class="color-container"  v-model="showStrokeColor" :color-value="item.val" @change="stroke" ></color-container>
          </div>
        </template>
        <template v-else-if="item.title === 'stroke-dasharray'">
          <div class="dasharray">
            <el-select v-model="item.val" :size="size" @change="blur(item.setter, item.val)">
              <el-option v-for="dash in dashArray" :key="dash.value" :label="dash.display" :value="dash.value"></el-option>
            </el-select>
          </div>
        </template>
        <template v-else-if="item.title === 'background'">
          <div class="color" v-clickoutside='hideBackground'>
            <span class="val" @click="showBackground">{{item.val}}</span>
            <i class="el-icon-caret-bottom caret" @click="showBackground"></i>
            <color-container class="color-container"  v-model="showBackgroundColor" :color-value="item.val" @change="setSvgBackground" ></color-container>
          </div>
        </template>
        <template v-else-if="item.title === 'gridColor'">
          <div class="color" v-clickoutside='hideGridColor'>
            <span class="val" @click="showGridColor">{{item.val}}</span>
            <i class="el-icon-caret-bottom caret" @click="showGridColor"></i>
            <color-container class="color-container"  v-model="gridColor" :color-value="item.val" @change="setSvgGridColor" ></color-container>
          </div>
        </template>
        <template v-else-if="item.title === 'gridShow'">
          <div class="switch">
            <el-switch v-model="item.val" @change='changeGridShow'> </el-switch>
          </div>
        </template>
        <template v-else>
          <el-input :name="item.title" v-model="item.val" @blur="blur(item.setter, item.val)" @keyup.enter.native="blur(item.setter)"  :size="size" :id="item.title" class="obr-el-input"></el-input>
        </template>
      </div>
    </div>
    <el-dialog title="渐变" :visible.sync="dialogVisible" width="430px" class="my-el-dialog">
      <gradient-container @ok='handleGradientOk' ></gradient-container>
    </el-dialog>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Popper from 'element-ui/src/utils/vue-popper'
import Bus from '../../bus/Bus'
import svgManager from '@/svg/SvgManager'
import ShapeUtils from '@/svg/shape/utils'
import SVG from 'svg.js'
import AttrUtils from '@/svg/shape/attrs/utils'
import ColorContainer from '../color-picker/ColorContainer'
import GradientContainer from '../gradient-picker/PickerContainer.vue'
export default {
  data () {
    return {
      shapes: [],
      isShowTree: false,
      label: '',
      currentId: '',
      size: 'mini',
      attrs: [],
      showFillColor: false,
      showStrokeColor: false,
      showBackgroundColor: false,
      gridColor: false,
      dialogVisible: false,
      dashArray: [
        {
          value: '0',
          display: '—————'
        },
        {
          value: '5,5',
          display: '- - - - - - - - -'
        },
        {
          value: '10,5,5,5',
          display: '— - — - — -'
        }
      ]
    }
  },
  directives: {Clickoutside},
  mixins: [Popper],
  components: {ColorContainer, GradientContainer},
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
    blur (setter, val) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        var selectorManager = currentSVG.selectorManager
        var shapes = selectorManager.getSelectedShapes()
        if (shapes.length > 0) {
          setter.call(AttrUtils, shapes, val)
          this.onSelectShapes(shapes)
        } else {
          setter.call(AttrUtils, currentSVG, val)
          this.onSelectSvg(currentSVG)
        }
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
          this.attrs = AttrUtils.getSvgAttrs(currentSVG)
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
        this.attrs = []
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
        setTimeout(() => {
          this.attrs = AttrUtils.getShapesAttrs(shapes)
        }, 5)
      }
    },
    onCreateShape (shape) {
      this.shapes[0].children.push({id: shape.attr('id'), label: shape.attr('id')})
    },
    select (id) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        var selectorManager = currentSVG.selectorManager
        if (currentSVG.id === id) {
          selectorManager.clearSelect()
          this.onSelectSvg()
        } else {
          var shape = ShapeUtils.getTopParent(SVG.get(id))
          selectorManager.selectShape(shape)
        }
      }
    },
    fill (val) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        var selectorManager = currentSVG.selectorManager
        var shapes = selectorManager.getSelectedShapes()
        if (shapes.length > 0) {
          AttrUtils.setFill(shapes, val)
          this.onSelectShapes(shapes)
        }
      }
    },
    stroke (val) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        var selectorManager = currentSVG.selectorManager
        var shapes = selectorManager.getSelectedShapes()
        AttrUtils.setStroke(shapes, val)
        this.onSelectShapes(shapes)
      }
    },
    setSvgBackground (val) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        AttrUtils.setSvgBackGround(currentSVG, val)
        this.onSelectSvg(currentSVG)
      }
    },
    setSvgGridColor (val) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        AttrUtils.setSvgGridColor(currentSVG, val)
        this.onSelectSvg(currentSVG)
      }
    },
    showFill () {
      this.showFillColor = !this.showFillColor
    },
    hideFill () {
      this.showFillColor = false
    },
    showStroke () {
      this.showStrokeColor = !this.showStrokeColor
    },
    hideStroke () {
      this.showStrokeColor = false
    },
    showBackground () {
      this.showBackgroundColor = !this.showBackgroundColor
    },
    hideBackground () {
      this.showBackgroundColor = false
    },
    showGridColor () {
      this.gridColor = !this.gridColor
    },
    hideGridColor () {
      this.gridColor = false
    },
    showGradient (gradient) {
      this.dialogVisible = true
      this.gradient = gradient
    },
    handleGradientOk (colors) {
      console.log(colors)
    },
    onSelectSvg () {
      var currentSVG = svgManager.currentSVG
      this.label = currentSVG.tabName
      this.currentId = currentSVG.id
      this.attrs = AttrUtils.getSvgAttrs(currentSVG)
    },
    changeGridShow (val) {
      var currentSVG = svgManager.currentSVG
      if (currentSVG) {
        AttrUtils.setSvgGridShow(currentSVG, val)
      }
    }
  },
  mounted () {
    var _this = this
    Bus.$on('setCurrentSVG', _this.onSetCurrentSVG)
    Bus.$on('selectShapes', _this.onSelectShapes)
    Bus.$on('createShape', _this.onCreateShape)
    Bus.$on('selectSvg', _this.onSelectSvg)
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
.obr-attr .obr-input .obr-el-input .el-input__inner, .dasharray .el-input__inner{
  padding: 0 5px;
  border: none;
  border-left: 1px solid #dcdfe6;
  border-radius: 0;
}
.dasharray .el-input__inner:focus,
.dasharray .el-input__inner:visited,
.dasharray .el-input.is-focus .el-input__inner, 
.dasharray .el-input__inner:hover{
  border: none;
}
.color, .switch{
  position: relative;
  display: inline-block;
  width: 125px;
  height: 28px;
  line-height: 28px;
  border-left: 1px solid #dcdfe6;
}
.switch{
  width: 120px;
  padding-left:5px;
}
.color .val{
  display: inline-block;
  width: 80px;
  height: 28px;
  line-height: 28px;
  padding: 0 5px;
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
.my-el-dialog .el-dialog__body{
  padding: 10px 20px 30px;
}
</style>
<style scoped>
.caret{
  float: right;
  width: 28px;
  height: 28px;
  font-size: 22px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
}
.caret:hover{
  background: #dcdfe6;
}
.dasharray{
  display: inline-block;
  width: 120px;
  border-left: 1px solid #dcdfe6;
}
.item-desc {
  font-family: '微软雅黑'
}
</style>

