<template>
    <v-row>
        <v-col v-for="(data, index) in cards" :key="index" cols="12" xl="3" lg="3" md="6" sm="6" xs="12">
            <v-card :loading="loading" class="grey--text text--darken-2">
                <v-card-title class="justify-center">
                <div class="text-center">
                    <h3 class="headline font-weight-light">{{data.text}}</h3>
                </div>
                
                </v-card-title>
                <v-card-text class="justify-center">
                <div class="text-center">
                    <h2 class="display-3 grey--text text--darken-1">{{numberWithCommas(data.count)}}</h2>            
                </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
export default {
    props: ['reload'],
    watch: {
        reload: {
            handler() {
                this.getDataFromAPI()
            }
        }
    },
    data() {
        return {
            cards: [
                {
                    text: 'Revenue', 
                    count: 0
                },
                {text: 'Expenses', count: 0},
                {text: 'Net Profit', count: 0},
                {text: 'Inventory Value', count: 0}
            ],
            loading: false
        }
    },
    mounted() {
        this.getDataFromAPI()
    },
   
    methods: {
        getDataFromAPI() {
            this.loading = true
            this.$store.dispatch('getOverallComputation')
            .then(res => {
                this.loading = false
                this.cards[0].count = this.values.revenue;
                this.cards[1].count = this.values.total_expenses;
                this.cards[2].count = this.values.profit;
                this.cards[3].count = this.values.inventory_value;
            })
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
    },
    computed: {
      ...mapGetters({
        values: 'getOverallComputation',
      })
    }
}
</script>