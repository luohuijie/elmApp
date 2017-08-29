<template>
  <div id="app">
    <el-header :seller="seller"></el-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/Goods" active-class="on">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/Ratings" active-class="on">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/Seller" active-class="on">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
    <div class="loading-box" v-show="loadingShow">
      <div class="loading-css3">
        <div class="loader">Loading...</div>
        <div>正在加载</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import elHeader from "@/components/header/header";
  import {getUrlParams} from "./common/js/getUrlParams";

  const ERR_OK = 0;
export default {
  name: 'app',
  data() {
      return {
          seller: {
            id: (()=>{//闭包自执行获取地址栏参数    直接解析
              let queryParams = getUrlParams();
              return queryParams.id ;
            })()
          }

      }
  },
  mounted() {
      this.$nextTick(function(){
       //   console.log(userParse)
          this.getSeller();
      });
  },
  methods: {
    getSeller() {
      let that = this;
      this.$http.get('/api/seller?id='+this.seller.id).then( (res) => {
        res = res.data;
        if(res.errno === ERR_OK ){
        //  this.seller = res.data; //ES6 对象扩展方法，保留之前定义变量
          this.seller = Object.assign({},this.seller,res.data);
         // console.log(this.seller)  success
        }
      })
    }

  },
  computed : {
    loadingShow () {
      return this.$store.state.loadingShow;
    }
  },
  components: {
      elHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../static/css/reset.css";
@import "./common/stylus/icon.css";
@import "./common/stylus/index.styl";

#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  -webkit-tap-highlight-color: none
  -webkit-user-select: none
  -moz-user-focus: none
  .tab
    display: flex
    width: 100%
    height: .4rem
    line-height: .4rem
    border-top-1px(rgba(7, 17, 27, .1))
    border-bottom-1px(rgba(7, 17, 27, .1))
    .tab-item
      flex: 1
      text-align : center
      & > a
        display: block
        color: rgb(77, 85, 93)
        &.on
          color: rgb(244,20,20)



  .loading-box
    position: fixed
    z-index: 1000
    bottom: 0
    left: 0
    width: 100%
    height: 100%
    background: transparent

  .loading-css3
    position: fixed
    left: 50%
    top: 50%
    -webkit-transform: translate(-50%,-50%)
    text-align: center
    background: rgba(0, 0, 0, .65)
    border-radius: 5px
    z-index: 1001
    color: #fff
    width: .68rem
    height: .68rem
    padding: .09rem
    box-sizing:border-box
    & :last-child
      white-space: nowrap
      margin-top: -8px
      margin-left: -3px


  .loading-box .loader
    -webkit-animation: loading 1.1s infinite linear
    animation: loading 1.1s infinite linear
    text-indent: -9999em
    border-top: .3em solid hsla(0, 0%, 100%, .2)
    border-right: .3em solid hsla(0, 0%, 100%, .2)
    border-bottom: .3em solid hsla(0, 0%, 100%, .2)
    border-left: .3em solid #fff


  .loading-box .loader, .loading-box .loader:after
    width: 24px
    height: 24px
    border-width: 3px
    margin: 0 auto .125rem
    border-radius: 50%


  @-webkit-keyframes loading
    0%
      -webkit-transform: rotate(0deg)
      transform: rotate(0deg)

    to
      -webkit-transform: rotate(1turn)
      transform: rotate(1turn)



  @keyframes loading
    0%
      -webkit-transform: rotate(0deg)
      transform: rotate(0deg)

    to
      -webkit-transform: rotate(1turn)
      transform: rotate(1turn)


</style>
