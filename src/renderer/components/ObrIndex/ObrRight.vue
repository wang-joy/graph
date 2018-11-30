<template>
  <div class="obr-right">
    <div class="obr-info" @click="showTree">
      <span class="obr-title">{{label}}</span>
    </div>
    <transition name="fade">
      <el-tree :data="shapes" node-key="id" highlight-current :current-node-key = 'currentId' @node-click="nodeClick" v-show="isShowTree" class="obr-tree"></el-tree>
		</transition>
  </div>
</template>

<script>
import Bus from '../../bus/Bus'
export default {
  data () {
    return {
      shapes: [],
      isShowTree: false,
      label: '',
      currentId: ''
    }
  },
  methods: {
    showTree () {
      this.isShowTree = !this.isShowTree
    },
    nodeClick (node) {
      this.label = node.label
      this.currentId = node.id
      this.isShowTree = false
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
      if (shapes.length === 1) {
        this.label = shapes[0].attr('id')
        this.currentId = shapes[0].attr('id')
      } else if (shapes.length > 1) {
        this.label = 'shapes ( ' + shapes.length + '个 )'
      }
    },
    onCreateShape (shape) {
      this.shapes[0].children.push({id: shape.attr('id'), label: shape.attr('id')})
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

<style scoped>
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
</style>
