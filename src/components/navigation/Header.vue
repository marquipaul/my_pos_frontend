<template>
    <v-app-bar
      app
    >
    <v-app-bar-nav-icon 
        v-if="currentUser.user_type === 'STOREADMIN'"
        text
        @click.stop="drawerOpen"
      >
      <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
       <v-toolbar-title class="text-uppercase">{{ currentUser.store.name }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items v-if="currentUser.user_type === 'CASHIER'">
        <v-btn to="/dashboard" icon text>
            <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>
        <v-btn to="/orders" icon text>
            <v-icon>mdi-view-list</v-icon>
        </v-btn>
        <v-btn
            @click="dialog = !dialog"
            icon 
            text 
            rounded>
                <v-badge
                :content="totalQuantity"
                :value="totalQuantity"
                color="green"
                left
                overlap
                >
            
                <v-icon >
                {{dialog? 'mdi-cart-off' : 'mdi-cart'}}
                </v-icon>
                </v-badge>
          </v-btn>
          <v-btn @click="signout()" icon text>
            <v-icon>mdi-power</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-btn @click="signout()" icon text>
          <v-icon>mdi-power</v-icon>
        </v-btn>
      </v-toolbar-items>
        <Cart class="float-right" :dialog="dialog" @close="dialog = false" />
    </v-app-bar>
</template>
<script>
import Cart from '../cashier/home/Cart'
import { mapGetters } from 'vuex'
export default {
  components: {
    Cart
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    signout() {
      this.$store.commit('SET_LOADING', true);
      this.$store.dispatch('destroyToken')
        .then(res => {
          this.$store.commit('SET_LOADING', false);
          this.snackbar('success', 'Logged Out Successfuly');
          this.$router.push('/')
          console.log(res)
        })
        .catch(error => {
          this.$store.commit('SET_LOADING', false);
          this.snackbar('success', 'Logged Out Successfuly');
          this.$router.push('/')
          console.log(error)
        })
    },
    snackbar(color, text) {
      this.$store.commit('SET_SNACKBAR', { 
        open: true, 
        color: color, 
        text: text,
        timeout: 4000
      });
    },
    drawerOpen() {
      this.$store.commit('SET_SIDEBAR_MODEL', this.sidebarModel? false : true)
    }
  },
  watch: {
    dialog: {
      handler() {
        this.$store.commit('SHOW_CART', this.dialog)
      }
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      sidebarModel: 'sidebarModel',
    }),
    cartItems() {
      return this.$store.getters['retrieveCartItems']
    },
    totalQuantity() {
      return this.cartItems.reduce((a, b) => a + (b['quantity'] || 0), 0);
    }
  }
}
</script>