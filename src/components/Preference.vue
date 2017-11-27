<template>
  <div class="preference">
    <navibar ref="nav" navtitle="设置" :tel="$root.tel" :uname="$root.uname">
      <span slot="action" class="glyphicon glyphicon-floppy-disk" @click="updatePreference"></span>
    </navibar>
    <div class="container-fluid" style="margin-top: 20px;">
      <div class="row">
        <div class="col-md-6">
          <div class="checkbox input-lg">
          <label @click="toggle">
            <span v-if="starup_minimaze===true" class="chkbox glyphicon glyphicon-check" ></span>
            <span v-if="starup_minimaze===false" class="chkbox glyphicon glyphicon-unchecked"></span>
            启动时最小化
          </label>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.preference { position: relative; height: 100%; width: 100%; }
@media screen and (min-width: 800px) {
  .preference { margin-left: 250px; width: calc(100% - 250px); }
}
span.chkbox { vertical-align: middle; float: left; -webkit-text-stroke: 2px white; color: #51c4f1; }

</style>

<script>
import Navibar from '@/components/Navibar'

export default {
  name: 'preference',
  data () {
    return {
      starup_minimaze: false
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    toggle () {
      this.starup_minimaze = !this.starup_minimaze
    },
    updatePreference () {
    }
  },
  components: {
    Navibar
  }
}
</script>

