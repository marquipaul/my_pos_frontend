<template>
    <v-card>
        <v-card-title class="grey--text text--darken-1">
            Result
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
                    >
                    <td>{{ item.description }}</td>
                    <td>{{ numberWithCommas(item.value) }}</td>
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
    props:['deduction'],
    data() {
        return {
            results: [
                {description: 'Revenue', value: 0},
                {description: 'Cost of Goods Sold', value: 0},
                {description: 'Other Expenses', value: 0},
                {description: 'Total Expenses', value: 0},
                {description: 'Profit', value: 0},
            ]
        }
    },

    watch: {
        analyticsResult: {
            handler() {
                this.results[0].value = this.analyticsResult.revenue;
                this.results[1].value = this.analyticsResult.cost_of_goods_sold;
                this.results[2].value = this.analyticsResult.other_expenses;
                this.results[3].value = this.analyticsResult.total_expenses;
                this.results[4].value = this.analyticsResult.profit;
            }
        }
    },
    computed: {
      ...mapGetters({
            analyticsResult: 'getAnalyticComputation'
        })
    },

}
</script>