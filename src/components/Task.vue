<template>
  <div style="position: relative; height: 100%; width: 100vw;">
  <navibar ref="nav" navtitle="任务" :tel="$root.tel" :uname="$root.uname">
    <span class="glyphicon glyphicon-floppy-disk" @click="updateTask"></span>
  </navibar>
  <div class="container" style="margin-top: 20px;">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <h3>{{ gname }}</h3>
        </div>
        <div class="form-group">
          <label for="task_content">内容</label>
          <textarea rows="15" maxlength="255" class="form-control" id="task_content" v-model="content"></textarea>
        </div>
        <div class="form-group">
          <label for="task_date">时间</label>
          <div class="input-group">
            <input type="text" id="task_date" class="form-control" readonly>
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" @click="notify_date=''">
                <span class="glyphicon glyphicon-remove"></span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<style scoped>
.vdatetime input { border-radius: 4px; }
#task_content { font-size: 16px; }
</style>

<script>
import Navibar from '@/components/Navibar'
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-datepicker'
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
      $('#task_date').val(this.notify_date)
      $('#task_date').datepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd'
      })
      $('#task_date').on('changeDate', () => {
        this.notify_date = $('#task_date').datepicker('getFormattedDate')
      })
    })
  },
  methods: {
    updateTask () {
      this.$root.updateTask(this.id, this.pid, this.content, this.notify_date)
      this.$router.go(-1)
    }
  },
  components: {
    Navibar
  }
}
</script>

