<template>
  <div class="list-group">
    <template v-for="project in projects">
      <div class="list-group-item list-group-item-info bg-danger" v-bind:key="project.id" v-bind:data-name="project.name" v-bind:data-pid="project.id" 
        @click="activeProject(project, $event)" @mouseenter="mousein" @mouseleave="mouseout">
        <span v-show="activePid === project.id" class="glyphicon glyphicon-ok-circle"></span> {{ project.name===''?$t('ui.ungrouped'):project.name }}{{ project.uid !== $root.uid ? '（' + project.uname + '）' : '' }}
        <div v-if="$root.runtime !== 'cordova'" class="pull-right" style="visibility: hidden">
          <div class="btn-group btn-group-xs" role="group" aria-label="...">
            <button type="button" class="btn btn-default" @click.stop="setTop(project.id, $event)">
              <span class="glyphicon glyphicon-arrow-up" ></span>
            </button>
            <button v-if="project.uid===$root.uid && project.editable==='Y'" type="button" class="btn btn-default" @click.stop="editProject(project, $event)">
              <span class="glyphicon glyphicon-pencil" ></span>
            </button>
            <button v-if="project.uid===$root.uid && project.editable==='Y'" type="button" class="btn btn-default" @click.stop="removeProject(project, $event)">
              <span class="glyphicon glyphicon-trash" ></span>
            </button>
          </div>
        </div>
        <div v-if="$root.runtime==='cordova' && project.uid===$root.uid && project.editable==='Y'" class="drawer-right btn-group">
          <button type="button" class="btn btn-default" @click.stop="setTop(project.id, $event)">
            <span class="glyphicon glyphicon-arrow-up" ></span>
          </button>
          <button type="button" class="btn btn-default" @click.stop="editProject(project, $event)">
            <span class="glyphicon glyphicon-pencil"></span>
          </button>
          <button type="button" class="btn btn-default" @click.stop="removeProject(project, $event)">
            <span class="glyphicon glyphicon-trash"></span>
          </button>
        </div>
      </div> <!-- /.list-group-item-info  -->
      <transition-group name="slide-fade" v-bind:key="project.id + '_slide'">
        <div class="list-group-item" v-for="task in project.tasks" v-show="search(task)" v-bind:key="task.id" @click="activeTask(task, $event)">
          <span v-if="task.state===0" class="chkbox glyphicon glyphicon-unchecked" @click.stop="toggleTask(task, 1, $event)"></span>
          <span v-if="task.state===1" class="chkbox glyphicon glyphicon-check" @click.stop="toggleTask(task, 0, $event)"></span>
          <div class="content" @mouseenter="mousein" @mouseleave="mouseout">
            <pre class="lead wrap" @click="expandContent">{{ task.content }}</pre>
            <small v-if="task.notify_date" class="text-muted">{{ task.notify_date }} {{ today(task.notify_date) }} {{ task.notify_time }}</small>
            <small v-else class="text-muted">{{ $t('ui.no_date') }}</small>
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
        </div> <!-- /.list-group-item  -->
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
  name: 'projectlist',
  props: [ 'content' ],
  data () {
    return {
      activePid: 0,
      topPid: 0
    }
  },
  created () {
    if (sessionStorage['activePid']) {
      this.activePid = sessionStorage['activePid']
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
      if (this.activePid !== 0 && $('.list-group-item-info[data-pid="' + this.activePid + '"]').length !== 0) {
        $('.list-group-item-info[data-pid="' + this.activePid + '"]').click()
      } else {
        $('.list-group-item-info:first').click()
      }
      touch.on('.list-group-item-info', 'hold', function (evt) {
        let _self = $('.drawer-right', evt.currentTarget)
        $('.drawer-right').not(_self).removeClass('drawer-right-on')
        _self.addClass('drawer-right-on')
      })
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
    editProject (project, evt) {
      if (project.uid !== this.$root.uid) {
        return
      }
      this.$router.push({ name: 'project', params: project })
    },
    removeProject (project) {
      let bool = confirm(this.$t('message.confirm_to_remove'))
      if (!bool) {
        return
      }
      this.$root.removeProject(project.id, project.name)
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
    activeProject (project, evt) {
      this.activePid = project.id
      this.$emit('changegroup', project.name)
      $('.drawer-right').removeClass('drawer-right-on')
    },
    activeTask (task, evt) {
      $('.drawer-right').removeClass('drawer-right-on')
    },
    addTask () {
      this.$root.addTask({
        pid: this.activePid,
        content: this.content,
        notify_date: null
      })
    },
    setTop (pid) {
      this.topPid = pid
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
    projects () {
      let projects = this.$store.state.projects.map((project) => {
        let projectProxy = {}
        Object.keys(project).forEach(key => {
          projectProxy[key] = project[key]
        })
        projectProxy.tasks = []
        this.$store.state.tasks.forEach((task) => {
          if (task.pid === projectProxy.id) {
            let taskProxy = {}
            Object.keys(task).forEach(key => {
              taskProxy[key] = task[key]
            })
            taskProxy.gname = projectProxy.name
            projectProxy.tasks.push(taskProxy)
          }
        })
        projectProxy.tasks.sort((a, b) => {
          if (a.state < b.state) {
            return -1
          }
          if (a.state > b.state) {
            return 1
          }
          if (a.notify_date === null && b.notify_date !== null) {
            return 1
          } else if (a.notify_date !== null && b.notify_date === null) {
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
        return projectProxy
      })
      let topPid = this.topPid
      projects.sort((a, b) => {
        if (a.id === topPid) { // a should smaller/negative
          return -1
        }
        if (b.id === topPid) { // b should smaller/positive
          return 1
        }
        return a.id - b.id // no top project/compare them
      })
      return projects
    }
  },
  watch: {
    activePid (val) {
      sessionStorage.setItem('activePid', val)
    }
  }
}
</script>

