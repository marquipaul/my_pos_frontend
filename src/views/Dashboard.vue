<template>
  <div class="dashboard-main">
      <DashboardCashier v-if="currentUser.user_type === 'CASHIER'"  />
      <DashboardAdmin v-if="currentUser.user_type === 'STOREADMIN'" />
  </div>
</template>

<script>
import DashboardCashier from '../components/cashier/Dashboard'
import DashboardAdmin from '../components/store-admin/Dashboard'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  components: {
    DashboardCashier,
    DashboardAdmin
  },
  computed: {
      ...mapGetters({
        currentUser: 'currentUser',
      })
  }
}
</script>
