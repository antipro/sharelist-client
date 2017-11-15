<template>
  <div style="position: relative; height: 100%;">
  <navibar ref="nav" navtitle="项目" :tel="$root.tel" :uname="$root.uname"></navibar>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="project_name">项目名称</label>
          <input type="text" class="form-control" id="project_name" v-model="name">
        </div>
        <div class="form-group">
          <label for="">共享用户</label>
          <div class="list-group">
            <div class="list-group-item">
              <div class="alert alert-warning alert-dismissible" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <span>13288888888<small>小张</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Navibar from '@/components/Navibar'

export default {
  name: 'project',
  data () {
    return {
      id: null,
      name: null,
      shares: []
    }
  },
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
      return
    }
    this.id = this.$route.params.id
    this.name = this.$route.params.name
  },
  components: {
    Navibar
  }
}
</script>

