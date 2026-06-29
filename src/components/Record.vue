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
              <button v-for="item in items" :key="item" type="button" class="list-group-item" @click="selectItem(item)">{{ formatted(item) }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'record',
  data () {
    return {
      recognition: null,
      counter: 10,
      interPtr: 0,
      items: [],
      finalTranscript: ''
    }
  },
  mounted () {
    $('#modal-record, #modal-items').modal({
      backdrop: false,
      show: false
    })
    $('#modal-record').on('show.bs.modal', () => {
      this.finalTranscript = ''
      this.counter = 10
      this.interPtr = setInterval(() => {
        if (this.counter <= 0) {
          this.stopRecord()
        }
        this.counter--
      }, 1000)
    })
    $('#modal-record').on('hide.bs.modal', () => {
      clearInterval(this.interPtr)
      if (this.recognition) {
        this.recognition.stop()
        this.recognition = null
      }
    })
  },
  beforeDestroy () {
    clearInterval(this.interPtr)
    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }
  },
  methods: {
    startRecord () {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        alert(this.$t('message.no_result'))
        return
      }
      let lan = this.$root.locale === 'en' ? 'en-US' : 'zh-CN'
      this.recognition = new SpeechRecognition()
      this.recognition.lang = lan
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 5

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            this.finalTranscript = result[0].transcript
          }
        }
      }

      this.recognition.onerror = (event) => {
        console.log('Speech recognition error', event.error)
        $('#modal-record').modal('hide')
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          alert('Speech recognition error: ' + event.error)
        }
      }

      this.recognition.onend = () => {
        $('#modal-record').modal('hide')
        if (this.finalTranscript) {
          this.processResult([this.finalTranscript])
        }
      }

      this.recognition.start()
      $('#modal-record').modal('show')
    },
    stopRecord () {
      if (this.recognition) {
        this.recognition.stop()
        this.recognition = null
      }
      $('#modal-record').modal('hide')
    },
    processResult (result) {
      if (result.length === 0 || !result[0]) {
        alert(this.$t('message.no_result'))
      } else {
        this.showItems(result)
      }
    },
    showItems (result) {
      this.items = result
      $('#modal-items').modal('show')
    },
    selectItem (item) {
      this.$emit('getContent', this.formatted(item))
      $('#modal-items').modal('hide')
    },
    formatted (item) {
      return item
    }
  }
}
</script>
