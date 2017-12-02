<template>
  <div class="preference">
    <navibar ref="nav" navtitle="设置" :tel="$root.tel" :uname="$root.uname">
    </navibar>
    <div class="container-fluid" style="margin-top: 20px;">
      <div class="row">
        <div class="col-md-6">
          <div v-if="$root.runtime === 'electron'" class="checkbox">
            <label class="input-lg" @click="toggle">
              <span v-if="starup_hidden===true" class="chkbox glyphicon glyphicon-check" ></span>
              <span v-if="starup_hidden===false" class="chkbox glyphicon glyphicon-unchecked"></span>
              启动时隐藏
            </label>
          </div>
          <div class="form-group">
            <label for="notify_time">默认提醒时间</label>
            <div class="input-group">
              <input type="text" v-model="notify_time" class="form-control input-lg" readonly placeholder="09:00" @focus="showTimeDlg">
            </div>
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
            <button type="button" class="btn btn-primary" @click="saveTime">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.preference { position: relative; height: 100%; width: 100%; }
@media screen and (min-width: 800px) {
  .preference { margin-left: 250px; width: calc(100% - 250px); }
}
.form-group { padding-left: 20px; }
span.chkbox { -webkit-text-stroke: 2px white; color: #51c4f1; }
</style>

<script>
/* eslint-disable no-eval */
import Navibar from '@/components/Navibar'
import jQuery from 'jquery'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'eonasdan-bootstrap-datetimepicker'

const $ = jQuery

export default {
  name: 'preference',
  data () {
    return {
      starup_hidden: false
    }
  },
  created () {
    if (this.$root.runtime === 'electron') {
      const ipc = eval('require(\'electron\')').ipcRenderer
      ipc.on('preference-get-reply', (event, ref) => {
        this.starup_hidden = ref.starup_hidden
      })
      ipc.send('preference-get-message')
    }
    $(() => {
      $('#time_modal').modal({
        backdrop: false,
        show: false
      })
      $('#task_time').datetimepicker({
        defaultDate: new Date(),
        format: 'HH:mm',
        stepping: 5,
        inline: true,
        sideBySide: true
      })
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    toggle () {
      this.starup_hidden = !this.starup_hidden
      const ipc = eval('require(\'electron\')').ipcRenderer
      ipc.on('preference-reply', function (event) {
        console.log('electron preference saved.')
      })
      ipc.send('preference-message', { starup_hidden: this.starup_hidden })
    },
    saveTime () {
      this.$root.updatePreference({
        notify_time: $('#task_time').data('DateTimePicker').date().format('HH:mm')
      })
      this.hideTimeDlg()
    },
    showTimeDlg () {
      $('#time_modal').modal('show')
    },
    hideTimeDlg () {
      $('#time_modal').modal('hide')
    }
  },
  components: {
    Navibar
  },
  computed: {
    notify_time () {
      return this.$store.state.preference.notify_time
    }
  }
}
</script>

