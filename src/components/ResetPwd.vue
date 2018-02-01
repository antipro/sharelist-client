<template>
  <div class="resetpwd-wrapper">
    <navibar ref="nav" :navtitle="$t('ui.resetpwd')" :email="$root.email" :uname="$root.uname">
      <a slot="header" class="navbar-brand navbar-menu" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
      <span slot="action" class="glyphicon glyphicon-floppy-disk" @click="updatePwd"></span>
    </navibar>
    <div class="container-fluid" style="margin-top: 20px;">
      <div class="row">
        <div class="col-md-6">
          <form role="form" @keyup.enter="resetpwd">
            <div class="form-group form-group-lg has-feedback" :class="{ 'has-error': oldpwdIsEmpty }">
              <input class="form-control" :placeholder="$t('ui.oldpwd')" v-model="oldpwd" type="password">
              <span v-if="oldpwdIsEmpty" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
            </div>
            <div class="form-group form-group-lg has-feedback" :class="{ 'has-error': pwdIsEmpty }">
              <input class="form-control" :placeholder="$t('ui.pwd')" v-model="pwd" type="password">
              <span v-if="pwdIsEmpty" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
            </div>
            <div class="form-group form-group-lg has-feedback" :class="pwdClassObj">
              <input class="form-control" :placeholder="$t('ui.repwd')" v-model="repwd" type="password">
              <span v-if="repwd && pwdValidated" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
              <span v-if="repwd && !pwdValidated" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.resetpwd-wrapper { position: relative; height: 100%; width: 100%; }
@media screen and (min-width: 800px) {
  .resetpwd-wrapper { margin-left: 250px; width: calc(100% - 250px); }
}
</style>


<script>
import Navibar from '@/components/Navibar'

export default {
  name: 'resetpwd',
  data () {
    return {
      oldpwdIsEmpty: false,
      pwdIsEmpty: false,
      oldpwd: '',
      pwd: '',
      repwd: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/') {
      next('/')
    } else {
      next()
    }
  },
  components: {
    Navibar
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    updatePwd () {
      let pass = true
      if (this.oldpwd === '') {
        this.oldpwdIsEmpty = true
        pass = false
      }
      if (this.oldpwd === '') {
        this.pwdIsEmpty = true
        pass = false
      }
      if (!this.pwdValidated) {
        pass = false
      }
      if (pass === false) {
        return
      }
      this.$root.resetPwd(this.oldpwd, this.pwd)
    }
  },
  computed: {
    pwdValidated () {
      return this.pwd === this.repwd
    },
    pwdClassObj () {
      if (this.repwd === '' && this.pwd === '') {
        return {}
      }
      return {
        'has-success': this.pwdValidated,
        'has-error': !this.pwdValidated
      }
    }
  },
  watch: {
    oldpwd (val) {
      if (val !== '') {
        this.oldpwdIsEmpty = false
      }
    },
    pwd (val) {
      if (val !== '') {
        this.pwdIsEmpty = false
      }
    }
  }
}
</script>

