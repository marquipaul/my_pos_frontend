<template>
    <div>
        <p class="grey--text text--darken-1">Analytics Reports</p>  
        <v-row>
            <v-col cols="12" xl="6" lg="6" md="6">
                <FilterForm @deduction="deduction = !deduction" />
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="6">
                <Result :deduction="deduction" />
            </v-col>
        </v-row>
    </div>
</template>
<script>
import FilterForm from '../components/store-admin/analytics/FilterForm'
import Result from '../components/store-admin/analytics/Result'
  export default {
      components: { FilterForm, Result },
      data() {
          return {
              deduction: true
          }
      }
  }
</script>