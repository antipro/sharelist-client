<template>
  <div style="position: relative; height: 100%;">
    <div class="notice alert alert-warning alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      操作完成 <a class="pull-right" href="#" @click="restore">撤销</a>
    </div>
    <navibar ref="nav" />
    <div class="main" @scroll="detect">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div class="footer">
      <div class="input-group">
        <input type="text" class="form-control input-lg" placeholder="新任务 ..." v-model="content" @keyup.enter="add">
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
.notice {
  position: fixed;
  display: none;
  top: 0;
  margin: 0 auto;
  width: 200px;
  left: 0;
  right: 0;
  z-index: 1050;
}
</style>


<script>
import Navibar from '@/components/Navibar'
import $ from 'jquery'

export default {
  data () {
    return {
      active_pid: null,
      content: '',
      timeout_ptr: null,
      forward: null,
      back: null
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
    },
    shownotice (forward, back) {
      if (this.timeout_ptr !== null) {
        clearTimeout(this.timeout_ptr)
        this.timeout_ptr = null
        this.forward()
        $('.notice').css({ display: 'none', top: '0' })
      }
      this.forward = forward
      this.back = back
      $('.notice').css({ display: 'block' }).animate({ top: '60px' }, () => {
        this.timeout_ptr = setTimeout(() => {
          this.forward()
          this.timeout_ptr = null
          $('.notice').css({ display: 'none', top: '0' })
        }, 5000)
      })
    },
    restore () {
      if (this.timeout_ptr !== null) {
        this.back()
        clearTimeout(this.timeout_ptr)
        this.timeout_ptr = null
      }
      $('.notice').css({ display: 'none', top: '0' })
    },
    detect (evt) {
      let elements = document.querySelectorAll('.list-group-item-info')
      for (let idx = elements.length - 1; idx > -1; idx--) {
        const element = elements[idx]
        if (evt.target.scrollTop > element.offsetTop + element.offsetHeight) {
          $(element).click()
          break
        }
      }
    }
  }
}
</script>

