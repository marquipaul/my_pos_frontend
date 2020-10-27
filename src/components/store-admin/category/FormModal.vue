<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 {{action == 'edit'? 'Update Category' : 'Create Category'}}
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-text-field
                    v-model="formData.title"
                    :rules="[$validate.rules.required]"
                    label="Name"
                    required
                ></v-text-field>
                <v-textarea
                    :rules="[$validate.rules.required]"
                    v-model="formData.description"
                    label="Address"
                    rows="3"
                    placeholder="Enter Description"
                ></v-textarea>
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
                let { id, title, description } = to;
                this.formData = { ...this.formData, id, title, description };
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
            this.formData.whole = true
            this.loading = true
            this.$store.dispatch(`${this.action == 'edit'? 'updateCategory' : 'addCategory'}`, this.formData)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.closeModal()
                    this.snackbar('success', `${this.action == 'edit'? 'Category Successfully Updated' : 'Category Successfully Created'}`);
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