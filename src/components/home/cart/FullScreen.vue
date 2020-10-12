<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Customer's Cart</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$emit('close')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <MainCart @close="$emit('close')" />
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import MainCart from './Main'
  export default {
    props: ['dialog'],
    components: { MainCart },
  }
</script>