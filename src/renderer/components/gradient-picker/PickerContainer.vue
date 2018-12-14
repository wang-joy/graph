<template>
  <div class="gradient-picker-container">
    <div class="gradient-left">
      <gradient-direction
        v-model="direction"
        @symmetryChange="handleSymmetryChange">
      </gradient-direction>
      <gradient-controller
        :colors="colors"
        @cursor-drag="handleDrag"
        @cursor-drag-end="handleDragEnd"
        @add-cursor="handleAddCursor"
        @change="change"
        @change-pos="changePos"
        ref="controller">
      </gradient-controller>
    </div>
    <div class="gradient-right">
      <div class="btns">
        <el-button size="mini" class="btn" @click="handleOk">确定</el-button>
        <el-button size="mini" class="btn">取消</el-button>
      </div>
      <div class="gradient-display" :style="{background: displayGradient}"></div>
    </div>
  </div>
</template>
<script>
import ColorPickerContainer from '../color-picker/ColorContainer'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import GradientDirection from './GradientDirection'
import GradientController from './GradientController'
import ColorSpan from './ColorSpan'
export default {
  data () {
    return {
      direction: '',
      symmetry: false,
      colors: [
        {
          value: '#000000',
          pos: 0
        },
        {
          value: '#ffffff',
          pos: 1
        }
      ]
    }
  },
  props: {
    gradient: String
  },
  components: {ColorPickerContainer, GradientDirection, ColorSpan, GradientController},
  methods: {
    handleSymmetryChange (val) {
      this.symmetry = val
    },
    handleDrag (pos, index) {
      if (index < this.colors.length - 1 && index > 0) {
        if (pos - 1 <= 0 && pos >= 0) {
          this.colors[index].pos = pos
        }
      }
    },
    handleDragEnd (pos, index) {
      if (index < this.colors.length - 1 && index > 0) {
        if (pos - 1 > 0 || pos < 0) {
          this.colors.splice(index, 1)
          this.$refs.controller.setIndex(index - 1)
        }
      }
    },
    handleAddCursor (pos) {
      var color = {
        pos: pos,
        value: '#000000'
      }
      this.colors.splice(this.colors.length - 1, 0, color)
      this.$refs.controller.setIndex(this.colors.length - 2)
    },
    change (index, value) {
      this.colors[index].value = value
    },
    getLinearGradient (deg) {
      var str = 'linear-gradient(' + deg + 'deg'
      var cloneColors = this.colors.concat()
      cloneColors.sort((element1, element2) => element1.pos - element2.pos)
      if (!this.symmetry) {
        cloneColors.forEach(element => {
          str += ',' + element.value + ' ' + this.toPercent(element.pos)
        })
      } else {
        cloneColors.forEach(element => {
          str += ',' + element.value + ' ' + this.toPercent(element.pos / 2)
        })
        cloneColors.reverse().forEach(element => {
          str += ',' + element.value + ' ' + this.toPercent(1 - element.pos / 2)
        })
      }
      str += ')'
      return str
    },
    toPoint (percent) {
      var str = percent.replace('%', '')
      return str / 100
    },
    toPercent (point) {
      var percent = Number(point * 100).toFixed(2)
      percent += '%'
      return percent
    },
    getRadialGradient () {
      let str = 'radial-gradient('
      var cloneColors = this.colors.concat()
      cloneColors.sort((element1, element2) => element1.pos - element2.pos)
      if (!this.symmetry) {
        cloneColors.forEach(element => {
          str += element.value + ' ' + this.toPercent(element.pos) + ','
        })
      } else {
        cloneColors.forEach(element => {
          str += element.value + ' ' + this.toPercent(element.pos / 2) + ','
        })
        cloneColors.reverse().forEach(element => {
          str += element.value + ' ' + this.toPercent(1 - element.pos / 2) + ','
        })
      }
      str = str.substr(0, str.length - 1)
      str += ')'
      return str
    },
    changePos (pos, index) {
      this.colors[index].pos = pos
    },
    handleOk () {
      this.$emit('ok', this.colors)
    },
    parse (gradient) {
      var linearReg = /^linear-gradient/
      if (linearReg.test(gradient)) {
      } else {
        this.direction = 'radiate'
      }
    }
  },
  directives: {Clickoutside},
  mounted () {
  },
  computed: {
    displayGradient () {
      var gradient = ''
      switch (this.direction) {
        case 'horizontal':
          gradient = this.getLinearGradient(90)
          break
        case 'vertical':
          gradient = this.getLinearGradient(180)
          break
        case 'upward':
          gradient = this.getLinearGradient(45)
          break
        case 'downward':
          gradient = this.getLinearGradient(135)
          break
        case 'radiate':
          gradient = this.getRadialGradient()
          break
        default:
          gradient = this.getLinearGradient(90)
      }
      return gradient
    }
  }
}
</script>

<style>
.gradient-display {
  clear: both;
  width: 75px;
  height: 75px;
  border: 1px solid #000;
  margin-top:15px;
}
.gradient-left, .gradient-right{
  display: inline-block;
  vertical-align: top;
}
.gradient-right{
  margin-left: 10px;
  text-align: right;
}
.gradient-right .btns{
  width: 75px;
}
.gradient-right .btns .btn{
  margin-left: 0;
  margin-top:5px;
}
.gradient-right .btns .btn:first-child{
  margin-top:0px;
}
</style>
