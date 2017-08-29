<template>
  <div class="seller" ref="sellerWrap">
    <div>
      <div class="seller-info seller-info-header">
        <div class="seller-info-wrap">
          <h5 class="title">{{seller.name}}</h5>
          <star :score="seller.score" :size="36"></star>
          <span class="monthSeller">
              月售{{seller.sellCount}}单
            </span>
        </div>
        <div class="dispatch">
          <div class="item">
            <span class="title">起送价</span>
            <span class="num">{{seller.minPrice}}</span>
            <i class="money">元</i>
          </div>
          <div class="item">
            <span class="title">商家配送</span>
            <span class="num">{{seller.deliveryPrice}}</span>
            <i class="money">元</i>
          </div>
          <div class="item">
            <span class="title">平均配送时间</span>
            <span class="num">{{seller.deliveryTime}}</span>
            <i class="money">分钟</i>
          </div>
        </div>
        <div class="collect" @click="collect($event)">
          <i class="icon icon-favorite" :class="{'active': selected }"></i>
          <span class="favorite-text">{{ selectText }}</span>
        </div>
      </div>
      <split-doc></split-doc>
      <div class="seller-info seller-info-activity">
        <h5 class="title">公告与活动</h5>
        <p class="activity-info">
          {{seller.bulletin}}
        </p>
        <ul class="info-lists">
          <li v-for="list in seller.supports" class="list">
            <span v-show="list.type>=0" :class="dataMap[ list.type ]" class="smIcon"></span>
            <span class="text">{{list.description}}</span>
          </li>
        </ul>
      </div>
      <split-doc></split-doc>
      <div class="seller-info seller-info-scene">
        <h5 class="title">商家实景</h5>
        <div class="scene-wrap" ref="scenewrap">
          <div class="scene" ref="scene">
            <img class="scenes" v-for="pic in seller.pics" :src="pic" width="120" height="90">
          </div>
        </div>
      </div>
      <split-doc></split-doc>
      <div class="seller-info">
        <h5 class="title">商家信息</h5>
        <ul class="info-lists">
          <li class="list" v-for="list of seller.infos">
            <span class="text">{{list}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from "@/components/star/star";
  import splitDoc from "@/components/splitDoc/splitDoc";
  import {saveStore,loadStroe} from "../../common/js/store";

  export default {
    name: "seller",
    props: {
      seller: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    watch:{
        seller(){
           // this.initScroll()
          if(!this.scroll){
            //  console.log(1)
            this.initScroll()
          }else{
           // console.log(2)
              this.scroll.refresh();
          };
          this._initScroll();
        }
    },
    data(){
      return {
        selected: (()=>{
          return  loadStroe(this.seller.id,"collect",false);
        })()
      }
    },
    created() {
      this.dataMap = ["decrease", "discount", "guarantee", "invoice", "special"];
    },
    mounted(){
      this.$nextTick(() => {
        //console.log(3)
        this.initScroll();
        this._initScroll();
      });

    },
    methods: {
      initScroll() {
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.sellerWrap, {
            click: true
          });
        } else {
            this.scroll.refresh();
        }

      },
      _initScroll() {
        if(this.seller.pics){   //手动计算该元素的宽度
          let imgw = 120;
          let mrw  = 6;
          let len = this.seller.pics.length;
          let totalw = imgw*len + mrw*(len-1);
          this.$refs.scene.style.width = totalw+"px";
          //获取后再进行BSoll
          if( !this.sceneScroll){
          this.sceneScroll = new BScroll(this.$refs.scenewrap,{
            scrollX: true
          });
          }else{
            this.sceneScroll.refresh();
          }
        }
      },
      collect(e) {
        if (!e._constructed) {
          return;
        }
          //console.log( this.selected)

        this.selected = !this.selected;
        saveStore(this.seller.id,"collect",this.selected);

      }
    },
    computed: {
      selectText(){
         //console.log(this.selected);
//        if (this.selected) return "已收藏";
//        return "收藏"
        //三目。。。
       return this.selected ? "已收藏":"收藏";
      }
    },
    components: {
      star,
      splitDoc
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .seller
    position absolute
    top 174px
    bottom 0px
    width 100%
    overflow hidden
    .title
      width 100%
      font-size 14px
      color rgb(7, 17, 27)
      height 14px
      line-height 14px
      margin-bottom 8px
    .seller-info
      padding 18px
      .info-lists
        .list
          border-top-1px(rgba(7, 17, 27, .1))
          padding  16px 12px
          font-size 0
          .smIcon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            margin-right 6px
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
            vertical-align top
            font-size 12px
            font-weight 200
            color rgb(7, 17, 27)
            line-height 16px
    .seller-info-header
      position relative
      .seller-info-wrap
        padding-bottom 18px
        font-size 0
        .star, .monthSeller
          vertical-align top
          display inline-block
          font-size 10px
          color rgb(77, 85, 93)
          margin-right 12px
        .monthSeller
          line-height 18px
      .collect
        position absolute
        right 18px
        top 18px
        font-size 0px
        text-align center
        min-width 42px
        .icon
          display block
          font-size 24px
          line-height 24px
          margin-bottom 4px
          color rgb(147, 153, 159)
          &.active
            color rgb(240, 20, 20)
          .favorite-text
            font-size 10px
            color rgb(77, 85, 93)
            line-height 10px
            height 10px
      .dispatch
        padding-top 18px
        display flex
        border-top-1px(rgba(7, 17, 27, .1))
        .item
          flex 1
          text-align center
          font-size 0px
          font-weight 200
          color rgb(7, 17, 27)
          line-height 24px
          border-right 1px solid rgba(7, 17, 27, .1)
          &:last-child
            border-right none
          .title
            display block
            font-size 10px
            color rgb(147, 153, 159)
            height 10px
            line-height 10px
            margin-bottom 4px
          .num
            font-size 24px
          .money
            font-style normal
            font-size 10px
    .activity-info
      font-size 12px
      line-height 24px
      font-weight 200
      color rgb(240, 20, 20)
      padding 0 12px 16px
    .scene-wrap
      overflow-x scroll
      overflow-y hidden
      margin-right: -18px
      &::-webkit-scrollbar
        width 0px
        height 0px
      &::-webkit-overflow-scrolling
        touch
      .scene
        display -webkit-box
        font-size 0
        .scenes
          display block
          margin-right 6px

</style>
