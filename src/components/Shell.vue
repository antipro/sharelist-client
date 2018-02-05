<template>
  <div class="shell">
    <div class="notice alert alert-warning alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      {{ $t('ui.operation_finished') }} <a class="pull-right" href="#" @click="restore">{{ $t('ui.operation_restore') }}</a>
    </div>
    <navibar ref="nav" :navtitle="active_gname" :email="$root.email" :uname="$root.uname">
      <div slot="action" class="btn-group">
        <span class="glyphicon glyphicon-refresh" @click="refresh"></span>
      </div>
    </navibar>
    <div class="main">
      <keep-alive>
        <router-view ref="tasklist" @changegroup="groupchanged" :content="content"></router-view>
      </keep-alive>
    </div>
    <div class="footer">
      <div class="input-group">
        <input id="command" type="text" class="form-control input-lg" :placeholder="placeholder" maxlength="255" v-model="content" @keyup.enter="add">
        <span class="input-group-addon" style="padding: 6px 18px; font-size: 18px;">
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
.shell .main { position: absolute; top: 50px; bottom: 50px; left: 0px; width: 100%; margin: 0px; overflow-y: auto; }
.shell .footer { position: absolute; bottom: 0px; left: 0px; height: 50px; width: 100%; padding: 2px 0px; }
.shell .footer .input-group { margin: 0 5px; }
.shell .notice { position: absolute; display: none; top: 0; margin: 0 auto; width: 250px; left: 0; right: 0; z-index: 1050; }
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

export default {
  data () {
    return {
      active_gname: '',
      active_gid: null,
      content: '',
      placeholder: '',
      timeout_ptr: null,
      interval_ptr: null,
      forward: null,
      back: null,
      defaultChild: null
    }
  },
  persist: ['defaultChild'],
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
      return
    }
    if (!this.defaultChild) {
      this.defaultChild = 'projectlist'
    }
    this.$router.replace({ name: this.defaultChild })
    let iter = this.tips()
    this.interval_ptr = setInterval(() => {
      if (this.content !== '') {
        return
      }
      let next = iter.next()
      if (next.done) {
        iter = this.tips()
        next = iter.next()
      }
      this.placeholder = next.value
    }, 5000)
  },
  mounted () {
    if (this.$root.runtime !== 'cordova') {
      document.addEventListener('keydown', this.shortCut, false)
    }
  },
  beforeDestroy () {
    clearInterval(this.interval_ptr)
    if (this.$root.runtime !== 'cordova') {
      document.removeEventListener('keydown', this.shortCut, false)
    }
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
    shortCut (evt) {
      if (evt.ctrlKey && evt.shiftKey && evt.keyCode === 80) {
        $('#command').focus()
        evt.preventDefault()
      }
      if (evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.keyCode === 40) {
        document.querySelector('.main').scrollTop += 30
      }
      if (evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.keyCode === 38) {
        document.querySelector('.main').scrollTop -= 30
      }
    },
    groupchanged (gname) {
      this.active_gname = gname === '' || gname === null ? this.$t('ui.ungrouped') : gname
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
          if (content.length > 20) {
            content = content.substr(0, 20)
          }
          this.$root.addProject(content)
        }
      } else {
        this.$refs.tasklist.addTask()
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
    * tips () {
      yield this.$t('message.common_tip_01')
      yield this.$t('message.common_tip_02')
      yield this.$t('message.common_tip_03')
      yield this.$t('message.common_tip_04')
      yield this.$t('message.common_tip_05')
      yield this.$t('message.common_tip_06')
      if ($(this.$refs.tasklist.$el).hasClass('listbydate')) {
        yield this.$t('message.common_tip_07')
      }
      if (this.$root.runtime === 'cordova') {
        yield this.$t('message.cordova_tip_01')
      } else {
        yield this.$t('message._cordova_tip_01')
        yield this.$t('message._cordova_tip_02')
        yield this.$t('message._cordova_tip_03')
      }
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

