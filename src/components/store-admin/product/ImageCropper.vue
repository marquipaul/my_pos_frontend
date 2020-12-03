<template>
    <v-dialog v-model="dialog" transition="scroll-y-reverse-transition" persistent max-width="600px" >
        <v-card>
            <v-form
                ref="form"
                lazy-validation
            >
            <v-card-title>
                 Product Image
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-center">
                
                <v-card
                  color="grey lighten-2"
                  class="mx-auto my-2"
                  max-width="400"
                  min-height="250"
                  >
                  <v-card-text>

                    <!-- <p v-if="!imgSrc" class="mt-12 white--text">Upload New Image</p> -->
                        <vue-cropper
                            style="border-radius: 7px;"
                            v-if="imgSrc"
                            ref="cropper"
                            max-width="250"
                            min-height="150"
                            :src="imgSrc"
                            :aspect-ratio="16/12"
                        >
                        </vue-cropper>
                  </v-card-text>
                </v-card> 
                <input
                      type="file"
                      style="display: none"
                      ref="image"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="onFilePicked"
                    >
                <v-btn class="primary" small @click="pickFile()">
                    <v-icon left small dark>mdi-camera</v-icon> 
                    Upload Image
                </v-btn>
                <v-btn v-show="!oldImage" :disabled="!imgSrc" class="primary" small @click.prevent="zoom(0.2)">
                    <v-icon left small dark>mdi-camera</v-icon> 
                    Zoom In
                </v-btn>
                <v-btn v-show="!oldImage" :disabled="!imgSrc" class="primary" small @click.prevent="zoom(-0.2)">
                    <v-icon left small dark>mdi-camera</v-icon> 
                    Zoom Out
                </v-btn>
                <v-btn v-show="!oldImage" :disabled="!imgSrc" class="primary" small @click.prevent="resetImage">
                    <v-icon left small dark>mdi-camera</v-icon> 
                    Reset
                </v-btn>
           </v-card-text>
            <v-divider></v-divider>
            <v-card-actions v-show="!oldImage">
                <v-btn small :loading="loading" :disabled="!imgSrc" @click="submitForm()" block class="primary">Save</v-btn>
            </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import axios from 'axios'
export default {
    //props: ['dialog', 'accountForm'],
    components: { VueCropper},
    props: {
        show: { type: Boolean, default: false, required: true },
        action: { type: String, default: '' },
        data: { type: Object, default: new Object() }
    },
    data() {
        return {
            imgSrc: '',
            croppedImage: '',
            images: [],
            dialog: this.show,
            loading: false,
            formData: {},
            oldImage: false,
            mime_type: '',
            fileName: ''
        }
    },
    mounted() {
        //this.getDataFromAPI()
    },
    watch: {
        show(to) {
            this.dialog = to;
        },
        data(to) {
            if (Object.keys(to).length > 0) {
                let { id, images } = to;
                this.formData = { ...this.formData, id, images };
                console.log(this.formData)
                if (this.formData.images) {
                    this.oldImage = true;
                    this.imgSrc = this.formData.images.image_url
                }
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
        zoom(percent) {
            this.$refs.cropper.relativeZoom(percent);
        },
        cropImage() {
            // get image data for post processing, e.g. upload or setting image src
            this.croppedImage = this.$refs.cropper.getCroppedCanvas().toDataURL();
            console.log(this.$refs.cropper.getCroppedCanvas())
        },
        resetImage() {
            this.$refs.cropper.reset();
        },
        pickFile () {
          this.$refs.image.click()
          this.fileUrl = ''
        },
        onFilePicked (e) {
          const file = e.target.files[0]
          this.mime_type = file.type
          this.fileName = file.name
          console.log(this.fileName)
             if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imgSrc = event.target.result;
                    // rebuild cropperjs with the updated source
                    this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
                this.oldImage = false;
            } else {
                alert('Sorry, FileReader API not supported');
            }
        },
        submitForm () {
            this.loading = true
            this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
                const formData = new FormData()
                if (this.formData.images) {
                    //formData.append('updateImage', true)
                    formData.append('images[0][id]', this.formData.images.id)
                    formData.append('images[0][image]', blob, this.fileName)
                    formData.append('_method', 'PUT')
                } else {
                    //formData.append('updateImage', true)
                    formData.append('images[0][image]', blob, this.fileName)
                    formData.append('_method', 'PUT')
                }
                axios.post(`/api/products/${this.formData.id}?updateImage`, formData)
                    .then(response => {
                        this.loading = false
                        console.log(response)
                        this.$store.commit('UPDATE_ADMIN_PRODUCT', response.data)
                        this.closeModal()
                        this.snackbar('success', 'Product Image Successfully Updated');
                    })
                    .catch(error => {
                        console.log(error)
                        this.snackbar('error', 'Something went wrong');
                    })
            }, this.mime_type)
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
            this.fileName = ''
            this.mime_type = '' 
            this.oldImage = false
            this.imgSrc = ''
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        },
    }
}
</script>