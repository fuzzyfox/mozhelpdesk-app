<template lang="html">
  <time class="mh-relative-time" :datetime="datetime">{{ displayTime }}</time>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'mh-relative-time',

    data() {
      return {
        interval: null,
        displayTime: null
      }
    },

    props: {
      timestamp: {
        type: [String, Object],
        required: true
      }
    },

    computed: {
      moment() {
        return moment(this.timestamp)
      },
      datetime() {
        return this.moment.toString()
      }
    },

    created() {
      this.displayTime = this.moment.fromNow()

      this.interval = setInterval(() => {
        this.displayTime = this.moment.fromNow()
      }, 5000)
    },

    beforeDestroy() {
      clearTimeout(this.interval)
    }
  }
</script>

<style lang="scss">
</style>
