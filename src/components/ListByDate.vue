<template>
  <div class="list-group">
    <template v-for="date in dates">
      <div class="list-group-item list-group-item-info" v-bind:key="date.notify_date" v-bind:data-name="date.notify_date" v-bind:data-date="date.notify_date"
        @click="activeDate(date, $event)">
        <span v-show="activeNotifyDate === date.notify_date" class="glyphicon glyphicon-ok-circle"></span> 
        {{ date.notify_date===null?$t('ui.ungrouped'):date.notify_date }} {{ today(date.notify_date) }}
      </div>
      <transition-group name="slide-fade" v-bind:key="date.notify_date + '_slide'">
        <div class="list-group-item" v-for="task in date.tasks" v-show="search(task)" v-bind:key="task.id" @click="activeTask(task, $event)">
          <span v-if="task.state===0" class="chkbox glyphicon glyphicon-unchecked" @click.stop="toggleTask(task, 1, $event)"></span>
          <span v-if="task.state===1" class="chkbox glyphicon glyphicon-check" @click.stop="toggleTask(task, 0, $event)"></span>
          <div class="content" @mouseenter="mousein" @mouseleave="mouseout">
            <pre class="lead wrap" @click="expandContent">{{ task.content }}</pre>
            <small v-if="task.pname" class="text-muted">{{ task.pname }} {{ task.notify_time }}</small>
            <small v-else class="text-muted">{{ $t('ui.ungrouped') }} {{ task.notify_time }}</small>
            <div v-if="$root.runtime!=='cordova'" class="pull-right" style="visibility: hidden">
              <div class="btn-group btn-group-xs" role="group" aria-label="...">
                <button type="button" class="btn btn-default" @click="editTask(task, $event)">
                  <span class="glyphicon glyphicon-pencil"></span>
                </button>
                <button type="button" class="btn btn-default" @click="removeTask(task, $event)">
                  <span class="glyphicon glyphicon-trash"></span>
                </button>
              </div>
            </div>
          </div>
          <div v-if="$root.runtime==='cordova'" class="drawer-right btn-group">
            <button type="button" class="btn btn-default" @click.stop="editTask(task, $event)">
              <span class="glyphicon glyphicon-pencil"></span>
            </button>
            <button type="button" class="btn btn-default" @click.stop="removeTask(task, $event)">
              <span class="glyphicon glyphicon-trash"></span>
            </button>
          </div>
        </div>
      </transition-group>
    </template>
  </div>
