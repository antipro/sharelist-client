<template>
  <div>Date</div>
</template>
<script>
export default {
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
    }
  }
}
</script>


