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
          id="login"
        >
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-card class="elevation-4">
              <v-form @submit.prevent="validate" ref="form" lazy-validation>
                <v-card-title class="justify-center">
                    <v-img max-width="250" src="~@/assets/img/finance.svg" lazy-src="~@/assets/img/finance.svg"/>
                  </v-card-title>
               <v-card-subtitle id="text" class="pa-0 pb-5 pt-5 text-center">Sign In to your account</v-card-subtitle>
              <v-card-text>
                  <v-text-field
                    flat
                    solo
                    autofocus
                    autocomplete="off"
                    v-model="form.username"
                    label="E-Mail Address"
                    :rules="[$validate.rules.required, $validate.rules.email]"
                    prepend-inner-icon="mdi-account"
                    type="text"
                    v-on:keypress.enter="validate"
                  ></v-text-field>

                  <v-text-field
                    solo
                    flat
                    v-model="form.password"
                    label="Password"
                    :rules="[$validate.rules.required]"
                    prepend-inner-icon="mdi-lock"
                    :type="showPass ? 'text' : 'password'"
                    :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPass = !showPass"
                    v-on:keypress.enter="validate"
                  ></v-text-field>
                
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn
                  large
                  depressed
                  block
                  color="primary" 
                  @click="validate" 
                  :loading="loading">
                  Sign In
                  </v-btn>
              </v-card-actions>
              <!-- <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn
                  large
                  depressed
                  block
                  color="primary" 
                  to="test-print">
                  Printer Test
                  </v-btn>
              </v-card-actions> -->
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
      validate() {
          var status = this.$refs.form.validate()
          if (status) {
              this.authenticate()
          }
      },
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
#login {
    #text {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 23px;
    }
    .v-text-field {
        &.theme--light {
            .v-input__slot {
                background-color: #FAFAFA;;
            }
        }

        &.theme--dark {
            .v-input__slot {
                background-color: #212746;
            }
        }
    }
}
  
</style>