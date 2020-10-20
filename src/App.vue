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
  data: () => ({
    //
  }),
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
<style>
    /* width */
    ::-webkit-scrollbar {
        width:10px;
        padding-left:10px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        display: none;
        
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #757575;
        border-radius: 50px;
        display: block;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #616161;
        display: block;
    }
  .v-card {
    border-radius: 14px !important;
  }
</style>