<template>
  <div class="task">
    <navibar ref="nav" :navtitle="gname" :tel="$root.tel" :uname="$root.uname">
      <a slot="header" class="navbar-brand" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
      <span slot="action" class="glyphicon glyphicon-floppy-disk" @click="updateTask"></span>
    </navibar>
    <div class="container-fluid" style="margin-top: 20px; overflow-y:auto;">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <textarea rows="15" maxlength="255" class="form-control input-lg" id="task_content" v-model="content" ></textarea>
          </div>
          <div class="form-group">
            <div class="input-group">
              <input type="text" v-model="notify_date" class="form-control input-lg" readonly @focus="showDlg" placeholder="提醒时间">
              <span class="input-group-addon">
                <span class="glyphicon glyphicon-remove" @click="clearDate"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="modal-id" @click="hideDlg">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-body">
            <div id="task_date"></div>
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
#modal-id .datepicker-inline { margin: 0 auto; font-size: 18px; }
</style>

<script>
import Navibar from '@/components/Navibar'
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'
import 'bootstrap-datepicker/js/bootstrap-datepicker'
import 'bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN'

export default {
  name: 'task',
  data () {
    return {
      id: null,
      pid: null,
      content: null,
      gname: '',
      notify_date: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    // 刷新页面就返回列表
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
    $(() => {
      $('#modal-id').modal({
        backdrop: false,
        show: false
      })
      $('#task_date').datepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        todayHighlight: true
      })
      $('#task_date').on('changeDate', () => {
        this.notify_date = $('#task_date').datepicker('getFormattedDate')
        $('#modal-id').modal('hide')
      })
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    updateTask () {
      if (this.content == null || this.content === '') {
        alert('必须输入内容。')
        return
      }
      if (this.$root.runtime === 'cordova' && this.notify_date) {
        let date = new Date(Date.parse(this.notify_date))
        date.setHours(9)
        window.cordova.plugins.notification.local.schedule({
          id: this.id,
          title: '提醒',
          text: this.content,
          at: date
        })
      }
      this.$root.updateTask(this.id, this.pid, this.content, this.notify_date)
      this.$router.go(-1)
    },
    clearDate () {
      this.notify_date = ''
    },
    showDlg () {
      $('#modal-id').modal('show')
    },
    hideDlg () {
      $('#modal-id').modal('hide')
    }
  },
  components: {
    Navibar
  }
}
</script>

