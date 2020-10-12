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
  phoneNumberRegex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
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

//axios.defaults.baseURL = 'http://product-pos.test'
//axios.defaults.baseURL = 'http://192.168.1.50:8000/'
axios.defaults.baseURL = `http://${window.location.hostname}:8000/`

initialize(store, router, axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
