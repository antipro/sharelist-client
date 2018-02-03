<template>
  <div class="project">
    <navibar ref="nav" :navtitle="$t('ui.project')" :email="$root.email" :uname="$root.uname">
      <a slot="header" class="navbar-brand" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
      <span slot="action" class="glyphicon glyphicon-floppy-disk" @click="updateProject"></span>
    </navibar>
    <div class="container-fluid" style="margin-top: 20px;">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <input type="text" v-model="pname" class="form-control input-lg" :placeholder="$t('ui.project_name')" maxlength="20">
          </div>
          <div class="form-group">
            <template v-if="isInProgress">
              <div class="list-group">
                <div class="list-group-item list-group-item-default">
                  {{ $t('ui.loading') }}
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="shares.length > 0" class="list-group">
                <div class="list-group-item list-group-item-success" v-for="(share, index) of shares" :key="share.uid">
                  <button type="button" class="close" aria-label="Close" @click="removeShare(index)">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <span>{{ share.email }} <small>{{ share.uname }}</small></span>
                </div>
              </div>
              <div v-else class="list-group">
                <div class="list-group-item list-group-item-info">{{ $t('ui.not_shared') }}</div>
              </div>
            </template>
          </div>
          <div class="form-group">
            <div class="input-group input-group-lg">
              <input type="email" class="form-control" :placeholder="$t('ui.email')" v-model="email" @keyup.stop.enter="addShare"  maxlength="50">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="addShare">
                  <span class="glyphicon glyphicon-plus"></span>
                </button>
              </span>
            </div><!-- /input-group -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.project { position: relative; height: 100%; width: 100%; overflow-y: auto; }
@media screen and (min-width: 800px) {
  .project { margin-left: 250px; width: calc(100% - 250px); }
}
div.list-group-item { box-shadow: 3px 3px #F4F4F4; font-size: 18px; }
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
      email: '',
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
    this.pid = this.$route.params.id
    this.pname = this.$route.params.name
    this.isInProgress = true
    this.$axios.get('/shares/' + this.pid, {
      headers: {
        TOKEN: this.$root.token
      }
    }).then((response) => {
      this.isInProgress = false
      let res = response.data
      if (res.state === '001') {
        alert(this.$t(res.msg))
        return
      }
      this.shares = res.data
    }).catch(err => {
      this.isInProgress = false
      console.log(err)
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    removeShare (index) {
      this.shares.splice(index, 1)
    },
    addShare () {
      let email = this.email.trim()
      if (email === this.$root.email) {
        alert(this.$t('message.can_not_add_yourself'))
        return
      }
      if (email === '') {
        return
      }
      this.shares.push({
        uid: 0,
        uname: this.$t('ui.new_user'),
        email: this.email.trim()
      })
      this.email = ''
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

