<template>
  <div :id="id"></div>
</template>

<script>
import SVG from 'svg.js'
export default {
  props: ['id'],
  methods: {
    createGrid (draw) {
      var lineAttr = {
        'stroke-width': 1,
        'shape-rendering': 'crispEdges',
        'stroke-color': '#ccc'
      }
      var gridRect = draw.rect('100%', '100%').fill('none').stroke('none')
      var gridPattern = draw.pattern(50, 50, function (add) {
        add.line(49, 0, 49, 50).stroke({dasharray: '2'}).attr(lineAttr)
        add.line(0, 49, 50, 49).stroke({dasharray: '2'}).attr(lineAttr)
      })
      gridRect.fill(gridPattern)
    }
  },
  mounted () {
    var id = this.id
    var draw = SVG(id)
    this.createGrid(draw)
  }
}
</script>

<style>

</style>
