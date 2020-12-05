<template>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="3"
          >
          <v-sheet v-if="loading" :color="`grey lighten-4`">
            <v-skeleton-loader
              type="card-heading, divider, list-item-three-line, divider, list-item-three-line, divider, list-item-three-line, divider, list-item-three-line, divider, list-item-three-line, divider, list-item-three-line"
            ></v-skeleton-loader>
          </v-sheet>

            <v-card id="my-receipt" flat outlined v-else-if="!loading&&order.store">
                <v-card-text class="text-center display-1 grey--text text--darken-4 font-weight-light">{{ order.store? order.store.name : '' }}</v-card-text>
                <v-card-text class="text-center">
                  <p class="subtitle-1 font-weight-light grey--text mt-n5 px-5">{{ order.store? order.store.address : '' }}</p>
                  <p v-if="order.store.enable_tin" class="subtitle-1 font-weight-light grey--text mt-n4">TIN# {{ order.store? order.store.tin_number : '' }}</p>
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
                                  Receipt #
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
                              <tr v-if="order.store.enable_tax" class="grey--text">
                              <td class="text-left">Subtotal ({{order.store.tax_percentage}}% Vatable)</td>
                              <td class="text-right">{{ numberWithCommas(order.total_amount-(order.total_amount*(order.store.tax_percentage/100))) }}</td>
                              </tr>
                              <tr v-if="order.store.enable_tax" class="grey--text">
                              <td class="text-left">Plus {{order.store.tax_percentage}}% VAT</td>
                              <td class="text-right">{{ numberWithCommas(order.total_amount*(order.store.tax_percentage/100)) }}</td>
                              </tr>
                              <tr>
                              <td class="text-left font-weight-bold">TOTAL AMOUNT</td>
                              <td class="text-right font-weight-bold">{{numberWithCommas(order.total_amount)}}</td>
                              </tr>
                              <tr v-if="order.cash_tenered">
                              <td class="text-left">TENDERED AMOUNT</td>
                              <td class="text-right">{{numberWithCommas(order.cash_tenered)}}</td>
                              </tr>
                              <tr v-if="order.cash_tenered">
                              <td class="text-left">CAHNGE AMOUNT</td>
                              <td class="text-right">{{numberWithCommas(order.cash_tenered-order.total_amount)}}</td>
                              </tr>
                          </tbody>
                          </template>
                      </v-simple-table>
                        <v-divider></v-divider>

                        <p class="body-2 mt-8 font-weight-light grey--text">This will serve as your Offical Receipt</p>
                        <p v-if="order.store.enable_bir" class="body-2 mt-n3 font-weight-light grey--text">BIR PERMIT NO. {{order.store.bir_number}}</p>
                        <p class="body-2 mt-8 font-weight-light grey--text">This Official Receipt shall be valid for Five(5) years from the date of permit to use.</p>
                        <div v-if="order.store.show_contact">
                          <p class="body-2 font-weight-light grey--text">If you have any questions, contact us at</p>
                          <p class="mt-n3"><a :href="`mailto:${order.store.store_contact_email}`">{{order.store.store_contact_email}}</a></p>
                          <p class="body-2 mt-n4 font-weight-light grey--text">------ OR ------</p>
                          <p class="mt-n4"><a :href="`sms:${order.store.store_contact_number}`">{{order.store.store_contact_number}}</a></p>
                        </div>
                    </v-card-text>
                </v-card-text>
            </v-card>
            <v-card v-if="error" flat outlined>
              <v-card-text class="text-center display-1 grey--text text--darken-4 font-weight-light">
                Something went wrong :(
              </v-card-text>
              <v-card-text>
                <p>Here are the posible reasons why this page is showing:</p>
                <ul>
                  <li>Your receipt does not exist to our record.</li>
                  <li>Your order has been deleted by the store.</li>
                  <li>Your trying to access an invalid link.</li>
                  <!-- <li>Something went wrong to the server.</li> -->
                </ul>
              </v-card-text>
            </v-card>
            <v-fab-transition v-if="!loading&&order.store">
              <v-btn
                @click="saveReceipt()"
                color="primary"
                dark
                fixed
                bottom
                right
                fab
                :loading="saveLoading"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-col>
        </v-row>
</template>

<script>
/* eslint-disable */
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import moment from 'moment'
  export default {
    data() {
      return {
        moment: moment,
        order: {},
        loading: false,
        error: false,
        saveLoading: false
      }
    },
    mounted() {
      console.log(this.$route.params)
      if (this.$route.params.id&&this.$route.params.code) {
        this.getReceipt()
      }
    },
    methods: {
      saveReceipt() {
        this.saveLoading = true
        htmlToImage.toPng(document.getElementById('my-receipt'), { quality: 1.0, pixelRatio: 1 })
        .then((blob) => {
          window.saveAs(blob, `${moment(this.order.created_at).format('llll')}-${this.order.order_code}.png`);
          this.saveLoading = false
          this.snackbar('success', 'Receipt Download Successful');
        })
        .catch(error => {
            console.log(error)
            this.loading = false
            this.snackbar('error', 'Something went wrong');
          });
      },
      snackbar(color, text) {
          this.$store.commit('SET_SNACKBAR', { 
              open: true, 
              color: color, 
              text: text,
              timeout: 4000
          });
      },
      getReceipt() {
        this.loading = true;
        this.$store.dispatch('getOrderReceipt', this.$route.params)
          .then(response => {
            console.log(response)
            this.order = response.data
            setTimeout(() => {
              this.loading = false
            }, 1500);
          })
          .catch(error => {
            console.log(error)
            setTimeout(() => {
              this.loading = false
              this.error = true
            }, 1500);
          })
      }
    }

  }
</script>