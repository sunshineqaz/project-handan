/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index'
import homePage from '@/views/vis-home-page'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/homePage',
            name: 'homePage',
            component: homePage
        }
    ]
})