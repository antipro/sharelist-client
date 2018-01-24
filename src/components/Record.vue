<template>
  <div>
    <div class="modal fade" id="modal-record">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">{{ $t('ui.recording') }}</h4>
          </div>
          <div class="modal-body text-center">
            <h3>{{ counter }}</h3>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="stopRecord(false)">{{ $t('ui.finish_recording') }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="modal-items">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">{{ $t('ui.candidate') }}</h4>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <button v-for="item in items" :key="item" type="button" class="list-group-item" @click="selectItem(item)">{{ item }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'

export default {
  name: 'record',
  data () {
    return {
      mediaRecorder: null,
      counter: 10,
      interPtr: 0,
      items: [],
      confirmed: false
    }
  },
  mounted () {
    $('#modal-record, #modal-items').modal({
      backdrop: false,
      show: false
    })
    $('#modal-record').on('show.bs.modal', (e) => {
      this.confirmed = false
      this.counter = 10
      this.interPtr = setInterval(() => {
        if (this.counter <= 0) {
          this.stopRecord()
        }
        this.counter--
      }, 1000)
    })
    $('#modal-record').on('hide.bs.modal', (e) => {
      clearInterval(this.interPtr)
      if (this.mediaRecorder) {
        this.mediaRecorder.stopRecord()
        this.mediaRecorder.release()
      }
    })
  },
  beforeDestroy () {
    clearInterval(this.interPtr)
    if (this.mediaRecorder) {
      this.mediaRecorder.stopRecord()
      this.mediaRecorder.release()
    }
  },
  methods: {
    startRecord () {
      let errorHandler = (error) => {
        console.log('Record Error', error)
      }
      this.mediaRecorder = new window.Media('cdvfile://localhost/temporary/speech.amr', () => {
        console.log('Record Success')
        if (!this.confirmed) { // Stop parsing if not confirmed by user
          return
        }
        window.resolveLocalFileSystemURL('cdvfile://localhost/temporary/speech.amr', (fileEntry) => {
          console.log(fileEntry)
          fileEntry.file(this.processFile, errorHandler)
        }, errorHandler)
        // window.resolveLocalFileSystemURL(window.cordova.file.externalRootDirectory, (dirEntry) => {
        //   dirEntry.getFile('8k-122.amr', {}, fileEntry => {
        //     console.log('fileEntry', fileEntry)
        //     fileEntry.file(this.processFile, errorHandler)
        //   }, errorHandler)
        // }, errorHandler)
      }, errorHandler)
      this.mediaRecorder.startRecord()
      $('#modal-record').modal('show')
    },
    stopRecord () {
      this.confirmed = true
      $('#modal-record').modal('hide')
    },
    processFile (file) {
      var reader = new FileReader()
      reader.onerror = () => {
        console.log('Can not read file', reader.error)
      }
      reader.onloadend = () => {
        let cuid = this.$root.uid
        let lan = 'zh'
        if (this.$root.locale === 'en') {
          lan = 'en'
        }
        this.$emit('recognizing')
        axios({
          method: 'post',
          url: 'http://vop.baidu.com/server_api?lan=' + lan + '&cuid=' + cuid + '&token=24.7fd075ee583a8021ebe4930893b59b03.2592000.1518941300.282335-10716330',
          headers: {
            'Content-Type': 'audio/amr; rate=8000'
          },
          data: reader.result
        }).then(response => {
          this.$emit('recognized')
          if (response.status !== 200) {
            console.error('Network Fault', response.status, response.statusText)
            alert(response.statusText)
            return
          }
          let res = response.data
          if (res.err_no === 0) {
            this.processResult(res.result)
          } else {
            alert(res.err_msg)
          }
        }).catch((error) => {
          this.$emit('recognized')
          console.log(error)
        })
      }
      reader.readAsArrayBuffer(file)
    },
    processResult (result) {
      console.log(result)
      if (result.length === 0) {
        alert('No Result')
      } else {
        this.showItems(result)
      }
    },
    showItems (result) {
      this.items = result
      $('#modal-items').modal('show')
    },
    selectItem (item) {
      this.$emit('getContent', item)
      $('#modal-items').modal('hide')
    }
  }
}
</script>
