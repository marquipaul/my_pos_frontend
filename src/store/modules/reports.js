/* eslint-disable */
import axios from 'axios'
const state  = {
    reportsComputation: {},
};
const getters = {
    getReportComputation(state) {
        return state.reportsComputation
    }
};
const mutations = {
    SET_ANALYTIC_COMPUTATION(state, payload) {
        state.reportsComputation = payload
    }
};
const actions = {
    getReportComputation(context, params){
        return new Promise((resolve, reject) => {
            axios.get('/api/computaiton-analytics', { params: params })
            .then(response => {
                console.log(response.data)
                context.commit('SET_ANALYTIC_COMPUTATION', response.data)
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