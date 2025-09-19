<template>
  <div class="typing">
    <span v-for="dot in dots" :key="dot" class="dot">.</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dots: [1, 2, 3],
      interval: null,
      count: 1
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count = this.count % 3 + 1
    }, 500)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  computed: {
    animatedDots() {
      return this.dots.slice(0, this.count)
    }
  }
}
</script>

<style scoped>
.typing {
  font-size: 1.5rem;
  font-style: italic;
  color: #aaa;
  display: flex;
  gap: 4px;
}
.dot {
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0 }
  40% { opacity: 1 }
}
</style>
