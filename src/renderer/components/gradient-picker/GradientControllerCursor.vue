<template>
  <div class="gradient-controller-cursor" @click="handleDrag">
    <span class="triangle" :class="{selected:selected}"></span>
    <span class="rect">
      <span :style="{'background-color': color.value}"></span>
    </span>
  </div>
</template>

<script>
import draggable from 'element-ui/packages/color-picker/src/draggable'
export default {
  props: {
    color: {
      required: true
    },
    selected: Boolean,
    index: Number
  },
  methods: {
    handleDrag (event) {
      this.$emit('drag', event.clientX, this.index)
      event.stopPropagation()
    },
    handleDragEnd () {
      this.$emit('drag-end', event.clientX, this.index)
    }
  },
  mounted () {
    const dragConfig = {
      drag: (event) => {
        this.handleDrag(event)
      },
      end: (event) => {
        this.handleDragEnd(event)
      }
    }
    draggable(this.$el, dragConfig)
  }
}
</script>

<style>
  .gradient-controller-cursor{
    display: inline-block;
    height: 9px;
    cursor: pointer;
  }
  .gradient-controller-cursor .triangle{
    position: relative;
    display: block;
    height: 0px;
    width: 0px;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 5px solid #000;
  }
  .gradient-controller-cursor .triangle::after{
    position: absolute;
    display: block;
    height: 0px;
    width: 0px;
    left: -3px;
    top: 1px;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 4px solid #fff;
    content: ''
  }
  .gradient-controller-cursor .triangle.selected::after{
    border-bottom-color: #000;
  }
  .gradient-controller-cursor .rect{
    display: block;
    height: 4px;
    width: 4px;
    border: 1px solid #000;
    padding: 1px;
  }
  .gradient-controller-cursor .rect span{
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
