<template>
    <div>
      <p class="grey--text text--darken-1">List of Orders</p>

        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="getOrders.data"
            :server-items-length="getOrders.total"
            :options.sync="pagination"
            :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100]}"
            class="elevation-1"
        >
        <template v-slot:item.customer="{ item }">
          <span>{{item.customer? item.customer.name : 'N/A'}}</span>
        </template>
        <template v-slot:item.total_amount="{ item }">
          <span>{{numberWithCommas(item.total_amount)}}</span>
        </template>
        <template v-slot:item.product_count="{ item }">
          <span>{{item.products.length}} Product(s)</span>
        </template>
        <template v-slot:item.created_at="{ item }">
          {{moment(item.created_at).format('llll')}}
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn @click="viewProducts(item)" icon text>
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
        </v-data-table>
        <List :dialog="dialog" :order="selectedOrder" @close="dialog=false" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment';
import _ from "lodash";
import List from './List'
export default {
  components: { List },
    data () {
      return {
        moment: moment,
        selectedOrder: {},
        dialog: false,
        search: '',
        pagination: {},
        headers: [
          { text: 'Order Code', value: 'order_code' },
          {
            text: 'Customer',
            align: 'start',
            sortable: false,
            value: 'customer',
          },
          { text: 'Product Count', value: 'product_count' },
          { text: 'Total Amount', value: 'total_amount' },
          { text: 'Transaction Type', value: 'transaction_type' },
          { text: 'Received', value: 'order_status' },
          { text: 'Paid', value: 'payment_status' },
          { text: 'Purchased Date', value: 'created_at' },
          { text: 'Action', value: 'action' },
        ],
        form: {},
        first: true,
        loading: false
      }
    },
    // mounted() {
    //   this.getDataFromApi();
    // },
    watch: {
      getParams: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      pagination: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      search: _.debounce(
        function() {
            this.getDataFromApi();
        },
        800,
        {
            leading: true,
            trailing: true
        }
      ),
    },
    methods: {
      viewProducts(item) {
        this.dialog = true;
        this.selectedOrder = item;
      },
      orderStatus(item) {
        item.order_status = item.order_status==='PENDING'? 'RECEIVED' : 'PENDING';
        console.log(item)
        this.updateStatus(item)
      },
      paymentStatus(item) {
        item.payment_status = item.payment_status==='UNPAID'? 'PAID' : 'UNPAID';
        console.log("ITEM", item)
        
        this.updateStatus(item)
      },
      updateStatus(item) {
        this.form = {
          id: item.id,
          order_status: item.order_status,
          payment_status: item.payment_status,
        }
        this.$store.dispatch('updateOrderStatus', this.form)
          .then(res => {
            console.log(res)
            setTimeout(() => {
              this.form = {}
            }, 1000);
            
          })
      },
      getDataFromApi() {
        this.loading = true
        //const { sortBy, sortDesc, page, itemsPerPage } = this.pagination

          if (this.first) {
            this.pagination.sortBy[0]='created_at'
            this.pagination.sortDesc[0]=true
          }

          this.first = false
          let params = { //getParams
            start_date: this.getParams.start_date,
            end_date: this.getParams.end_date,
            product_id: this.getParams.product_id,
            category_id: this.getParams.category_id,
            report: true,
            page: this.pagination.page,
            per_page: this.pagination.itemsPerPage,
            sort_by: this.pagination.sortBy[0],
            sort_order: this.pagination.sortDesc[0]? 'DESC' : 'ASC',
          }
        this.$store.dispatch('getOrders', params)
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
      getOrders: 'getOrders',
      getParams: 'getAnalyticParams'
    })
  },
  }
</script>