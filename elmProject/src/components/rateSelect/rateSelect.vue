<template>
    <div class="ratingsMod">
      <div class="rate-type">
        <span @click="select(2,$event)" class="rate positive" :class="{'active': selectType === 2}">{{des.all}} <i class="count">{{allRatings.length}}</i> </span>
        <span @click="select(0,$event)"  class="rate positive" :class="{'active': selectType === 0}">{{des.positive}}<i class="count">{{recommend.length}}</i></span>
        <span @click="select(1,$event)"  class="rate negative" :class="{'active': selectType === 1}">{{des.negative}}<i class="count">{{disclose.length}}</i></span>
      </div>
      <div class="switch" :class="{'on': onlyContent}" @click="toggleRatings($event)">
        <span class="icon-check_circle"></span>
        <span class="text">只看有内容的评论</span>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  const NEGATIVE = 0;
  const POSITIVE = 1;
  const ALL = 2;

    export default {
        name: "ratings",
        props:{
          thisFood:{
              type: Array,
              default(){
                  return []
              }
          },
          selectType:{
              type: Number,
              default: ALL
          },
          onlyContent:{
              type: Boolean,
              default: false
          },
          des:{
              type:Object,
              default(){
                  return {
                      all:"全部",
                      positive: "满意",
                      negative: "吐槽"
                  }
              }
          }
        },
        computed: {
        allRatings() {
          return this.thisFood;
        },
        recommend() {

          //老师的 ，返回一个新数组 用高阶函数的filter
         return  this.thisFood.filter( (rating)=>{
             return rating.rateType === NEGATIVE;
         } )
        },
        disclose() {
          return  this.thisFood.filter( (rating)=>{
            return rating.rateType === POSITIVE;
          } )
        }
      },
        methods: {
          select( type,e ){
            if (!e._constructed) {
              return;
            }
            this.$emit("selectTypeChange",type);
          },
          toggleRatings(e){
            if (!e._constructed) {
              return;
            }
            this.$emit("toggleChange");
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .ratingsMod
    .rate-type
      padding: 18px 0
      font-size 0
      border-bottom-1px(rgba(7, 17, 27, .1))
      .rate
        display: inline-block
        padding 8px 12px
        font-size 12px
        line-height 16px
        margin-right 8px
        border-radius 1px
        color rgb(77,85,93)
        background-color rgb(0,160,220)
        cursor pointer
        &.active
          color rgb(255,255,255)
        .count
          font-size 8px
          margin-left 2px
        &.positive
          background-color rgba(0,160,220,.2)
          &.active
           background-color rgb(0,160,220)
        &.negative
          background-color rgba(77,85,93,.2)
          &.active
           background-color rgb(77,85,93)


    .switch
       padding: 12px 18px 12px 18px
       margin: 0 -18px
       font-size 0
       border-bottom: 1px solid rgba(7, 17, 27, .1)
       cursor pointer
       &.on
        .icon-check_circle
          color rgb(0,200,80)
       .icon-check_circle
         font-size 24px
         color rgb(147,153,159)
         margin-right 4px
         vertical-align: middle
       .text
          font-size 12px
          color rgb(147,153,159)
          line-height 24px
          vertical-align: middle


</style>
