import Vue from 'vue';
import Router from 'vue-router';
import Goods from '@/view/goods/goods';
import Ratings from '@/view/ratings/ratings';
import Seller from '@/view/seller/seller';
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: "/Goods"
    },
    {
      path: '/Goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/Ratings',
      name: 'Ratings',
      component: Ratings
    },
    {
      path: '/Seller',
      name: 'Seller',
      component: Seller
    }
  ]
});
