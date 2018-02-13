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
        <router-view ref="tasklist" @changegroup="groupchanged" @searchgroup="groupsearched" :content="content"></router-view>
      </keep-alive>
    </div>
    <record ref="record" @getContent="contentGet" @recognizing="isInProgress = true" @recognized="isInProgress = false"></record>
    <div class="footer">
      <div style="position: absolute; bottom: 0;">
        <div class="list-group search-group">
          <div v-for="(searchedgroup, idx) in searchedgroups"
              :key="searchedgroup.id" 
              class="list-group-item" 
              :class="{'active': selected_gidx === idx}" 
              @click="selectGroup(searchedgroup.id)">
              {{ searchedgroup.name?searchedgroup.name:$t('ui.ungrouped') }}
          </div>
        </div>
        <div class="input-group input-group-lg">
          <input 
            id="command" 
            type="text" 
            class="form-control" 
            :placeholder="placeholder" 
            maxlength="500" 
            v-model="content" 
            @keydown.enter="add"
            @keydown.40="nextGroup"
            @keydown.38="prevGroup"
            @keydown.ctrl.68.stop.prevent="$refs.tasklist.removeItem"  
            @keydown.ctrl.69.stop.prevent="$refs.tasklist.editItem">
          <template v-if="$root.runtime === 'cordova'">
            <span class="input-group-addon" style="padding: 6px 18px; font-size: 18px;">
              <span v-if="content !== ''" class="glyphicon glyphicon-edit" @click="add"></span>
              <span v-if="content === ''" class="glyphicon glyphicon-record" @click="startRecord"></span>
            </span>
          </template>
          <template v-else>
            <span class="input-group-addon" style="padding: 6px 18px; font-size: 18px;">
              <span class="glyphicon glyphicon-edit" @click="add"></span>
            </span>
          </template>
        </div><!-- /input-group -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.shell { position: relative; height: 100%; width: 100%; }
@media screen and (min-width: 800px) {
  .shell { margin-left: 250px; width: calc(100% - 250px); }
}
.shell .main { position: absolute; top: 50px; bottom: 50px; left: 0px; width: 100%; margin: 0px; overflow-y: auto; background: url('../../static/border.jpg') repeat-y }
.shell .footer { position: absolute; bottom: 0px; left: 0px; height: 50px; width: 100%; padding: 2px 0px; }
.shell .footer .input-group { margin: 0 5px; }
.shell .footer .search-group { position: absolute; bottom: 50px; left: 0; width: 100%; margin-bottom: 0; max-height: 200px; overflow-y: auto; }
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
import Record from '@/components/Record'
import $ from 'jquery'

export default {
  data () {
    return {
      active_gname: '',
      selected_gidx: 0,
      content: '',
      placeholder: '',
      timeout_ptr: null,
      interval_ptr: null,
      forward: null,
      back: null,
      defaultChild: null,
      isInProgress: false,
      searchedgroups: []
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
    if (this.$root.runtime === 'electron') {
      document.querySelector('#command').addEventListener('contextmenu', this.$root.rightMenu, false)
    }
    document.querySelector('#command').focus()
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
    Navibar, Record
  },
  methods: {
    shortCut (evt) {
      if (evt.ctrlKey && evt.shiftKey && evt.keyCode === 80) {
        document.querySelector('#command').focus()
        evt.preventDefault()
      }
      if (evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.keyCode === 40) {
        document.querySelector('.main').scrollTop += 60
      }
      if (evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.keyCode === 38) {
        document.querySelector('.main').scrollTop -= 60
      }
      if (!evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.keyCode === 40) {
        this.$refs.tasklist.next()
      }
      if (!evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.keyCode === 38) {
        this.$refs.tasklist.prev()
      }
    },
    groupchanged (gname) {
      this.active_gname = gname === '' || gname === null ? this.$t('ui.ungrouped') : gname
    },
    add () {
      let content = this.content.trim()
      if (content === '') {
        if (this.$root.runtime === 'cordova') {
          this.startRecord()
        }
        return
      }
      this.content = ''
      if (content.startsWith('#')) {
        let searchedGroup = this.searchedgroups.find((group, idx) => {
          return this.selected_gidx === idx
        })
        this.selectGroup(searchedGroup.id)
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
          this.$refs.tasklist.addProject(content)
        }
        return
      }
      this.$refs.tasklist.addTask()
    },
    startRecord () {
      if (this.isInProgress) {
        return
      }
      this.$refs.record.startRecord()
    },
    contentGet (text) {
      this.content = text
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
        yield this.$t('message._cordova_tip_04')
        yield this.$t('message._cordova_tip_05')
        yield this.$t('message._cordova_tip_06')
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
    },
    next (evt) {
      if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        this.$refs.tasklist.next()
        evt.stopPropagation()
      }
    },
    prev (evt) {
      if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        this.$refs.tasklist.prev()
        evt.stopPropagation()
      }
    },
    groupsearched (results) {
      this.searchedgroups = results
      this.selected_gidx = 0
    },
    nextGroup (evt) {
      if (this.searchedgroups.length === 0) {
        return
      }
      evt.stopPropagation()
      if (this.selected_gidx === this.searchedgroups.length - 1) {
        console.log('archive to bottom')
        return
      }
      this.selected_gidx++
      document.querySelector('.search-group').scrollTop += 42
    },
    prevGroup (evt) {
      if (this.searchedgroups.length === 0) {
        return
      }
      evt.stopPropagation()
      if (this.selected_gidx === 0) {
        console.log('archive to top')
        return
      }
      this.selected_gidx--
      document.querySelector('.search-group').scrollTop -= 42
    },
    selectGroup (gid) {
      this.$refs.tasklist.selectGroup(gid)
      this.content = ''
    }
  }
}
</script>

