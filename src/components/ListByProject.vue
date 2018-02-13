<template>
  <div class="list-group listbyproject">
    <template v-if="projects.length === 0">
      <div class="list-group-item list-group-item-info">
        <h3>{{ $t('ui.loading') }}</h3>
        <div class="progress">
          <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%"></div>
        </div>
      </div>
    </template>
    <template v-else v-for="project in projects">
      <div class="list-group-item list-group-item-info" 
        v-locate :id="'project_' + project.id" 
        :key="project.id" 
        :data-name="project.name" 
        :data-pid="project.id" 
        @click="activeProject(project)" 
        @mouseenter="mousein('project_' + project.id)" 
        @mouseleave="mouseout('project_' + project.id)"
        :class="{'activestyle': activeid === 'project_' + project.id}">
        <span v-show="checkActive(project)" class="glyphicon glyphicon-ok-circle"></span> {{ project.name===''?$t('ui.ungrouped'):project.name }} {{ project.uid !== $root.uid ? '(' + project.uname + ')' : '' }}
        <div 
          v-if="$root.runtime !== 'cordova'" 
          class="pull-right" 
          :class="{'pull-right-on': activeid === 'project_' + project.id || mouseid === 'project_' + project.id}">
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
        <div v-if="$root.runtime==='cordova'" 
          class="drawer-right btn-group" 
          :class="{'drawer-right-on': drawid === 'project_' + project.id}">
          <button type="button" class="btn btn-default" @click.stop="setTop(project.id, $event)">
            <span class="glyphicon glyphicon-arrow-up" ></span>
          </button>
          <button v-if="project.uid===$root.uid && project.editable==='Y'" type="button" class="btn btn-default" @click.stop="editProject(project, $event)">
            <span class="glyphicon glyphicon-pencil"></span>
          </button>
          <button v-if="project.uid===$root.uid && project.editable==='Y'" type="button" class="btn btn-default" @click.stop="removeProject(project, $event)">
            <span class="glyphicon glyphicon-trash"></span>
          </button>
        </div>
      </div> <!-- /.list-group-item-info  -->
      <transition-group name="slide-fade" :key="project.id + '_slide'">
        <div class="list-group-item" 
          v-for="task in project.tasks" 
          v-locate v-if="search(task)" 
          :id="'task_' + task.id" 
          :key="task.id" 
          :data-tid="task.id" 
          @click="activeTask(task)"
          :class="{'activestyle': activeid === 'task_' + task.id}">
          <span v-if="task.state===0" class="chkbox glyphicon glyphicon-unchecked" @click.stop="toggleTask(task, 1, $event)"></span>
          <span v-if="task.state===1" class="chkbox glyphicon glyphicon-check" @click.stop="toggleTask(task, 0, $event)"></span>
          <div class="content" @mouseenter="mousein('task_' + task.id)" @mouseleave="mouseout('task_' + task.id)">
            <pre class="lead" :class="{'wrap': expandid !== 'task_' + task.id}" @click="toggleWrap(task.id)">{{ task.content }}</pre>
            <small v-if="task.notify_date" class="text-muted">{{ task.notify_date }} {{ today(task.notify_date) }} {{ task.notify_time }}</small>
            <small v-else class="text-muted">{{ $t('ui.no_date') }}</small>
            <div v-if="$root.runtime!=='cordova'" 
              class="pull-right" 
              :class="{'pull-right-on': activeid === 'task_' + task.id || mouseid === 'task_' + task.id}">
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
          <div v-if="$root.runtime==='cordova'" class="drawer-right btn-group" :class="{'drawer-right-on': drawid === 'task_' + task.id}">
            <button type="button" class="btn btn-default" @click.stop="editTask(task, $event)">
              <span class="glyphicon glyphicon-pencil"></span>
            </button>
            <button type="button" class="btn btn-default" @click.stop="removeTask(task, $event)">
              <span class="glyphicon glyphicon-trash"></span>
            </button>
          </div>
        </div> <!-- /.list-group-item  -->
      </transition-group> <!-- /task transition-group  -->
    </template> <!-- /foreach project  -->
  </div> <!-- /.list-group  -->
