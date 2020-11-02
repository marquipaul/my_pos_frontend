import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './modules/authentication';
import cart from './modules/cart';
import productCashier from './modules/product-cashier';
import product from './modules/product';
import customer from './modules/customer';
import order from './modules/order';
import account from './modules/account';
import category from './modules/category';
import productInbound from './modules/product-inbound';
import productOutbound from './modules/product-outbound';
import expenses from './modules/expenses';
import dashboard from './modules/dashboard';
import analytic from './modules/analytic';
import message from './modules/message';
import billing from './modules/billing';

export default new Vuex.Store({
  state: {
    isLoading: false,
    snackbar: {
      open: false,
      text: '',
      color: '',
      timeout: 4000
    },
    sidebarMini: false,
    sidebarModel: true
  },
  getters: {
    isLoading(state) {
      return state.isLoading
    },
    snackbar(state) {
      return state.snackbar
    },
    sidebarMini(state) {
      return state.sidebarMini
    },
    sidebarModel(state) {
      return state.sidebarModel
    }
    
  },
  mutations: {
    SET_SIDEBAR_MODEL(state, payload) {
      state.sidebarModel = payload
    },
    SET_SIDEBAR_MINI(state, payload) {
      state.sidebarMini = payload
    },
    SET_LOADING(state, payload) {
      state.isLoading = payload
    },
    SET_SNACKBAR(state, payload) {
      state.snackbar = payload
    }
  },
  actions: {
  },
  modules: {
    auth,
    cart,
    productCashier,
    product,
    customer,
    order,
    account,
    category,
    productInbound,
    productOutbound,
    expenses,
    dashboard,
    analytic,
    message,
    billing
  }
})
