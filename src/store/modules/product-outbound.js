/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    outbounds: {},
    outboundInfo: {}
};
const getters = {
    getOutbounds(state) {
        return state.outbounds
    },
    getOutboundInfo(state) {
        return state.productInfo
    }
};
const mutations = {
    SET_OUTBOUNDS(state, payload){
        state.outbounds = payload
    },
    SET_OUTBOUND_INFO(state, payload){
        state.productInfo = payload
    },
    PUSH_OUTBOUND(state, payload){
        state.outbounds.data.push(payload)
    },
    UPDATE_OUTBOUND(state, payload) {
        let updateIndex = state.outbounds.data.findIndex(item => item.id === payload.id);
        Vue.set(state.outbounds.data, updateIndex, payload)
    },
    DELETE_OUTBOUND(state, id) {
        let deleteIndex = state.outbounds.data.findIndex(item => item.id === id);
        state.outbounds.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getOutbounds(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/product-outbounds', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_OUTBOUNDS', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getOutbound(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/product-outbounds/${id}`)
            .then(response => {
                context.commit('SET_OUTBOUND_INFO', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addOutbound(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/product-outbounds', payload)
            .then(response => {
                console.log(response.data)
                context.commit('PUSH_OUTBOUND', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateOutbound(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/product-outbounds/${payload.id}`, payload)
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
    deleteOutbound(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/product-outbounds/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_OUTBOUND', id)
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