<template>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card flat outlined>
                <v-card-text class="text-center display-1 grey--text text--darken-4 font-weight-light">{{order.store.name}}</v-card-text>
                <v-card-text class="text-center ">
                    <p class="headline font-weight-light grey--text text--darken-2">Your Order</p>
                    <p class="subtitle-1 font-weight-light grey--text">{{moment(order.created_at).format('llll')}}</p>
                    <v-card-text class="mt-n7">
                    <v-simple-table dense>
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-left subtitle-1">
                                Order #
                            </th>
                            <th class="text-right subtitle-1">
                                {{order.order_code}}
                            </th>
                            </tr>
                        </thead>
        
                        <tbody>
                            <tr
                            v-for="item in order.products"
                            :key="item.name"
                            >
                            <td class="text-left">
                              {{ item.description }}
                              <span class="caption grey--text">{{ item.quantity }} x ₱{{ item.amount }}</span>
                            </td>
                            <td class="text-right">₱{{ numberWithCommas(item.total_amount) }}</td>
                            </tr>
                            <!-- <tr class="grey--text">
                            <td class="text-left">Subtotal (12% Vatable)</td>
                            <td class="text-right">₱{{ numberWithCommas(order.total_amount-(order.total_amount*0.12)) }}</td>
                            </tr>
                            <tr class="grey--text">
                            <td class="text-left">Plus 12% VAT</td>
                            <td class="text-right">₱ {{ numberWithCommas(order.total_amount*0.12) }}</td>
                            </tr> -->
                            <tr>
                            <td class="text-left font-weight-bold">TOTAL</td>
                            <td class="text-right font-weight-bold">₱{{numberWithCommas(order.total_amount)}}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                        <v-divider></v-divider>
                    </v-card-text>
                </v-card-text>
            </v-card>
          </v-col>
        </v-row>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
  export default {
    data() {
      return {
        moment: moment,
        order: {},
      }
    },
    mounted() {
      console.log(this.$route.params)
      if (this.$route.params.id&&this.$route.params.code) {
        this.getReceipt()
      }
    },
    methods: {
      getReceipt() {
        this.$store.dispatch('getOrderReceipt', this.$route.params)
          .then(response => {
            console.log(response)
            this.order = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      numberWithCommas(x) {
        //Monday, Dec 28 2015 at 4:13pm
        var number = x.toFixed(2)
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
    }

  }
</script>