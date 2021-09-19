<template>
    <div>
      <p class="grey--text text--darken-1">Orders</p>
      <v-card>
        <v-card-title>
                
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
            :loading="loading"
            :headers="headers"
            :items="getOrders.data"
            :server-items-length="getOrders.total"
            :options.sync="pagination"
            :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100]}"
            class="elevation-1"
        >
        <template v-slot:item.total_amount="{ item }">
          <span>{{numberWithCommas(item.total_amount)}}</span>
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
          {{moment(item.created_at).format('llll')}}
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom v-if="currentUser.user_type == 'STOREADMIN'">
              <template  v-slot:activator="{ on }">
                <v-btn v-on="on"  :loading="sendLoading == item.id" color="primary" @click="sendRceipt(item)" icon text>
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </template>
              <span>Resend Receipt</span>
          </v-tooltip>
          <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="success" @click="viewProducts(item)" icon text>
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Show More</span>
          </v-tooltip>
          <v-tooltip bottom v-if="currentUser.user_type == 'CASHIER' && currentUser.store.enable_receipt">
              <template  v-slot:activator="{ on }">
                <v-btn v-on="on" :loading="printLoading == item.id" color="primary" @click="confirmAction({ action: 'print', data: item })" icon text>
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <span>Print Receipt</span>
          </v-tooltip>
          <v-tooltip bottom>
              <template v-if="currentUser.user_type == 'STOREADMIN'" v-slot:activator="{ on }">
                <v-btn v-on="on" v-if="currentUser.user_type == 'STOREADMIN'" color="error" @click="confirmAction({ action: 'delete', data: item })" icon text>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete Order</span>
          </v-tooltip>
        </template>
        </v-data-table>
      </v-card-text>
    </v-card>
        <List :dialog="dialog" :order="selectedOrder" @close="dialog=false" />
        <v-dialog v-model="confirmDialog.show" scrollable max-width="540" color="primary" transition="scroll-y-reverse-transition" persistent>
                <v-card>
                    <v-card-title>
                        Confirmation
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon class="dialog-close" v-on="on" @click="confirmDialog.show = false">mdi-close</v-icon>
                        </template>
                        <span>Close</span>
                    </v-tooltip>
                    </v-card-title>
                    <v-card-text v-if="confirmDialog.action == 'print'">
                      <p class="headline text-center py-4">Please select printer option</p>
                    </v-card-text>
                    <v-card-text v-else class="d-flex flex-column align-center justify-center px-9 py-4">
                        <p class="headline text-center py-4">{{ `${(confirmDialog.action == 'edit') ? 'Are you sure you want to edit' : 'Are you sure you want to delete order'}` }} {{ `${(confirmDialog.data) ? `${confirmDialog.data.order_code}?` : ''}` }}</p>
                        <p class="caption mt-n6">Please enter the Order Number for Confirmation</p>
                        <v-text-field
                          class="mt-n2"
                          solo
                          type="number"
                          v-model="delete_order_code"
                          label="Order Number"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions v-if="confirmDialog.action == 'print'" class="pa-5">
                        <v-row align="center" justify="center">
                            <v-col cols="12" class="d-flex justify-center pb-0">
                                <v-btn class="confirm-btn btn-min-width white--text mx-1" depressed large color="#2F80ED" @click="action({ action: 'receipt', data: confirmDialog.data });">Print Receipt</v-btn>
                                <v-btn class="confirm-btn btn-min-width white--text mx-1" depressed large color="#2F80ED" @click="action({ action: 'order', data: confirmDialog.data });">Print Order</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                    <v-card-actions v-else class="pa-5">
                        <v-row align="center" justify="center">
                            <v-col cols="12" class="d-flex justify-center pb-0">
                                <v-btn :disabled="delete_order_code != confirmDialog.data.order_code" class="confirm-btn btn-min-width white--text" depressed large :color="((confirmDialog.action == 'edit') ? '#2F80ED' : '#EB5757')" @click="action({ action: confirmDialog.action, data: confirmDialog.data });">{{ `${(confirmDialog.action == 'edit') ? 'Confirm' : 'Delete'}` }}</v-btn>

                                <v-btn class="btn-min-width" text large @click="confirmDialog.show = false">Cancel</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <ReceiptPrinter v-bind="printerState" @done="donePrinting" />
    </div>
