import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import {initialize} from './helpers/general';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'


Vue.config.productionTip = false

// Inputs Validation
Vue.prototype.$validate = {
  emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // Email Validator
  phoneNumberRegex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/,
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
  rules: {
      required: value => !!value || 'Required.',
      email: value => { return Vue.prototype.$validate.emailRegex.test(value) || 'Email is invalid.'; },
      password: value => { return Vue.prototype.$validate.passwordRegex.test(value) || 'Password is invalid.'; },
      mobileNumber: value => { return Vue.prototype.$validate.phoneNumberRegex.test(value) || 'Mobile number is invalid.'; }
  },
  numbersOnly(event) {
    // console.log(event);
    let keyCode = (event.keyCode ? event.keyCode : event.which);
    // console.log(keyCode); //keyCodes value
    if (keyCode < 48 || keyCode > 57) { event.preventDefault(); }
  }
}

Vue.mixin({
  methods: {
    numberWithCommas(x) {
      var parseX = parseFloat(x);
      var number = parseX.toFixed(2)
      number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return `₱${number}`
    },
    numberWithCommasR(x) {
      var parseX = parseFloat(x);
      var number = parseX.toFixed(2)
      number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return `${number}`
    },
  }
})



axios.defaults.baseURL = process.env.VUE_APP_API_URL
//axios.defaults.baseURL = 'http://product-pos.test'
//axios.defaults.baseURL = 'http://44939e9bfd8a.ngrok.io/'
//axios.defaults.baseURL = `http://${window.location.hostname}:8000/`
//axios.defaults.baseURL = 'http://islanderposapp-env.eba-i4mn5qhg.ap-southeast-1.elasticbeanstalk.com/'

console.log('BASE URL', process.env.VUE_APP_API_URL)

initialize(store, router, axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
