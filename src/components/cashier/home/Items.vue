<template>
  <div class="items">
    <v-row v-if="getProducts.length > 1" class="mt-n8">
      <v-col cols="12">
        <v-card flat class="grey"> 
            <v-tabs
              next-icon="mdi-arrow-right"
              prev-icon="mdi-arrow-left"
              show-arrows
              v-model="category"
            >
              <v-tabs-slider></v-tabs-slider>
              <v-tab
                v-for="(item, key) in tabs"
                :key="key"
              >
                {{ item }}
              </v-tab>
            </v-tabs>
          </v-card>
      </v-col>
    </v-row>
      <v-row class="mb-n5" >
        <v-col cols="12">
          <v-text-field 
            v-model="search" 
            filled
            rounded 
            dense
            placeholder="Search item" 
            prepend-inner-icon="mdi-magnify">
          </v-text-field>
        </v-col>
      </v-row>
        <v-row v-for="(item, category_index) in filteredCategory(category)" :key="category_index">
          <v-col v-if="item.products.length > 0" cols="12" class="title">{{item.category}}
            <v-divider></v-divider>
          </v-col>
          <v-col
            v-for="(product, product_index) in item.products"
            :key="product_index"
            xl="2"
            lg="3"
            md="4"
            sm="6"
            xs="12"
            cols="12"
          >
            <v-card 
              class="text-center"
              @click="addItem(product, category_index, product_index)"
              :disabled="checkValidQuantity(product)"
            > 
              <v-img
                :class="product.image_url? '' : 'grey'"
                height="175px"
                :src="product.image_url"
                :lazy-src="product.image_url"
              >
              <v-row>
                <v-col>
                  <v-chip small :class="`${product.quantity < 1? 'error white--text' : product.minimum_stock > product.quantity? 'warning white--text' : 'success white--text'}  float-right mr-2`">
                    Stock: {{product.quantity}}
                  </v-chip>
                </v-col>
              </v-row>
              <v-icon v-if="!product.image_url" dark x-large class="mt-4">
                mdi-camera-off
              </v-icon>
              </v-img>
                <v-card-text>
                    <h3 class="grey--text text--darken-3 text-truncate">
                      <span class="body-2">{{product.description}}</span>
                    </h3>
                </v-card-text>
                    <v-card-text class="text-center justify-center">
                            <div class="mt-n4 justify-center">
                              <span class="caption" v-if="product.price_type === 'WHOLESALE'">
                                WHOLESALE QUANTITY: {{product.price_type === 'RETAIL'? 1 : product.minimum_wholesale_order}}
                                <br>
                                <v-divider></v-divider>
                                PRICE: {{ numberWithCommas(product.wholesale_price)}}
                              </span>
                                <v-select
                                  :disabled="!currentUser.store.enable_wholesale"
                                  class="px-3 mt-1 mb-n6 caption"
                                  v-model="product.price_type"
                                  @change="checkValidQuantity(product)"
                                  :items="['RETAIL', 'WHOLESALE']"
                                  dense
                                  filled
                                ></v-select>
                              </div>
                    </v-card-text>

                    <v-divider class="mx-4"></v-divider>

                <v-card-actions>
                <v-btn
                    block
                    small
                    color="primary"
                    text
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
      loading: false,
      tabs: ['All'],
      category: 0
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      getProducts: 'getProducts',
      getCartProducts: 'retrieveCartItems'
    })
  },
  watch: {
    category: {
      handler() {
        if (this.category) {
          this.filteredCategory(this.category)
        }
      },
      deep: true
    }
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
          this.arrangeCategory()
        })
        .catch(error => {
          this.loading = false;
          console.log(error)
        })
    },
    arrangeCategory() {
      this.getProducts.forEach(item => {
        this.tabs.push(item.category);
        console.log(item.category)
      });
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
      this.snackbar('success', 'Product has been added to the Cart');
    },
    snackbar(color, text) {
        this.$store.commit('SET_SNACKBAR', { 
            open: true, 
            color: color, 
            text: text,
            timeout: 4000
        });
    },
    filteredCategory(index) {
      const search = this.search.toLowerCase().trim();
      if (index) {
        if (!search) {
          return this.getProducts.filter((product) => {
            var catIndex = this.getProducts.findIndex(item => item.id === product.id);
            return catIndex == index-1;
          })
        }
        return this.getProducts.filter((product) => {
          var catIndex = this.getProducts.findIndex(item => item.id === product.id);
          return catIndex == index-1;
        }).map(item => {
          return {
            ...item,
            products: item.products.filter(product => {
              return product.description.toLowerCase().includes(search);
            }),
          }
        });
        
      } else {
        if (!search) {
          return this.getProducts;
        }
        return this.getProducts.map(item => {
          return {
            ...item,
            products: item.products.filter(product => {
              return product.description.toLowerCase().includes(search);
            }),
          }
        });
      }
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
<style scoped>
.img-center {
  margin: auto;
}
</style>