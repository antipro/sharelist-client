<template>
  <div class="row">
    <div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
      <div class="login-panel panel panel-default">
        <div class="panel-heading">
          <img alt="Brand" src="../assets/logo.png" style="max-height: 25px;">
          <span>{{ $t('ui.app_name') }}</span>
        </div>
        <div class="panel-body">
          <form role="form"  @keyup.enter="login">
            <div class="form-group">
              <input class="form-control" :placeholder="$t('ui.email')" v-model="email" type="email" autofocus>
            </div>
            <div class="form-group">
              <input class="form-control" :placeholder="$t('ui.pwd')" v-model="pwd" type="password" value="">
            </div>
            <div class="btn-group btn-group-justified" role="group" aria-label="...">
              <div class="btn-group" role="group">
                <button type="button" @click="login" class="btn btn-lg btn-primary">{{ $t('ui.login') }}</button>
              </div>
              <router-link role="button" class="btn btn-lg btn-default" :to="{ name: 'signup' }">{{ $t('ui.signup') }}</router-link>
            </div>
          </form>
        </div>
      </div>
    </div><!-- /.col-->
  </div><!-- /.row -->
</template>

<style scoped>
div.row { margin-top: 100px; }
div#app { margin-left: 0; }
</style>

<script>
export default {
  name: 'login',
  data () {
    return {
      email: this.$root.email,
      pwd: ''
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
      this.$axios.get('/login', {
        params: {
          email: this.email,
          pwd: this.pwd
        }
      }).then((response) => {
        let res = response.data
        if (res.state === '001') {
          alert(this.$t(res.msg))
          return
        }
        this.$root.email = this.email
        this.$root.uid = res.data.uid
        this.$root.uname = res.data.uname
        this.$root.token = res.data.token
        this.$router.replace('/')
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>