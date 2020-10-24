<template>
        <v-card :loading="loading">
            <v-card-title class="grey--text text--darken-2">
                Low Stocks
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-data-table
                    
                    :headers="headers"
                    :items="getAdminProducts.data"
                    :server-items-length="getAdminProducts.total"
                    :options.sync="pagination"
                    :footer-props="{ 'items-per-page-options': [5, 10]}"
                    class="elevation-1"
                >
                <template v-slot:item.created_at="{ item }">
                    {{moment(item.created_at).format('llll')}}
                </template>
                <template v-slot:item.unit_quantity="{ item }">
                <v-chip small>
                    {{item.unit_quantity}} {{item.unit}}
                </v-chip>
                </template>
                <template v-slot:item.category="{ item }">
                <v-chip small>
                    {{item.category.title}}
                </v-chip>
                </template>
                <template v-slot:item.cost_price="{ item }">
                    ₱{{item.cost_price}}
                </template>
                <template v-slot:item.wholesale_price="{ item }">
                    ₱{{item.wholesale_price}}
                </template>
                <template v-slot:item.retail_price="{ item }">
                    ₱{{item.retail_price}}
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from "lodash";
import moment from 'moment';
export default {
  props: ['reload'],
    data () {
      return {
        moment: moment,
        loading: false,
        search: '',
        dialog: false,
        viewInfo: false,
        product: {},
        pagination: {},
        headers: [
          { text: 'Item Code', value: 'item_code' },
          { text: 'Description', value: 'description' },
          { text: 'Category', value: 'category', sortable: false },
          { text: 'Unit Quantity', value: 'unit_quantity' },
          { text: 'Quantity', value: 'quantity' },
          { text: 'Cost Price', value: 'cost_price' }
        ],
        first: true
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
      },
      pagination: {
        handler () {
          this.getDataFromAPI()
        },
        deep: true
      },
      search: _.debounce(
        function() {
            this.getDataFromAPI();
        },
        800,
        {
            leading: true,
            trailing: true
        }
      ),
    },
    methods: {
      getDataFromAPI() {
        this.loading = true
          if (this.first) {
            this.pagination.sortBy[0]='quantity'
            this.pagination.sortDesc[0]=true
          }

          this.first = false
          let params = {
            minimumstock: true,
            search: this.search,
            page: this.pagination.page,
            per_page: this.pagination.itemsPerPage,
            sort_by: this.pagination.sortBy[0],
            sort_order: this.pagination.sortDesc[0]? 'DESC' : 'ASC',
          }
        this.$store.dispatch('getAdminProducts', params)
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
            getAdminProducts: 'getAdminProducts'
        })
    },
}
</script>