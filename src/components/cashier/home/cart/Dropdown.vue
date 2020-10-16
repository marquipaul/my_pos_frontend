<template>
  <div>
    <v-menu
      v-model="dialog"
      max-height="500"
      :close-on-content-click="false"
      :close-on-click="false"
      offset-y
    >
        <v-card>
            <MainCart @close="dialog = false" />
        </v-card>
      </v-menu> 
  </div>
</template>

<script>
import MainCart from './Main'
export default {
  props: ['dialog'],
  components: { MainCart },
  name: 'cart',
}
</script>
