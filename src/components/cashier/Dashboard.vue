<template>
  <div class="home">
      <v-row>
        <v-col :cols="$vuetify.breakpoint.mobile? '12' : showCart? '9' : '12'">
          <Items />
        </v-col>
        <v-col v-if="!$vuetify.breakpoint.mobile&showCart" md="3" sm="12" xs="12">
          <v-card>
            <MainCart />
          </v-card>
        </v-col>
      </v-row>
  </div>
</template>

<script>
import Items from './home/Items'
import MainCart from './home/cart/Main'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      cart: true
    }
  },
  components: {
    Items,
    MainCart
  },
  computed: {
    ...mapGetters({
      showCart: 'showCart'
    })
  }
}
</script>
