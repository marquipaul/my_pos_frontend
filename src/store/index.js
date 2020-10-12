import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './modules/authentication';
import cart from './modules/cart';
import product from './modules/product';
import customer from './modules/customer';
import order from './modules/order';

export default new Vuex.Store({
  state: {
    isLoading: false,
    snackbar: {
      open: false,
      text: '',
      color: '',
      timeout: 4000
    }
  },
  getters: {
    isLoading(state) {
      return state.isLoading
    },
    snackbar(state) {
      return state.snackbar
    }
  },
  mutations: {
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
    product,
    customer,
    order
  }
})
