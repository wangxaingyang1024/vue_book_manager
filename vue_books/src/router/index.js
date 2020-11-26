import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'

//ss
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    },
    {
        path: '/HelloWorld',
        name: 'HelloWorld',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../components/HelloWorld.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router