/* eslint-disable */
import axios from 'axios'
const state  = {
    items: [],
};
const getters = {
    getProducts(state) {
        return state.items
    }
};
const mutations = {
    SET_PRODUCTS(state, payload){
        state.items = payload
    },
    UPDATE_PRODUCT(state, payload){
        state.items[payload.category_index].products[payload.product_index] = payload.item;
    },
};
const actions = {
    getProducts(context){
        return new Promise((resolve, reject) => {
            context.commit('SET_LOADING', true);
            axios.get('/api/products?cashier')
            .then(response => {
                console.log(response.data)
                context.commit('SET_PRODUCTS', response.data)
                resolve(response)
                context.commit('SET_LOADING', false);
            })
            .catch(error => {
                reject(error)
                context.commit('SET_LOADING', false);
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