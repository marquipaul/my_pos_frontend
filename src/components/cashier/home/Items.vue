<template>
  <div class="items">
      <v-row class="mb-n5" >
        <v-col cols="12">
          <v-text-field 
            v-model="search" 
            filled
            rounded 
            dense
            clearable
            placeholder="Search item" 
            prepend-inner-icon="mdi-magnify">
          </v-text-field>
        </v-col>
      </v-row>
        <v-row v-for="(item, category_index) in getProducts" :key="category_index">
          <v-col v-if="item.products.length > 0" cols="12" class="title">{{item.category}}
            <v-divider></v-divider>
          </v-col>
          <v-col
            v-for="(product, product_index) in filteredProducts(category_index)"
            :key="product_index"
            xl="3"
            lg="3"
            md="6"
            sm="12"
            xs="12"
            cols="12"
          >
            <v-card> 
                <v-card-text>
                    <h3 class="font-weight-regular grey--text text--darken-3">
                      <span>{{product.description}}</span>
                      <v-chip
                        class="float-right"
                        color="green"
                        text-color="white"
                        x-small
                      >
                        {{product.quantity}}
                      </v-chip>
                    </h3>
             

                </v-card-text>
                    <v-card-text>
                        <v-row
                            align="center"
                            class="mx-0"
                        >

                            <div class="mt-n4">
                              <span v-if="product.price_type === 'WHOLESALE'">
                                WHOLESALE QUANTITY: {{product.price_type === 'RETAIL'? 1 : product.minimum_wholesale_order}}
                                |
                                PRICE: {{product.wholesale_price}}
                              </span>
                              <v-radio-group
                                  v-model="product.price_type"
                                  @change="checkValidQuantity(product)"
                                  row
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
                            </div>
                        </v-row>
                    </v-card-text>

                    <v-divider class="mx-4"></v-divider>

                <v-card-actions>
                <v-btn
                    block
                    color="deep-purple lighten-2"
                    text
                    @click="addItem(product, category_index, product_index)"
                    :disabled="checkValidQuantity(product)"
                >
                    Add to Cart {{numberWithCommas(getPrice(product))}}
                </v-btn>
                </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
export default {
  name: 'items',
  data() {
    return {
      search: '',
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    ...mapGetters({
      getProducts: 'getProducts',
      getCartProducts: 'retrieveCartItems'
    })
  },
  methods: {
    getPrice(item) {
      if (item.price_type === 'RETAIL') {
        return item.retail_price;
      } else {
        return item.wholesale_price*item.minimum_wholesale_order;
      }
    },
    getData() {
      this.loading = true;
      this.$store.dispatch('getProducts')
        .then(res => {
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error)
        })
    },
    updateProduct(item, product_index, category_index) {
      //Update Product
      this.$store.commit('UPDATE_PRODUCT', {item, product_index, category_index})
    },
    addItem(item) {
      var price = item.price_type === 'RETAIL'? item.retail_price : item.wholesale_price;
      var quantity = item.price_type === 'RETAIL'? 1 : item.minimum_wholesale_order;
      var amount = price * quantity;
      var product = {
        product_id: item.id,
        description: item.description,
        quantity: quantity,
        minimum_wholesale_order: item.minimum_wholesale_order,
        price_type: item.price_type,
        current_quantity: item.quantity,
        price: price,
        amount: amount,
      }
      if (product.quantity > product.current_quantity) {
        this.snackbar('error', 'Low Product Quantity');
      } else {
        this.submitItem(product);
      }
    },
    submitItem(product) {
      this.$store.dispatch('addProductToCart', product);
    },
    snackbar(color, text) {
        this.$store.commit('SET_SNACKBAR', { 
            open: true, 
            color: color, 
            text: text,
            timeout: 4000
        });
    },
    filteredProducts(index) {
      var query = this.search? this.search : '';
        return this.getProducts[index].products.filter((product) => {
          return product.description.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
    },
    checkValidQuantity(product) {
      let index = this.getCartProducts.findIndex(item => item.product_id === product.id);
      
      if (index != -1) {
        var productItem = this.getCartProducts[index];

        if (productItem.price_type === 'RETAIL') {
          var status = productItem.current_quantity === productItem.quantity;
        } else {
          //var current_quantity = item.current_quantity
          status =  productItem.current_quantity < productItem.quantity+productItem.minimum_wholesale_order;
        }
        //console.log('Wholesale Status', productItem.current_quantity < productItem.quantity+productItem.minimum_wholesale_order)
        
        return status;

      } else {
        return product.quantity === 0;
      }
    }
  }
}
</script>
