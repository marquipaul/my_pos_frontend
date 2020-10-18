/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    categories: [],
};
const getters = {
    getCategories(state) {
        return state.categories
    }
};
const mutations = {
    SET_CATEGORIES(state, payload){
        state.categories = payload
    },
    PUSH_CATEGORY(state, payload){
        var category = {
            id: payload.id,
            category: payload.title
        }
        state.categories.push(category)
    },
    UPDATE_CATEGORY(state, payload) {
        let updateIndex = state.categories.data.findIndex(item => item.id === payload.id);
        Vue.set(state.categories.data, updateIndex, payload)
    },
    DELETE_CATEGORY(state, id) {
        let deleteIndex = state.categories.data.findIndex(item => item.id === id);
        state.categories.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getCategories(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/categories', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_CATEGORIES', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addCategory(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/categories', payload)
            .then(response => {
                console.log(response.data)
                context.commit('PUSH_CATEGORY', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateCategory(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/categories/${payload.id}`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_CATEGORY', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteCategory(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/categories/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_CATEGORY', id)
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