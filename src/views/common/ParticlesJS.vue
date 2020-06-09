<template>
  <div id="particles-js"></div>
</template>
<script>
import config from '../../assets/particles.json'
export default {
  name: 'ParticlesJS',
  mounted() {
    require('particles.js')
    this.$nextTick(() => {
      this.initParticlesJS()
    })
  },
  methods: {
    initParticlesJS() {
      /* eslint-disable */
      particlesJS('particles-js', config)
    }
  }
}
</script>
