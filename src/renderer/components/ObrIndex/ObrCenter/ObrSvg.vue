<template>
  <div :id="id"></div>
</template>

<script>
import svgManager from '@/svg/SvgManager'
import Bus from '../../../bus/Bus'
// import ready from '@/assets/js/MutationObserver'
export default {
  props: ['id'],
  mounted () {
    var svgId = this.id
    var svg = svgManager.createSVG(svgId)
    var draw = svg.draw
    draw.on('mousemove', function (e) {
      var point = this.point(e.screenX, e.screenY)
      Bus.$emit('updateCursor', point)
    })
  },
  destroyed () {
    var svgId = this.id
    svgManager.removeSVG(svgId)
  }
}
</script>

<style lang='stylus' scoped>
</style>
