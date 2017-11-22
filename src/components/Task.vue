<template>
  <div style="position: relative; height: 100%; width: 100vw;">
  <navibar ref="nav" navtitle="项目" :tel="$root.tel" :uname="$root.uname"></navibar>
  <div class="container" style="margin-top: 20px;">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="task_content">内容</label>
          <textarea rows="15" maxlength="255" class="form-control" id="task_content" v-model="content"></textarea>
        </div>
        <div class="form-group">
          <label for="task_date">时间</label>
          <div class="input-group">
            <datetime id="task_date" v-model="notify_date" type="date" input-format="YYYY-MM-DD" locale="en" input-class="form-control"></datetime>
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" @click="notify_date=''">
                <span class="glyphicon glyphicon-remove"></span>
              </button>
            </span>
          </div>
          
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-default" @click="updateTask">
            <span class="glyphicon glyphicon-floppy-disk"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<style scoped>
.vdatetime input {
  border-radius: 4px;
}
</style>

<script>
import Navibar from '@/components/Navibar'

export default {
  name: 'task',
  data () {
    return {
      id: null,
      pid: null,
      content: null,
      notify_date: ''
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
    if (this.$route.params.notify_date) {
      this.notify_date = this.$route.params.notify_date
    }
  },
  methods: {
    updateTask () {
      console.log(Date.parse(this.notify_date))
      this.$root.updateTask(this.id, this.pid, this.content, this.notify_date)
      this.$router.go(-1)
    }
  },
  components: {
    Navibar
  }
}
</script>

