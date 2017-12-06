<template>
  <div class="shell">
    <div class="notice alert alert-warning alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      操作完成 <a class="pull-right" href="#" @click="restore">撤销</a>
    </div>
    <navibar ref="nav" :navtitle="active_gname" :tel="$root.tel" :uname="$root.uname">
      <div slot="action" class="btn-group">
        <span class="glyphicon glyphicon-refresh" @click="refresh"></span>
      </div>
    </navibar>
    <div class="main">
      <keep-alive>
        <router-view @activate="activated" :content="content"></router-view>
      </keep-alive>
    </div>
    <div class="footer">
      <div class="input-group">
        <input type="text" class="form-control input-lg" v-bind:placeholder="placeholder" maxlength="255" v-model="content" @keyup.enter="add">
        <span class="input-group-addon" style="padding: 6px 18px;">
          <span class="glyphicon glyphicon-edit" @click="add"></span>
        </span>
      </div><!-- /input-group -->
    </div>
  </div>
</template>

<style scoped>
.shell { position: relative; height: 100%; width: 100%; }
@media screen and (min-width: 800px) {
  .shell { margin-left: 250px; width: calc(100% - 250px); }
}
.main { position: absolute; top: 50px; bottom: 50px; left: 0px; width: 100%; margin: 0px; overflow-y: auto; }
.footer { position: absolute; bottom: 0px; left: 0px; height: 50px; width: 100%; padding: 2px 0px; }
.footer * { border-radius: 0; }
.footer .input-group { margin: 0 5px; }
.notice { position: absolute; display: none; top: 0; margin: 0 auto; width: 200px; left: 0; right: 0; z-index: 1050; }
@keyframes rotate {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(36deg); }
  20%  { transform: rotate(72deg); }
  30%  { transform: rotate(108deg); }
  40%  { transform: rotate(144deg); }
  50%  { transform: rotate(180deg); }
  60%  { transform: rotate(216deg); }
  70%  { transform: rotate(252deg); }
  80%  { transform: rotate(288deg); }
  90%  { transform: rotate(324deg); }
  100% { transform: rotate(360deg); }
}
span.glyphicon-refresh{
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
</style>


<script>
import Navibar from '@/components/Navibar'
import $ from 'jquery'

const TIPS = [
  'Input content to create task',
  'Input @content to create project',
  'Input ~content to search in tasks'
]

export default {
  data () {
    return {
      active_gname: '',
      active_gid: null,
      content: '',
      placeholder: TIPS[0],
      timeout_ptr: null,
      forward: null,
      back: null,
      tipPtr: 0,
      defaultChild: null
    }
  },
  persist: ['active_gid', 'defaultChild'],
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
      return
    }
    if (!this.defaultChild) {
      this.defaultChild = 'projectlist'
    }
    this.$router.replace({ name: this.defaultChild })
    let iter = 0
    setInterval(() => {
      if (this.content !== '') {
        return
      }
      this.placeholder = TIPS[iter++]
      if (iter === TIPS.length) {
        iter = 0
      }
    }, 5000)
  },
  beforeRouteUpdate (to, from, next) {
    if (['projectlist', 'datelist'].indexOf(to.name) > -1) {
      this.defaultChild = to.name
    }
    next()
  },
  components: {
    Navibar
  },
  methods: {
    activated (gid, gname) {
      this.active_gid = gid
      this.active_gname = gname
    },
    add () {
      let content = this.content.trim()
      if (content === '') {
        return
      }
      if (content.startsWith('@')) {
        content = content.substr(1)
        if (content === '') {
          this.content = ''
        } else {
          this.$root.addProject(content)
        }
      } else {
        this.$root.addTask(this.active_gid, content)
      }
      this.content = ''
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
    refresh () {
      $('span.glyphicon-refresh').css('animation-name', 'rotate')
      this.$root.refresh(() => {
        $('span.glyphicon-refresh').css('animation-name', '')
      })
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

