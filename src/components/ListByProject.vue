<template>
  <div class="list-group">
    <template v-for="project in projects">
      <div class="list-group-item list-group-item-info" v-bind:key="project.id" v-bind:data-name="project.name" v-bind:data-pid="project.id" 
        @click="activeProject(project, $event)" @dblclick="editProject(project, $event)">
        {{ project.name }}
        <div class="pull-right">
          <span v-if="project.uid===$root.uid && project.editable==='Y'" class="glyphicon glyphicon-pencil" @click="editProject(project, $event)"></span>
        </div>
      </div>
      <div class="list-group-item" v-for="task in project.tasks" v-bind:key="task.id">
        <span v-if="task.state===0" class="chkbox glyphicon glyphicon-unchecked" @click="toggleTask(task, 1, $event)"></span>
        <span v-if="task.state===1" class="chkbox glyphicon glyphicon-check" @click="toggleTask(task, 0, $event)"></span>
        <div class="content" @mouseenter="mousein" @mouseleave="mouseout">
          <p class="lead wrap" @click="expandContent" @dblclick="editTask(task, $event)">
            {{ task.content }}
          </p>
          <small v-if="task.notify_date" class="text-muted">{{ task.notify_date }}</small>
          <small v-else class="text-muted">无期限</small>
          <div v-if="$root.runtime !== 'cordova'" class="pull-right" style="visibility: hidden">
            <div class="btn-group btn-group-xs" role="group" aria-label="...">
              <button type="button" class="rmbtn btn btn-default" @click="editTask(task, $event)">
                <span class="glyphicon glyphicon-pencil"></span>
              </button>
              <button type="button" class="rmbtn btn btn-default" @click="removeTask(task, $event)">
                <span class="glyphicon glyphicon-trash"></span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="$root.runtime === 'cordova'" class="drawer-right btn-group">
          <button type="button" class="btn btn-default" @click.stop="editTask(task, $event)">
            <span class="glyphicon glyphicon-pencil"></span>
          </button>
          <button type="button" class="btn btn-default" @click.stop="removeTask(task, $event)">
            <span class="glyphicon glyphicon-trash"></span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
div.list-group-item { margin: 0 5px; box-shadow: 3px 3px #F4F4F4 }
div.list-group-item-info { background: linear-gradient(to bottom right, #d9edf7, #FFFFFF); font-weight: 600; font-size: 16px; margin-top: 10px; }
span.chkbox { font-size: 32px; vertical-align: middle; float: left; -webkit-text-stroke: 2px white; color: #51c4f1; }
div.content { margin-left: 35px; position: relative; }
div.pull-right span.glyphicon { margin: 0 5px; }
div.drawer-right { position: absolute; top: 0; right: 0; bottom: 0; width: 100px; background-color: #F4F4F4; 
  display: none; flex-direction: row; flex-wrap: nowrap; justify-content: flex-end; transition: display .5s; }
div.drawer-right-on { display: flex; }
div.drawer-right .btn { flex-grow: 1; }
div.drawer-right span.glyphicon-pencil { color: #7ed321; }
div.drawer-right span.glyphicon-trash { color: red; }

p.lead { margin-bottom: 0px; overflow: hidden; font-weight: 400; }
p.wrap { white-space: nowrap; text-overflow: ellipsis; }
.affix { top: 50px; left: 0px; width: 100vw; z-index: 1001; }
</style>

<script>
import $ from 'jquery'
import touch from 'touchjs'

export default {
  name: 'projectlist',
  data () {
    return {
      active_pname: '',
      active_pid: null
    }
  },
  persist: ['active_pid', 'active_pname'],
  updated () {
    this.initDom()
  },
  activated () {
    this.initDom()
  },
  methods: {
    initDom () {
      if (this.active_pid !== null && $('.list-group-item-info[data-pid="' + this.active_pid + '"]').length !== 0) {
        $('.list-group-item-info[data-pid="' + this.active_pid + '"]').click()
      } else {
        $('.list-group-item-info:first').click()
      }
      touch.on('.list-group-item:not(.list-group-item-info)', 'hold', function (evt) {
        let _self = $('.drawer-right', evt.currentTarget)
        $('.drawer-right').not(_self).removeClass('drawer-right-on')
        _self.addClass('drawer-right-on')
      })
    },
    expandContent (evt) {
      $('p.lead').not(evt.target).addClass('wrap')
      $(evt.target).toggleClass('wrap')
    },
    editProject (project, evt) {
      if (project.uid !== this.$root.uid) {
        return
      }
      this.$router.push({ name: 'project', params: project })
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
        this.$root.removeTask(task.id, task.pid)
      }, () => {
        $item.css({ display: 'block' })
      })
    },
    activeProject (project, evt) {
      $('span.glyphicon-ok-circle').remove()
      $('<span>').addClass('glyphicon glyphicon-ok-circle').appendTo($('.pull-right', evt.target))
      this.active_pid = project.id
      this.active_pname = project.name
      this.$emit('activate', project.id, project.name)
    },
    mousein (evt) {
      $('.pull-right', evt.target).css('visibility', '')
    },
    mouseout (evt) {
      $('.pull-right', evt.target).css('visibility', 'hidden')
    }
  },
  computed: {
    projects () {
      if (this.$store.state.tasks.length === 0) {
        return []
      }
      this.$store.state.projects.forEach((project) => {
        project.tasks = []
        this.$store.state.tasks.forEach((task) => {
          if (task.pid === project.id) {
            task.gname = project.name
            project.tasks.push(task)
          }
        })
        project.tasks.sort((a, b) => {
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
            return a.ctime > b.ctime
          } else {
            return a.notify_date > b.notify_date
          }
        })
      })
      this.$store.state.projects.sort((a, b) => {
        return a.id > b.id
      })
      return this.$store.state.projects
    }
  }
}
</script>

