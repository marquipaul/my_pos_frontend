import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
        customProperties: true
    },
    themes: {
        light: {
            primary: '#a11ba9',
            primaryBackgroundColor: '#FFFFFF',
            secondaryBackgroundColor: '#F3F5F8'
        },
        dark: {
            primary: '#a11ba9',
            primaryBackgroundColor: '#323B5F',
            secondaryBackgroundColor: '#212746'
        }
    }
}
});
