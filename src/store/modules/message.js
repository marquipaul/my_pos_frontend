/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    messages: {},
};
const getters = {
    getMessages(state) {
        return state.messages
    }
};
const mutations = {
    SET_MESSAGES(state, payload){
        state.messages = payload
    },
    PUSH_MESSAGE(state, payload){
        state.messages.data.push(payload)
    },
    UPDATE_MESSAGE(state, payload) {
        let updateIndex = state.messages.data.findIndex(item => item.id === payload.id);
        Vue.set(state.messages.data, updateIndex, payload)
    },
    DELETE_MESSAGE(state, id) {
        let deleteIndex = state.messages.data.findIndex(item => item.id === id);
        state.messages.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getMessages(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/messages', { params: params })
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
    addMessageReceipt(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/messages?sendReceipt', payload)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateAccount(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/messages/${payload.id}`, payload)
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
            axios.delete(`/api/messages/${id}`)
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