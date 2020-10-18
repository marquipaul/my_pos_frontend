<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 {{action == 'edit'? 'Update Account' : 'Create Account'}}
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-text-field
                    v-model="formData.name"
                    :rules="[$validate.rules.required]"
                    label="Name"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.email"
                    :rules="[$validate.rules.required, $validate.rules.email]"
                    label="E-mail Address"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.mobile_number"
                    :rules="[$validate.rules.required, $validate.rules.mobileNumber]"
                    label="Mobile Number"
                    required
                    type="number"
                ></v-text-field>
                <v-radio-group
                    v-model="formData.user_type"
                    row
                >
                <v-radio
                    label="Cashier"
                    value="CASHIER"
                ></v-radio>
                <v-radio
                    label="Store Admin"
                    value="STOREADMIN"
                ></v-radio>
                </v-radio-group>
                <v-divider></v-divider>
                
                <v-text-field
                    v-model="formData.password"
                    :rules="[$validate.rules.required, $validate.rules.password]"
                    label="Password"
                    required
                    prepend-icon="mdi-lock"
                    :type="showPass ? 'text' : 'password'"
                    :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPass = !showPass"
                ></v-text-field>
                <p class="grey--text text--darken-2">*Note: Password must be at least 8 characters and must contain at least one capital letter and a number</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn small :loading="loading" @click="validate()" block class="primary">Save</v-btn>
            </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    //props: ['dialog', 'accountForm'],
    props: {
        show: { type: Boolean, default: false, required: true },
        action: { type: String, default: '' },
        data: { type: Object, default: new Object() }
    },
    data() {
        return {
            loading: false,
            formData: {},
            showPass: false,
            dialog: false
        }
    },
    watch: {
        show(to) {
            this.dialog = to;
        },
        data(to) {
            if (Object.keys(to).length > 0) {
                let { id, name, mobile_number, email, user_type } = to;
                this.formData = { ...this.formData, id, name, mobile_number, email, user_type };
            }
        },
        dialog(to) {
            if (!to) {
                this.closeModal();
                this.$emit('close');
            }
        }
    },
    methods: {
        validate() {
            var status = this.$refs.form.validate()
            if (status) {
                this.submitForm()
            }
        },
        submitForm () {
            this.loading = true
            this.$store.dispatch(`${this.action == 'edit'? 'updateAccount' : 'addAccount'}`, this.formData)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.closeModal()
                    this.snackbar('success', `${this.action == 'edit'? 'Account Successfully Updated' : 'Account Successfully Created'}`);
                })
                .catch(error => {
                    console.log(error)
                    this.snackbar('error', 'Something went wrong');
                })
        },
        closeModal() {
            this.$emit('close')
            this.reset()
        },
        snackbar(color, text) {
          this.$store.commit('SET_SNACKBAR', { 
              open: true, 
              color: color, 
              text: text,
              timeout: 4000
          });
        },
        reset () {
            this.$refs.form.reset()
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        },
    }
}
</script>