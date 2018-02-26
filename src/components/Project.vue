<template>
  <div class="project">
    <navibar ref="nav" :navtitle="$t('ui.project')" :email="$root.email" :uname="$root.uname">
      <a slot="header" class="navbar-brand" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
      <span slot="action" class="glyphicon glyphicon-floppy-disk" @click="updateProject"></span>
    </navibar>
    <div class="container-fluid">
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
          <div class="form-group form-group-lg has-feedback" :class="{ 'has-error': email && !emailValidated }">
            <div class="input-group input-group-lg">
              <input type="email" class="form-control" :placeholder="$t('ui.email')" v-model="email" @keyup.stop.enter="addShare"  maxlength="50">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="addShare">
                  <span class="glyphicon glyphicon-plus"></span>
                </button>
              </span>
            </div><!-- /input-group -->
            <span v-if="email && !emailValidated" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.project { position: relative; height: 100%; width: 100%; overflow-y: auto; }
@media screen and (min-width: 800px) {
  .project { margin-left: 250px; width: calc(100% - 250px); }
}
.project .container-fluid { position: absolute; top: 50px; bottom: 0; left: 0px; width: 100%; margin: 0px; padding-top: 10px; overflow-y: auto; }
.project .has-feedback .form-control-feedback { right: 50px; }
.project div.list-group-item { box-shadow: 3px 3px #F4F4F4; font-size: 18px; }
.project .alert-info { margin-bottom: 1px; }
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
    this.$root.querySharedUsers(this.pid, (shares) => {
      this.isInProgress = false
      this.shares = shares
    })
  },
  mounted () {
    if (this.$root.runtime !== 'cordova') {
      document.addEventListener('keydown', this.shortCut, false)
    }
    if (this.$root.runtime === 'electron') {
      document.querySelector('input').addEventListener('contextmenu', this.$root.rightMenu, false)
    }
  },
  beforeDestroy () {
    if (this.$root.runtime !== 'cordova') {
      document.removeEventListener('keydown', this.shortCut, false)
    }
  },
  methods: {
    shortCut (evt) {
      if (evt.ctrlKey && evt.keyCode === 83) {
        this.updateProject()
        evt.preventDefault()
      }
      if (evt.ctrlKey && evt.keyCode === 66) {
        this.$router.go(-1)
      }
    },
    back () {
      this.$router.go(-1)
    },
    removeShare (index) {
      this.shares.splice(index, 1)
    },
    addShare () {
      if (this.email === this.$root.email) {
        alert(this.$t('message.can_not_add_yourself'))
        return
      }
      if (this.email === '') {
        return
      }
      if (!this.emailValidated) {
        return
      }
      if (this.shares.findIndex(share => share.email === this.email) > -1) {
        alert(this.$t('message.this_email_is_already_existed'))
        return
      }
      this.shares.push({
        uid: 0,
        uname: this.$t('ui.new_user'),
        email: this.email
      })
      this.email = ''
    },
    updateProject () {
      if (this.isInProgress) {
        alert(this.$t('message.wait_for_loading_shared_users'))
        return
      }
      this.$root.updateProject(this.pid, this.pname, this.shares)
      this.$router.go(-1)
    }
  },
  components: {
    Navibar
  },
  computed: {
    emailValidated () {
      return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.email)
    }
  }
}
</script>

