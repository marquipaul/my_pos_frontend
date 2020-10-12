<template>
    <div class="pa-1">      
        <v-divider></v-divider>  
        <v-list
            two-line
            subheader
            >
            <v-subheader>Customer Registration</v-subheader>
            <v-form ref="form">
                <v-list-item>
                    <v-list-item-content>
                        <v-text-field
                            :rules="[$validate.rules.required]"
                            v-model="form.name"
                            label="Full Name"
                            placeholder="Enter Customer Name"
                        ></v-text-field>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-text-field
                            :rules="[$validate.rules.required, $validate.rules.mobileNumber]"
                            v-model="form.mobile_mobile"
                            label="Mobile No."
                            placeholder="ex. 9123456789"
                        ></v-text-field>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-textarea
                            :rules="[$validate.rules.required]"
                            v-model="form.address"
                            label="Address"
                            rows="3"
                            placeholder="Enter Customer Address"
                        ></v-textarea>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                <v-list-item-content>
                <v-list-item-title class="grey--text text--darken-1">Customer Type</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-radio-group
                            v-model="form.customer_type"
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
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
                <v-list-item>
                    <v-btn :loading="loading" block @click="submitCustomer">Save Customer</v-btn>
                </v-list-item>
            </v-form>
        </v-list>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                name: '',
                mobile_number: '',
                address: '',
                customer_type: 'RETAIL'
            },
            loading: false
        }
    },
    methods: {
        submitCustomer() {
            this.loading = true;
            var status = this.$refs.form.validate();
            console.log(status)
            if (status) {
                this.$store.dispatch('addCustomer', this.form)
                    .then(response => {
                        console.log(response)
                        this.$emit('setCustomerID', response.data.id)
                        this.reset();
                        this.$emit('close')
                        this.loading = false;
                        this.snackbar('success', 'Customer info Successfuly Saved');
                    })
                    .catch(error => {
                        console.log(error)
                        this.loading = false;
                        this.snackbar('error', 'Something went wrong');
                    })
            }

        },
        reset () {
            this.$refs.form.reset()
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        },
        snackbar(color, text) {
            this.$store.commit('SET_SNACKBAR', { 
                open: true, 
                color: color, 
                text: text,
                timeout: 4000
            });
        }
    }
}
</script>