</template>
<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import moment from 'moment';
import _ from "lodash";
import List from '../components/orders/Products'
  import ReceiptPrinter from '../components/ReceiptPrinter'
export default {
  components: { List, ReceiptPrinter },
    data () {
      return {
        delete_order_code: '',
        confirmDialog : { show: false, action: '', data: {} },
        moment: moment,
        selectedOrder: {},
        dialog: false,
        search: '',
        pagination: {},
        headers: [
          { text: 'Order Code', value: 'order_code' },
          { text: 'Invoice Number', value: 'full_invoice_number' },
          {
            text: 'Customer',
            align: 'start',
            sortable: false,
            value: 'customer_name',
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
        loading: false,
        sendLoading: undefined,
        printLoading: undefined,
        printerState: { print: false, data: {} },
      }
    },
    // mounted() {
    //   this.getDataFromApi();
    // },
    watch: {
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
      printReceipt(order, action) {
        console.log(order)
        this.printLoading = order.id;
        this.$store.dispatch('getOrderReceipt', {id: order.customer_id, code: order.order_code})
          .then(response => {
            response.data.customer = order.customer_name;
            response.data.order_type = order.order_type;
            response.data.type = action;
            response.data.orders = response.data.products;
            console.log(response.data)
            this.printerState = { print: true, data: response.data }
          })
          .catch(error => {
            console.log(error)
            this.printLoading = undefined;
            this.snackbar('error', 'Something went wrong');
          })
      },
      donePrinting() {
        this.printerState = { ...this.printerState, print: false, data: {} }
        this.printLoading = undefined;
      },
      confirmAction({ action, data }) {
        this.confirmDialog = { show: true, action, data };
        },
      action({ action, data }) {
            // console.log(action, data);
            switch (action) {
                case 'add':
                    this.userFormDialog = { show: true, action, data: {} };
                    break;
                case 'edit':
                    this.confirmDialog.show = false;
                    this.userFormDialog = { show: true, action, data }
                    break;
                case 'delete':
                    this.confirmDialog.show = false;
                    this.deleteOrder();
                    break;
                case 'receipt':
                    this.confirmDialog.show = false;
                    this.printReceipt(data, action);
                    break;
                case 'order':
                    this.confirmDialog.show = false;
                    this.printReceipt(data, action);
                    break;
            }
        },
        deleteOrder() {
            console.log(this.confirmDialog)
            this.loading = true
            this.$store.dispatch('deleteOrder', this.confirmDialog.data.id)
                .then(res => {
                    this.loading = false
                    this.delete_order_code = ''
                    console.log(res)
                    this.snackbar('success', 'Order Successfully Deleted');
                })
                .catch(error => {
                    this.loading = false
                    console.log(error)
                    this.snackbar('error', 'Something went wrong');
                })
        },
      viewProducts(item) {
        this.dialog = true;
        this.selectedOrder = item;
      },
      sendRceipt(order) {
        this.sendLoading = order.id;
        this.$store.dispatch('addMessageReceipt', { order_id: order.id })
          .then(res => {
            console.log(res)
            this.sendLoading = undefined;
            this.snackbar('success', 'Message Sent Successfully');
          })
          .catch(error => {
            if (error.response.status == 403) {
              this.snackbar('error', error.response.data);
            } else {
              this.snackbar('error', 'Something went wrong');
            }
            this.sendLoading = undefined;
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
          let params = {
            search: this.search,
            cashier: true,
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
      currentUser: 'currentUser',
    })
  },
  }
</script>