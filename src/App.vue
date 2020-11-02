<template>
  <v-app>
    <Header v-if="loggedIn" />
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Snackbar />
    <Sidebar v-if="loggedIn&currentUser.user_type === 'STOREADMIN'" />
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/navigation/Header'
import Sidebar from './components/navigation/Sidebar'
import Snackbar from './components/Snackbar'
export default {
  name: 'App',
  components: {
    Header,
    Sidebar,
    Snackbar
  },
    computed: {
      loggedIn(){
        return this.$store.getters.loggedIn
      },
      currentUser(){
        return this.$store.getters.currentUser
      },
      loading() {
        return this.$store.getters.isLoading
      }
    }
};
</script>
<style lang="scss">
  .v-card {
    border-radius: 7px !important;
  }
  .v-main__wrap{
    background-color: #FAFAFA;
  }

</style>