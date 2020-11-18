/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
const state  = {
    customers: [],
    adminCustomers: {}
};
const getters = {
    getCustomers(state) {
        return state.customers
    },
    getAdminCustomers(state) {
        return state.adminCustomers
    }
};
const mutations = {
    SET_CUSTOMERS(state, payload) {
        state.customers = payload
    },
    ADD_CUSTOMER(state, payload) {
        state.customers.push(payload)
    },
    SET_ADMIN_CUSTOMERS(state, payload) {
        state.adminCustomers = payload
    },
    ADD_ADMIN_CUSTOMER(state, payload) {
        state.adminCustomers.data.push(payload)
    },
    UPDATE_ADMIN_CUSTOMER(state, payload) {
        let updateIndex = state.adminCustomers.data.findIndex(item => item.id === payload.id);
        Vue.set(state.adminCustomers.data, updateIndex, payload)
    },
    DELETE_ADMIN_CUSTOMER(state, id) {
        let deleteIndex = state.adminCustomers.data.findIndex(item => item.id === id);
        state.adminCustomers.data.splice(deleteIndex, 1)
    }
    
};
const actions = {
    getCustomers(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/customers', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_CUSTOMERS', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addCustomer(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/customers', payload)
            .then(response => {
                console.log(response.data)
                var customer = {
                    id: response.data.id,
                    name: response.data.name
                }
                context.commit('ADD_CUSTOMER', customer)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getAdminCustomers(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/customers', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_ADMIN_CUSTOMERS', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addAdminCustomer(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/customers', payload)
            .then(response => {
                if (context.state.adminCustomers.data.length === 0) {
                    context.dispatch('getAdminCustomers', {})
                } else {
                    context.commit('ADD_ADMIN_CUSTOMER', response.data)
                }
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateAdminCustomer(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/customers/${payload.id}`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_ADMIN_CUSTOMER', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteAdminCustomer(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/customers/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_ADMIN_CUSTOMER', id)
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