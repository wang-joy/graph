<template>
  <div :id="id"></div>
</template>

<script>
import SVG from 'svg.js'
import Bus from '../../../bus/Bus'
export default {
  props: ['id', 'vertical', 'len'],
  methods: {
    createRuler (draw) {
      var lineAttr = {
        'stroke-width': 1,
        'shape-rendering': 'crispEdges'
      }
      var ruler = draw.line().attr(lineAttr)
      var len = this.len
      var pathStr = ''
      var count = 0
      if (this.vertical) {
        draw.size(20, '100%')
        ruler.attr({
          x1: 19,
          y1: 0,
          x2: 19,
          y2: '100%'
        })
        for (let i = 29; i < len; i = i + 10) {
          count++
          if (count % 10 === 0) {
            pathStr += 'M5,' + i + ' L20,' + i + ' '
          } else if (count % 5 === 0) {
            pathStr += 'M10,' + i + ' L20,' + i + ' '
          } else {
            pathStr += 'M15,' + i + ' L20,' + i + ' '
          }
        }
        draw.text(function (add) {
          for (let i = 22; i < len; i = i + 50) {
            add.tspan(i - 22).y(i)
          }
        }).font('size', 12).attr('writing-mode', 'tb-rl').x(10)
      } else {
        ruler.attr({
          x1: 0,
          y1: 19,
          x2: '100%',
          y2: 19
        })
        for (let i = 29; i < len; i = i + 10) {
          count++
          if (count % 10 === 0) {
            pathStr += 'M' + i + ',5 L' + i + ',20 '
          } else if (count % 5 === 0) {
            pathStr += 'M' + i + ',10 L' + i + ',20 '
          } else {
            pathStr += 'M' + i + ',15 L' + i + ',20 '
          }
        }
        draw.text(function (add) {
          for (let i = 22; i < len; i = i + 50) {
            add.tspan(i - 22).x(i)
          }
        }).font('size', 12).y(3).font('weight', 'normal')
      }
      var path = draw.path(pathStr)
      path.attr(lineAttr)
    },
    createCursor (draw) {
      if (!this.vertical) {
        let cursor = draw.polygon('15,20 25,20 20,15')
        cursor.fill('#000').addClass('x-ruler')
      } else {
        let cursor = draw.polygon('20,15 20,25 15,20')
        cursor.fill('#000').addClass('y-ruler')
      }
    }
  },
  mounted () {
    var id = this.id
    var draw = SVG(id)
    this.createRuler(draw)
    this.createCursor(draw)
    let self = this
    Bus.$on('updateCursor', function (point) {
      if (!self.vertical) {
        let cursor = (draw.select('polygon.x-ruler')).members[0]
        let points = [
          [point.x + 15, 19],
          [point.x + 25, 19],
          [point.x + 20, 15]
        ]
        cursor.plot(points)
      } else {
        let cursor = (draw.select('polygon.y-ruler')).members[0]
        let points = [
          [19, point.y - 26],
          [19, point.y - 16],
          [15, point.y - 21]
        ]
        cursor.plot(points)
      }
    })
  }
}
</script>

<style>

</style>
