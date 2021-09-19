/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    stores: [],
    storesWhole: {},
};
const getters = {
    getStores(state) {
        return state.stores
    },
    getWholeStores(state) {
        return state.storesWhole
    }
};
const mutations = {
    SET_STORES(state, payload){
        state.stores = payload
    },
    SET_WHOLE_STORES(state, payload){
        state.storesWhole = payload
    },
    PUSH_STORE(state, payload){
        var store = {
            id: payload.id,
            store: payload.name
        }
        state.stores.push(store)
    },
    PUSH_WHOLE_STORE(state, payload){
        state.storesWhole.data.push(payload)
    },
    UPDATE_STORE(state, payload) {
        let updateIndex = state.storesWhole.data.findIndex(item => item.id === payload.id);
        Vue.set(state.storesWhole.data, updateIndex, payload)
    },
    DELETE_STORE(state, id) {
        let deleteIndex = state.storesWhole.data.findIndex(item => item.id === id);
        state.storesWhole.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getStores(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/stores', { params: params })
            .then(response => {
                console.log(response.data)
                if (params.whole) {
                    context.commit('SET_WHOLE_STORES', response.data)
                } else {
                    context.commit('SET_STORES', response.data)
                }
                
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addStore(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/stores', payload)
            .then(response => {
                console.log(response.data)
                if (payload.whole) {
                    context.commit('PUSH_WHOLE_STORE', response.data)
                } else {
                    context.commit('PUSH_STORE', response.data)
                }
                
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateStoreStatus(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/stores/${payload.id}?update_status`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_STORE', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateStore(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/stores/${payload.id}`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_STORE', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteStore(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/stores/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_STORE', id)
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