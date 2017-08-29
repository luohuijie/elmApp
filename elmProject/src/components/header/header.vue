<template>
  <div class="header">
    <div class="cont-wrap">
      <div v-if="seller.avatar" class="avatar">
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="cont">
        <div class="title">
          <span class="pingpai"></span>
          <span class="name">{{ seller.name }}</span>
        </div>
        <div class="des">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="dataMap[seller.supports[0].type]"></span>
          <span class="text">{{ seller.supports[0].description }}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetails">
        <span class="count">{{ seller.supports.length }}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="com-broad">
      <span class="com-title"></span>
      <span class="com-text">{{ seller.bulletin }}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="backgroundbox">
      <img :src="seller.avatar" alt="" width="100%" height="100%">
    </div>
    <transition name="slideUp">
      <div class="details" v-show="detailsShow">
        <div class="details-wrap clearfix">
          <div class="details-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="starWrap">
              <star :score="seller.score" :size="48"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="item-supports" v-for="item of seller.supports">
                <span class="icon" :class="dataMap[ item.type ]"></span>
                <span class="text">{{ item.description }}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">
                {{ seller.bulletin }}
              </p>
            </div>
          </div>
        </div>
        <div class="details-close">
          <i class="icon-close" @click="showDetails"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from "@/components/star/star";
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailsShow: false
      }
    },
    methods: {
      showDetails() {
        this.detailsShow = !this.detailsShow;
      }
    },
    created() {
      this.dataMap = ["decrease", "discount", "guarantee", "invoice", "special"]
    },
    components: {
      star
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .slideUp-transition
    opacity 1

  .slideUp-enter-active, &.slideUp-leave-active
    opacity 0

  .header
    color #fff
    background rgba(7, 17, 27, .5)
    position relative
    overflow hidden
    .cont-wrap
      display flex
      position relative
      padding .24rem .12rem .18rem .24rem
      .avatar
        margin-right .16rem
        img
          display block
          border-radius 2px
      .cont

        .title
          margin: 2px 0 8px 0
          font-size 0
          .pingpai
            display inline-block
            vertical-align top
            width 30px
            height 18px
            bg-image("brand")
            background-size 100% auto
            margin-right 6px
          .name
            font-size .16rem
            line-height .18rem
            font-weight bold

        .des
          margin-bottom .1rem
          font-size .12rem
          line-height .12rem
        .support
          font-size 0
        .icon
          display inline-block
          vertical-align bottom
          width 12px
          height 12px
          margin-right 4px
          background-size 100% auto
          background-repeat no-repeat
          &.decrease
            bg-image("decrease_1")
          &.discount
            bg-image("discount_1")
          &.guarantee
            bg-image("guarantee_1")
          &.invoice
            bg-image("invoice_1")
          &.special
            bg-image("special_1")
        .text
          line-height 12px
          font-size 10px
      .support-count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 64px
        background-color rgba(0, 0, 0, .2)
        text-align center
        cursor: pointer
        .count
          margin-right 2px
        .count, .icon-keyboard_arrow_right
          font-size 10px
    .com-broad
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      background-color rgba(7, 17, 27, .2)

      .com-title
        display inline-block
        vertical-align top
        margin-top 7.5px
        width 22px
        height 12px
        bg-image("bulletin")
        background-size 100% auto
        background-repeat no-repeat
      .com-text
        vertical-align top
        font-size 10px
        margin 0 4px
      .icon-keyboard_arrow_right
        position absolute
        font-size 10px
        right 12px
        top 8px
    .backgroundbox
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      filter blur(10px)
    .details
      position fixed
      top 0
      left 0
      width 100%
      height 100vh
      overflow-x hidden
      overflow-y auto
      z-index 100
      transition: all .3s ease;
      background-color rgba(7, 17, 27, .7)
      -webkit-backdrop-filter blur(10px)
      &:-webkit-scrollbar
        width 0
        height 0
      .details-wrap
        min-height 100%
        width 100%
        .details-main
          margin-top 64px
          padding-bottom 64px
          .name
            text-align center
            font-size .16rem
            font-weight 700
            line-height .16rem
          .starWrap
            margin-top 12px
            margin-bottom 28px
            text-align center
          .title
            display flex
            width 80%
            margin 30px auto 24px auto
            .line
              flex 1
              position relative
              top -6px
              border-bottom 1px solid rgba(255, 255, 255, .2)
            .text
              padding 0 12px
              font-size .14rem
              font-weight 700
          .supports
            width 80%
            margin 0 auto
            .item-supports
              margin-bottom 12px
              font-size 0
              &:last-child
                margin-bottom 0
              .icon
                display inline-block
                width 16px
                height 16px
                vertical-align top
                background-size 16px 16px
                margin 0 6px 0 12px
                &.decrease
                  bg-image("decrease_2")
                &.discount
                  bg-image("discount_2")
                &.guarantee
                  bg-image("guarantee_2")
                &.invoice
                  bg-image("invoice_2")
                &.special
                  bg-image("special_2")
              .text
                font-size 12px
                line-height 16px
                font-weight 200
          .bulletin
            width 80%
            margin 0 auto
            padding 0 12px
            .content
              font-size 12px
              font-weight 200
              line-height 24px
      .details-close
        position relative
        width 32px
        height 32px
        clear both
        margin -64px auto 0 auto
        cursor pointer
        .icon-close
          font-size 32px
</style>
