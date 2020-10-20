/* eslint-disable */
import axios from 'axios'
const state  = {
    overallValues: {},
};
const getters = {
    getOverallComputation(state) {
        return state.overallValues
    }
};
const mutations = {
    SET_OVERALL_COMPUTATION(state, payload) {
        state.overallValues = payload
    }
};
const actions = {
    getOverallComputation(context){
        return new Promise((resolve, reject) => {
            axios.get('/api/overall-computaiton')
            .then(response => {
                console.log(response.data)
                context.commit('SET_OVERALL_COMPUTATION', response.data)
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