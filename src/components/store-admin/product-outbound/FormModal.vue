<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 {{action == 'edit'? 'Update Product Outbound' : 'Create Product Outbound'}}
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-autocomplete
                    :loading="selection"
                    v-model="formData.product_id"
                    :items="getProductSelection"
                    item-text="description"
                    item-value="id"
                    :rules="[$validate.rules.required]"
                    label="Select Product"
                    readonly
                    required
                ></v-autocomplete>
                <v-text-field
                    v-model="formData.remaining_quantity"
                    label="Remaining Quantity"
                    type="number"
                    readonly
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.quantity"
                    :rules="[$validate.rules.required]"
                    label="Quantity"
                    type="number"
                    required
                ></v-text-field>
                <v-text-field
                    prefix="₱"
                    :value="`${formData.amount} | ${formData.price_type}`"
                    readonly
                    label="Amount"
                    required
                ></v-text-field>
                <v-text-field
                    prefix="₱"
                    :value="formData.amount*formData.quantity"
                    readonly
                    label="Total Amount"
                    required
                    type="number"
                ></v-text-field>
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
import { mapGetters } from 'vuex'
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
            categoryLoading: false,
            formData: {},
            form: {},
            showPass: false,
            dialog: false,
            addCategory: false,
            selection: false
        }
    },
    mounted() {
        this.getDataFromAPI()
    },
    watch: {
        // 'formData.product_id'(to) {
        //     if (to) {
        //         var index = this.getProductSelection.findIndex(item => item.id === to);
        //         var product = this.getProductSelection[index];
        //         this.formData.amount = product.amount;
        //         this.formData.remaining_quantity = product.remaining_quantity;
        //     }
        // },
        show(to) {
            this.dialog = to;
        },
        data(to) {
            if (Object.keys(to).length > 0) {
                let { id, product_id, item_code, price_type, description, remaining_quantity, amount, quantity } = to;
                this.formData = { ...this.formData, id, product_id, item_code, price_type, description, remaining_quantity, amount, quantity };
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
        getDataFromAPI () {
            this.selection = true
            this.$store.dispatch('getProductSelection', { selection: true })
                .then(res => {
                    this.selection = false
                    console.log(res)
                })
                .catch(error => {
                    this.selection = false
                    console.log(error)
                })
        },
        submitForm () {
            this.loading = true
            this.$store.dispatch(`${this.action == 'edit'? 'updateOutbound' : 'addOutbound'}`, this.formData)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.getDataFromAPI()
                    this.closeModal()
                    this.$emit('reloadAPI');
                    this.snackbar('success', `${this.action == 'edit'? 'Product Outbound Successfully Updated' : 'Product Outbound Successfully Created'}`);
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
    },
    computed: {
        ...mapGetters({
            getProductSelection: 'getProductSelection'
        })
    },
}
</script>