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
            <textarea rows="15" maxlength="255" class="form-control input-lg" id="task_content" v-model="content" ></textarea>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <div class="input-group">
              <input type="text" v-model="notify_date" class="form-control input-lg" readonly @focus="showDateDlg" :placeholder="$t('ui.date_for_notification')">
              <span class="input-group-addon">
                <span class="glyphicon glyphicon-remove" @click="clearDate"></span>
              </span>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div v-show="notify_date" class="form-group">
            <div class="input-group">
              <input type="text" v-model="notify_time" class="form-control input-lg" readonly @focus="showTimeDlg" :placeholder="$t('ui.time_for_notification')">
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
    
    <div class="modal fade" id="date_modal" @click="hideDateDlg">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-body">
            <div id="task_date"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="time_modal" @click="hideTimeDlg">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-body">
            <div id="task_time"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="saveTime">{{ $t('ui.confirm') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.task { position: relative; height: 100%; width: 100%; overflow-y: auto; }
@media screen and (min-width: 800px) {
  .task { margin-left: 250px; width: calc(100% - 250px); }
}
textarea { resize: none; }
</style>
<style>
#date_modal .datepicker-inline { margin: 0 auto; font-size: 18px; }
</style>

<script>
import Navibar from '@/components/Navibar'
import Record from '@/components/Record'
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'
import 'bootstrap-datepicker/js/bootstrap-datepicker'
import 'bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'eonasdan-bootstrap-datetimepicker'

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
      isInProgress: false
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
    $(() => {
      $('#date_modal').modal({
        backdrop: false,
        show: false
      })
      $('#time_modal').modal({
        backdrop: false,
        show: false
      })
      $('#task_date').datepicker({
        language: this.$root.locale,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        todayBtn: true
      })
      if (this.notify_date !== '') {
        $('#task_date').datepicker('setDate', this.notify_date)
      }
      let defaultTime = new Date()
      if (this.notify_time !== '') {
        defaultTime = this.notify_date + ' ' + this.notify_time
      }
      $('#task_time').datetimepicker({
        defaultDate: defaultTime,
        format: 'HH:mm',
        stepping: 5,
        inline: true,
        sideBySide: true
      })
      $('#task_date').on('changeDate', () => {
        this.notify_date = $('#task_date').datepicker('getFormattedDate')
        $('#date_modal').modal('hide')
      })
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    updateTask () {
      if (this.content == null || this.content === '') {
        alert('Content is required.')
        return
      }
      this.$root.updateTask(this.id, this.pid, this.content, this.notify_date, this.notify_time)
      this.$router.go(-1)
    },
    saveTime () {
      this.notify_time = $('#task_time').data('DateTimePicker').date().format('HH:mm')
      this.hideTimeDlg()
    },
    clearDate () {
      this.notify_date = ''
      this.notify_time = ''
    },
    clearTime () {
      this.notify_time = ''
    },
    showDateDlg () {
      $('#date_modal').modal('show')
    },
    hideDateDlg () {
      $('#date_modal').modal('hide')
    },
    showTimeDlg () {
      $('#time_modal').modal('show')
    },
    hideTimeDlg () {
      $('#time_modal').modal('hide')
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

