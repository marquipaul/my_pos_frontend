/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    products: {},
    productInfo: {},
    product_selection: []
};
const getters = {
    getAdminProducts(state) {
        return state.products
    },
    getProductSelection(state) {
        return state.product_selection
    },
    getProductInfo(state) {
        return state.productInfo
    }
};
const mutations = {
    SET_ADMIN_PRODUCTS(state, payload){
        state.products = payload
    },
    SET_PRODUCT_SELECTION(state, payload) {
        state.product_selection = payload;
    },
    SET_PRODUCT_INFO(state, payload){
        state.productInfo = payload
    },
    PUSH_PRODUCT(state, payload){
        state.products.data.push(payload)
    },
    UPDATE_ADMIN_PRODUCT(state, payload) {
        let updateIndex = state.products.data.findIndex(item => item.id === payload.id);
        Vue.set(state.products.data, updateIndex, payload)
    },
    DELETE_PRODUCT(state, id) {
        let deleteIndex = state.products.data.findIndex(item => item.id === id);
        state.products.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getAdminProducts(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/products', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_ADMIN_PRODUCTS', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getProductSelection(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/products?selection')
            .then(response => {
                console.log(response.data)
                context.commit('SET_PRODUCT_SELECTION', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getProduct(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/products/${id}`)
            .then(response => {
                context.commit('SET_PRODUCT_INFO', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addProduct(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/products', payload)
            .then(response => {
                console.log(response.data)
                if (context.state.products.data.length === 0) {
                    context.dispatch('getAdminProducts', {})
                } else {
                    context.commit('PUSH_PRODUCT', response.data)
                }
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateProduct(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/products/${payload.id}`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_ADMIN_PRODUCT', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateProductImage(context, payload){
        return new Promise((resolve, reject) => {
            axios.post(`/api/products/${payload.id}?updateImage`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_ADMIN_PRODUCT', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteProduct(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/products/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_PRODUCT', id)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },

};


export default {
    state,
    getters,
    actions,
    mutations,
}