<template>
  <div class="goods">
    <div class="goods-menu" ref="goodsMenu">
      <ul>
        <li v-for="(item,index) in goods" class="item-menu" :class="{ 'current': currentIndex===index }"
            @click="goToScoll(index,$event)">
            <span class="text">
              <span v-show="item.type>0 " class="icon" :class="dataMap[item.type]"></span>
              {{ item.name }}
            </span>
        </li>
      </ul>
    </div>
    <div class="goods-content" ref="goodsList">
      <ul>
        <li v-for="item of goods" class="food-list food-list-hook">
          <h2 class="title">{{ item.name }}</h2>
          <ul>
            <li v-for="food of item.foods" class="food-item border-bottom-1px" @click="foodDetail(food,$event)">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div class="cont">
                <h3 class="name">{{ food.name }}</h3>
                <p class="des">{{ food.description}}</p>
                <div class="extra">
                  <span>月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">￥<i>{{ food.price }}</i></span>
                  <span v-if="food.oldPrice !='' " class="old">￥{{ food.oldPrice }}</span>
                </div>
                <div class="control">
                  <cart-controller :food="food" @add="addFood"></cart-controller>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"
               :select-food-list="selectFood" ref="shopCart"></shop-cart>
    <div class="detailWrap">
      <foodDetail :food="selectedFood" ref="selectedFood"></foodDetail>
    </div>
  </div>
</template>

<script>
  const ERR_OK = 0;
  import BScroll from 'better-scroll';
  import shopCart from "@/components/shopcart/shopcart";
  import foodDetail from "@/components/foodDetail/foodDetail";
  import cartController from "@/components/cartController/cartController";

  export default {
    name: 'goods',
    props: {
      seller: {}
    },
    data () {
      return {
        goods: [],
        heightList: [],
        scrollY: 0,
        selectedFood:{}
      }
    },
    computed: {
      currentIndex() {

        for (let i = 0; i < this.heightList.length; i++) {
          let thisHeight = this.heightList[i];

          let nextHeight = this.heightList[i + 1];

          if (!nextHeight || (this.scrollY >= thisHeight && this.scrollY < nextHeight)) {
            return i;
          }
        }
        return 0;
      },
      selectFood: {
        get: function () {
          let foodList = [];
          this.goods.forEach((food) => {
            food.foods.forEach((item) => {
              if (item.count) {
                foodList.push(item);
              }
            })
          });
          return foodList;
        }

      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getGoods();
      })
    },
    created() {
      this.dataMap = ["decrease", "discount", "guarantee", "invoice", "special"]
    },
    methods: {
      getGoods() {
        let that = this;
        this.$http.get("/api/goods").then((res) => {
          res = res.body;
          if (res.errno == ERR_OK) {
            this.goods = res.data;
            this.$nextTick(function () {
              this.initScroll();
              this.linkage();
            })
          }
        });
      },
      _drop(target) {

        this.$refs.shopCart.drop(target);
      },
      initScroll() {
        this.menu = new BScroll(this.$refs.goodsMenu, {
          click: true
        });
        this.scroll = new BScroll(this.$refs.goodsList, {
          click: true,
          probeType: 3
        });
        //对象滚动的的原型方法scroll
//        this.scroll.on("scroll",function( pos ){
//            //获取当前滚动高度
//            this.scrollY = Math.abs(Math.round(pos.y));
//
//        })
        this.scroll.on("scroll", (pos) => { //ES6
          //获取当前滚动高度
          this.scrollY = Math.abs(Math.round(pos.y));

        })
      },
      linkage() {
        let foodList = this.$refs.goodsList.querySelectorAll(".food-list-hook");
        //  console.log(foodList)
        let height = 0;
        this.heightList.push(height);
        for (var i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;  //厉害了我的哥
          this.heightList.push(height);
        }
      },
      goToScoll(i, e) {

        if (!e._constructed) {
          return;
        }

        this.scrollY = this.heightList[i];
        // scroll 动画类型函数  quadratic | circular | back | bounce | elastic
        this.scroll.scrollTo(0, -this.scrollY, 300, 'bounce');
      },
      addFood(target) {
        //体验优化，异步执行
        this.$nextTick(() => {
          this._drop(target);
        })
      },
      foodDetail(food, e) {
        if (!e._constructed) {
          return;
        }
        this.selectedFood = food;
       // console.log(this.$refs.selectedFood)
        this.$refs.selectedFood.show();
      }

    },
    components: {
      shopCart,
      foodDetail,
      cartController
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .goods-menu
      flex: 0 0 80px
      width: 80px
      background-color #f3f5f7
      .item-menu
        display table
        height 45px
        width 56px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          background-color #fff
          margin-top -1px
          z-index 10
          font-weight 700

          .text
            color #000
            border-bottom-none()
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 100% auto
          background-repeat no-repeat
          &.decrease
            bg-image("decrease_3")
          &.discount
            bg-image("discount_3")
          &.guarantee
            bg-image("guarantee_3")
          &.invoice
            bg-image("invoice_3")
          &.special
            bg-image("special_3")
        .text
          display table-cell
          vertical-align middle
          width 56px
          font-size 12px
          font-weight 200
          border-bottom-1px(rgba(7, 17, 27, .1))
    .goods-content
      flex: 1
      .food-list
        cursor pointer
        .title
          height 26px
          line-height 26px
          font-size 12px
          color rgb(147, 153, 159)
          background-color #f3f5f7
          border-left 2px solid #d9dde1
          padding-left 13px
        .food-item
          display flex
          margin: 18px 18px 0
          padding-bottom 18px
          position relative
          border-bottom-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-bottom-none()
            margin-bottom 0
          .icon
            flex 0 0 57px
            margin-right 10px
          .cont
            flex 1
            position relative
          .name
            margin-top 2px
            font-size 14px
            line-height 1
            color rgb(7, 17, 27)
          .des
            margin-top 8px
            margin-bottom 8px
            font-size 10px
            line-height 10px
            color rgb(147, 153, 159)
          .extra
            font-size 0
            & > span
              font-size 10px
              line-height 10px
              color rgb(147, 153, 159)
              margin-right 12px
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
          .control
            position absolute
            right 0
            bottom 0
</style>
