<template>
  <div style="position: relative; height: 100%;">
    <navibar ref="nav" />
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer">
      <div class="input-group">
        <input type="text" class="form-control input-lg" placeholder="New ..." v-model="content" @keyup.enter="add">
        <span class="input-group-btn">
          <button class="btn btn-default btn-lg" type="button" @click="add">
            <span class="glyphicon glyphicon-floppy-disk"></span>
          </button>
        </span>
      </div><!-- /input-group -->
    </div>
  </div>
</template>

<style scoped>
.main { 
  position: absolute;
  top: 50px;
  bottom: 50px;
  left: 0px;
  width: 100vw;
  margin: 0px;
  overflow-y: auto;
}
.footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100vw;
  height: 50px;
  width: 100vw;
  padding: 2px 0px;
}
</style>


<script>
import Navibar from '@/components/Navibar'
export default {
  data () {
    return {
      active_pid: null,
      content: ''
    }
  },
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
      return
    }
    this.$root.connect()
    let defaultPath = '/project'
    this.$router.replace(defaultPath)
  },
  components: {
    Navibar
  },
  methods: {
    add () {
      if (this.content !== '') {
        this.$root.addItem(this.active_pid, this.content)
        this.content = ''
      }
    }
  }
}
</script>

