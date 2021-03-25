<template>
  <div>
    <v-form ref="form">
      <v-list
          two-line
          subheader
        >
          <v-subheader>
            Customer Details
          <v-spacer></v-spacer>
          <v-btn 
            @click="registerCustomer = !registerCustomer" 
            x-small
            :class="registerCustomer? 'error darken-1 mt-n1' : 'success darken-1 mt-n1'"
            >
            {{registerCustomer? 'Cancel' : 'Register a Customer'}}
            
          </v-btn>
          </v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Registered Customer</v-list-item-title>
                <v-list-item-subtitle>
                    <v-autocomplete
                      name="customer"
                      ref="customer"
                      v-model="customer_id"
                      :items="customers"
                      placeholder="Select a Customer"
                      item-text="name"
                      item-value="id"
                      dense
                      :loading="loading"
                      :rules="[$validate.rules.required]"
                    ></v-autocomplete>
                </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
      </v-list>
      <!-- Create customer -->
      <CreateCustomer v-if="registerCustomer" @setCustomerID="setCustomerID" @close="registerCustomer = false" />
      <v-divider></v-divider>
        <v-list
          two-line
          subheader
        >
          <v-subheader>Order Details</v-subheader>
          <v-list-item v-if="currentUser.store.mode === 'RESTAURANT'">
            <v-list-item-content>
              <v-list-item-title>DINE-IN/TAKE-OUT</v-list-item-title>
                <v-list-item-subtitle>
                    <v-radio-group
                        v-model="form.order_type"
                        row
                        dense
                        >
                        <v-radio
                            label="DINE-IN"
                            value="DINE-IN"
                        ></v-radio>
                        <v-radio
                            label="TAKE-OUT"
                            value="TAKE-OUT"
                        ></v-radio>
                        </v-radio-group>
                </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="currentUser.store.mode == 'RESTAURANT'? form.order_type == 'TAKE-OUT' : true">
            <v-list-item-content>
              <v-list-item-title>Transaction Type</v-list-item-title>
                <v-list-item-subtitle>
                    <v-radio-group
                        v-model="form.transaction_type"
                        row
                        dense
                        >
                        <v-radio
                            label="PICKUP"
                            value="PICKUP"
                        ></v-radio>
                        <v-radio
                            label="DELIVERY"
                            value="DELIVERY"
                        ></v-radio>
                        </v-radio-group>
                </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Order Status</v-list-item-title>
                <v-list-item-subtitle>
                    <v-radio-group
                        v-model="form.order_status"
                        row
                        dense
                        >
                        <v-radio
                            label="PENDING"
                            value="PENDING"
                        ></v-radio>
                        <v-radio
                            label="RECEIVED"
                            value="RECEIVED"
                        ></v-radio>
                        <!-- <v-radio
                            label="CANCELLED"
                            value="CANCELLED"
                        ></v-radio> -->
                        </v-radio-group>
                </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Payment Status</v-list-item-title>
                <v-list-item-subtitle>
                    <v-radio-group
                        v-model="form.payment_status"
                        row
                        dense
                        >
                        <v-radio
                            label="PAID"
                            value="PAID"
                        ></v-radio>
                        <v-radio
                            label="UNPAID"
                            value="UNPAID"
                        ></v-radio>
                        </v-radio-group>
                </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          three-line
          subheader
        >
          <v-subheader>
              Ordered Items
              <v-spacer></v-spacer>
            <v-btn class="grey--text text--darken-1" text x-small @click="clearOrder()">Clear Order</v-btn>
          </v-subheader>
            <v-simple-table dense>
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-left">
                        Description
                    </th>
                    <th class="text-left" width="40%">
                        Quantity
                    </th>
                    <th class="text-left">
                        Price
                    </th>
                    <th class="text-left">
                        Amount
                    </th>
                    <th class="text-left">
                        Action
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="(item, index) in cartItems"
                    :key="index"
                    >
                    <td>{{ item.description }}</td>
                    <td>
                      <v-text-field
                        style="font-size: 0.8rem;"
                        v-model="item.quantity"
                        type="number"
                        min="1"
                        @input="computeAmount(item)"
                        @keypress="checkValidValue"
                        outlined
                        dense
                      ></v-text-field>
                    </td>
                    <td>{{ numberWithCommas(item.price) }}</td>
                    <td>{{ numberWithCommas(item.amount) }}</td>
                    <td>
                      <v-btn
                        icon
                        color="success"
                        x-small
                        @click="addQuantity(item)"
                        :disabled="checkValidQuantity(item)"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        color="error"
                        x-small
                        @click="deductQuantity(item)"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </v-list>
        <v-list>
            <v-list-item>
                <v-text-field
                    label="Total Amount"
                    type="number"
                    v-model="totalAmount"
                ></v-text-field>
            </v-list-item>
            <v-list-item>
                <v-text-field
                    :rules="[$validate.rules.required]"
                    label="Cash Tenered"
                    type="number"
                    v-model="form.cash_tenered"
                ></v-text-field>
            </v-list-item>
            <v-list-item>
                <v-text-field
                    label="Change Amount"
                    type="number"
                    readonly
                    v-model="change_amount"
                ></v-text-field>
            </v-list-item>
            <p v-if="changeStatus" class="px-2 text-center caption red--text">Paid Amount must be equal or higher than the total amount</p>
            <v-list-item v-if="currentUser.store.mode == 'RESTAURANT'">
                <v-btn :disabled="cartItems.length == 0" class="warning" :loading="loadingCart" block @click="printOrders()">
                    Print Orders
                </v-btn>
            </v-list-item>
            <v-list-item>
                <v-btn :disabled="verifyCart()" class="primary" block @click="checkOut()">
                    Check Out ₱{{totalAmount}}
                </v-btn>
            </v-list-item>
            <v-list-item v-if="getDeviceType() != 'desktop'">
                <ReceiptPrinter v-bind="printerState" @done="printDone()" />
            </v-list-item>
        </v-list>
    </v-form>
  </div>
