<template>
  <div class="obr-index">
    <obr-tools-bar class="obr-tools-bar" :style="{height:'60px', width: width+'px'}"></obr-tools-bar>
    <div class="obr-main">
      <obr-left class="obr-left" :style="{height:(height-80)+'px', width: '199px'}"></obr-left>
      <obr-center class="obr-center"  :style="{height:(height-80)+'px', width: width-450+'px'}"></obr-center>
      <obr-right class="obr-right" :style="{height:(height-80)+'px', width: '249px'}"></obr-right>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import ObrToolsBar from './ObrIndex/ObrToolsBar'
import ObrLeft from './ObrIndex/ObrLeft'
import ObrRight from './ObrIndex/ObrRight'
import ObrCenter from './ObrIndex/ObrCenter'

export default {
  components: {ObrToolsBar, ObrLeft, ObrRight, ObrCenter},
  computed: {
    ...mapState({height: state => state.ObrWin.height, width: state => state.ObrWin.width})
  }
}
</script>

<style lang="stylus" scoped >
.obr-index
  width 100%
  height 100%
.obr-left,.obr-right,.obr-center
  float left

.obr-center
  border-left: 1px solid #cccccc
  border-right: 1px solid #ccc
</style>
