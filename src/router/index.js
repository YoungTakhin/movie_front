import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login/index'
import Register from '@/components/Register/index'
import Home from '@/components/User/index'
import Recommend from '@/components/User/Recommend/index'
import Admin from '@/components/Admin/index'
import Movie from '@/components/Admin/Movie/index'

Vue.use(Router);
Vue.use(VueResource);

const router = new Router({
    routes: [
        {
            path: '/',
            name: '根',
            component: Login,
            meta: {
                needLogin: false
            }
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
            path: '/register',
            name: "注册",
            component: Register,
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
        },
        {
            path: '/admin',
            name: '管理员主页',
            component: Admin,
            meta: {
                needLogin: true
            }
        },
        {
            path: '/movie',
            name: '电影管理',
            component: Movie,
            meta: {
                needLogin: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const role = localStorage['user'];
    if (!role && to.path !== '/login' && to.path !== '/register' && to.meta.needLogin) {
        next('/login');
    } else {
        next();
    }
});

export default router;