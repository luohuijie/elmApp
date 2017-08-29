<template>
    <div class="split">
      <div class="split-model"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "splitDoc"
    }
</script>

<style lang="stylus" ref="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .split
    .split-model
      height 16px
      background-color #f3f5f7
      border-top-1px(rgba(7, 17, 27, .1))
      border-bottom-1px(rgba(7, 17, 27, .1))

</style>
