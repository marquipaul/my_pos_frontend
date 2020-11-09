<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="1200px"
    >
      <v-card>
        <v-card-title>
             Order #{{order.order_code}}
            <v-spacer></v-spacer>
            <v-btn
            icon
            
            @click="$emit('close')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-card class="mt-3" flat>
                <v-simple-table dense>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            Item Code
                        </th>
                        <th class="text-left">
                            Description
                        </th>
                        <th class="text-left">
                            Type
                        </th>
                        <th class="text-left">
                            Quantity
                        </th>
                        <th class="text-left">
                            Amount
                        </th>
                        <th class="text-left">
                            Cost Price
                        </th>
                        <th class="text-left">
                            Total Amount
                        </th>
                        <th class="text-left">
                            Total Cost Price
                        </th>
                        <th class="text-left">
                            Total Profit
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in order.products"
                        :key="item.id"
                        >
                        <td>{{ item.item_code }}</td>
                        <td>{{ item.description }}</td>
                        <td>{{ item.price_type }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ numberWithCommas(item.amount) }}</td>
                        <td>{{ numberWithCommas(item.cost_price) }}</td>
                        <td>{{ numberWithCommas(item.total_amount) }}</td>
                        <td>{{ numberWithCommas(item.total_cost_price) }}</td>
                        <td>{{ numberWithCommas(item.total_profit) }}</td>
                        </tr>
                        <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="font-weight-bold">Total </td>
                        <td class="font-weight-bold">{{ numberWithCommas(order.total_amount) }}</td>
                        <td class="font-weight-bold">{{ numberWithCommas(order.total_cost_price) }}</td>
                        <td class="font-weight-bold">{{ numberWithCommas(order.total_profit) }}</td>
                        </tr>
                    </tbody>
                    
                    </template>
                </v-simple-table>
            </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
    props: ['dialog', 'order']
}
</script>