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
            //primary: '#6890ba',
            primaryBackgroundColor: '#FFFFFF',
            secondaryBackgroundColor: '#F3F5F8'
        },
        dark: {
            primaryBackgroundColor: '#323B5F',
            secondaryBackgroundColor: '#212746'
        }
    }
}
});