</template>
<style scoped>
div.list-group-item { margin: 0 5px; box-shadow: 3px 3px #F4F4F4 }
div.list-group-item-info { background-color: #beffb2; font-weight: 600; font-size: 16px; margin-top: 10px; }
span.chkbox { font-size: 32px; vertical-align: middle; float: left; -webkit-text-stroke: 2px white; color: #51c4f1; }
div.content { margin-left: 35px; position: relative; }
div.pull-right span.glyphicon { margin: 0 5px; }
div.drawer-right { position: absolute; top: 0; right: 0; bottom: 0; width: 100px; background-color: #F4F4F4; 
  display: none; }
div.drawer-right-on { display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: flex-end; }
div.drawer-right .btn { flex-grow: 1; }
div.drawer-right span.glyphicon-pencil { color: #7ed321; }
div.drawer-right span.glyphicon-trash { color: red; }

pre.lead { white-space: pre-wrap; margin-bottom: 0px; overflow: hidden; font-weight: 400; background-color: transparent; border: none; padding: 0; font-family: inherit; }
pre.wrap { white-space: nowrap; text-overflow: ellipsis; }

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-move {
  transition: transform .5s;
}
</style>
<script>
import $ from 'jquery'
import touch from 'touchjs'

export default {
  name: 'datelist',
  props: [ 'content' ],
  data () {
    return {
      activeNotifyDate: null
    }
  },
  created () {
    if (sessionStorage['activeNotifyDate']) {
      this.activeNotifyDate = sessionStorage['activeNotifyDate']
    }
  },
  updated () {
    this.initDom()
  },
  activated () {
    this.initDom()
  },
  methods: {
    initDom () {
      if (this.activeNotifyDate !== null && $('.list-group-item-info[data-date="' + this.activeNotifyDate + '"]').length !== 0) {
        $('.list-group-item-info[data-date="' + this.activeNotifyDate + '"]').click()
      } else {
        $('.list-group-item-info:last').click()
      }
      touch.on('.list-group-item:not(.list-group-item-info)', 'hold', function (evt) {
        let _self = $('.drawer-right', evt.currentTarget)
        $('.drawer-right').not(_self).removeClass('drawer-right-on')
        _self.addClass('drawer-right-on')
      })
    },
    expandContent (evt) {
      $('pre.lead').not(evt.currentTarget).addClass('wrap')
      $(evt.currentTarget).toggleClass('wrap')
    },
    editTask (task, evt) {
      this.$router.push({ name: 'task', params: task })
    },
    toggleTask (task, state, evt) {
      this.$root.toggleTask(task.id, state, task.pid)
    },
    removeTask (task, evt) {
      let $item = $(evt.target).parents('.list-group-item')
      $item.fadeOut('normal', () => {
        $item.css({ display: 'none' })
      })
      this.$parent.shownotice(() => {
        this.$root.removeTask(task.id, task.pid, task.content)
      }, () => {
        $item.css({ display: 'block' })
      })
    },
    activeDate (date, $evt) {
      this.activeNotifyDate = date.notify_date
      this.$emit('changegroup', date.notify_date)
    },
    activeTask (task, evt) {
      $('.drawer-right').removeClass('drawer-right-on')
    },
    addTask () {
      this.$root.addTask({
        pid: 0,
        content: this.content,
        notify_date: this.activeNotifyDate
      })
    },
    mousein (evt) {
      $('.pull-right', evt.target).css('visibility', '')
    },
    mouseout (evt) {
      $('.pull-right', evt.target).css('visibility', 'hidden')
    },
    search (task) {
      let term = this.content.toLowerCase()
      if (term === '' || !term.startsWith('~')) {
        return true
      }
      term = term.substr(1)
      if (task.content.toLowerCase().indexOf(term) > -1) {
        return true
      } else {
        return false
      }
    },
    today (notifyDate) {
      notifyDate = new Date(Date.parse(notifyDate))
      let today = new Date()
      if (notifyDate.getFullYear() === today.getFullYear() && notifyDate.getMonth() === today.getMonth() && notifyDate.getDate() === today.getDate()) {
        return this.$t('ui.today')
      }
    }
  },
  computed: {
    dates () {
      let dates = []
      this.$store.state.tasks.forEach(task => {
        let date = dates.find(date => {
          return date.notify_date === task.notify_date
        })
        if (date === undefined) {
          date = {
            notify_date: task.notify_date,
            tasks: []
          }
          dates.push(date)
        }
        let taskProxy = {}
        Object.keys(task).forEach(key => {
          taskProxy[key] = task[key]
        })
        date.tasks.push(taskProxy)
      })
      dates.forEach(date => {
        date.tasks.sort((a, b) => {
          if (a.state < b.state) {
            return -1
          }
          if (a.state > b.state) {
            return 1
          }
          if (a.notify_date === null && b.notify_date !== null) {
            return 1
          } else if (b.notify_date === null && a.notify_date !== null) {
            return -1
          } else if (a.notify_date === null && b.notify_date === null) {
            let aTime = Date.parse(a.ctime)
            let bTime = Date.parse(b.ctime)
            return aTime - bTime
          } else {
            let aTime = Date.parse(a.notify_date + ' ' + (a.notify_time === null ? this.$store.state.preference.notify_time : a.notify_time) + ':00')
            let bTime = Date.parse(b.notify_date + ' ' + (b.notify_time === null ? this.$store.state.preference.notify_time : b.notify_time) + ':00')
            return aTime - bTime
          }
        })
      })
      dates.sort((a, b) => {
        if (a.notify_date === null && b.notify_date !== null) {
          return 1
        } else if (b.notify_date === null && a.notify_date !== null) {
          return -1
        } else {
          let aTime = Date.parse(a.notify_date + ' ' + '00:00:00')
          let bTime = Date.parse(b.notify_date + ' ' + '00:00:00')
          return aTime - bTime
        }
      })
      return dates
    }
  },
  watch: {
    activeNotifyDate (val) {
      sessionStorage.setItem('activeNotifyDate', val)
    }
  }
}
</script>


