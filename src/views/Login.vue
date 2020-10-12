<template>
      <v-container
        class="fill-height"
        fluid
      >
      
      <v-snackbar v-model="admin_error" :timeout="4000" top right multi-line="multi-line" color="error">
            <span>{{error_content}}</span>
            <v-btn text color="white" @click="admin_error = false">Close</v-btn>
      </v-snackbar>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
                <v-form @submit.prevent="authenticate">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login | Cashier</v-toolbar-title>
                <div class="flex-grow-1"></div>
              
              </v-toolbar>
              <v-card-text>
                
                  <v-text-field
                    v-model="form.username"
                    label="E-Mail Address"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="form.password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    :type="showPass ? 'text' : 'password'"
                    :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPass = !showPass"
                  ></v-text-field>
                
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn
                  block
                  :disabled="form.username&&form.password ? false : true"
                  color="primary" 
                  @click="authenticate" 
                  :loading="loading">
                  Login
                  </v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>

<script>
/* eslint-disable */
  export default {
    data() {
      return {
        loading: false,
        error_content: '',
        admin_error: false,
        form: {
          username: '',
          password: ''
        },
        showPass: false
      }
    },

    methods: {
        authenticate() {
            this.loading = true
            this.$store.dispatch('retrieveToken', this.$data.form)
            .then(response => {
                this.loader = false
                this.loading = false
                //this.$store.dispatch('getLocations')
                this.$router.push({path: '/dashboard'});
                //console.log(response)
            }).catch(error => {
                console.log(error)
                this.error_content = error
                this.admin_error = true
                this.loading = false
                })
            },
        },
  }
</script>