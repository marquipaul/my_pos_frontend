<template>
    <v-card>
        <v-card-title class="grey--text text--darken-1">
            Income Statement
            <v-spacer></v-spacer>
            {{moment(analyticsResult.start_date).format('ll')}} ~ {{moment(analyticsResult.end_date).format('ll')}}
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
                    <th class="text-right">
                        Amount
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="(item, i) in results"
                    :key="i"
                    :class="item.class"
                    >
                    <td><span :class="item.class">{{ item.description }}</span></td>
                    <td v-if="item.value != null" class="text-right">{{ numberWithCommas(item.value) }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment';
export default {
    props:['deduction'],
    data() {
        return {
            moment: moment,
            results: [
                {description: 'Revenue', value: 0},
                {description: 'Less: Expenses', value: null},
                {description: '• Cost of Sales', value: 0, class: 'ml-5'},
                {description: '• Other Expenses', value: 0, class: 'ml-5'},
                {description: 'Total Expenses', value: 0},
                {description: 'Gross Income', value: 0},
                {description: 'Net Income / Net Profit', value: 0, class: 'font-weight-bold'},
            ]
        }
    },

    watch: {
        analyticsResult: {
            handler() {
                this.results[0].value = this.analyticsResult.revenue;
                this.results[1].value = null;
                this.results[2].value = this.analyticsResult.cost_of_goods_sold;
                this.results[3].value = this.analyticsResult.other_expenses;
                this.results[4].value = this.analyticsResult.total_expenses;
                this.results[5].value = this.analyticsResult.gross;
                this.results[6].value = this.analyticsResult.profit;
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