</template>

<style scoped>
div.list-group-item { margin: 0 5px; box-shadow: 3px 3px #F4F4F4; }
div.activestyle { border-color: #3d3c3c; box-shadow: 3px 3px #3d3c3c; }
div.list-group-item-info { background-color: #beffb2; font-weight: 600; font-size: 16px; margin-top: 10px; }
span.chkbox { font-size: 32px; vertical-align: middle; float: left; -webkit-text-stroke: 2px white; color: #51c4f1; }
div.content { margin-left: 35px; position: relative; }
div.pull-right { visibility: hidden; }
div.pull-right-on { visibility: visible; }
div.pull-right span.glyphicon { margin: 0 5px; }
div.drawer-right { position: absolute; top: 0; right: 0; bottom: 0; background-color: #F4F4F4; 
  display: none; }
div.drawer-right-on { display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: flex-end; }
div.drawer-right .btn { flex-grow: 1; }
div.drawer-right span.glyphicon-pencil { color: #7ed321; }
div.drawer-right span.glyphicon-trash { color: red; }

pre.lead { white-space: pre-wrap; margin-bottom: 0px; overflow: hidden; font-weight: 400; background-color: transparent; border: none; padding: 0; font-family: inherit; }
pre.wrap { white-space: nowrap; text-overflow: ellipsis; }

.slide-fade-enter-active { transition: all .3s ease; }
.slide-fade-leave-active { transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0); }
.slide-fade-enter, .slide-fade-leave-to { transform: translateX(10px); opacity: 0; }
.slide-fade-move { transition: transform .5s; }
</style>

<script>
import $ from 'jquery'
import touch from 'touchjs'

let locationId = ''
function locateElement (el) {
  let viewTop = document.querySelector('.main').scrollTop
  let viewButtom = document.querySelector('.main').scrollTop + window.innerHeight - 100
  let elButtom = el.offsetTop + el.scrollHeight
  if (locationId !== '#' + el.id) {
    return
  }
  if (elButtom >= viewButtom) {
    document.querySelector('.main').scrollTop += elButtom - viewButtom
  }
  if (el.offsetTop <= viewTop) {
    document.querySelector('.main').scrollTop -= viewTop - elButtom + el.scrollHeight
  }
}
export default {
  name: 'projectlist',
  props: [ 'content' ],
  data () {
    return {
      drawid: '',
      expandid: '',
      activeid: '',
      mouseid: ''
    }
  },
  directives: {
    locate: {
      inserted: function (el) {
        locateElement(el)
      }
    }
  },
  mounted () {
    touch.on('.list-group', 'hold', (evt) => {
      if (evt.target.dataset.pid !== undefined) {
        this.drawid = 'project_' + evt.target.dataset.pid
        return
      }
      if (!evt.path) {
        evt.path = []
        let fun = (src, target) => {
          evt.path.push(src)
          if (src === target) {
            return
          }
          fun(src.parentElement, target)
        }
        fun(evt.srcElement, evt.currentTarget)
      }
      let taskel = evt.path.find((el) => {
        return el.classList.contains('list-group-item')
      })
      if (taskel === undefined) {
        return
      }
      if (taskel.dataset.tid !== undefined) {
        this.drawid = 'task_' + taskel.dataset.tid
      }
    })
  },
  activated () {
    this.$emit('changegroup', '')
    for (let project of this.projects) {
      if (this.checkActive(project)) {
        break
      }
    }
    // document.querySelector('#command').focus()
  },
  updated () {
    document.querySelector('#command').focus()
  },
  methods: {
    toggleWrap (tid) {
      if (this.expandid === 'task_' + tid) {
        this.expandid = ''
      } else {
        this.expandid = 'task_' + tid
      }
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
      if (this.activeid === 'project_' + project.id) {
        this.activeid = ''
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
      if (this.activeid === 'task_' + task.id) {
        this.activeid = ''
      }
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
    addProject (content) {
      this.$root.addProject(content, (project) => {
        this.$root.activePid = project.id
        this.activeid = 'project_' + project.id
        locationId = '#' + this.activeid
      })
    },
    checkActive (project) {
      let bool = this.activePid === project.id
      if (bool) {
        this.$emit('changegroup', project.name)
      }
      return bool
    },
    activeProject (project) {
      if (project === undefined) {
        return
      }
      this.$root.activePid = project.id
      this.drawid = ''
    },
    activeTask (task) {
      if (task === undefined) {
        return
      }
      this.drawid = ''
    },
    addTask () {
      let content = this.content
      if (content.length > 500) {
        content = content.substr(0, 500)
      }
      this.$root.addTask({
        pid: this.activePid,
        content,
        notify_date: null
      }, (task) => {
        this.activeid = 'task_' + task.id
        locationId = '#' + this.activeid
      })
    },
    setTop (pid) {
      this.$root.topPid = pid
    },
    mousein (id) {
      this.mouseid = id
    },
    mouseout (id) {
      this.mouseid = ''
    },
    search (task) {
      let term = this.content.toLowerCase()
      if (term === '' || !term.startsWith('?')) {
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
    },
    next () {
      if (this.activeid === '') {
        this.activeid = $('.listbyproject .list-group-item:first').attr('id')
      } else {
        let els = $('.listbyproject .list-group-item').get()
        let idx = els.findIndex(el => {
          return this.activeid === el.id
        })
        idx += 1
        if (els[idx]) {
          this.activeid = els[idx].id
        } else {
          console.log('archive to bottom')
        }
      }
      this.locateItem()
    },
    prev () {
      if (this.activeid === '') {
        this.activeid = $('.listbyproject .list-group-item:first').attr('id')
      } else {
        let els = $('.listbyproject .list-group-item').get()
        let idx = els.findIndex(el => {
          return this.activeid === el.id
        })
        idx -= 1
        if (els[idx]) {
          this.activeid = els[idx].id
        } else {
          console.log('archive to top')
        }
      }
      this.locateItem()
    },
    locateItem () {
      locationId = '#' + this.activeid
      locateElement(document.querySelector(locationId))
      if (this.activeid.startsWith('project')) {
        let pid = parseInt(this.activeid.split('_')[1])
        this.activeProject(this.projects.find(project => project.id === pid))
      }
      if (this.activeid.startsWith('task')) {
        let tid = parseInt(this.activeid.split('_')[1])
        this.activeTask(this.$store.state.tasks.find(task => task.id === tid))
      }
    },
    removeItem () {
      if (this.activeid === '') {
        return
      }
      $('#' + this.activeid).find('.glyphicon-trash').click()
    },
    editItem () {
      if (this.activeid === '') {
        return
      }
      $('#' + this.activeid).find('.glyphicon-pencil').click()
    },
    selectGroup (gid) {
      this.activeid = 'project_' + gid
      this.locateItem()
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
    },
    activePid () {
      return this.$root.activePid
    },
    topPid () {
      return this.$root.topPid
    }
  },
  watch: {
    content (val) {
      if (val.startsWith('#')) {
        let projectName = val.substr(1, val.length).toLowerCase()
        let results = this.projects.filter(project => {
          return project.name.toLowerCase().indexOf(projectName) > -1
        }).map(project => {
          return {
            id: project.id,
            name: project.name
          }
        })
        if (results.length > 0) {
          this.$emit('searchgroup', results)
        } else {
          this.$emit('searchgroup', this.projects.map(project => {
            return {
              id: project.id,
              name: project.name
            }
          }))
        }
      } else {
        this.$emit('searchgroup', [])
      }
    }
  }
}
</script>

