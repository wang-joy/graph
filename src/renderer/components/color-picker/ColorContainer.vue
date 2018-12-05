<template>
  <div class="color-container">
    <p @click="handleOk('none')" :class="{selected:this.value === 'NONE'}">无色</p>
    <p>渐变</p>
    <color-picker v-model="val" color-format="hex" class="color-picker"></color-picker>
    <div class="my-el-input">
      <el-input v-model="val" size="mini"></el-input>
    </div>
    <div class="my-el-bts">
      <el-button size="mini" @click="handleOk" class="ok">确定</el-button>
    </div>
  </div>
</template>
<script>
import ColorPicker from './ColorPicker'
export default {
  components: {ColorPicker},
  data () {
    return {
    }
  },
  props: {
    value: String
  },
  computed: {
    val: {
      get () {
        return this.value !== 'NONE' ? this.value : 'transparent'
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleOk (val) {
      if (val === 'none') {
        this.$emit('ok', val)
      } else {
        console.log(this.value)
        this.$emit('ok', this.val)
      }
    }
  }
}
</script>
<style scoped>
  .color-container{
    padding: 5px;
  }
  .color-container .color-picker{
    margin: 0 auto;
  }
  .color-container>p{
    height: 28px;
    line-height: 28px;
    padding-left: 20px;
    border-bottom: 1px solid rgb(228, 231, 237);
    cursor: pointer;
  }
  .color-container>p:hover,.color-container>p.selected{
    background-color: rgb(228, 231, 237);
  }
  .my-el-input{
    width:  100px;
    margin-top: 5px;
    margin-left: 5px;
    float: left;
  }
  .my-el-bts{
    width:  130px;
    margin-top: 5px;
    margin-left: 5px;
    float: right;
    padding-left:10px;
  }
  .my-el-bts .ok{
    float: right;
  }
</style>
