<template>
    <div>
        <p class="grey--text text--darken-1">Expenses</p>
        <v-card>
            <v-card-title>
                <v-btn class="primary" @click="action({ action: 'add' })">
                    <v-icon>mdi-plus</v-icon>
                    Add Expense
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
                    :items="getExpenses.data"
                    :server-items-length="getExpenses.total"
                    :options.sync="pagination"
                    :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100]}"
                    class="elevation-1"
                >
                <template v-slot:item.created_at="{ item }">
                    {{moment(item.created_at).format('llll')}}
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
                        <p class="headline text-center py-4">{{ `${(confirmDialog.action == 'edit') ? 'Are you sure you want to edit' : 'Are you sure you want to delete'}` }} {{ `${(confirmDialog.data) ? `${confirmDialog.data.expense_code}?` : 'this expense?'}` }}</p>
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
import FormModal from '../components/store-admin/expense/FormModal'
export default {
  components: { FormModal },
    data () {
      return {
        moment: moment,
        loading: false,
        search: '',
        dialog: false,
        pagination: {},
        userFormDialog: { show: false, action: '', data: {} },
        confirmDialog : { show: false, action: '', data: {} },
        headers: [
          { text: 'Code', value: 'expense_code' },
          { text: 'Description', value: 'description' },
          { text: 'Amount', value: 'expense_amount' },
          { text: 'Created At', value: 'created_at' },
          { text: 'Action', value: 'action', sortable: false },
        ],
        first: true
      }
    },
    mounted() {
      this.getDataFromApi();
    },
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
          }
        this.$store.dispatch('getExpenses', params)
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
                    this.deleteExpense();
                    break;
            }
        },
        deleteExpense() {
            console.log(this.confirmDialog)
            this.loading = true
            this.$store.dispatch('deleteExpense', this.confirmDialog.data.id)
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.snackbar('success', 'Expense Successfully Deleted');
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
      getExpenses: 'getExpenses'
    })
  },
  }
</script>