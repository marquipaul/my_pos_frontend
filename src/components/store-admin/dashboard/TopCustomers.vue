<template>
        <v-card :loading="loading">
            <v-card-title  class="grey--text text--darken-2">
                Top {{ limit }} Customers
                <v-spacer></v-spacer>
                <v-row v-if="filter">
                  <v-col cols="12" xl="4" lg="4" md="12" sm="12" xs="12">
                    <v-text-field v-model="limit" type="number" max="10" label="Rank Limit"></v-text-field>
                  </v-col>
                  <v-col cols="12" xl="5" lg="5" md="12" sm="12" xs="12">
                    <v-text-field v-model="minimum" type="number" label="Minimum Amount"></v-text-field>
                  </v-col>
                  <v-col cols="12" xl="3" lg="3" md="12" sm="12" xs="12">
                    <v-btn small :loading="loading" @click="getDataFromAPI()" block color="success">Filter</v-btn>
                    <v-btn @click="filter = false" color="error" small block>Cancel</v-btn>
                  </v-col>
                </v-row>
                <v-btn v-if="!filter" small :loading="loading" @click="filter = true" color="success">Filter</v-btn>
            </v-card-title>
            <v-card-text>
                <v-simple-table :loading="loading">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Rank
                      </th>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Mobile Number
                      </th>
                      <th class="text-left">
                        Total Purchased Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in getCustomers"
                      :key="i"
                    >
                      <td>{{ i+1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.mobile_number? item.mobile_number : 'N/A'}}</td>
                      <td>₱ {{ item.total_amount }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
        </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: ['reload'],
    
    data () {
      return {
        loading: false,
        filter: false,
        limit: 10,
        minimum: 200
      }
    },
    mounted() {
      this.getDataFromAPI();
    },
    watch: {
      reload: {
        handler() {
          this.getDataFromAPI()
        },
        deep: true
      }
    },
    methods: {
      getDataFromAPI() {
        this.loading = true

          this.first = false
          let params = {
            ranking: true,
            limit: this.limit,
            minimum_amount: this.minimum
          }
        this.$store.dispatch('getCustomers', params)
          .then(res => {
              this.loading = false
            console.log(res)
          })
          .catch(error => {
              this.loading = false
            console.log(error)
          })
      }
    },
    computed: {
        ...mapGetters({
            getCustomers: 'getCustomers'
        })
    },
}
</script>