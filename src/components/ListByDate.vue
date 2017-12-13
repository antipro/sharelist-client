<template>
  <div>Date</div>
</template>
<script>
export default {
  name: 'datalist',
  props: [ 'content' ],
  methods: {
    addTask () {
      this.$root.addTask({
        pid: this.$store.state.ungroupPid,
        uid: this.$root.uid,
        content: this.content,
        notify_date: this.$store.state.activeDate
      })
    }
  }
}
</script>


