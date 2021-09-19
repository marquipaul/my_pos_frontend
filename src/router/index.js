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
import Billing from '../views/Billing.vue'

import Store from '../views/Stores.vue'

import PrinterTest from '../views/PrinterTest.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login | StockPoints',
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Dashboard | StockPoints'
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Order,
    meta: {
      requiresAuth: true,
      title: 'Orders | StockPoints',
    }
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Account,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Accounts | StockPoints',
    }
  },
  {
    path: '/accounts-admin',
    name: 'Accounts-Admin',
    component: Account,
    meta: {
      requiresAuth: true,
      permission: 'SUPERADMIN',
      title: 'Accounts | StockPoints',
    }
  },
  {
    path: '/stores',
    name: 'stores',
    component: Store,
    meta: {
      requiresAuth: true,
      permission: 'SUPERADMIN',
      title: 'Stores | StockPoints',
    }
  },
  {
    path: '/customers',
    name: 'Customer',
    component: Customer,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Customers | StockPoints',
    }
  },
  {
    path: '/products',
    name: 'Product',
    component: Product,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Products | StockPoints',
    }
  },
  {
    path: '/categories',
    name: 'Category',
    component: Category,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Categories | StockPoints',
    }
  },
  {
    path: '/product-inbounds',
    name: 'Product-inbound',
    component: ProductInbound,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Inbounds | StockPoints',
    }
  },
  {
    path: '/product-outbounds',
    name: 'Product-outbounds',
    component: ProductOutbound,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Outbounds | StockPoints',
    }
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: Expense,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Expenses | StockPoints',
    }
  },
  {
    path: '/income-report',
    name: 'Income',
    component: Analytics,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Income Report | StockPoints',
    }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: Billing,
    meta: {
      requiresAuth: true,
      permission: 'STOREADMIN',
      title: 'Billing Report | StockPoints',
    }
  },
  {
    path: '/customer/receipt/:id/:code',
    name: 'Receipt',
    component: Receipt,
    meta: {
      title: 'Customer Receipt | StockPoints',
    }
  },
  {
    path: '/test-print',
    name: 'TEST PRINT',
    component: PrinterTest,
    meta: {
      title: 'TEST PRINT | StockPoints',
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
