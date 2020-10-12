<template>
  <div>
    <div v-if="$vuetify.breakpoint.mobile">
      <FullScreen :dialog="dialog" @close="$emit('close')" />
    </div>
    <!-- <div v-else>
      <Dropdown :dialog="dialog" />
    </div> -->
  </div>
</template>

<script>
import FullScreen from './cart/FullScreen';
//import Dropdown from './cart/Dropdown'
export default {
  props: ['dialog'],
  name: 'main-cart',
  components: {
    FullScreen,
    //Dropdown
  },
  watch: {
    dialog: {
      handler() {
        console.log(this.dialog)
      }
    }
  },
  data () {
      return {
      }
    },
}
</script>
