<template>
  <div  class="signup-wrapper">
    <div class="row">
    </div>
    <div class="row">
      <div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
        <div class="panel panel-default">
          <div class="panel-heading">
            <img alt="Brand" src="../assets/logo.png" style="max-height: 25px;">
            <span>{{ $t('ui.signup') }}</span>
          </div>
          <div class="panel-body">
            <form role="form">
              <div class="form-group form-group-lg has-feedback" :class="emailClassObj">
                <input class="form-control" :placeholder="$t('ui.email')" v-model="email" type="text">
                <span v-if="email && emailValidated" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                <span v-if="email && !emailValidated" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
              </div>
              <div class="form-group form-group-lg">
                <input class="form-control" :placeholder="$t('ui.username')" v-model="username" type="text">
              </div>
              <div class="form-group form-group-lg">
                <input class="form-control" :placeholder="$t('ui.pwd')" v-model="pwd" type="password">
              </div>
              <div class="form-group form-group-lg has-feedback" :class="pwdClassObj">
                <input class="form-control" :placeholder="$t('ui.repwd')" v-model="repwd" type="password">
                <span v-if="repwd && pwdValidated" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                <span v-if="repwd && !pwdValidated" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
              </div>
              <div v-show="mailSended" class="form-group form-group-lg has-feedback" :class="{ 'has-error': isError }">
                <div class="input-group">
                  <span class="input-group-addon" id="basic-addon3">{{ $t('ui.verify_code') }}</span>
                  <input type="text" class="form-control" v-model="verifyCode">
                  <span v-show="isError" class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>
                </div>
                <p class="help-block">{{ $t('message.verifycode_guide') }}</p>
              </div>
              <div v-show="isInProgress" class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%"></div>
              </div>
              <button v-show="!mailSended" type="button" @click="next" v-bind:disabled="isInProgress" class="btn btn-lg btn-primary btn-block">{{ $t('ui.next') }}</button>
              <button v-show="mailSended" type="button" @click="signup" v-bind:disabled="isInProgress" class="btn btn-lg btn-primary btn-block">{{ $t('ui.signup') }}</button>
              <router-link class="btn btn-lg btn-default btn-block" :to="{ name: 'login' }">{{ $t('ui.return_to_login') }}</router-link>
            </form>
          </div>
        </div>
      </div><!-- /.col-->
    </div><!-- /.row -->
    <div class="row"></div>
  </div>
</template>
<style>
.signup-wrapper { height: 100%; display: flex; flex-direction: column; justify-content: center; }
.signup-wrapper div.row { flex-grow: 1; }
</style>

<script>
export default {
  name: 'signup',
  data () {
    return {
      email: '',
      username: '',
      pwd: '',
      repwd: '',
      mailSended: false,
      verifyCode: '',
      uuid: '',
      isError: false,
      isInProgress: false
    }
  },
  methods: {
    next () {
      if (!this.emailValidated || !this.pwd || !this.pwdValidated) {
        return
      }
      this.isInProgress = true
      this.$axios.get('/checkuser', {
        params: {
          email: this.email
        }
      }).then((response) => {
        this.isInProgress = false
        let res = response.data
        if (res.state === '001') {
          alert(this.$t(res.msg))
          return Promise.reject(this.$t(res.msg))
        }
        if (res.data === true) {
          alert(this.$t(res.msg))
          return Promise.reject(this.$t(res.msg))
        }
        this.isInProgress = true
        return this.$axios.get('/verifycode', {
          params: {
            email: this.email,
            mailcontent: this.$t('message.verify_email'),
            mailsubject: this.$t('ui.verify_code'),
            mailsender: this.$t('ui.app_name')
          }
        })
      }).then((response) => {
        this.isInProgress = false
        let res = response.data
        if (res.state === '001') {
          alert(this.$t(res.msg))
          return
        }
        this.uuid = res.data.uuid
        this.mailSended = true
      }).catch((error) => {
        this.isInProgress = false
        console.log(error)
      })
    },
    signup () {
      if (this.verifyCode === '') {
        this.isError = true
        return
      }
      let timezone = new Date().getTimezoneOffset() / -60
      this.isInProgress = true
      this.$axios.get('/signup', {
        params: {
          email: this.email,
          username: this.username,
          pwd: this.pwd,
          verifycode: this.verifyCode,
          uuid: this.uuid,
          timezone
        }
      }).then((response) => {
        this.isInProgress = false
        let res = response.data
        if (res.state === '001') {
          alert(this.$t(res.msg))
          return
        }
        alert(this.$t('message.signup_ok'))
        this.$root.email = res.data.email
        this.$root.uid = res.data.uid
        this.$root.uname = res.data.uname
        this.$root.token = res.data.token
        this.$router.replace('/')
      }).catch((error) => {
        this.isInProgress = false
        console.log(error)
      })
    }
  },
  computed: {
    emailValidated () {
      return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.email)
    },
    emailClassObj () {
      if (this.email === '') {
        return {}
      }
      return {
        'has-success': this.emailValidated,
        'has-error': !this.emailValidated
      }
    },
    pwdValidated () {
      return this.pwd === this.repwd
    },
    pwdClassObj () {
      if (this.repwd === '') {
        return {}
      }
      return {
        'has-success': this.pwdValidated,
        'has-error': !this.pwdValidated
      }
    }
  }
}
</script>

