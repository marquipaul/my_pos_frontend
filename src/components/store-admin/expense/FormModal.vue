<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 {{action == 'edit'? 'Update Expense' : 'Add Expense'}}
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-text-field
                    v-if="formData.expense_code"
                    readonly
                    v-model="formData.expense_code"
                    label="Expense Code"
                ></v-text-field>
                <v-text-field
                    v-model="formData.expense_amount"
                    :rules="[$validate.rules.required]"
                    label="Expense Amount"
                    required
                    type="number"
                ></v-text-field>
                <v-textarea
                    v-model="formData.description"
                    :rules="[$validate.rules.required]"
                    label="Description"
                    required
                    rows="3"
                ></v-textarea>
                <p class="grey--text text--darken-2">*Note: This expense will reflect on your accounting.</p>
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
                let { id, description, expense_amount, expense_code } = to;
                this.formData = { ...this.formData, id, description, expense_amount, expense_code };
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
            this.$store.dispatch(`${this.action == 'edit'? 'updateExpense' : 'addExpense'}`, this.formData)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.closeModal()
                    this.snackbar('success', `${this.action == 'edit'? 'Expense Successfully Updated' : 'Expense Successfully Created'}`);
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