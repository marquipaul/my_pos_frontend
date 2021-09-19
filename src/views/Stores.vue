<template>
    <div>
      <p class="grey--text text--darken-1">Stores</p>  
        <v-card>
            <v-card-title>
                <v-btn class="primary" @click="action({ action: 'add' })">
                    <v-icon>mdi-plus</v-icon>
                    Create Store
                </v-btn>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-data-table
                    :loading="loading"
                    :headers="headers"
                    :items="getStores.data"
                    :server-items-length="getStores.total"
                    :options.sync="pagination"
                    :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100]}"
                    class="elevation-1"
                >
                <template v-slot:item.created_at="{ item }">
                    {{moment(item.created_at).format('llll')}}
                </template>
                <template v-slot:item.enable_sms="{ item }">
                    <v-switch
                        :loading="item.id === form.id"
                        @change="smsStatus(item)"
                        inset
                        :input-value="item.enable_sms ? true : false"
                    ></v-switch>
                </template>
                <template v-slot:item.enable_receipt="{ item }">
                    <v-switch
                        :loading="item.id === form.id"
                        @change="receiptStatus(item)"
                        inset
                        :input-value="item.enable_receipt ? true : false"
                    ></v-switch>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon color="success" class="mr-2" v-on="on" @click="confirmAction({ action: 'edit', data: item })">mdi-pencil</v-icon>
                        </template>
                        <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon color="error" class="mr-2" v-on="on" @click="confirmAction({ action: 'delete', data: item })">mdi-delete</v-icon>
                        </template>
                        <span>Delete</span>
                    </v-tooltip>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <FormModal v-bind="userFormDialog" @close="userFormDialog = { ...userFormDialog, show: false, data: {} }"/>
        <v-dialog v-model="confirmDialog.show" scrollable max-width="540" color="primary" transition="scroll-y-reverse-transition" persistent>
                <v-card>
                    <v-card-title>
                        Confirmation
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon class="dialog-close" v-on="on" @click="confirmDialog.show = false">mdi-close</v-icon>
                        </template>
                        <span>Close</span>
                    </v-tooltip>
                    </v-card-title>
                    <v-card-text class="d-flex flex-column align-center justify-center px-9 py-4">
                        <p class="headline text-center py-4">{{ `${(confirmDialog.action == 'edit') ? 'Are you sure you want to edit' : 'Are you sure you want to delete'}` }} {{ `${(confirmDialog.data) ? `${confirmDialog.data.name}?` : 'this tenant?'}` }}</p>
                    </v-card-text>
                    <v-card-actions class="pa-5">
                        <v-row align="center" justify="center">
                            <v-col cols="12" class="d-flex justify-center pb-0">
                                <v-btn class="confirm-btn btn-min-width" depressed large dark :color="((confirmDialog.action == 'edit') ? '#2F80ED' : '#EB5757')" @click="action({ action: confirmDialog.action, data: confirmDialog.data });">{{ `${(confirmDialog.action == 'edit') ? 'Confirm' : 'Delete'}` }}</v-btn>

                                <v-btn class="btn-min-width" text large @click="confirmDialog.show = false">Cancel</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from "lodash";
import moment from 'moment';
import FormModal from '../components/super-admin/store/FormModal'
export default {
  components: { FormModal },
    data () {
      return {
        moment: moment,
        loading: false,
        search: '',
        dialog: false,
        form: {},
        pagination: {},
        userFormDialog: { show: false, action: '', data: {} },
        confirmDialog : { show: false, action: '', data: {} },
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Name', value: 'name' },
          { text: 'Owner Name', value: 'owner_name' },
          { text: 'Enable SMS', value: 'enable_sms' },
          { text: 'Enable Receipt', value: 'enable_receipt' },
          { text: 'Created At', value: 'created_at' },
          { text: 'Action', value: 'action' },
        ],
        first: true
      }
    },
    // mounted() {
    //   this.getDataFromApi();
    // },
    watch: {
      pagination: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      search: _.debounce(
        function() {
            this.getDataFromApi();
        },
        800,
        {
            leading: true,
            trailing: true
        }
      ),
    },
    methods: {
      smsStatus(item) {
        item.enable_sms = item.enable_sms ? 0 : 1;
        console.log(item)
        this.storeStatus(item)
      },
      receiptStatus(item) {
        item.enable_receipt = item.enable_receipt ? 0 : 1;
        console.log("ITEM", item)
        this.storeStatus(item)
      },
      storeStatus (item) {
        this.form = {
          id: item.id,
          enable_sms: item.enable_sms,
          enable_receipt: item.enable_receipt,
        }
        this.$store.dispatch('updateStoreStatus', this.form)
          .then(res => {
            console.log(res)
            setTimeout(() => {
              this.form = {}
            }, 1000);
            
          })
      },
      getDataFromApi() {
        this.loading = true
          if (this.first) {
            this.pagination.sortBy[0]='created_at'
            this.pagination.sortDesc[0]=true
          }

          this.first = false
          let params = {
            search: this.search,
            page: this.pagination.page,
            per_page: this.pagination.itemsPerPage,
            sort_by: this.pagination.sortBy[0],
            sort_order: this.pagination.sortDesc[0]? 'DESC' : 'ASC',
            whole: true
          }
        this.$store.dispatch('getStores', params)
          .then(res => {
              this.loading = false
            console.log(res)
          })
          .catch(error => {
              this.loading = false
            console.log(error)
          })
      },
      confirmAction({ action, data }) {
            // console.log(action, data);
            this.confirmDialog = { show: true, action, data };
        },
      action({ action, data }) {
            // console.log(action, data);
            switch (action) {
                case 'add':
                    this.userFormDialog = { show: true, action, data: {} };
                    break;
                case 'edit':
                    this.confirmDialog.show = false;
                    this.userFormDialog = { show: true, action, data }
                    break;
                case 'delete':
                    this.confirmDialog.show = false;
                    this.deleteUser();
                    break;
            }
        },
        deleteUser() {
            console.log(this.confirmDialog)
            this.loading = true
            this.$store.dispatch('deleteStore', this.confirmDialog.data.id)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.snackbar('success', 'Store Successfully Deleted');
                })
                .catch(error => {
                    this.loading = false
                    console.log(error)
                    this.snackbar('error', 'Something went wrong');
                })
        },
        snackbar(color, text) {
          this.$store.commit('SET_SNACKBAR', { 
              open: true, 
              color: color, 
              text: text,
              timeout: 4000
          });
        },
    },
    computed: {
    ...mapGetters({
      getStores: 'getWholeStores',
      currentUser: 'currentUser',
    })
  },
  }
</script>