<template>
  <div class="task">
    <navibar ref="nav" :navtitle="gname" :email="$root.email" :uname="$root.uname">
      <a slot="header" class="navbar-brand" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
      <span slot="action" class="glyphicon glyphicon-floppy-disk" @click="updateTask"></span>
    </navibar>
    <div class="container-fluid" style="margin-top: 20px; overflow-y:auto;">
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <textarea rows="12" maxlength="500" class="form-control input-lg" id="task_content" v-model="content"></textarea>
            <p class="help-block">
              <span class="label label-default">{{ 500 - content.length + ' ' + $t('ui.left')  }}</span>
              <span class="label label-info">{{ saveStatus }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <div class="input-group">
              <input type="date" v-model="notify_date" class="form-control input-lg" min="1970-01-01" max="2500-12-31" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" :placeholder="$t('ui.date_for_notification')">
              <span class="input-group-addon">
                <span class="glyphicon glyphicon-remove" @click="clearDate"></span>
              </span>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div v-show="notify_date" class="form-group">
            <div class="input-group">
              <input type="time" v-model="notify_time" class="form-control input-lg" pattern="[0-9]{2}:[0-9]{2}" :placeholder="$t('ui.time_for_notification')">
              <span class="input-group-addon">
                <span class="glyphicon glyphicon-remove" @click="clearTime"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="$root.runtime === 'cordova'" class="row">
        <div class="col-xs-12">
          <div v-show="isInProgress" class="progress">
            <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%"></div>
          </div>
          <record ref="record" @getContent="contentGet" @recognizing="isInProgress = true" @recognized="isInProgress = false"></record>
          <button v-show="isInProgress === false" class="btn btn-primary btn-lg btn-block" @click="startRecord"><span class="glyphicon glyphicon-record"></span> {{ $t('ui.speech_recognition') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.task { position: relative; height: 100%; width: 100%; overflow-y: auto; }
@media screen and (min-width: 800px) {
  .task { margin-left: 250px; width: calc(100% - 250px); }
}
.task .container-fluid { position: absolute; top: 50px; bottom: 0; left: 0px; width: 100%; margin: 0px; padding-top: 10px; overflow-y: auto; }
.task textarea { resize: none; }
#date_modal .datepicker-inline { margin: 0 auto; font-size: 18px; }
</style>

<script>
import Navibar from '@/components/Navibar'
import Record from '@/components/Record'

export default {
  name: 'task',
  data () {
    return {
      id: null,
      pid: null,
      content: null,
      gname: '',
      notify_date: '',
      notify_time: '',
      mediaRecorder: null,
      isInProgress: false,
      timeoutPtr: null,
      saveStatus: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/') {
      next('/')
    } else {
      next()
    }
  },
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
      return
    }
    this.id = this.$route.params.id
    this.pid = this.$route.params.pid
    this.content = this.$route.params.content
    this.gname = this.$route.params.gname
    if (this.$route.params.notify_date) {
      this.notify_date = this.$route.params.notify_date
    }
    if (this.$route.params.notify_time) {
      this.notify_time = this.$route.params.notify_time
    }
  },
  mounted () {
    if (this.$root.runtime !== 'cordova') {
      document.querySelector('#task_content').focus()
    }
    let autoSave = () => {
      if (this.content !== '') {
        this.saveStatus = this.$t('message.saving')
        this.$root.updateTask({
          id: this.id,
          pid: this.pid,
          content: this.content,
          notify_date: this.notify_date,
          notify_time: this.notify_time
        }, () => {
          this.saveStatus = this.$t('message.saved')
          setTimeout(() => {
            this.saveStatus = ''
          }, 5000)
        })
      }
      this.timeoutPtr = setTimeout(autoSave, 60000)
    }
    this.timeoutPtr = setTimeout(autoSave, 60000)
    if (this.$root.runtime !== 'cordova') {
      document.addEventListener('keydown', this.shortCut, false)
    }
    if (this.$root.runtime === 'electron') {
      document.querySelector('textarea').addEventListener('contextmenu', this.$root.rightMenu, false)
    }
  },
  beforeDestroy () {
    clearInterval(this.timeoutPtr)
    if (this.$root.runtime !== 'cordova') {
      document.removeEventListener('keydown', this.shortCut, false)
    }
  },
  methods: {
    shortCut (evt) {
      if (evt.ctrlKey && evt.keyCode === 83) {
        this.updateTask()
        evt.preventDefault()
      }
      if (evt.ctrlKey && evt.keyCode === 66) {
        this.$router.go(-1)
      }
    },
    back () {
      this.$router.go(-1)
    },
    updateTask () {
      if (this.content == null || this.content === '') {
        alert(this.$t('message.content_required'))
        return
      }
      this.$root.updateTask({
        id: this.id,
        pid: this.pid,
        content: this.content,
        notify_date: this.notify_date,
        notify_time: this.notify_time
      })
      this.$router.go(-1)
    },
    clearDate () {
      this.notify_date = ''
      this.notify_time = ''
    },
    clearTime () {
      this.notify_time = ''
    },
    startRecord () {
      this.$refs.record.startRecord()
    },
    contentGet (text) {
      this.content += text
    }
  },
  components: {
    Navibar, Record
  }
}
</script>

