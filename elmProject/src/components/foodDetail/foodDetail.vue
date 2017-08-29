<template>
  <transition name="slideLeft">
    <div class="foodDetail" v-show="detailShow" ref="food">
      <div>
        <div class="detail-header">
          <img :src="food.image" class="banner">
          <div class="backFoodPage" @click="backHide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="detail-title">
          <h3 class="title">{{food.name}}</h3>
          <div class="foodInfo">
            <span class="sellCount">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥<i>{{ food.price }}</i></span>
            <span v-if="food.oldPrice !='' " class="old">￥{{ food.oldPrice }}</span>
          </div>
          <transition name="fadeOut">
           <div class="addShopCart" v-show="!food.count || food.count===0">
            <div class="addCart" @click.self="firstAddCart(food,$event)">加入购物车</div>
          </div>
          </transition>
          <div class="cartControll-wrap">
            <cart-controller :food="food"></cart-controller>
          </div>
        </div>
        <div class="split-wrap">
          <split-doc></split-doc>
        </div>
        <div class="detail-introduce" v-show="food.info">
          <h3 class="title">商品介绍</h3>
          <p class="introduce-cont">{{food.info}}</p>
        </div>
        <div class="split-wrap"  v-show="food.info">
          <split-doc></split-doc>
        </div>
        <div class="detail-ratings">
          <div class="title-wrap">
            <h3 class="title">商品评价</h3>
            <div class="rate-wrap">
              <rate-select
                :thisFood="food.ratings"
                :select-type="selectType"
                :only-content="onlyContent"
                :des="des"
                @selectTypeChange="changCont"
                @toggleChange="toggleFlg"
              ></rate-select>
            </div>
          </div>
          <div class="ratings-cont">
              <ul v-show="food.ratings && food.ratings.length">
                <li class="ratingsList" v-for="item of food.ratings" v-show="needShow( item.rateType , item.text )">
                  <div class="avatarInfo">
                    <time class="time">{{item.rateTime | timeFormat}}</time>
                    <span class="name">{{item.username}}</span>
                    <img :src="item.avatar" width="12" height="12" class="avatar">
                  </div>
                  <p class="text">
                    <i :class="{'icon-thumb_up': item.rateType===0,'icon-thumb_down':item.rateType===1}"></i>
                    {{item.text}}
                  </p>
                </li>
              </ul>
              <div v-show="!food.ratings || !food.ratings.length" class="no-ratings">
                暂无评论
              </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import splitDoc from "@/components/splitDoc/splitDoc";
  import {formatDate} from "../../common/js/formatDate";
  import rateSelect from "@/components/rateSelect/rateSelect";
  import cartController from "@/components/cartController/cartController";

  const ALL = 2;

  export default {
    name: "foodDetail",
    props: {
      food: {
        type: Object
      }
    },
    data(){
      return {
        detailShow: false,
        selectType: ALL,
        onlyContent: false,
        des: {
          all:"全部",
          positive: "满意",
          negative: "吐槽"
        }
      }
    },
    methods: {
      show(){
        this.detailShow = true;
        //每次展示初始化评论状态
        this.selectType= ALL;
        this.onlyContent=false;
        this.$nextTick(function () {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh();
          }
        })

      },
      backHide(){
        this.detailShow = false;
      },
      firstAddCart(food,e) {
        if (!e._constructed) {
          return;
        }
     // console.log(e.target)
        this.$emit("add",e.target);
        this.$set(food,"count",1);
      },
      changCont(type){
           this.selectType = type;
           this.$nextTick(function(){
             this.scroll.refresh();
           })
      },
      toggleFlg(){
          this.onlyContent = !this.onlyContent;
          this.$nextTick(function(){
            this.scroll.refresh();
          })
      },
      needShow( type ,text ){
          //当选中了只读，但是有没有内容的时候，返回
          if( this.onlyContent && !text ){
              return false;
          };
          if(this.selectType == ALL ){
              return true;
          }else{
              return type == this.selectType;
          }

      }
    },
    filters: {
      timeFormat( time ) {
         let date = new Date( time );
         return formatDate(date,"yyyy-MM-dd hh:mm");
      }
    },
    components: {
      cartController,
      rateSelect,
      splitDoc
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .foodDetail
    position fixed
    left 0
    bottom 48px
    width 100%
    height 100%
    overflow hidden
    background-color #fff
    z-index 40
    transition all .2s linear
    transform translate3d(0, 0, 0)
    &.slideLeft-enter, &.slideLeft-leave-active
      transform translate3d(100%, 0, 0)
    .detail-header
      position relative
      width 100%
      height 0
      padding-top 100%
      .banner
        position absolute
        left 0
        top 0
        width 100%
        height 100%
      .backFoodPage
        position absolute
        left 3px
        top 50px
        background-color rgba(0, 0, 0, .2)
        border-radius 50%
        .icon-arrow_lift
          display block
          font-size 20px
          padding 10px
          color #fff
    .detail-title
      padding 18px
      position relative
      .title
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
        line-height 14px
        margin-bottom 8px
      .foodInfo
        font-size 0
        color rgb(147, 163, 159)
        height 10px
        line-height 10px
        margin-bottom 18px
        .sellCount
          font-size 10px
          margin-right 12px
        .rating
          font-size 10px
      .price
        font-weight 700
        line-height 24px
        font-size 0
        .now
          margin-right 8px
          font-size 10px
          color rgb(240, 20, 20)
          & > i
            font-size 14px
            font-style normal
            font-weight 700
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
          font-weight 700
          line-height 24px

      .addShopCart
        position absolute
        right 18px
        bottom 18px
        max-width 148px * .5
        max-height 48px * .5
        line-height 24px
        padding 0 12px
        font-size 0px
        border-radius 24px
        background-color rgb(0, 160, 220)
        box-sizing border-box
        z-index 30
        opacity 1
        transition all .2s
        &.fadeOut-enter,&.fadeOut-leave-active
          opacity 0
        .addCart
          font-size 10px
          color #fff
      .cartControll-wrap
        position absolute
        right 12px
        bottom 12px
    .detail-introduce
      padding 18px
      box-sizing border-box
      .title
        font-size 14px
        color rgb(7,17,27)
        height 14px
        line-height 14px
        margin-bottom 6px
      .introduce-cont
        padding  0 16px*.5
        font-size 12px
        font-weight 200
        color rgb(77,85,93)
        line-height 24px
    .detail-ratings
      padding 18px
      .title
        font-size 14px
        color rgb(7,17,27)
        height 14px
        line-height 14px
      .ratings-cont
        .ratingsList
          padding 16px 0
          border-bottom-1px(rgba(7,17,27,.1))
          .avatarInfo
            font-size 0
            margin-bottom 12px
            position relative
            .avatar
              position absolute
              right 0
              top 0
              border-radius 50%
          .time,.name
            font-size 10px
            color rgb(147,153,159)
            line-height 12px
          .name
            float right
            padding-right 18px
          .icon-thumb_down,.icon-thumb_up
            font-size 12px
            color rgb(183,187,191)
            line-height 16px
            margin-right 4px
          .icon-thumb_up
            color rgb(0,160,220)
          .text
            font-size 12px
            color rgb(7,17,27)
            line-height 16px

      .no-ratings
        padding 12px 0
        font-size 12px
        color rgb(147,153,159)
</style>
