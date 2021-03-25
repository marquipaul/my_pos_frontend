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
      items: []
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
            let { customer, orders } = to;
            this.formData = { ...this.formData, customer, orders };
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