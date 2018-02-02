<template>
  <div class="login-wrapper">
    <div class="row">
    </div>
    <div class="row">
      <div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
        <div class="login-panel panel panel-default">
          <div class="panel-heading">
            <img alt="Brand" src="../assets/logo.png" style="max-height: 25px;">
            <span>{{ $t('ui.app_name') }}</span>
          </div>
          <div class="panel-body">
            <form role="form"  @keyup.enter="login">
              <div class="form-group form-group-lg">
                <input class="form-control" :placeholder="$t('ui.email')" v-model="email" type="email" autofocus autocomplete="on" maxlength="50">
              </div>
              <div class="form-group form-group-lg">
                <input class="form-control" :placeholder="$t('ui.pwd')" v-model="pwd" type="password" maxlength="20">
              </div>
              <div v-show="isInProgress" class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%"></div>
              </div>
              <div class="form-group">
                <div class="btn-group btn-group-justified" role="group" aria-label="...">
                  <div class="btn-group" role="group">
                    <button type="button" @click="login" class="btn btn-lg btn-primary" :disabled="isInProgress"><span class="glyphicon glyphicon-log-in"></span> {{ $t('ui.login') }}</button>
                  </div>
                  <router-link role="button" class="btn btn-lg btn-default" :to="{ name: 'signup' }"><span class="glyphicon glyphicon-plus"></span> {{ $t('ui.signup') }}</router-link>
                </div>
              </div>
              <div class="form-group">
                <router-link :to="{ name: 'findpwd' }">{{ $t('ui.findpwd') }}</router-link>
              </div>
            </form>
          </div>
        </div>
      </div><!-- /.col-->
    </div><!-- /.row -->
    <div class="row"></div>
  </div>
</template>

<style>
.login-wrapper { height: 100%; display: flex; flex-direction: column; justify-content: center; }
.login-wrapper div.row { flex-grow: 1; }
.login-wrapper .navbar { background-color: #337ab7; border: none; }
</style>

<script>
export default {
  name: 'login',
  data () {
    return {
      email: this.$root.email,
      pwd: '',
      isInProgress: false
    }
  },
  created () {
    if (this.$root.token !== '') {
      this.$router.replace('/')
    }
  },
  methods: {
    login (e) {
      if (this.email === '' || this.pwd === '') {
        alert(this.$t('message.require_email_and_pwd'))
        return
      }
      this.isInProgress = true
      this.$axios.get('/login', {
        params: {
          email: this.email,
          pwd: this.pwd
        }
      }).then((response) => {
        this.isInProgress = false
        let res = response.data
        if (res.state === '001') {
          alert(this.$t(res.msg))
          return
        }
        this.$root.email = this.email
        this.$root.uid = res.data.uid
        this.$root.uname = res.data.uname
        this.$root.token = res.data.token
        this.$root.timezone = res.data.timezone
        this.$router.replace('/')
      }).catch((error) => {
        this.isInProgress = false
        console.log(error)
      })
    }
  }
}
</script>