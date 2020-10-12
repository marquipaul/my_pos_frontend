/* eslint-disable */
import axios from 'axios'
const state  = {
    customers: [],
};
const getters = {
    getCustomers(state) {
        return state.customers
    }
};
const mutations = {
    SET_CUSTOMERS(state, payload) {
        state.customers = payload
    },
    ADD_CUSTOMER(state, payload) {
        state.customers.push(payload)
    }
};
const actions = {
    getCustomers(context){
        return new Promise((resolve, reject) => {
            axios.get('/api/customers?cashier')
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
};


export default {
    state,
    getters,
    actions,
    mutations,
}