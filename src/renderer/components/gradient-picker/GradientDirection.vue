<template>
  <div class="gradient-direction">
    <fieldset>
      <legend>{{title}}</legend>
      <div class="gradient-direction-radios">
        <el-radio
          class="my-el-radio"
          v-model="direction"
          v-for="item in directions"
          @change="change"
          :label="item.label"
          :key="item.label">
          {{item.desc}}
        </el-radio>
      </div>
    </fieldset>
    <el-checkbox v-model="checked" class="my-el-checkbox"  @change="checkboxChange">对称</el-checkbox>
  </div>
</template>

<script>
export default {
  data () {
    return {
      direction: '',
      checked: false,
      directions: [
        {
          label: 'horizontal',
          desc: '水平'
        },
        {
          label: 'upward',
          desc: '斜上'
        },
        {
          label: 'radiate',
          desc: '放射'
        },
        {
          label: 'vertical',
          desc: '垂直'
        },
        {
          label: 'downward',
          desc: '斜下'
        }
      ]
    }
  },
  props: {
    title: {
      type: String,
      default: '方向'
    },
    value: String,
    symmetry: Boolean
  },
  methods: {
    change () {
      this.$emit('input', this.direction)
      this.$emit('directionChang', this.direction)
    },
    checkboxChange () {
      this.$emit('symmetryChange', this.checked)
    }
  }
}
</script>

<style>
.gradient-direction {
  width: 280px;
}
.gradient-direction fieldset{
  display: inline-block;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  width: 175px;
  vertical-align: top;
}
.gradient-direction fieldset legend{
 padding: 0 10px;
}
.gradient-direction
.gradient-direction-radios
.my-el-radio{
  margin-left: 15px;
}
.gradient-direction
.gradient-direction-radios
.my-el-radio:nth-child(3n + 1){
  margin-left: 5px;
}
.gradient-direction .el-radio__label{
  padding-left: 0;
}
.gradient-direction .my-el-checkbox{
  display: inline-block;
  padding:14px 10px 11px 10px;
  vertical-align: top;
}
.gradient-direction .el-checkbox__label {
  padding-left: 4px;
}
</style>
