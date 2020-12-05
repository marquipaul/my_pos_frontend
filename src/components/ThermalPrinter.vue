<template>
    <div>
        <!-- <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="6"
            v-if="loading"
          ></v-progress-linear> -->
    </div>
</template>
<script>
import EscPosEncoder from 'esc-pos-encoder';
export default {
    props: {
        print: { type: Boolean, default: false, required: true },
        data: { type: Object, default: new Object(), required: true }
    },
  name: 'Thermal-Printer',
  data () {
    return {
      loading: false,
      title: '',
      printCharacteristic: null,
      textFinal: '',
      formData: {},
      items: [],
      items1: [
        [                                   
          { text:"10 Grape Fruit Chum Churum @130.00", align:"LEFT", width: 0.65625 },
          { text:"1,300.00", align:"RIGHT", width: 0.34375 }
        ],
        [                                   
          { text:"10 Original Chum Churum @130.00", align:"LEFT", width: 0.65625 },
          { text:"1,300.00", align:"RIGHT", width: 0.34375 }
        ]
      ]
    }
  },
  watch: {
    print(to) {
        if (to) {
            setTimeout(() => {
                this.printReceipt();
            }, 250);
        }
    },
    data(to) {
        if (Object.keys(to).length > 0) {
            let { id, customer_id, cash_tenered, created_at, full_invoice_number, order_code, products, store, total_amount} = to;
            this.formData = { ...this.formData, id, customer_id, cash_tenered, created_at, full_invoice_number, order_code, products, store, total_amount };
        }
    },
  },
  methods: {
    printReceipt() {
      this.loading = true
      if (this.printCharacteristic == null) {
        navigator.bluetooth.requestDevice({
          filters: [{
            services: ['000018f0-0000-1000-8000-00805f9b34fb']
          }]
        })
        .then(device => {
          console.log('> Found ' + device.name);
          console.log('Connecting to GATT Server...');
          return device.gatt.connect();
        })
        .then(server => server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb"))
        .then(service => service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb"))
        .then(characteristic => {
          // Cache the characteristic
          this.printCharacteristic = characteristic;
          this.arrangeItems();
        })
        .catch(this.handleError);
      } else {
        this.arrangeItems();
      }
    },
    arrangeItems() {
        for (let index = 0; index < this.formData.products.length; index++) {
            const item = this.formData.products[index];
            var data = [
                { text:`${item.description} x ${item.quantity} @${this.numberWithCommasR(item.amount)}`, align:"LEFT", width: 0.65625 },
                { text:`${this.numberWithCommasR(item.total_amount)}`, align:"RIGHT", width: 0.34375 }
            ]
            this.items.push(data);
        }
        console.log(this.items)
        this.sendTextData()
    },
    sendTextData() {
      let encoder = new EscPosEncoder();
      //Supports 58mm only
      let result = encoder
            .align('center')
            .qrcode(`https://console.stock-points.com/customer/receipt/${this.formData.customer_id}/${this.formData.order_code}`)
            .newline()
            .bold(true)
            .text(`${this.formData.store? this.formData.store.name : ''}`, 35)
            .bold(false)
            .newline()
            .newline()
            .text(`${this.formData.store? this.formData.store.address : ''}`, 20)
            .newline()
            .line('================================')
            .align('center')
            .line('SALES RECEIPT')
            .align('left')
            .line('--------------------------------')
            .line('DESCRIPTION               AMOUNT')
            .line('--------------------------------')
            .tableLoop(this.items)
            .line('--------------------------------')
            .tableCustom([                                   
                { text:"TOTAL", align:"LEFT", width: 0.65625, bold: true },
                { text:`${this.numberWithCommasR(this.formData.total_amount)}`, align:"RIGHT", width: 0.34375, bold: true }
            ])
            .tableCustom([                                   
                { text:"Payment Received", align:"LEFT", width: 0.65625 },
                { text:`${this.numberWithCommasR(this.formData.cash_tenered)}`, align:"RIGHT", width: 0.34375 }
            ])
            .line('--------------------------------')
            .tableCustom([                                   
                { text:"CHANGE", align:"LEFT", width: 0.65625, bold: true },
                { text:`${this.numberWithCommasR(this.formData.cash_tenered-this.formData.total_amount)}`, align:"RIGHT", width: 0.34375, bold: true }
            ])
            .newline()
            .newline()
            .align('center')
            .text('This will serve as your Official Receipt', 30)
            .newline()
            .newline()
            .text('This Official Receipt shall be valid for Five(5) years from the date of permit to use.', 35)
            .newline()
            .newline()
            .encode();

      this.loopEncoder(result)
    },
    loopEncoder(result) {
      var data = []
      var i,j,temporary,chunk = 512;
      for (i=0,j=result.length; i<j; i+=chunk) {
          temporary = result.slice(i,i+chunk);
          data.push(temporary)
      }
      console.log(data)
      //Loop on a primise based
      for (let i = 0, p = Promise.resolve(); i < data.length; i++) {
          p = p.then(() => new Promise(resolve =>
              this.printValue(data[i]).then(()=> {
                resolve();
                if (data.length == i+1) {
                  console.log('Write done.');
                  this.loading = false;
                  this.items = []
                  this.$emit('done')
                }
              })
          ));
      }
    },
    printValue(data) {
      // execute after promise
      return new Promise((resolve) => {
        return this.printCharacteristic.writeValue(data).then(() => {
            resolve();
         })
        .catch(() =>  {
            console.log("DOMException: GATT operation already in progress.")
        });
      })
    },
    handleError (error, device) {
      console.error('handleError => error', error)
      if (device != null) {
        device.gatt.disconnect()
      }
      let erro = JSON.stringify({
        code: error.code,
        message: error.message,
        name: error.name
      })
      console.log('handleError => erro', erro)
      if (error.code !== 8) {
        alert('Could not connect with the printer. Try it again')
      }
      this.loading = false
      this.$emit('done')
    }
  }
}
</script>