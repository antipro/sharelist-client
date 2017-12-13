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
        pid: 0,
        content: this.content,
        notify_date: this.$store.state.activeDate
      })
    }
  }
}
</script>


