import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Order from '../views/Order.vue'
import Account from '../views/Accounts.vue'
import Product from '../views/Product.vue'
import ProductInbound from '../views/ProductInbound.vue'
import ProductOutbound from '../views/ProductOutbound.vue'
import Expense from '../views/Expenses.vue'
import Analytics from '../views/Analytics.vue'
import Receipt from '../views/Receipt.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Order,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Account,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN'
    }
  },
  {
    path: '/products',
    name: 'Product',
    component: Product,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN'
    }
  },
  {
    path: '/product-inbounds',
    name: 'Product-inbound',
    component: ProductInbound,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN'
    }
  },
  {
    path: '/product-outbounds',
    name: 'Product-outbounds',
    component: ProductOutbound,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN'
    }
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: Expense,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN'
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN'
    }
  },
  {
    path: '/customer/receipt/:id/:code',
    name: 'Receipt',
    component: Receipt,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
