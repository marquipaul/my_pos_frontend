<template>
    <v-navigation-drawer
      :value="model"
      :temporary="$vuetify.breakpoint.mobile"
      app
      @input="inputModel"
      overflow
      fixed
      clipped
    >

      <v-list class="mt-n1">
        <v-list-item two-line>
            <!-- <v-list-item-avatar>
              <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460">
            </v-list-item-avatar> -->
            <v-list-item-avatar color="primary">
                <!-- <span class="white--text headline">{{currentUser.name.charAt(0)}}</span> -->
                <span class="white--text headline">{{ currentUser.name.charAt(0) }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{currentUser.name}}</v-list-item-title>
              <v-list-item-subtitle>{{currentUser.user_type}}</v-list-item-subtitle>
            </v-list-item-content>
            <!-- <v-list-item-action >
                <v-btn icon @click.stop="minimize">
                <v-icon>chevron_left</v-icon>
                </v-btn>
          </v-list-item-action> -->
          </v-list-item>
      </v-list>

    <v-list class="mt-n5" dense nav>
    <!-- dashboard menu -->
    <template v-for="(item, i) in navigations" >
      <!-- <v-divider :key="item.name"></v-divider> -->
      <v-list-item :to="item.route" router :key="i">
        <v-list-item-action>
          <v-icon>{{item.icon}}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{item.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- <v-divider></v-divider> -->
    </v-list>

    </v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            navigations: [
                {name: 'Dashboard', icon: 'mdi-view-dashboard', route: 'dashboard'},
                {name: 'Accounts', icon: 'mdi-account-multiple', route: 'accounts'},
                {name: 'Customers', icon: 'mdi-file-account', route: 'customers'},
                {name: 'Category', icon: 'mdi-format-list-checks', route: 'categories'},
                {name: 'Products', icon: 'mdi-clipboard-check', route: 'products'},
                {name: 'Product Inbound', icon: 'mdi-inbox-arrow-down', route: 'product-inbounds'},
                {name: 'Product Outbound', icon: 'mdi-inbox-arrow-up', route: 'product-outbounds'},
                {name: 'Expenses', icon: 'mdi-cash-usd', route: 'expenses'},
                {name: 'Orders', icon: 'mdi-view-list', route: 'orders'},
                {name: 'Income', icon: 'mdi-trending-up', route: 'income-report'},
                {name: 'Billing', icon: 'mdi-clipboard-text', route: 'billing'},
            ],
        }
    },
    created () {

    },
    methods: {
      inputModel(evt){
        console.log(evt)
        if (!evt) {
            this.$store.commit('SET_SIDEBAR_MODEL', false)
        }
      }
    },
    computed: {
        ...mapGetters({
            currentUser: 'currentUser',
            model: 'sidebarModel',
            mini: 'sidebarMini'
        })
    }
}
</script>
<style>

</style>