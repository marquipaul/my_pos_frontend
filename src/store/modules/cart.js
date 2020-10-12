/* eslint-disable */
import Vue from 'vue'
//import axios from 'axios'
const state  = {
    items: [],
    showCart: false,
};
const getters = {
    retrieveCartItems(state) {
        return state.items
    },
    showCart(state) {
        return state.showCart
    }
};
const mutations = {
    SHOW_CART(state, payload) {
        state.showCart = payload
    },
    ADD_PRODUCT(state, payload){
        state.items.push(payload)
    },
    ADD_QUANTITY(state, payload){
        let updateIndex = state.items.findIndex(item => item.product_id === payload.product_id);
        state.items[updateIndex].quantity++;
        state.items[updateIndex].amount = state.items[updateIndex].price * state.items[updateIndex].quantity;
    },
    DEDUCT_QUANTITY(state, payload){
        let updateIndex = state.items.findIndex(item => item.product_id === payload.product_id);
        state.items[updateIndex].quantity--;
        state.items[updateIndex].amount = state.items[updateIndex].price * state.items[updateIndex].quantity;
    },
    ADD_WHOLESALE_QUANTITY(state, payload){
        let updateIndex = state.items.findIndex(item => item.product_id === payload.product_id);
        state.items[updateIndex].quantity = state.items[updateIndex].quantity+payload.minimum_wholesale_order;
        state.items[updateIndex].amount = state.items[updateIndex].price * state.items[updateIndex].quantity;
    },
    DEDUCT_WHOLESALE_QUANTITY(state, payload){
        let updateIndex = state.items.findIndex(item => item.product_id === payload.product_id);
        state.items[updateIndex].quantity = state.items[updateIndex].quantity-payload.minimum_wholesale_order;
        console.log(updateIndex, state.items[updateIndex])
        state.items[updateIndex].amount = state.items[updateIndex].price * state.items[updateIndex].quantity;
    },
    REMOVE_PRODUCT(state, payload){
        let deleteIndex = state.items.findIndex(item => item.product_id === payload.product_id);
        state.items.splice(deleteIndex, 1)
    },
    CLEAR_PRODUCTS(state){
        state.items = []
    }
};
const actions = {
    addProduct(context, payload){
        console.log(context.state.items.some(el => el.product_id === payload.product_id), payload, context.state.items)
        if (context.state.items.some(el => el.product_id === payload.product_id)) {
            context.dispatch('addQuantity', payload)
        } else {
            context.commit('ADD_PRODUCT', payload)
        }
    },

    addQuantity(context, payload){
        if (payload.price_type === 'RETAIL') {
            context.commit('ADD_QUANTITY', payload)
        } else {
            //If quantity will be greater than the remaining quantity don't continue
            context.commit('ADD_WHOLESALE_QUANTITY', payload)
        }
        
    },
    deductQuantity(context, payload){
        let index = context.state.items.findIndex(item => item.product_id === payload.product_id);
        if (context.state.items[index].quantity <= 1) {
            context.commit('REMOVE_PRODUCT', payload)
        } else {
            if (payload.price_type === 'RETAIL') {
                context.commit('DEDUCT_QUANTITY', payload)
            } else {
                context.commit('DEDUCT_WHOLESALE_QUANTITY', payload)
                if (context.state.items[index].quantity <= 1) {
                    context.commit('REMOVE_PRODUCT', payload)
                }
            }
        }
    },
                   
};


export default {
    state,
    getters,
    actions,
    mutations,
}