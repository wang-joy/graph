<template>
  <div :id="id"></div>
</template>

<script>
import SVG from 'svg.js'
export default {
  props: {
    'id': {
      required: true
    },
    'grid-color': {
      default: '#cccccc'
    },
    'grid-show': Boolean
  },
  methods: {
    createGrid (draw) {
      var lineAttr = {
        'stroke-width': 1,
        'shape-rendering': 'crispEdges',
        'stroke': this.gridColor
      }
      var gridRect = draw.rect('100%', '100%').fill('none').stroke('none')
      var gridPattern = draw.pattern(50, 50, function (add) {
        add.line(49, 0, 49, 50).stroke({dasharray: '2'}).attr(lineAttr)
        add.line(0, 49, 50, 49).stroke({dasharray: '2'}).attr(lineAttr)
      })
      gridRect.fill(gridPattern)
      if (this.gridShow) {
        gridRect.show()
      } else {
        gridRect.hide()
      }
      return gridRect
    }
  },
  mounted () {
    var id = this.id
    var draw = SVG(id)
    this.gridRect = this.createGrid(draw)
    this.draw = draw
    this.isMounted = true
  },
  watch: {
    gridShow: {
      handler () {
        if (!this.isMounted) return
        if (this.gridShow) {
          this.gridRect.show()
        } else {
          this.gridRect.hide()
        }
      }
    },
    gridColor (val) {
      if (!this.isMounted) return
      this.draw.clear()
      this.createGrid(this.draw)
    }
  }
}
</script>

<style>

</style>
