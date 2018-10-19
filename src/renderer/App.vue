<template>
  <div id="app" :style="{height:height+'px', width: width+'px'}">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'graph',
    mounted () {
      let win = this.$electron.remote.getCurrentWindow()
      let size = win.getContentSize()
      let that = this
      console.log(size)
      that.$store.dispatch('winResize', size)
      window.onresize = function () {
        size = win.getContentSize()
        that.$store.dispatch('winResize', size)
      }
    },
    computed: {
      ...mapState({height: state => state.ObrWin.height, width: state => state.ObrWin.width})
    }
  }
</script>

<style>
  /* CSS */
</style>
