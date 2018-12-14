<template>
  <div :style="{background: displayGradient}">

  </div>
</template>

<script>
export default {
  props: {
    colors: {
      required: true,
      type: Array
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    symmetry: Boolean
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
      }
      return gradient
    }
  },
  methods: {
    getLinearGradient (deg) {
      var str = 'linear-gradient(' + deg + 'deg'
      var cloneColors = this.colors.concate()
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
      var cloneColors = this.colors.concate()
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
    }
  }
}
</script>

<style>

</style>
