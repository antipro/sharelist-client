<template>
  <div style="position: relative; height: 100%; width: 100vw;">
  <navibar ref="nav" navtitle="项目" :tel="$root.tel" :uname="$root.uname"></navibar>
  <div class="container" style="margin-top: 20px;">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="project_name">名称</label>
          <input type="text" class="form-control" id="project_name" v-model="pname">
        </div>
        <div class="form-group">
          <label for="">共享</label>
          <div>
            <div class="alert alert-info alert-dismissible" role="alert" v-for="(share, index) of shares" :key="share.uid">
              <button type="button" class="close" aria-label="Close" @click="removeShare(index)">
                <span aria-hidden="true">&times;</span>
              </button>
              <span>{{ share.tel }} <small>{{ share.uname }}</small></span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Tel..." v-model="tel">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" @click="addShare">
                <span class="glyphicon glyphicon-plus"></span>
              </button>
            </span>
          </div><!-- /input-group -->
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-default" @click="updateProject">
            <span class="glyphicon glyphicon-floppy-disk"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<style scoped>
.alert-info { margin-bottom: 1px; }
</style>

<script>
import Navibar from '@/components/Navibar'

export default {
  name: 'project',
  data () {
    return {
      pid: null,
      pname: null,
      shares: [],
      tel: ''
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
    this.pid = this.$route.params.id
    this.pname = this.$route.params.name

    this.$axios.get('/shares/' + this.pid, {
      headers: {
        TOKEN: this.$root.token
      }
    }).then((response) => {
      let res = response.data
      if (res.state === '001') {
        alert(res.msg)
        return
      }
      this.shares = res.data
    })
  },
  methods: {
    removeShare (index) {
      this.shares.splice(index, 1)
    },
    addShare () {
      let tel = this.tel.trim()
      if (tel === this.$root.tel) {
        alert('不能添加本号码。')
        return
      }
      if (tel === '') {
        return
      }
      this.shares.push({
        uid: 0,
        uname: '<新用户>',
        tel: this.tel.trim()
      })
      this.tel = ''
    },
    updateProject () {
      this.$root.updateProject(this.pid, this.pname, this.shares)
      this.$router.go(-1)
    }
  },
  components: {
    Navibar
  }
}
</script>

