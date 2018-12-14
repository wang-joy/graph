<template>
  <div class="gradient-color-span">
    <div class="color-display-span" :style="{'background-color':value}"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  }
}
</script>

<style>

</style>
