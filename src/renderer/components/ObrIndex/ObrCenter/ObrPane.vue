<template>
  <div class="obr-tab-span">
    <obr-ruler v-show="rulerShow"  :id="'x_ruler'+ id" class="obr-x-ruler" :len='workWidth - 0 + 20' :style="{'margin-left': -scrollLeft + 'px', width: (workWidth+20) + 'px'}"></obr-ruler>
      <div class="obr-work-space" :style="{height:(height-146)+'px', width: width-470+'px'}" @scroll="scroll">
          <obr-grid :grid-show="gridShow" :id="'grid'+id" class="obr-grid" :grid-color='gridColor' :style="{height: workHeight+'px', width: workWidth+'px', background: gridBackGroundColor}"></obr-grid>
          <obr-svg  :path='path' :id="'svg'+id" class="obr-svg" :style="{height:workHeight+'px', width: workWidth+'px'}" :tab-name = 'tabName' @change="change"></obr-svg>
      </div>
    <obr-ruler v-show="rulerShow" :id="'y_ruler'+ id" :vertical="true" class="obr-y-ruler" :len="workHeight - 0 + 20" :style="{'margin-top': -scrollTop + 'px', height: (workHeight+20) + 'px'}"></obr-ruler>
  </div>
</template>

<script>
import ObrSvg from './ObrSvg'
import ObrGrid from './ObrGrid'
import ObrRuler from './ObrRuler'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      workWidth: 18000,
      workHeight: 18000,
      scrollLeft: 0,
      scrollTop: 0,
      gridColor: '#000000',
      gridBackGroundColor: '#CCCCCC',
      gridShow: true,
      rulerShow: true
    }
  },
  props: ['id', 'tab-name', 'path'],
  components: {ObrSvg, ObrGrid, ObrRuler},
  computed: {
    ...mapState({height: state => state.ObrWin.height, width: state => state.ObrWin.width}),
    onScrollLeft () {
      return this.scrollLeft
    }
  },
  methods: {
    scroll (e) {
      this.scrollLeft = e.target.scrollLeft
      this.scrollTop = e.target.scrollTop
    },
    change () {
      this.$emit('change', '' + this.id)
    }
  }
}
</script>

<style scoped>
  .obr-tab-span {
    width: 100%;
    height: 100%;
  }
  .obr-work-space{
    position: relative;
    margin-left: 20px;
    margin-top: 20px;
    overflow: auto;
  }
  .obr-grid{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .obr-svg{
    width: 100%;
    height: 100%;
  }
  .obr-x-ruler,.obr-y-ruler{
    position: absolute;
    left: 0;
    top: 0;
    height: 20px;
    /* background: #fff; */
  }
  .obr-y-ruler{
    height: 100%;
    width: 20px;
  }
</style>
