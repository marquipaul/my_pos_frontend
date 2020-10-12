<template>
  <v-app>
    <Header v-if="loggedIn" />
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Snackbar />
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/navigation/Header'
import Snackbar from './components/Snackbar'
export default {
  name: 'App',
  components: {
    Header,
    Snackbar
  },
  data: () => ({
    //
  }),
    computed: {
      loggedIn(){
        return this.$store.getters.loggedIn
      },
      loading() {
        return this.$store.getters.isLoading
      }
    }
};
</script>
