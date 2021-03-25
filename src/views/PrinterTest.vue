<template>
    <div>
      <div>
        <v-textarea
          label="Store Name"
          v-model="title"
        />
      </div>
      <div class="text-center">
        <v-btn :loading="loading" color="primary" @click="print()">Print</v-btn>
      </div>
      <div class="text-center">
        <v-btn :loading="loading" color="primary" @click="sendTextData()">TEst</v-btn>
      </div>
    </div>
</template>
<style>
</style>

<script>
import EscPosEncoder from 'esc-pos-encoder';
export default {
  name: 'PageIndex',
  data () {
    return {
      loading: false,
      title: '',
      printCharacteristic: null,
      isMobile: this.$vuetify.breakpoint.mobile,
      cartItems: [
        {
          title: 'Original',
          quantity: 2,
          price: 135
        },
        {
          title: 'Fresh',
          quantity: 2,
          price: 135
        },
        {
          title: 'Grape Fruit Chum Churum',
          quantity: 2,
          price: 135
        }
      ],
      textFinal: '',
      items: [
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
  mounted() {
    console.log(this.wordWrap('Local variables are created when a function starts, and deleted when the function is completed. Global JavaScript Variables', 25))
    // Create our html template, could be an html file on it's own
    const TestTable = `
    <html>
        <head>
            <meta charset="utf-8">
        </head>   
        <body>
            <style>
              table {border-collapse:collapse; table-layout:fixed; width:310px;}
              table td {border:solid 1px #fab; width:100px; word-wrap:break-word;}
              table tr {margin-top: 10px; }
            </style>  
            <div class="invoice-box">
                <table class="receipt-table">
                    <tbody>
                        ${this.cartItems.map(item =>
                            `
                                <tr>
                                    <td width="5"> ${item.quantity}</td>
                                    <td width="75"> ${this.wrapText(item)}</td>
                                    <td width="20" align="right">
                                    <span align="right" style="text-align:right;">
                                    ${this.numberWithCommasR(this.totalPerItemList(item))}
                                    <span>
                                    </td>
                                </tr>
                            `
                        )}
                    </tbody>
                    
            </table>
            </div>            
        </body>     
    </html>`
    const { htmlToText } = require('html-to-text');
 
    const text = htmlToText(TestTable, {
        wordwrap: false,
        tables: ['.invoice-box', '.receipt-table'],
        tags: { 'table': { options: { rowSpacing: 1, colSpacing: 1, maxColumnWidth: 22 } } }
    });
    this.textFinal = text;
    console.log(this.textFinal);
  },
  methods: {
    wordWrap(str, maxWidth) { //20 or 21
      var newLineStr = "---"; 
      var res = '';
      var res2 = '';
      //res2 = str.substring(0, maxWidth - 1);
      for (var i1 = maxWidth - 1; i1 >= 0; i1--) {
          if (this.testWhite(str.charAt(i1))) {
              //res2 = str.slice(0, i1);
               res2 = str.slice(0, i1);
              // str = str.slice(i + 1);
          }
      }
      while (str.length > maxWidth) {                 
          var found = false;
          // Inserts new line at first whitespace of the line
          for (var i = maxWidth - 1; i >= 0; i--) {
              if (this.testWhite(str.charAt(i))) {
                  //res2 = str.substring(0, maxWidth - 1);
                  res = res + [str.slice(0, i), newLineStr].join('');
                  str = str.slice(i + 1);
                  found = true;
                  break;
              }
          }
          // Inserts new line at maxWidth position, the word is too long to wrap
          if (!found) {
              res += [str.slice(0, maxWidth), newLineStr].join('');
              str = str.slice(maxWidth);
          }

      }
      console.log(res2)

      return res + str;
  },

  testWhite(x) {
      var white = new RegExp(/^\s$/);
      return white.test(x.charAt(0));
  },
    totalPerItemList(item) {
      return item.quantity*item.price
    },
    wrapText(item) {
      var wrap = require('word-wrap');
      return wrap(`${item.title} @${this.numberWithCommasR(item.price)}`,
                  {
                    width: 22,  
                    newline: '<br/>'
                  }
                );
    },
    print () {
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
          this.sendTextData();
        })
        .catch(this.handleError);
      } else {
        this.sendTextData();
      }
    },
    sendTextData() {
      let encoder = new EscPosEncoder();
      //Supports 58mm only
      let result = encoder
          .align('center')
          .qrcode('https://console.stock-points.com')
          .newline()
          .bold(true)
          .text(`${this.title}`, 35)
          .bold(false)
          .newline()
          .newline()
          .text('Prk 3, Bonifacio st. Brgy. Poblacion, Polillo, Quezon', 20)
          .newline()
          .line('================================')
          .align('center')
          .line('SALES RECEIPT')
          .align('left')
          .line('--------------------------------')
          .line('DESCRIPTION               AMOUNT')
          .line('--------------------------------')
          //.text(this.textFinal)
          .tableLoop(this.items)
          .line('--------------------------------')
          .line('--------------------------------')
          .newline()
          .align('left')
          .text(`TOTAL AMOUNT:`)
          .align('left')
          .align('right')
          .text(`${this.numberWithCommasR(560)}`)
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
                  this.loading = false
                }
              })
          ));
      }
    },
    printValue(data) {
      // execute after promise
      return new Promise((resolve) => {
        return this.printCharacteristic.writeValueWithResponse(data).then(() => {
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
    }
  }
}
</script>