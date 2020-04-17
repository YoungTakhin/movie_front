import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login/index'
import Home from '@/components/User/index'
import Recommend from '@/components/User/Recommend/index'

import Navbar from '@/components/Common/Navbar'

Vue.use(Router);
Vue.use(VueResource);

const router = new Router({
    routes: [
        {
            path: '/navbar',
            name: '导航栏',
            component: Navbar,
        },
        {
            path: '/login',
            name: '登录',
            component: Login,
            meta: {
                needLogin: false
            }
        },
        {
            path: '/home',
            name: '用户首页',
            component: Home,
            meta: {
                needLogin: true
            }
        },
        {
            path: '/recommend',
            name: '推荐',
            component: Recommend,
            meta: {
                needLogin: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const role = localStorage['user'];
    if (!role && to.path !== '/login' && to.meta.needLogin) {
        next('/login');
    } else {
        next();
    }
});

export default router;