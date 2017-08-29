// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import server from "vue-resource"
import Vuex from 'vuex'
import AwesomeSwiper from "vue-awesome-swiper"
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './common/stylus/index.styl'

//使用组件
Vue.use(server)
Vue.use(Vuex)
Vue.use(AwesomeSwiper)
Vue.use(Element)

Vue.config.productionTip = false

//vuex
var store = new Vuex.Store({
  state:{
    loadingShow : false
  },
  mutations:{
    showUserName( event,flag){
      store.state.loadingShow = flag;
    }
  }
})

//vue-resouse 拦截器
Vue.http.interceptors.push((request, next)  =>{
  //登录成功后将后台返回的TOKEN在本地存下来,每次请求从sessionStorage中拿到存储的TOKEN值
  store.commit('showUserName',true);

  next((response) => {
    store.commit('showUserName',false);
    return response;
  });

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  template: '<App/>',
  components: { App }
})
