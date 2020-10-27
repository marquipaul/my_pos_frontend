<template>
    <v-dialog v-model="dialog" max-width="500" transition="scroll-y-reverse-transition" persistent>
        <v-card>
            <v-card-title class="font-weight-bold align-center">
                Product Inbound Information
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon class="dialog-close" v-on="on" @click="dialog = false">mdi-close</v-icon>
                    </template>
                    <span>Close</span>
                </v-tooltip>
            </v-card-title>
            <v-card-text v-if="loading">
                <v-progress-linear
                    indeterminate
                    class="mb-0"
                ></v-progress-linear>
            </v-card-text>
            <v-card-text v-else class="pa-5">
                <v-card outlined>
                    <v-simple-table dense>
                        <template v-slot:default>
                        <tbody>
                            <tr v-for="item in productInfo" :key="item.name">
                                <td style="width: 40%" class="text-left caption font-weight-bold text-capitalize">{{ item.text.replace(/_/g, " ") }}</td>
                                <td class="text-left ">{{ item.value }}</td>
                                <!-- <td>{{ item.value }}</td> -->
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        name: 'view-dialog',
        props: {
            show: { type: Boolean, default: false, required: true },
            action: { type: String, default: '' },
            data: { type: Object, default: new Object() }
        },
        data() {
            return {
                dialog: this.show,
                formData: {},
                productInfo: [],
                loading: false,
                getProductInfo: {}
            };
        },
        watch: {
            show(to) {
                this.dialog = to;
            },
            getProductInfo(to) {
                this.productInfo = [];
                // console.log('Personal Information', to);
                for (var key in to) {
                    if (key != 'id' && key != 'product_id' && key != 'date_delivered' && key != 'time_delivered' && key != 'store_id' && key != 'user_id' && key != 'updated_at' && key != 'deleted_at' && key != 'category_id') {
                        if (key === 'created_at') {
                             this.productInfo.push({text: 'Delivered At', value: to[key]? `${this.formatDate(to[key])} ${new Date(to[key]).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}` : 'N/A'})
                        } else if (key != 'item_code'  && key != 'remaining_quantity' && key != 'unit' && key != 'quantity' && key != 'description' && key != 'unit_quantity' && key != 'minimum_stock' && key != 'minimum_wholesale_order' && key != 'created_at') {
                            this.productInfo.push({text: key, value: to[key]? this.numberWithCommas(to[key]) : 'N/A'})
                        } else if (key == 'description' || key == 'item_code' || key == 'remaining_quantity') {
                            this.productInfo.unshift({text: key, value: to[key]? to[key] : 'N/A'})
                        } else {
                            this.productInfo.push({text: key, value: to[key]? to[key] : 'N/A'})
                        }
                    }
                }
            },
            data(to) {
                if (Object.keys(to).length > 0) {
                    //Call API
                    this.getProductInfo = to;
                }
            },
            dialog(to) {
                if (!to) {
                    this.$emit('close');
                }
            }
        },
        methods: {
            formatDate(date) {
                const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let current_datetime = new Date(date)
                let formatted_date = `${months[current_datetime.getMonth()]} ${current_datetime.getDate()}, ${current_datetime.getFullYear()}`;
                console.log(formatted_date)
                return formatted_date;
            },
            // getData() {
            //     // console.log('initiated');
            //     this.loading = true;
            //     this.$store.dispatch('getProduct', this.data.id)
            //         .then(() => {
            //             // console.log(res);
            //             this.loading = false;
            //         })
            //         .catch(err => {
            //             console.log(err);
            //             this.loading = false;
            //         })
            // },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 
</style>
