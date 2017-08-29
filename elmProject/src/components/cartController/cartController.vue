<template>
  <div class="cartController">
    <transition name="fadeX">
      <div class="decrease icon-remove_circle_outline" v-if="food.count>0" @click.stop="detractCount($event)"></div>
    </transition>
    <div class="count" v-if="food.count>0">{{ food.count }}</div>
    <div class="add icon-add_circle" @click.stop="addCount( food,$event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: "cartController",
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {}
    },
    methods: {
      addCount(item, e){
          //console.log(item)
        if (!e._constructed) {
          return;
        }
        if (typeof item.count === "undefined") {
          this.$set(item, "count", 1);
        } else {
          item.count++;
        }
        ;
        //console.log(e.target)   接收问题
        this.$emit("add", e.target);
      },
      detractCount(e){

        if (!e._constructed) {
          return;
        }
        if (this.food.count <= 0) return;
        this.food.count--;
      }

    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  .fadeX-transition
    opacity 1
    transform translate3d(0, 0, 0) rotate(0)

  .fadeX-enter-active, .fadeX-leave-active
    opacity 0
    transform translate3d(24px, 0, 0) rotate(180deg)

  .cartController
    font-size 0
    .decrease, .add
      display inline-block
      padding 6px
      font-size 24px
      color rgb(0, 160, 220)
    .decrease
      transition all .4s linear
    .count
      display inline-block
      vertical-align top
      width 12px
      margin-top 6px
      font-size 10px
      line-height 24px
      color rgb(147, 153, 159)
      text-align center
</style>
