<template>
    <v-card>
        <v-card-title class="grey--text text--darken-1">
            Filters
        </v-card-title>
        <v-card-text>
            <v-form ref="form">
                <v-row>
                    <v-col cols="6">
                        <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="computedDateFormatted1"
                            label="Start Date"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date1"
                            @input="menu1 = false"
                        ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6">
                        <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="computedDateFormatted2"
                            label="End Date"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date2"
                            @input="menu2 = false"
                        ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" xl="5" lg="5">
                        <v-switch
                            inset
                            dense
                            v-model="deduct_order_expenses"
                            label="Deduct other Expenses"
                        ></v-switch>
                    </v-col>
                    <v-col cols="12" xl="7" lg="7">
                        <v-radio-group
                        label="Filter by"
                        v-model="filterBy"
                        :row="!$vuetify.breakpoint.mobile"
                        >
                        <v-radio
                            label="None"
                            value="none"
                        ></v-radio>
                        <v-radio
                            label="Products"
                            value="products"
                        ></v-radio>
                        <v-radio
                            label="Categories"
                            value="categories"
                        ></v-radio>
                        </v-radio-group>
                        
                    </v-col>
                    
                    <v-col cols="12" v-if="filterBy == 'products'">
                        <v-autocomplete
                            v-model="product_id"
                            :items="getProductSelection"
                            item-text="description"
                            item-value="id"
                            dense
                            chips
                            small-chips
                            label="Select a Products"
                            multiple
                            :loading="selection1"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" v-if="filterBy == 'categories'">
                        <v-autocomplete
                            v-model="category_id"
                            :items="getCategories"
                            item-text="category"
                            item-value="id"
                            dense
                            chips
                            small-chips
                            label="Select a Categories"
                            multiple
                            :loading="selection2"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-btn small @click="submitFilter" block class="primary">Filter</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
  export default {
    data: vm => ({
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
      deduct_order_expenses: true,
      filterBy: 'none',
      selection1: false,
      selection2: false,
      product_id: [],
      category_id: []
    }),

    computed: {
      computedDateFormatted1 () {
        return this.formatDate(this.date1)
      },
      computedDateFormatted2 () {
        return this.formatDate(this.date2)
      },
      ...mapGetters({
            getCategories: 'getCategories',
            getProductSelection: 'getProductSelection'
        })
    },

    watch: {
      deduct_order_expenses (to) {
          this.$emit('deduction', to);
      },
      filterBy () {
        this.product_id = [],
        this.category_id = []
      },
      date1 () {
        this.dateFormatted = this.formatDate(this.date1)
      },
      date2 () {
        this.dateFormatted = this.formatDate(this.date2)
      },
    },
    mounted() {
        this.getDataFromAPI1()
        this.getDataFromAPI2()
        this.submitFilter()
    },
    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      getDataFromAPI1 () {
        this.selection1 = true
        this.$store.dispatch('getProductSelection', { selection: true })
            .then(res => {
                this.selection1 = false
                console.log(res)
            })
            .catch(error => {
                this.selection1 = false
                console.log(error)
            })
      },
      getDataFromAPI2 () {
            this.selection2 = true
            this.$store.dispatch('getCategories', { selection: true })
                .then(res => {
                    this.selection2 = false
                    console.log(res)
                })
                .catch(error => {
                    this.selection2 = false
                    console.log(error)
                })
        },
        submitFilter() {
            var params = {
                start_date: this.date1,
                end_date: this.date2,
                deduct_order_expenses: this.deduct_order_expenses? true : null,
                product_id: this.filterBy == 'products'? this.product_id : null,
                category_id: this.filterBy == 'categories'? this.category_id : null
            }
            console.log(params)
            this.$store.dispatch('getAnalyticComputation', params)
                .then(res => {
                    console.log(res)
                })
        }
    },
  }
</script>