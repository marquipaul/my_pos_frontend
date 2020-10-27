/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    categories: [],
    categoriesWhole: {},
};
const getters = {
    getCategories(state) {
        return state.categories
    },
    getWholeCategories(state) {
        return state.categoriesWhole
    }
};
const mutations = {
    SET_CATEGORIES(state, payload){
        state.categories = payload
    },
    SET_WHOLE_CATEGORIES(state, payload){
        state.categoriesWhole = payload
    },
    PUSH_CATEGORY(state, payload){
        var category = {
            id: payload.id,
            category: payload.title
        }
        state.categories.push(category)
    },
    PUSH_WHOLE_CATEGORY(state, payload){
        state.categoriesWhole.data.push(payload)
    },
    UPDATE_CATEGORY(state, payload) {
        let updateIndex = state.categoriesWhole.data.findIndex(item => item.id === payload.id);
        Vue.set(state.categoriesWhole.data, updateIndex, payload)
    },
    DELETE_CATEGORY(state, id) {
        let deleteIndex = state.categoriesWhole.data.findIndex(item => item.id === id);
        state.categoriesWhole.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getCategories(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/categories', { params: params })
            .then(response => {
                console.log(response.data)
                if (params.whole) {
                    context.commit('SET_WHOLE_CATEGORIES', response.data)
                } else {
                    context.commit('SET_CATEGORIES', response.data)
                }
                
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
                if (payload.whole) {
                    context.commit('PUSH_WHOLE_CATEGORY', response.data)
                } else {
                    context.commit('PUSH_CATEGORY', response.data)
                }
                
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