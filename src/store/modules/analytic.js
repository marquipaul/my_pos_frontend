/* eslint-disable */
import axios from 'axios'
const state  = {
    analyticComputation: {},
    analyticParams: {}
};
const getters = {
    getAnalyticComputation(state) {
        return state.analyticComputation
    },
    getAnalyticParams(state) {
        return state.analyticParams
    }
};
const mutations = {
    SET_ANALYTIC_COMPUTATION(state, payload) {
        state.analyticComputation = payload
    },
    SET_ANALYTIC_PARAMS(state, payload) {
        state.analyticParams = payload
    }
};
const actions = {
    getAnalyticComputation(context, params){
        return new Promise((resolve, reject) => {
            context.commit('SET_ANALYTIC_PARAMS', params)
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