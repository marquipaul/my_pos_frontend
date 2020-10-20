<template>
    <div>
        <p class="grey--text text--darken-1 mb-n3">Dashboard</p>  
        <v-row>
            <v-col cols="12">
                <Overall />
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
                <LowStock />
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
                <TopCustomers />
            </v-col>
        </v-row>
    </div>
</template>
<script>
/* eslint-disable */
import Overall from './dashboard/Overall'
import LowStock from './dashboard/LowProduct'
import TopCustomers from './dashboard/TopCustomers'
export default {
    components: { Overall, LowStock, TopCustomers }
}
</script>