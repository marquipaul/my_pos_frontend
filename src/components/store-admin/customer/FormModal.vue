<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 {{action == 'edit'? 'Update Customer' : 'Create Customer'}}
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
                    v-model="formData.mobile_number"
                    :rules="[$validate.rules.required, $validate.rules.mobileNumber]"
                    label="Mobile Number"
                    required
                    type="number"
                ></v-text-field>
                <v-textarea
                    :rules="[$validate.rules.required]"
                    v-model="formData.address"
                    label="Address"
                    rows="3"
                    placeholder="Enter Customer Address"
                ></v-textarea>
                <v-radio-group
                    v-model="formData.customer_type"
                    row
                    dense
                >
                    <v-radio
                        label="RETAIL"
                        value="RETAIL"
                    ></v-radio>
                    <v-radio
                        label="WHOLESALE"
                        value="WHOLESALE"
                    ></v-radio>
                </v-radio-group>

                <div class="text-center">
                    <p class="caption">By submitting, you and the customer accept StackPoint</p> 
                    <a href="#" class="caption">Terms and Condition</a>
                </div>
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
            formData: {
                name: '',
                mobile_number: '',
                address: '',
                customer_type: 'RETAIL'
            },
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
                let { id, name, mobile_number, address, customer_type } = to;
                this.formData = { ...this.formData, id, name, mobile_number, address, customer_type };
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
            this.$store.dispatch(`${this.action == 'edit'? 'updateAdminCustomer' : 'addAdminCustomer'}`, this.formData)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.closeModal()
                    this.snackbar('success', `${this.action == 'edit'? 'Customer Successfully Updated' : 'Customer Successfully Created'}`);
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