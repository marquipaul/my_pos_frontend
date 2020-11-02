/* eslint-disable */
import axios from 'axios'
const state  = {
    currentBilling: {},
};
const getters = {
    getCurrentBilling(state) {
        return state.currentBilling
    }
};
const mutations = {
    SET_CURRENT_BILLING(state, payload) {
        state.currentBilling = payload
    }
};
const actions = {
    getCurrentBilling(context){
        return new Promise((resolve, reject) => {
            axios.get('/api/current-bill')
            .then(response => {
                console.log(response.data)
                context.commit('SET_CURRENT_BILLING', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    }
};


export default {
    state,
    getters,
    actions,
    mutations,
}