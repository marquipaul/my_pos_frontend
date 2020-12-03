<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 {{action == 'edit'? 'Update Product' : 'Create Product'}}
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-autocomplete
                    v-model="formData.category_id"
                    :items="getCategories"
                    item-text="category"
                    item-value="id"
                    :rules="[$validate.rules.required]"
                    label="Category"
                    required
                    :append-icon="addCategory? 'mdi-minus' : 'mdi-plus'"
                    @click:append="addCategory = !addCategory"
                ></v-autocomplete>
                <v-card outlined v-if="addCategory" :loading="categoryLoading">
                    <v-card-text>
                        <v-form ref="categoryForm">
                            Add Category
                            <v-text-field
                                v-model="form.title"
                                :rules="[$validate.rules.required]"
                                label="Category Name"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="form.description"
                                :rules="[$validate.rules.required]"
                                label="Description"
                                required
                            ></v-text-field>
                            <v-btn @click="saveCategory" :disabled="categoryLoading" text small color="primary">
                                Save
                            </v-btn>
                            <v-btn @click="addCategory = false" text small color="error">
                                Cancel
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-text-field
                    v-model="formData.description"
                    :rules="[$validate.rules.required]"
                    label="Description"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.unit"
                    :rules="[$validate.rules.required]"
                    label="Product Unit"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.unit_quantity"
                    :rules="[$validate.rules.required]"
                    label="Unit Quantity"
                    type="number"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="formData.minimum_stock"
                    :rules="[$validate.rules.required]"
                    label="Minimum Stock"
                    required
                    type="number"
                ></v-text-field>
                <v-text-field
                    v-model="formData.minimum_wholesale_order"
                    :rules="[$validate.rules.required]"
                    label="Minimum Wholesale Order"
                    required
                    type="number"
                ></v-text-field>
                <v-text-field
                    prefix="₱"
                    v-model="formData.cost_price"
                    :rules="[$validate.rules.required]"
                    label="Product Cost Price"
                    required
                    type="number"
                ></v-text-field>
                <v-text-field
                    prefix="₱"
                    v-model="formData.wholesale_price"
                    :rules="[$validate.rules.required]"
                    label="Wholesale Price"
                    required
                    type="number"
                ></v-text-field>
                <v-text-field
                    prefix="₱"
                    v-model="formData.retail_price"
                    :rules="[$validate.rules.required]"
                    label="Retail Price"
                    required
                    type="number"
                ></v-text-field>

                <p class="grey--text text--darken-2">*Note: Please make sure that you enter the correct pricing this will reflect to your profit computation.</p>
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
            addCategory: false
        }
    },
    mounted() {
        this.getDataFromAPI()
    },
    watch: {
        show(to) {
            this.dialog = to;
        },
        data(to) {
            if (Object.keys(to).length > 0) {
                let { id, description, category_id, unit, unit_quantity, minimum_stock, minimum_wholesale_order, cost_price, wholesale_price, retail_price, quantity } = to;
                this.formData = { ...this.formData, id, description, category_id, unit, unit_quantity, minimum_stock, minimum_wholesale_order, cost_price, wholesale_price, retail_price, quantity };
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
        saveCategory() {
            var categoryStatus = this.$refs.categoryForm.validate()
            if (categoryStatus) {
                this.categoryLoading = true
                this.$store.dispatch('addCategory', this.form)
                .then(res => {
                    this.loading = false
                    this.formData.category_id = res.data.id
                    console.log(res)
                    this.$refs.categoryForm.reset()
                    this.addCategory = false;
                    this.categoryLoading = false
                    this.snackbar('success', 'Category Successfully Added');
                })
                .catch(error => {
                    console.log(error)
                    this.categoryLoading = false
                    this.snackbar('error', 'Something went wrong');
                })
            }
        },
        getDataFromAPI () {
            this.selection = true
            this.$store.dispatch('getCategories', { selection: true })
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
            this.action == 'edit'? '' : this.formData.quantity = 0;
            this.loading = true
            this.$store.dispatch(`${this.action == 'edit'? 'updateProduct' : 'addProduct'}`, this.formData)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.closeModal()
                    this.snackbar('success', `${this.action == 'edit'? 'Product Successfully Updated' : 'Product Successfully Created'}`);
                    if (this.action != 'edit') {
                        this.$emit('openImageCropper', res.data);
                    }
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
            getCategories: 'getCategories'
        })
    },
}
</script>