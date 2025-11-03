// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import CustomerList from '@/components/CustomerList.vue'
import CustomerDetail from '@/components/CustomerDetail.vue'
import FormExample from '@/components/FormExample.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/customers'
  },
  {
    path: '/customers',
    name: 'CustomerList',
    component: CustomerList,
    meta: {
      title: '客户列表'
    }
  },
  {
    path: '/customer-detail/:id',
    name: 'CustomerDetail',
    component: CustomerDetail,
    meta: {
      title: '客户详情'
    }
  },
  {
    path: '/form-example',
    name: 'FormExample',
    component: FormExample,
    meta: {
      title: 'test'
    }
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - 客户管理系统'
  }
  next()
})

export default router

