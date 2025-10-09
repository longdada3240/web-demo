// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import CustomerList from '@/components/CustomerList.vue'
import CustomerDetail from '@/components/CustomerDetail.vue'

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
    path: '/customer/:id',
    name: 'CustomerDetail',
    component: CustomerDetail,
    meta: {
      title: '客户详情'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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
