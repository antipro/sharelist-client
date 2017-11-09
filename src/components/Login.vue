<template>
  <div class="row">
    <div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
      <div class="login-panel panel panel-default">
        <div class="panel-heading">
          <img alt="Brand" src="../assets/logo.png" style="max-height: 25px;">
          <span>登录</span>
        </div>
        <div class="panel-body">
          <form role="form"  @keyup.enter="login" autocomplete="off">
            <fieldset>
              <div class="form-group">
                <input class="form-control" placeholder="Tel" v-model="tel" name="tel" type="tel" autofocus="">
              </div>
              <div class="form-group">
                <input class="form-control" placeholder="Password" v-model="pwd" id="password" name="password" type="password" value="">
              </div>
              <button type="button" @click="login" class="btn btn-lg btn-primary btn-block">登录</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div><!-- /.col-->
  </div><!-- /.row -->
</template>
<script>
import axios from 'axios'

var instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000
})

export default {
  name: 'login',
  data () {
    return {
      tel: this.$root.tel,
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
      if (this.tel === '' || this.pwd === '') {
        alert('请输入用户名和密码')
        return
      }
      instance.get('/login', {
        params: {
          tel: this.tel,
          pwd: this.pwd
        }
      }).then((response) => {
        let res = response.data
        if (res.state === '001') {
          alert(res.msg)
          return
        }
        this.$root.tel = this.tel
        this.$root.uid = res.data.uid
        this.$root.uname = res.data.uname
        this.$root.token = res.data.token
        this.$router.replace('/')
      }).catch((error) => {
        console.log(error)
      })
    },
    updated (e) {
      console.log(this.$http)
    }
  }
}
</script>