/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    accounts: {},
};
const getters = {
    getAccounts(state) {
        return state.accounts
    }
};
const mutations = {
    SET_ACCOUNTS(state, payload){
        state.accounts = payload
    },
    PUSH_ACCOUNT(state, payload){
        state.accounts.data.push(payload)
    },
    UPDATE_ACCOUNT(state, payload) {
        let updateIndex = state.accounts.data.findIndex(item => item.id === payload.id);
        Vue.set(state.accounts.data, updateIndex, payload)
    },
    DELETE_ACCOUNT(state, id) {
        let deleteIndex = state.accounts.data.findIndex(item => item.id === id);
        state.accounts.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getAccounts(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/users', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_ACCOUNTS', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addAccount(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/users', payload)
            .then(response => {
                console.log(response.data)
                context.commit('PUSH_ACCOUNT', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateAccount(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/users/${payload.id}`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_ACCOUNT', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteAccount(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/users/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_ACCOUNT', id)
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