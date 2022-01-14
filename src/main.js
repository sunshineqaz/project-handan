// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;

import aMap from 'vue-amap'
Vue.use(aMap)

//初始化vue-amap
aMap.initAMapApiLoader({
    key: '20b7259f91c4df3e50c069f6c67b0412',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder', 'AMap.Geolocation', 'AMap.Marker', 'AMap.MarkerClusterer'],
    uiVersion: "1.0"
})

import axios from 'axios';
axios.defaults.baseURL = process.env.API_ROOT;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

import store from './store/index'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})