<template>
  <div class="preference">
    <navibar ref="nav" :navtitle="$t('ui.preference')" :email="$root.email" :uname="$root.uname">
      <a slot="header" class="navbar-brand navbar-menu" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
    </navibar>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <div v-if="$root.runtime === 'electron'" class="form-group">
            <div class="checkbox">
              <label class="input-lg" @click="toggle" style="padding-left: 0px;">
                <span v-if="starup_hidden===true" class="chkbox glyphicon glyphicon-check" ></span>
                <span v-if="starup_hidden===false" class="chkbox glyphicon glyphicon-unchecked"></span>
                {{ $t('ui.hidden_on_startup') }}
              </label>
            </div>
          </div>
          <div v-if="$root.runtime === 'electron'" class="form-group">
            <label for="shortcut">{{ $t('ui.global_shortcut') }}</label>
            <div class="input-group input-group-lg">
              <span class="input-group-addon">CmdOrCtrl+Alt+Shift</span>
              <input type="text" class="form-control" v-model="shortcut">
              <span class="input-group-addon" style="padding: 6px 18px;">
                <span class="glyphicon glyphicon-floppy-save" @click="saveKey"></span>
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="notify_time">{{ $t('ui.default_time_for_notification') }}</label>
            <div class="input-group input-group-lg">
              <input type="time" id="notify_time" v-model="notify_time" pattern="[0-9]{2}:[0-9]{2}" class="form-control">
              <span class="input-group-addon" style="padding: 6px 18px;">
                <span class="glyphicon glyphicon-floppy-save" @click="saveTime"></span>
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="locale">{{ $t('ui.default_locale') }}</label>
            <select v-model="$root.locale" class="form-control input-lg">
              <option value='en'>English</option>
              <option value='zh-CN'>简体中文</option>
            </select>
          </div>
          <div class="form-group">
            <label for="locale">{{ $t('ui.default_timezone') }}</label>
            <select v-model="$root.timezone" class="form-control input-lg">
              <option v-for="n in 12" :key="'+' + n" :value="n - 13">{{ 'UTC' + (n - 13) }}</option>
              <option value="0">UTC+0</option>
              <option v-for="n in 13" :key="'-' + n" :value="n">{{ 'UTC+' + n }}</option>
            </select>
          </div>
          <div class="form-group has-feedback" :class="{ 'has-error': uname==='' }">
            <label for="locale">{{ $t('ui.username') }}</label>
            <div class="input-group">
              <input type="text" class="form-control input-lg" maxlength="50" v-model="uname" @keyup.enter="saveName">
              <span v-show="uname===''" class="glyphicon glyphicon-warning-sign form-control-feedback" style="right: 52px;" aria-hidden="true"></span>
              <span class="input-group-addon" style="padding: 6px 18px;">
                <span class="glyphicon glyphicon-floppy-save" @click="saveName"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <router-link class="btn btn-default btn-lg btn-block" :to="{ name: 'resetpwd' }"><span class="glyphicon glyphicon-lock"></span> {{ $t('ui.resetpwd') }}</router-link>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <button class="btn btn-danger btn-lg btn-block" @click="deleteAccount"><span class="glyphicon glyphicon-warning-sign"></span> {{ $t('ui.delete_account_data') }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style>
.preference { position: relative; height: 100%; width: 100%; }
@media screen and (min-width: 800px) {
  .preference { margin-left: 250px; width: calc(100% - 250px); }
}
.preference .container-fluid { position: absolute; top: 50px; bottom: 0; left: 0px; width: 100%; padding-top: 20px; overflow-y: auto; }
.preference span.chkbox { -webkit-text-stroke: 2px white; color: #51c4f1; }
</style>

<script>
/* eslint-disable no-eval */
import Navibar from '@/components/Navibar'

export default {
  name: 'preference',
  data () {
    return {
      starup_hidden: false,
      notify_time: this.$store.state.preference.notify_time,
      shortcut: 'S',
      uname: this.$root.uname
    }
  },
  created () {
    if (this.$root.runtime === 'electron') {
      const ipc = eval('require(\'electron\')').ipcRenderer
      ipc.on('preference-get-reply', (event, ref) => {
        this.starup_hidden = ref.starup_hidden
        this.shortcut = ref.shortcut || 'S'
      })
      ipc.send('preference-get-message')
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    toggle () {
      this.starup_hidden = !this.starup_hidden
      const ipc = eval('require(\'electron\')').ipcRenderer
      ipc.send('preference-message', {
        starup_hidden: this.starup_hidden,
        shortcut: this.shortcut
      })
    },
    saveKey () {
      const ipc = eval('require(\'electron\')').ipcRenderer
      ipc.send('preference-message', {
        starup_hidden: this.starup_hidden,
        shortcut: this.shortcut
      })
    },
    saveTime () {
      this.$root.updatePreference({
        notify_time: this.notify_time
      })
    },
    saveName () {
      if (this.uname === '') {
        return
      }
      this.$root.uname = this.uname
      this.$root.updatePreference({
        name: this.uname
      })
    },
    deleteAccount () {
      let bool = confirm(this.$t('message.warning_for_delete_account'))
      if (!bool) {
        return
      }
      bool = confirm(this.$t('message.warning_again_for_delete_account'))
      if (!bool) {
        return
      }
      this.$root.deleteAccount()
    }
  },
  components: {
    Navibar
  }
}
</script>

