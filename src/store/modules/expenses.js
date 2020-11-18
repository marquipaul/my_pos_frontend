/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    expenses: {
        data: []
    },
};
const getters = {
    getExpenses(state) {
        return state.expenses
    }
};
const mutations = {
    SET_EXPENSES(state, payload){
        state.expenses = payload
    },
    PUSH_EXPENSE(state, payload){
        state.expenses.data.push(payload)
    },
    UPDATE_EXPENSE(state, payload) {
        let updateIndex = state.expenses.data.findIndex(item => item.id === payload.id);
        Vue.set(state.expenses.data, updateIndex, payload)
    },
    DELETE_EXPENSE(state, id) {
        let deleteIndex = state.expenses.data.findIndex(item => item.id === id);
        state.expenses.data.splice(deleteIndex, 1)
    }
};
const actions = {
    getExpenses(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/expenses', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_EXPENSES', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    addExpense(context, payload){
        return new Promise((resolve, reject) => {
            axios.post('/api/expenses', payload)
            .then(response => {
                console.log(response.data)
                if (context.state.expenses.data.length === 0) {
                    context.dispatch('getExpenses', {})
                } else {
                    context.commit('PUSH_EXPENSE', response.data)
                }
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    updateExpense(context, payload){
        return new Promise((resolve, reject) => {
            axios.put(`/api/expenses/${payload.id}`, payload)
            .then(response => {
                console.log(response.data)
                context.commit('UPDATE_EXPENSE', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    deleteExpense(context, id){
        return new Promise((resolve, reject) => {
            axios.delete(`/api/expenses/${id}`)
            .then(response => {
                console.log(response.data)
                context.commit('DELETE_EXPENSE', id)
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