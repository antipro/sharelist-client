<template>
  <div class="list-group">
    <template v-for="project in projects">
      <div class="list-group-item list-group-item-info" v-bind:key="project.id" v-bind:data-name="project.name" v-bind:data-pid="project.id" 
        @click="activeProject(project, $event)" @dblclick="editProject(project, $event)" v-editproject="project">
        <span class="glyphicon glyphicon-chevron-down"></span> {{ project.name }}
        <div class="pull-right">
          <span v-if="project.uid===$root.uid" class="glyphicon glyphicon-pencil"></span>
        </div>
      </div>
      <div class="list-group-item" v-for="task in project.tasks" v-bind:key="task.id" v-edittask="task" @mouseenter="mousein" @mouseleave="mouseout">
        <span v-if="task.state===0" class="chkbox glyphicon glyphicon-unchecked" @click="toggleTask(task, 1, $event)"></span>
        <span v-if="task.state===1" class="chkbox glyphicon glyphicon-check" @click="toggleTask(task, 0, $event)"></span>
        <div class="content">
          <p class="lead wrap" @click="expandContent" @dblclick="editTask(task, $event)">
            {{ task.content }}
          </p>
          <small v-if="task.notify_date" class="text-muted">{{ task.notify_date }}</small>
          <small v-else class="text-muted">无期限</small>
          <div class="pull-right" style="visibility: hidden">
            <div class="btn-group btn-group-xs" role="group" aria-label="...">
              <button type="button" class="rmbtn btn btn-default" @click="removeTask(task, $event)">
                <span class="glyphicon glyphicon-trash"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
div.list-group-item-info { background: linear-gradient(to bottom right, #d9edf7, #FFFFFF); font-weight: 600; }
span.chkbox { font-size: 32px; vertical-align: middle; float: left; -webkit-text-stroke: 2px white; }
div.content { padding-left: 35px; }
div.pull-right span.glyphicon { margin-left: 5px; }
p.lead { margin-bottom: 0px; overflow: hidden; font-weight: 400; }
p.wrap { white-space: nowrap; text-overflow: ellipsis; }
.affix { top: 50px; left: 0px; width: 100vw; z-index: 1001; }
</style>

<script>
import $ from 'jquery'
import touch from 'touchjs'

export default {
  name: 'projectlist',
  updated () {
    if (this.$parent.active_gid === null) {
      $('.list-group-item-info:first').click()
    }
    touch.on('.list-group-item', 'swiperight swipeleft', function (evt) {
      if ($(this).hasClass('list-group-item')) {
        $('.rmbtn', this).click()
      } else {
        $(this).parents('.list-group-item').find('.rmbtn').click()
      }
    })
    touch.on('.list-group-item', 'doubletap', function (evt) {
      if ($(this).hasClass('list-group-item')) {
        $(this).dblclick()
      } else {
        $(this).parents('.list-group-item').dblclick()
      }
    })
  },
  directives: {
    editproject: {
      inserted: function (el, binding, vnode) {
        let diff = 0
        let ptr = 0
        el.addEventListener('touchstart', (evt) => {
          if (diff === 0) {
            diff = evt.timeStamp
          } else {
            diff = evt.timeStamp - diff
            if (diff < 300) {
              vnode.context.editProject(binding.value)
            }
            diff = 0
            clearTimeout(ptr)
          }
          ptr = setTimeout(() => {
            diff = 0
          }, 400)
        })
      }
    },
    edittask: {
      inserted: function (el, binding, vnode) {
        let diff = 0
        el.addEventListener('touchstart', (evt) => {
          if (diff === 0) {
            diff = evt.timeStamp
          } else {
            diff = evt.timeStamp - diff
            if (diff < 1000) {
              vnode.context.editTask(binding.value)
            }
            diff = 0
          }
        })
      }
    }
  },
  methods: {
    expandContent (evt) {
      $('p.lead').not(evt.target).addClass('wrap')
      $(evt.target).toggleClass('wrap')
    },
    editProject (project, evt) {
      if (project.editable === 'N') {
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
      this.$parent.active_gid = project.id
      this.$parent.active_gname = project.name
    },
    mousein (evt) {
      evt.target.querySelector('.pull-right').style.visibility = ''
    },
    mouseout (evt) {
      evt.target.querySelector('.pull-right').style.visibility = 'hidden'
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

