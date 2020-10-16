<template>
    <div>
        <v-data-table
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
        <template v-slot:item.order_status="{ item }">
          <v-switch
            :loading="item.id === form.id"
            @change="orderStatus(item)"
            inset
            :input-value="item.order_status==='RECEIVED'? true : false"
          ></v-switch>
        </template>
        <template v-slot:item.payment_status="{ item }">
          <v-switch
            :loading="item.id === form.id"
            @change="paymentStatus(item)"
            inset
            :input-value="item.payment_status==='PAID'? true : false"
          ></v-switch>
        </template>
        <template v-slot:item.product_count="{ item }">
          <span>{{item.products.length}} Product(s)</span>
        </template>
        <template v-slot:item.created_at="{ item }">
          <span>{{formatDate(item.created_at)}}</span>
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
import List from '../components/orders/Products'
export default {
  components: { List },
    data () {
      return {
        selectedOrder: {},
        dialog: false,
        pagination: {},
        headers: [
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
        first: true
      }
    },
    mounted() {
      this.getDataFromApi();
    },
    watch: {
      pagination: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
    },
    methods: {
      formatDate(date) {
        var todate=new Date(date).getDate();
        var tomonth=new Date(date).getMonth()+1;
        var toyear=new Date(date).getFullYear();

        let unix_timestamp = new Date(date).getTime();
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var dateTime = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var hours = dateTime.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + dateTime.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + dateTime.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        var original_date=tomonth+'/'+todate+'/'+toyear+' '+formattedTime;
        return original_date;
      },
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
        this.$store.commit('SET_LOADING', true);
        //const { sortBy, sortDesc, page, itemsPerPage } = this.pagination

          if (this.first) {
            this.pagination.sortBy[0]='created_at'
            this.pagination.sortDesc[0]=true
          }

          this.first = false
          let params = {
            cashier: true,
            page: this.pagination.page,
            per_page: this.pagination.itemsPerPage,
            sort_by: this.pagination.sortBy[0],
            sort_order: this.pagination.sortDesc[0]? 'DESC' : 'ASC',
          }
        this.$store.dispatch('getOrders', params)
          .then(res => {
            this.$store.commit('SET_LOADING', false);
            console.log(res)
          })
          .catch(error => {
            this.$store.commit('SET_LOADING', false);
            console.log(error)
          })
      }
    },
    computed: {
    ...mapGetters({
      getOrders: 'getOrders'
    })
  },
  }
</script>