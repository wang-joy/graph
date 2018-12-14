<template>
  <div class="gradient-controller">
    <div class="gradient-controller-display" :style="{background: gradient}"></div>
    <div class="gradient-controller-cursors" @click="addCursor">
      <gradient-controller-cursor
        class="cursor"
        v-for="(color, index) in colorArray"
        :color="color"
        :key="index"
        :index='index'
        @drag="handleDrag"
        @drag-end="handleDragEnd"
        :style="{left: color.pos}"
        @click.native="handleClick(index)">
      </gradient-controller-cursor>
    </div>
    <div class="color-span-container">
      <span class="color-desc">颜色</span>
      <div class="color-span" v-clickoutside='hide'>
        <div class="color-display" :style="{'background-color': color.value}"></div>
        <i class="el-icon-caret-bottom caret" @click="showColor"></i>
        <color-container class="color-container" v-model="show" :color-value="color.value" @change="change" ref="color"></color-container>
      </div>
      <div class="num-container">
        <span class="num-desc">位置</span>
        <div class="num">
          <el-input-number class="my-el-input-number" v-model="num" controls-position="right" :disabled="disabled" :precision="2" :step="0.01" @change="changPos"  :min="0" :max="100" size="mini"></el-input-number>%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import GradientControllerCursor from './GradientControllerCursor'
import ColorContainer from '../color-picker/ColorContainer'
export default {
  data () {
    return {
      index: 0,
      show: false,
      num: 0
    }
  },
  props: {
    colors: {
      required: true,
      type: Array
    }
  },
  components: {GradientControllerCursor, ColorContainer},
  directives: {Clickoutside},
  computed: {
    gradient () {
      var gradientStr = 'linear-gradient(90deg'
      var arrClone = this.colorArray.concat()
      arrClone.sort((item1, item2) => this.toPoint(item1.percent) - this.toPoint(item2.percent))
      arrClone.forEach(color => {
        gradientStr += ',' + color.value + ' ' + color.percent
      })
      gradientStr += ')'
      return gradientStr
    },
    colorArray () {
      return this.colors.map(_ => { return {value: _.value, percent: this.toPercent(_.pos), pos: 280 * _.pos - 2.5 + 'px'} })
    },
    disabled () {
      return this.index === 0 || this.index === this.colors.length - 1
    },
    color () {
      return this.colors[this.index]
    }
  },
  methods: {
    toPoint (percent) {
      var str = percent.replace('%', '')
      return str / 100
    },
    toPercent (point) {
      var percent = Number(point * 100).toFixed(2)
      percent += '%'
      return percent
    },
    handleDrag (clientX, index) {
      var rect = this.$el.getElementsByClassName('gradient-controller-cursors')[0].getBoundingClientRect()
      var left = clientX - rect.left
      var pos = left / rect.width
      this.$emit('cursor-drag', pos, index)
    },
    handleDragEnd (clientX, index) {
      var rect = this.$el.getElementsByClassName('gradient-controller-cursors')[0].getBoundingClientRect()
      var left = clientX - rect.left
      var pos = left / rect.width
      this.$emit('cursor-drag-end', pos, index)
    },
    addCursor () {
      var rect = this.$el.getElementsByClassName('gradient-controller-cursors')[0].getBoundingClientRect()
      var left = event.clientX - rect.left
      var pos = left / rect.width
      this.$emit('add-cursor', pos)
    },
    handleClick (index) {
      this.index = index
    },
    hide () {
      this.show = false
    },
    showColor () {
      this.show = true
      this.$nextTick(_ => {
        let color = this.$refs.color
        color && color.update()
      })
    },
    change (value) {
      this.$emit('change', this.index, value)
    },
    setIndex (index) {
      this.index = index
    },
    changPos (value) {
      this.$emit('change-pos', value / 100, this.index)
    }
  },
  watch: {
    color: {
      immediate: true,
      deep: true,
      handler (val) {
        this.num = val.pos * 100
      }
    }
  }
}
</script>

<style>
.gradient-controller {
  clear: both;
  margin-left: 2px;
  margin-top: 10px;
}
.gradient-controller .gradient-controller-display{
  height: 40px;
  border: 1px solid #dcdfe6;
  width: 280px;
}
.gradient-controller .gradient-controller-cursors{
  width: 280px;
  height: 14px;
  position: relative;
}
.gradient-controller .gradient-controller-cursors .cursor{
  position: absolute;
}
.my-el-input-number.el-input-number.is-controls-right .el-input__inner{
  padding-left: 5px;
  padding-right: 20px;
}
.my-el-input-number.el-input-number--mini .el-input-number__decrease, .my-el-input-number.el-input-number--mini .el-input-number__increase{
  width: 18px;
  left: 40px;
}
</style>
<style scoped>
.color-span-container {
  margin-top:10px;
}
.color-desc{
  display: inline-block;
  height: 26px;
  line-height:26px;
  vertical-align:top;
  text-align:right;
}
.gradient-controller .color-span{
  display: inline-block;
  position: relative;
  width: 140px;
  height: 26px;
  border: 1px solid #ccc;
}
.gradient-controller .color-span .color-display {
  display: inline-block;
  width: 108px;
  margin: 3px 0 3px 3px;
  height: 20px;
}
.caret{
  float: right;
  width: 26px;
  line-height: 26px;
  height: 26px;
  text-align:center;
  cursor: pointer;
  font-size:20px;
  background: #ccc;
}
.caret:hover{
  background: #ccd;
}
.color-container {
  position: absolute;
  width: 260px;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 2;
  top: 35px;
  left: -1px;
}
.num-container{
  display: inline-block;
  vertical-align:top;
}
.num-container .num-desc,.num-container .num{
  display: inline-block;
}
.my-el-input-number{
  width: 60px;
}
.num-container .num{
}
</style>
