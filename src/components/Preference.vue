<template>
  <div class="preference">
    <navibar ref="nav" navtitle="设置" :tel="$root.tel" :uname="$root.uname">
    </navibar>
    <div class="container-fluid" style="margin-top: 20px;">
      <div class="row">
        <div class="col-md-6">
          <div v-if="$root.runtime==='electron'" class="checkbox">
            <label class="input-lg" @click="toggle">
              <span v-if="starup_hidden===true" class="chkbox glyphicon glyphicon-check" ></span>
              <span v-if="starup_hidden===false" class="chkbox glyphicon glyphicon-unchecked"></span>
              启动时隐藏
            </label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>默认提醒时间</label>
            <input type="text" v-model="notify_time"></div>
          </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.preference { position: relative; height: 100%; width: 100%; }
@media screen and (min-width: 800px) {
  .preference { margin-left: 250px; width: calc(100% - 250px); }
}
span.chkbox { -webkit-text-stroke: 2px white; color: #51c4f1; }

</style>

<script>
/* eslint-disable no-eval */
import Navibar from '@/components/Navibar'

export default {
  name: 'preference',
  data () {
    return {
      starup_hidden: false
    }
  },
  created () {
    const ipc = eval('require(\'electron\')').ipcRenderer
    ipc.on('preference-get-reply', (event, ref) => {
      this.starup_hidden = ref.starup_hidden
    })
    ipc.send('preference-get-message')
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    toggle () {
      this.starup_hidden = !this.starup_hidden
      const ipc = eval('require(\'electron\')').ipcRenderer
      ipc.on('preference-reply', function (event) {
        console.log('electron preference saved.')
      })
      ipc.send('preference-message', { starup_hidden: this.starup_hidden })
    },
    updatePreference () {
    }
  },
  components: {
    Navibar
  }
}
</script>

