import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Order from '../views/Order.vue'
import Account from '../views/Accounts.vue'
import Customer from '../views/Customers.vue'
import Product from '../views/Product.vue'
import ProductInbound from '../views/ProductInbound.vue'
import ProductOutbound from '../views/ProductOutbound.vue'
import Expense from '../views/Expenses.vue'
import Analytics from '../views/Analytics.vue'
import Receipt from '../views/Receipt.vue'
import Category from '../views/Categories.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login | StackPoint',
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Dashboard | StackPoint'
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Order,
    meta: {
      requiresAuth: true,
      title: 'Orders | StackPoint',
    }
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Account,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Accounts | StackPoint',
    }
  },
  {
    path: '/customers',
    name: 'Customer',
    component: Customer,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Customers | StackPoint',
    }
  },
  {
    path: '/products',
    name: 'Product',
    component: Product,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Products | StackPoint',
    }
  },
  {
    path: '/categories',
    name: 'Category',
    component: Category,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Categories | StackPoint',
    }
  },
  {
    path: '/product-inbounds',
    name: 'Product-inbound',
    component: ProductInbound,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Inbounds | StackPoint',
    }
  },
  {
    path: '/product-outbounds',
    name: 'Product-outbounds',
    component: ProductOutbound,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Outbounds | StackPoint',
    }
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: Expense,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Expenses | StackPoint',
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Analytic Report | StackPoint',
    }
  },
  {
    path: '/customer/receipt/:id/:code',
    name: 'Receipt',
    component: Receipt,
    meta: {
      title: 'Customer Receipt | StackPoint',
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
