<template>
  <div class="list-group">
    <template v-for="project in projects">
      <div class="list-group-item list-group-item-info" v-bind:key="project.id" v-bind:data-name="project.name" v-bind:data-pid="project.id" 
        @click="activeProject(project, $event)" @dblclick="editproject(project)">
        <span class="glyphicon glyphicon-chevron-down"></span> {{ project.name }}
        <div class="pull-right">
          <span v-if="project.editable === 'Y'" class="glyphicon glyphicon-share"></span>
          <span v-if="project.editable === 'Y'" class="glyphicon glyphicon-pencil"></span>
        </div>
      </div>
      <div class="list-group-item" v-for="task in project.tasks" v-bind:key="task.id" @mouseenter="mousein" @mouseleave="mouseout">
        <p class="lead wrap" @click="expandContent">
          <span v-if="task.state===0" class="glyphicon glyphicon-unchecked" @click="finishTask(task, $event)"></span>
          <span v-if="task.state===1" class="glyphicon glyphicon-check"></span>
           {{ task.content }}
        </p>
        <small v-if="task.notify_date">{{ task.notify_date }}</small>
        <small v-else class="text-muted">无期限</small>
        <div class="pull-right" style="visibility: hidden">
          <div class="btn-group btn-group-xs" role="group" aria-label="...">
            <button type="button" class="rmbtn btn btn-default" @click="removeTask(task, $event)">
              <span class="glyphicon glyphicon-trash"></span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
div.list-group-item-info { background: linear-gradient(to bottom right, #d9edf7, #FFFFFF); }
div.pull-right span.glyphicon { margin-left: 5px; }
p.lead { margin-bottom: 0px; overflow: hidden; }
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
    touch.on('.list-group-item', 'swiperight', function (evt) {
      if ($(this).hasClass('list-group-item')) {
        $('.rmbtn', this).click()
      } else {
        $(this).parents('.list-group-item').find('.rmbtn').click()
      }
    })
  },
  methods: {
    expandContent (evt) {
      $('p.lead').not(evt.target).addClass('wrap')
      $(evt.target).toggleClass('wrap')
    },
    editproject (project) {
      console.log(project)
      if (project.editable === 'N') {
        return
      }
      this.$router.push({ name: 'project', params: project })
    },
    editTask (task) {
      console.log('编辑条目', task)
    },
    finishTask (task, evt) {
      task.state = 1
      this.$parent.shownotice(() => {
        this.$root.finishTask(task.id, task.pid)
      }, () => {
        task.state = 0
      })
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
      let newProjects = this.$store.state.projects.map((project) => {
        let newProject = {}
        $.extend(newProject, project)
        newProject.tasks = []
        this.$store.state.tasks.forEach((task) => {
          if (task.pid === project.id) {
            newProject.tasks.push(task)
          }
        })
        newProject.tasks.sort((a, b) => {
          if (a.notify_date === null && b.notify_date !== null) {
            return true
          } else if (a.notify_date !== null && b.notify_date === null) {
            return false
          } else if (a.notify_date === null && b.notify_date === null) {
            return a.ctime > b.ctime
          } else {
            return a.notify_date > b.notify_date
          }
        })
        return newProject
      })
      newProjects.sort((a, b) => {
        return a.id > b.id
      })
      return newProjects
    }
  }
}
</script>

