import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: () => import("@/views/Home.vue")
    },
    {
        path: '/About',
        name: 'About',
        component: () => import("@/views/About.vue"),
    },
    {
        path: '/Display',
        name: 'Display',
        component: () => import("@/views/display/DisplayIndex.vue"),
    },
    {
        path: '/Display/SelectTheme',
        name: 'SelectTheme',
        component: () => import("@/views/display/selecttheme/SelectTheme.vue"),
    },
    {
        path: '/Network',
        name: 'Network',
        component: () => import("@/views/network/NetworkIndex.vue"),
    },
    {
        path: '/Network/HttpProxy',
        name: 'HttpProxy',
        component: () => import("@/views/network/httpproxy/HttpProxy.vue"),
    },
    {
        path: '/Network/SelectWifi',
        name: 'SelectWifi',
        component: () => import("@/views/network/httpproxy/SelectWifi.vue"),
    },
    {
        path: '/Other',
        name: 'Other',
        component: () => import("@/views/other/OtherIndex.vue"),
    },
]

const router = new VueRouter({
    routes
})

export default router
