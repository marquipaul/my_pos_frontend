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
                <v-card-text class="text-center display-1 grey--text text--darken-4 font-weight-light">{{ order.store? order.store.name : '' }}</v-card-text>
                <v-card-text class="text-center">
                  <p class="subtitle-1 font-weight-light grey--text mt-n5 px-5">{{ order.store? order.store.address : '' }}</p>
                  <p class="subtitle-1 font-weight-light grey--text mt-n4">TIN# {{ order.store? order.store.tin_number : '' }}</p>
                <div class="px-16">
                  <v-divider class="mt-n2"></v-divider>
                </div>
                </v-card-text>
                <v-card-text class="text-center mt-n6">
                    <p class="title font-weight-light grey--text text--darken-2">Sales Receipt</p>
                    <p class="subtitle-1 font-weight-light grey--text">{{moment(order.created_at).format('llll')}}</p>
                    <v-card-text class="mt-n7">
                      <v-divider></v-divider>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                              <tr>
                              <th class="text-left subtitle-1">
                                  SI #
                              </th>
                              <th class="text-right subtitle-1">
                                  {{order.full_invoice_number}}
                              </th>
                              </tr>
                          </thead>
                        </template>
                      </v-simple-table>
                      <v-simple-table dense>
                          <template v-slot:default>
                          <tbody>
                              <tr
                              v-for="item in order.products"
                              :key="item.id"
                              >
                              <td class="text-left">
                                {{ item.description }}
                                <span class="caption grey--text">{{ item.quantity }} x {{ numberWithCommas(item.amount) }}</span>
                              </td>
                              <td class="text-right">{{ numberWithCommas(item.total_amount) }}</td>
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
                              <td class="text-right font-weight-bold">{{numberWithCommas(order.total_amount)}}</td>
                              </tr>
                          </tbody>
                          </template>
                      </v-simple-table>
                        <v-divider></v-divider>

                        <p class="body-2 mt-8 font-weight-light grey--text">This will serve as your Offical Receipt</p>
                        <p class="body-2 mt-n3 font-weight-light grey--text">BIR PERMIT NO. 000-00A-000000-000</p>
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
      }
    }

  }
</script>