</template>
<script>
/* eslint-disable */
  import { mapGetters } from 'vuex'
  import CreateCustomer from '../../../CreateCustomer'
  import ReceiptPrinter from '../../../ReceiptPrinter'
  export default {
    components: {
      CreateCustomer,
      ReceiptPrinter
    },
    data () {
      return {
        registerCustomer: false,
        dialog: false,
        form: {
            transaction_type: 'PICKUP',
            order_status: 'RECEIVED',
            payment_status: 'PAID',
            order_type: 'DINE-IN',
            cash_tenered: 0
        },
        customer_id: undefined,
        loading: false,
        loadingCart: false,
        changeStatus: false,
        printerState: { print: false, data: {} },
      }
    },
    mounted() {
      this.getDataFromAPI();
    },
    methods: {
      printOrders() {
          this.loadingCart = true;
          let index = this.customers.findIndex(item => item.id === this.customer_id);
          var data = {
            customer: this.customer_id? this.customers[index].name : 'N/A',
            orders: this.cartItems,
            order_type: this.form.order_type,
            type: 'order'
          }
          this.printerState = { print: true, data: data }
      },
      printDone() {
        this.printerState = { ...this.printerState, print: false, data: {} }
        this.loadingCart = false;
      },
      getDeviceType() {
          const ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
          }
          if (
            /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
              ua
            )
          ) {
            return "mobile";
          }
          return "desktop";
      },
      verifyCart() {
        this.changeStatus = this.form.cash_tenered < this.totalAmount;
        var cartStatus = this.cartItems.length<1;
        if (!cartStatus&!this.changeStatus) {
          if (cartStatus!=this.changeStatus) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      },
      getDataFromAPI() {
        this.loading = true
        var params = {
          cashier: true
        }
        this.$store.dispatch('getCustomers', params)
          .then(res => {
            this.loading = false
          })
          .catch(error => {
            console.log(error)
            this.loading = false
          })
      },
      setCustomerID(evt) {
        this.customer_id = evt;
      },
      addQuantity(item) {
        this.$store.dispatch('addQuantity', item)
      },
      computeAmount(item) {
        item.quantity = parseInt(item.quantity)
        this.$store.commit('COMPUTE_AMOUNT', item)
      },
      checkValidValue(e) {
        //setTimeout(() => {
          console.log('Checking Zero', e.target.value)
          if (e.target.value.charAt(0) == 0 && e.keyCode == 48) {
            return e.preventDefault();
          }
        //}, 10);
        console.log('Checking', e.target.value, e)
        if(!((e.keyCode > 95 && e.keyCode < 106)
          || (e.keyCode > 47 && e.keyCode < 58) 
          || e.keyCode == 8)) {
            return e.preventDefault();
        }
      },
      deductQuantity(item) {
        this.$store.dispatch('deductQuantity', item)
      },
      checkOut() {
        var status = this.$refs.form.validate();
        if (status) {
          this.$emit('close')
          this.$store.commit('SET_LOADING', true);
            var form = {
              customer_id: this.customer_id,
              transaction_type: this.form.transaction_type,
              order_status: this.form.order_status,
              cash_tenered: this.form.cash_tenered,
              payment_status: this.form.payment_status,
              order_type: this.form.order_type,
              products: this.cartItems
            }
            this.$store.dispatch('placeOrder', form)
              .then(response => {
                console.log(response)
                if (response.status === 200) {
                  response.data.type = 'receipt'
                  this.printerState = { print: true, data: response.data }
                }
                this.$store.commit('SET_LOADING', false);
                this.clearOrder();
                this.defaulData();
                this.resetValidation();
                //Update Item's quantity
                this.$store.dispatch('getProducts')
                this.snackbar('success', 'Order Successfully Purchased');
              })
              .catch(error => {
                this.$store.commit('SET_LOADING', false);
                console.log(error)
                this.snackbar('error', 'Something went wrong');
              })
        }
      },
      resetValidation () {
            this.$refs.form.resetValidation()
        },
      clearOrder() {
          this.$store.commit('CLEAR_PRODUCTS');
      },
      defaulData() {
        this.form = {
            transaction_type: 'PICKUP',
            order_status: 'RECEIVED',
            payment_status: 'PAID',
            cash_tenered: 0
        }
        this.customer_id = undefined;
      },
      checkValidQuantity(item) {
        if (item.price_type === 'RETAIL') {
          var status = item.current_quantity === item.quantity;
        } else {
          //var current_quantity = item.current_quantity
          status =  item.current_quantity < item.quantity+item.minimum_wholesale_order;
        }
        return status;
        
      },
      snackbar(color, text) {
          this.$store.commit('SET_SNACKBAR', { 
              open: true, 
              color: color, 
              text: text,
              timeout: 4000
          });
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'currentUser'
      }),
      change_amount() {
        var amount = this.form.cash_tenered - this.totalAmount;
        if (amount < 0) {
          return 0;
        } else {
          return amount;
        }
      },
      customers() {
        return this.$store.getters['getCustomers']
      },
      cartItems() {
        return this.$store.getters['retrieveCartItems']
      },
      totalAmount() {
        return this.cartItems.reduce((a, b) => a + (b['amount'] || 0), 0);
      }
    }
  }
</script>
<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>