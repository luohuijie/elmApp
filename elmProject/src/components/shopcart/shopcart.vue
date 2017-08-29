<template>
  <div class="shopcart">
    <div class="content" @click="toggleList()">
      <div class="shopcart-left">
        <div class="logo">
          <div class="icon-shopping_cart" :class="{ haveShop:totalCount>0 }"></div>
          <div v-if="totalCount>0" class="tip">{{totalCount}}</div>
        </div>
        <div class="price" :class="{ haveShop:totalPrice>0 }">￥{{totalPrice}}</div>
        <div class="des">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="shopcart-right">
        <span class="total" :class="{ haveShop: totalPrice > minPrice }" @click.stop.prevent="goPayMoney">{{ payMoney }}</span>
      </div>
    </div>
    <div class="ball-wrap">
      <!--<div class="ball" v-for="item of ballList" v-show="item.show" :key="item.id"></div>-->
      <transition name="drop" v-for="item of ballList" :key="item.show" @before-enter="beforedrop" @enter="droping"
                  @after-enter="afterdrop">
        <div class="ball" v-show="item.show">
          <div class="inner"></div>
        </div>
      </transition>
    </div>
    <transition name="comeBottom">
      <div class="shopCartList" v-show="listShow">
        <div class="header">
          <h3 class="title">购物车</h3>
          <span class="clear" @click="clearAll">清空</span>
        </div>
        <div class="selectList" ref="selectWrap">
          <ul class="foodListWrap">
            <li class="foods" v-for="item of selectFoodList">
              <span class="name">{{ item.name}}</span>
              <span class="price"><i class="money">￥</i>{{ item.price*item.count }}</span>
              <span class="controll">
              <cart-controller :food="item" ></cart-controller>
            </span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fadeBg">
      <div class="selectFood-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartController from "@/components/cartController/cartController";
  export default {
    name: "shopcart",
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoodList: {
        type: Array
      }
    },
    data() {
      return {
        ballList: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        finishBall: [],
        fold: true
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoodList.forEach((val, index) => {
          //total += val.price * val.count;
          total += val.price * val.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoodList.forEach((val, index) => {
          count += val.count;
        })
        return count;
      },
      payMoney() {
        if (this.totalPrice == 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice <= this.minPrice) {
          var diff = this.minPrice - this.totalPrice;

          return `还差￥${diff}元起送`;
        } else {
          return "去结算";
        }
      },
      listShow() {
        if (!this.totalCount) {  //数量是0时  购物车详情不显示，点击的时候return false
          this.fold = true;
          return false;
        }
        ;
        let show = !this.fold;    //大于0时候 取反，
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.selectWrap, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
            // console.log(this.scroll)

          })
        }
        ;
        return show;
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.ballList.length; i++) {
          let ball = this.ballList[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.finishBall.push(ball);
            return; //找到之后跳出
          }
        }

      },
      beforedrop(el) {
        var count = this.finishBall.length;
        while (count--) {
          let ball = this.finishBall[count];
          if (ball.show) {  //如果是显示，

            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22 );

            el.style.display = "";
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.querySelectorAll(".inner")[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }

      },
      droping(el) {
        //触发动画重绘
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.querySelectorAll(".inner")[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        })
      },
      afterdrop(el) {
        var ball = this.finishBall.shift();
        if (ball) {
          ball.show = false;
          el.style.display = "none";
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        ;
        this.fold = !this.fold;
      },
      clearAll(){
        this.selectFoodList.forEach((food) => {
          food.count = 0;
        })
      },
      hideList(){
        this.fold = true;
      },
      goPayMoney(){
          if( this.totalPrice <this.minPrice ){
              return
          }
          window.alert(`您需要支付${this.totalPrice}元`)
      }
    },
    components: {
      cartController
    }

  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background-color #141d27
    .content
      display flex
      width 100%
      height 100%
      background-color #141D27
      cursor pointer
      .shopcart-left
        flex 1
        font-size 0
        .logo
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          background-color #141d27
          border-radius 50%
          .tip
            position absolute
            right 0
            top 0
            width 24px
            background-color rgb(244, 20, 20)
            box-shadow 0px 4px 8px 0 rgba(0, 0, 0, .4)
            font-size 9px
            color #fff
            font-weight 700
            text-align center
            box-sizing border-box
            border-radius 5px
          .icon-shopping_cart
            border-radius 50%
            background-color #2b343c
            font-size 24px
            line-height 44px
            text-align center
            color rgba(255, 255, 255, .4)
            &.haveShop
              background-color rgb(0, 160, 220)
              color #fff
        .price
          display inline-block
          vertical-align top
          font-size 16px
          color rgba(255, 255, 255, .4)
          font-weight 700
          line-height 24px
          margin-top 12px
          margin-right 12px
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, .4)
          @media only screen and (max-width: 320px)
            margin-left -15px
          &.haveShop
            color #fff
        .des
          display inline-block
          vertical-align top
          font-size 10px
          color rgba(255, 255, 255, .4)
          font-weight normal
          line-height 48px
      .shopcart-right
        flex 0 0 105px
        width 105px
        background-color #2b343c
        .total
          display block
          text-align center
          line-height 48px
          font-size 12px
          font-weight 700
          color rgba(255, 255, 255, .4)
          &.haveShop
            background-color #00b43c
            color #fff

    .ball-wrap
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all .4s cubic-bezier(0.49, -0.28, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background-color rgb(0, 160, 220)
          transition all .4s linear
    .shopCartList
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transition: all .3s ease
      transform: translate3d(0, -100%, 0)
      &.comeBottom-enter, &.comeBottom-leave-active
        transform: translate3d(0, 0, 0)
    .header
      height 40px
      line-height 40px
      border-bottom 1px solid rgba(7, 17, 27, .1)
      padding 0 18px
      background-color #f3f5f7
      .title
        float left
        font-size 14px
        font-weight 200
        color rgb(7, 17, 27)
      .clear
        float right
        font-size 12px
        color rgb(0, 160, 220)
    .selectList
      max-height 217px
      background-color #fff
      overflow hidden
      .foodListWrap
        padding 0 18px;
        .foods
          display flex
          justify-content space-between
          align-items center
          height 48px
          border-bottom-1px(rgba(7, 17, 27, .1))
          .name
            flex 1
          .price
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)

            .money
              font-size 10px
              font-weight normal
              color rgb(240, 20, 20)
              font-style normal
          .controll
            margin-left 6px
  .selectFood-mask
    position fixed
    left 0px
    top 0px
    width 100vw
    height 100vh
    background-color rgba(7,17,27,.6)
    filter blur(10px)
    z-index -2
    opacity 1
    transition all .4s ease
    cursor pointer
    &.fadeBg-enter,&.fadeBg-leave-active
      opacity 0
</style>
