<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar.open"
      top
      right
      :color="snackbar.color"
      multi-line
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="close"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
  export default {
    watch: {
        snackbar: {
            handler() {
                if (this.snackbar.open) {
                    setTimeout(() => {
                        this.close()
                    }, this.snackbar.timeout);
                }
            }
        }
    },
    methods: {
        close() {
            this.$store.commit('SET_SNACKBAR', {open: false, text: '', color: '', timeout: 4000});
        }
    },
    computed: {
    ...mapGetters({
      snackbar: 'snackbar'
    })
  }
  }
</script>