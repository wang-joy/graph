<template>
  <div class="color-picker">
    <color-span class="color-span" :color = "color"></color-span>
    <color-slider class="color-slider" vertical :color = "color"></color-slider>
  </div>
</template>

<script>
import Color from './js/color'
import ColorSpan from './ColorSpan'
import ColorSlider from './ColorSlider'
export default {
  data () {
    const color = new Color({format: this.colorFormat})
    return {
      color
    }
  },
  components: {ColorSpan, ColorSlider},
  props: {
    value: String,
    'color-format': String
  },
  methods: {
    displayedRgb (color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class')
      }
      const { r, g, b } = color.toRgb()
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})`
        : `rgb(${r}, ${g}, ${b})`
    }
  },
  computed: {
    displayedColor () {
      if (!this.value && !this.showPanelColor) {
        return 'transparent'
      }
      return this.displayedRgb(this.color, this.showAlpha)
    }
  },
  watch: {
    value (val) {
      if (val && val !== this.color.value) {
        this.color.fromString(val)
      }
    },
    displayedColor (val) {
      const currentValueColor = new Color({format: this.colorFormat})
      currentValueColor.fromString(this.value)
      const currentValueColorRgb = this.displayedRgb(currentValueColor, this.showAlpha)
      if (val !== currentValueColorRgb) {
        this.$emit('active-change', val)
      }
    },
    color: {
      deep: true,
      handler () {
        this.$emit('input', this.color.value)
      }
    }
  },
  mounted () {
    const val = this.value
    if (val) {
      this.color.fromString(val)
    }
  }
}
</script>

<style>
  .color-picker{
    /* width: 260px; */
    height: 185px;
  }
  .color-picker .color-span{
    width: 220px;
    height: 180px;
    margin-left: 5px;
    margin-top: 5px;
    margin-right: 5px;
    float: left;
  }
  .color-picker .color-slider{
    width: 15px;
    height: 180px;
    margin-top: 5px;
    margin-right: 5px;
    float: right;
  }
</style>
