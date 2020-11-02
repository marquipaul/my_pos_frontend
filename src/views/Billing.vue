<template>
    <div>
        <v-row>
            <v-col cols="12" xs="4" sm="4" md="4">
                <v-card :loading="loading">
                    <v-card-title class="grey--text text--darken-1">
                        Current Bill
                        <v-spacer></v-spacer>
                        <p class="caption">{{ moment(this.currentBilling.start_date).format('ll') }} - {{ moment(this.currentBilling.end_date).format('ll') }}</p>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <!-- <p v-if="!deduction" class="caption">*Note: Other expenses is not yet deducted to profit</p> -->
                        <v-simple-table dense>
                            <template v-slot:default>
                            <thead>
                                <tr>
                                <th class="text-left">
                                    Description
                                </th>
                                <th class="text-left">
                                    Amount
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="(item, i) in results"
                                :key="i"
                                :class="i==3? 'font-weight-bold' : ''"
                                >
                                <td>{{ item.description }}</td>
                                <td>{{ numberWithCommas(item.value) }}</td>
                                </tr>
                                <!-- <tr >
                                    <td>Total Amount</td>
                                    <td>{{ numberWithCommas(this.currentBilling.total_amount) }}</td>
                                </tr> -->
                            </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            moment: moment,
            results: [
                {description: 'Service Fee', value: 0},
                {description: 'SMS Fee', value: 0},
                {description: 'Sender Name Fee', value: 0},
                {description: 'Total Amount', value: 0}
            ],
            loading: false
        }
    },
    mounted() {
        this.loading = true;
        this.$store.dispatch('getCurrentBilling')
            .then(res => {
                console.log(res)
                this.loading = false;
                console.log('BILL', this.currentBilling)
            })
            .catch(error => {
                console.log(error)
                this.loading = false;
            })
    },
    watch: {
        currentBilling: {
            handler() {
                this.results[0].value = this.currentBilling.service_fee;
                this.results[1].value = this.currentBilling.sms_fee;
                this.results[2].value = this.currentBilling.sender_name_fee;
                this.results[3].value = this.currentBilling.total_amount;
            }
        }
    },
    computed: {
      ...mapGetters({
            currentBilling: 'getCurrentBilling'
        })
    },
}
</script>