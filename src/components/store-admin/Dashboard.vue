<template>
    <div>
        <p class="grey--text text--darken-1 mb-n3">
            Dashboard
            <v-btn @click="reload = !reload" class="grey--text text--darken-1" small text> 
                <v-icon small color="success">mdi-refresh</v-icon>
                Reload
            </v-btn>
        </p>  
        <v-row>
            <v-col cols="12">
                <Overall :reload="reload" />
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
                <LowStock :reload="reload" />
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
                <TopCustomers :reload="reload" />
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
    components: { Overall, LowStock, TopCustomers },
    data() {
        return {
            reload: false
        }
    }
}
</script>