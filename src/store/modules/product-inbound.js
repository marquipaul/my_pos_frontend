/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    inbounds: {},
    inboundInfo: {}
};
const getters = {
    getInbounds(state) {
        return state.inbounds
    },
    getInboundInfo(state) {
        return state.productInfo
    }
};
const mutations = {
    SET_INBOUNDS(state, payload){
        state.inbounds = payload
    },
    SET_INBOUND_INFO(state, payload){
        state.productInfo = payload
    },
    PUSH_INBOUND(state, payload){
        state.inbounds.data.push(payload)
    },
    UPDATE_INBOUND(state, payload) {
        let updateIndex = state.inbounds.data.findIndex(item => item.id === payload.id);
        Vue.set(state.inbounds.data, updateIndex, payload)
    },
    DELETE_INBOUND(state, id) {
        let deleteIndex = state.inbounds.data.findIndex(item => item.id === id);
        state.inbounds.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getInbounds(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/product-inbounds', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_INBOUNDS', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getInbound(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/product-inbounds/${id}`)
            .then(response => {
                context.commit('SET_INBOUND_INFO', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addInbound(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/product-inbounds?update_pricing', payload)
            .then(response => {
                console.log(response.data)
                context.commit('PUSH_INBOUND', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateInbound(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/product-inbounds/${payload.id}?update_pricing`, payload)
            .then(response => {
                console.log(response.data)
                //context.commit('UPDATE_INBOUND', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteInbound(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/product-inbounds/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_INBOUND', id)
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