<template>
  <div class="list-group">
    <template v-for="project in projects">
      <div class="list-group-item list-group-item-info" v-bind:key="project.id" @click="active" v-bind:data-pid="project.id">
        <span class="glyphicon glyphicon-chevron-down"></span> {{ project.name }}
        <div class="pull-right">
          <span v-if="project.editable === 'Y'" class="glyphicon glyphicon-share"></span>
          <span v-if="project.editable === 'Y'" class="glyphicon glyphicon-pencil" @click="editproject(project)"></span>
        </div>
      </div>
      <div class="list-group-item" v-for="item in project.items" v-bind:key="item.id">
        <p class="lead wrap" @click="expandContent">{{ item.content }}</p>
        <small v-if="item.notify_date">{{ item.notify_date }}</small>
        <small v-else class="text-muted">无期限</small>
        <small>{{ item.ctime }}</small>
        <div class="pull-right">
        </div>
      </div>
    </template>
  </div>
</template>

<style>
div.pull-right span.glyphicon { margin-left: 5px; }
p.lead { margin-bottom: 0px; overflow: hidden; }
p.wrap { white-space: nowrap; text-overflow: ellipsis; }
.affix { top: 57px; left: 0px; width: 100vw; z-index: 1001; }
</style>


<script>
import $ from 'jquery'

export default {
  name: 'project',
  created () {
    $(function () {
      $('.list-group-item-info').each(function (idx, ele) {
        $(ele).affix({
          offset: {
            top: function () {
              return (this.top = ele.offsetTop + 1 - idx * 2)
            }
          },
          target: '.main'
        })
        $(ele).on('affixed.bs.affix', function () {
          $(this).click()
          $(this).next().css('margin-top', $(this).height() + 20)
        })
        $(ele).on('affixed-top.bs.affix', function () {
          $(this).click()
          $(this).next().css('margin-top', '0px')
        })
      })
    })
  },
  methods: {
    expandContent (evt) {
      $('p.lead').not(evt.target).addClass('wrap')
      $(evt.target).toggleClass('wrap')
    },
    editproject (project) {
      console.log('编辑项目', project)
    },
    edititem (item) {
      console.log('编辑条目', item)
    },
    active (evt) {
      $('span.glyphicon-ok-circle').remove()
      $('<span>').addClass('glyphicon glyphicon-ok-circle').appendTo($('.pull-right', evt.target))
      this.$parent.active_pid = $(evt.target).data('pid')
    }
  },
  computed: {
    projects () {
      if (this.$store.state.items.length === 0) {
        return []
      }
      if (this.$parent.active_pid === null && this.$store.state.projects.length !== 0) {
        this.$parent.active_pid = this.$store.state.projects[0].id
      }
      let newProjects = this.$store.state.projects.map((project) => {
        let newProject = {}
        $.extend(newProject, project)
        newProject.items = []
        this.$store.state.items.forEach((item) => {
          if (item.pid === project.id) {
            newProject.items.push(item)
          }
        })
        newProject.items.sort((a, b) => {
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

