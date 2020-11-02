/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    orders: {},
};
const getters = {
    getOrders(state) {
        return state.orders
    }
};
const mutations = {
    SET_ORDERS(state, payload){
        state.orders = payload
    },
    UPDATE_ORDER(state, payload) {
        let updateIndex = state.orders.data.findIndex(item => item.id === payload.id);
        //Vue.set(state.orders.data, updateIndex, payload)
        state.orders.data[updateIndex].order_status = payload.order_status
        state.orders.data[updateIndex].payment_status = payload.payment_status
        // order_status: item.order_status,
        //   payment_status: item.payment_status,
    },
    DELETE_ORDER(state, id) {
        let deleteIndex = state.orders.data.findIndex(item => item.id === id);
        state.orders.data.splice(deleteIndex, 1)
    }
};
const actions = {
    placeOrder(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/orders', payload)
            .then(response => {
                console.log(response.data)
                //context.commit('PUSH_ORDER', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateOrderStatus(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/orders/${payload.id}?update_status`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_ORDER', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getOrders(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/orders', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_ORDERS', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteOrder(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/orders/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_ORDER', id)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getOrderReceipt(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/customer/reciept/${params.id}/${params.code}`)
            .then(response => {
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