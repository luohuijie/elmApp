<template>
  <div class="ratings" ref="ratingsBox">
    <div class="ratings-wrap">
      <div class="overview">
        <div class="view-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="view-right">
          <div class="view-list">
            <span class="title">服务态度</span>
            <span class="star-wrap">
              <star :score="seller.serviceScore" :size="36"></star>
            </span>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="view-list">
            <span class="title">食物评分</span>
            <span class="star-wrap">
              <star :score="seller.foodScore" :size="36"></star>
            </span>
            <span class="score foodScore">{{seller.foodScore}}</span>
          </div>
          <div class="view-list">
            <span class="title">送达时间</span>
            <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split-doc></split-doc>
      <div class="ratings-count">
        <rate-select
          :thisFood="ratings"
          :select-type="selectType"
          :only-content="onlyContent"
          :des="des"
          @selectTypeChange="changCont"
          @toggleChange="toggleFlg"
        ></rate-select>
      </div>
      <div class="ratings-cont">
        <!--{{ratings}}-->
        <ul class="ratings-list-wrap">
          <li class="ratingsList" v-for="item of ratings" v-show="needShow( item.rateType , item.text )">
            <div class="avatarInfo">
              <div class="top clearfix">
                <time class="time fr">{{item.rateTime | timeFormat}}</time>
                <span class="name fl">{{item.username}}</span>
              </div>
              <img :src="item.avatar" width="28" height="28" class="avatar">
              <span class="star-wrap clearfix">
               <star :score="item.score" :size="24" class="ratings-star"></star>
               <span class="useBackTime" v-show="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
              </span>
            </div>
            <p class="text">
              {{item.text}}
            </p>
            <div class="text recommend">
              <i class="icon" :class="{'icon-thumb_up': item.rateType===0,'icon-thumb_down':item.rateType===1}"></i>
              <span
                  v-show="item.recommend && item.recommend.length"
                  v-for="food of item.recommend" v-text="food" class="rec-food-list"></span>

            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import star from "@/components/star/star";
import {formatDate} from "../../common/js/formatDate";
import splitDoc from "@/components/splitDoc/splitDoc";
import rateSelect from "@/components/rateSelect/rateSelect";

const ERR_OK = 0;
const ALL = 2;
export default {
  name: 'ratings',
  props:{
      seller:{
          type: Object,
          default() {
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
          }
      }
  },
  data () {
    return {
      ratings:[],
      selectType: ALL,
      onlyContent: false,
      des: {
        all:"全部",
        positive: "满意",
        negative: "吐槽"
      }
    }
  },
  mounted(){
      this.$nextTick(()=>{

          this.getRatings();
          this.selectType= ALL;
          this.onlyContent=false;
      });
  },
  methods:{
    getRatings(){
        let that = this;
        this.$http.get("/api/ratings").then((res) => {
        res = res.body;
        if (res.errno == ERR_OK) {
          this.ratings = res.data;
          this.$nextTick(function () {
            this.initScroll();
          })
        }
      });
    },
    initScroll() {
        this.scroll = new BScroll(this.$refs.ratingsBox,{
            click: true
        })
    },
    needShow( type ,text ){
      //当选中了只读，但是有没有内容的时候，返回
      //console.log(type ,text,this.selectType)
      if( !text && this.onlyContent){

          return false;
      };

      if(this.selectType == ALL ){
        return true;
      }else{
        return type == this.selectType;
      }

    },
    changCont(type){
      this.selectType = type;
      this.$nextTick(function(){
        this.scroll.refresh();
      })
    },
    toggleFlg(){
     // console.log(this.onlyContent)
      this.onlyContent = !this.onlyContent;
      this.$nextTick(function(){
        this.scroll.refresh();
      })
    }
  },
  filters: {
    timeFormat( time ) {
      let date = new Date( time );
      return formatDate(date,"yyyy-MM-dd hh:mm");
    }
  },
  components: {
    star,
    splitDoc,
    rateSelect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .ratings
    position absolute
    top 174px
    bottom 0px
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .view-left
        flex 0 0 137px
        width 137px
        border-right 1px solid rgba(7,17,27,.1)
        text-align center
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          font-size 24px
          color rgb(255,153,0)
          line-height 28px
          margin-bottom 6px
        .title
          font-size 12px
          color rgb(7,17,27)
          height 12px
          line-height 12px
          margin-bottom 8px
        .rank
          font-size 10px
          color #93999f
          line-height 10px
          margin-bottom 6px
      .view-right
        flex 1
        padding-left 24px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .view-list
          font-size 0
          display flex
          margin-bottom 8px
          .title
            font-size 12px
            color rgb(7,17,27)
            line-height 18px
            margin-right 12px
          .star-wrap
            margin-right 12px
          .score
            font-size 12px
            color rgb(255,153,0)
            line-height 18px
          .deliveryTime
            font-size 12px
            color rgb(147,153,159)
            line-height 18px
    .ratings-count
      padding 0 18px
    .ratings-cont
      padding 0 18px
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

        .avatarInfo
          position relative
          padding-left 40px
          font-size 0
          .top
            width 100%
          .avatar
            position absolute
            left 0
            top 0px
          .star-wrap
            .ratings-star,.useBackTime
              float left
              margin-right 6px
            .useBackTime
              font-size 10px
              font-weight 200
              color rgb(147,153,159)


        .text
          padding-left 40px
          font-size 0px
          color rgb(7,17,27)
          line-height 18px
          font-size 12px
          .icon
            display inline-block
            margin-right 8px
        .recommend
          font-size 0px
          .rec-food-list
            display inline-block
            border-style solid
            border-width 1px
            border-color rgba(7,17,27,.1)
            border-radius 1px
            background-color #fff
            font-size 9px
            color rgb(147,153,159)
            line-height 16px
            margin-right 8px
            padding 0 6px

</style>
