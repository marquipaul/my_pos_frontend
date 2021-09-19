<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 {{action == 'edit'? 'Update Store' : 'Create Store'}}
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
                    label="Store Name"
                    required
                ></v-text-field>
                <v-select
                    v-model="formData.mode"
                    :items="['STORE', 'RESTAURANT']"
                    :rules="[$validate.rules.required]"
                    label="Type"
                    required
                ></v-select>
                <v-text-field
                    v-model="formData.owner_name"
                    :rules="[$validate.rules.required]"
                    label="Owner Name"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.tin_number"
                    :rules="[$validate.rules.required]"
                    label="Tin Number"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.bir_number"
                    :rules="[$validate.rules.required]"
                    label="BIR Permit Number"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.tax_percentage"
                    :rules="[$validate.rules.required]"
                    label="Tax Percentage"
                    type="tel"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.store_contact_email"
                    :rules="[$validate.rules.required, $validate.rules.email]"
                    label="E-mail Address"
                    required
                    :error-messages="emailErrors"
                    @keyup="emailErrors = []"
                ></v-text-field>
                <v-text-field
                    v-model="formData.store_contact_number"
                    :rules="[$validate.rules.required, $validate.rules.mobileNumber]"
                    label="Mobile Number"
                    required
                    type="tel"
                    :error-messages="numberErrors"
                    @keyup="numberErrors = []"
                ></v-text-field>
                <v-textarea
                    v-model="formData.address"
                    :rules="[$validate.rules.required]"
                    label="Store Address"
                    required
                    rows="3"
                ></v-textarea>
                <v-radio-group v-model="formData.enable_sms" :rules="[$validate.rules.requiredRadio]">
                    <template v-slot:label>
                        <div>Enable SMS Receipt?</div>
                    </template>
                    <v-radio
                        label="Yes"
                        :value="1"
                    ></v-radio>
                    <v-radio
                        label="No"
                        :value="0"
                    ></v-radio>
                </v-radio-group>
                <v-radio-group v-model="formData.enable_receipt" :rules="[$validate.rules.requiredRadio]">
                    <template v-slot:label>
                        <div>Enable Receipt Printing?</div>
                    </template>
                    <v-radio
                        label="Yes"
                        :value="1"
                    ></v-radio>
                    <v-radio
                        label="No"
                        :value="0"
                    ></v-radio>
                </v-radio-group>
                <v-radio-group v-model="formData.enable_wholesale" :rules="[$validate.rules.requiredRadio]">
                    <template v-slot:label>
                        <div>Enable Wholesale price?</div>
                    </template>
                    <v-radio
                        label="Yes"
                        :value="1"
                    ></v-radio>
                    <v-radio
                        label="No"
                        :value="0"
                    ></v-radio>
                </v-radio-group>
                <v-radio-group v-model="formData.show_contact" :rules="[$validate.rules.requiredRadio]">
                    <template v-slot:label>
                        <div>Show contact information on receipt?</div>
                    </template>
                    <v-radio
                        label="Yes"
                        :value="1"
                    ></v-radio>
                    <v-radio
                        label="No"
                        :value="0"
                    ></v-radio>
                </v-radio-group>
                <v-radio-group v-model="formData.enable_tax" :rules="[$validate.rules.requiredRadio]">
                    <template v-slot:label>
                        <div>Show VAT Tax?</div>
                    </template>
                    <v-radio
                        label="Yes"
                        :value="1"
                    ></v-radio>
                    <v-radio
                        label="No"
                        :value="0"
                    ></v-radio>
                </v-radio-group>
                <v-radio-group v-model="formData.enable_bir" :rules="[$validate.rules.requiredRadio]">
                    <template v-slot:label>
                        <div>Show BIR Permit no.?</div>
                    </template>
                    <v-radio
                        label="Yes"
                        :value="1"
                    ></v-radio>
                    <v-radio
                        label="No"
                        :value="0"
                    ></v-radio>
                </v-radio-group>
                <v-radio-group v-model="formData.enable_tin" :rules="[$validate.rules.requiredRadio]">
                    <template v-slot:label>
                        <div>Show TIN number?</div>
                    </template>
                    <v-radio
                        label="Yes"
                        :value="1"
                    ></v-radio>
                    <v-radio
                        label="No"
                        :value="0"
                    ></v-radio>
                </v-radio-group>
                <!-- <v-divider></v-divider>
                
                <p class="grey--text text--darken-2">*Note: Password must be at least 8 characters and must contain at least one capital letter and a number</p> -->
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
            dialog: false,
            errors: [],
            emailErrors: [],
            numberErrors: []
        }
    },
    watch: {
        show(to) {
            this.dialog = to;
        },
        data(to) {
            if (Object.keys(to).length > 0) {
                let { id, name, address, tin_number, owner_name, enable_sms, enable_receipt, enable_tax, tax_percentage, confirmed, enable_bir, enable_tin, bir_number, show_contact, store_contact_email, store_contact_number, enable_wholesale, mode } = to;
                this.formData = { ...this.formData,  id, name, address, tin_number, owner_name, enable_sms, enable_receipt, enable_tax, tax_percentage, confirmed, enable_bir, enable_tin, bir_number, show_contact, store_contact_email, store_contact_number, enable_wholesale, mode };
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
            this.formData.confirmed = 1
            this.formData.with_sender_name = 1
            this.formData.sender_name_rate = 200
            this.formData.whole = true
            this.$store.dispatch(`${this.action == 'edit'? 'updateStore' : 'addStore'}`, this.formData)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.closeModal()
                    this.snackbar('success', `${this.action == 'edit'? 'Store Successfully Updated' : 'Store Successfully Created'}`);
                })
                .catch(error => {
                    this.loading = false
                    if (error.response.data.errors.email) {
                        this.emailErrors = error.response.data.errors.email[0];
                    }
                    if (error.response.data.errors.mobile_number) {
                        this.numberErrors = error.response.data.errors.mobile_number[0];
                    }
                    //var mobile_msg = error.response.data.errors.mobile_number.length > 0? error.response.data.errors.mobile_number[0] : '';
                    this.snackbar('error', `${error.response.data.message}`);
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