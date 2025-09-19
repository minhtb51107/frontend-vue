<template>
  <div class="session-menu" v-click-outside="handleClickOutside">
    <div @click="$emit('rename')">✏️ Rename</div>
    <div @click="$emit('delete')">🗑️ Delete</div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClickOutside() {
      this.$emit('close')
    }
  }
}
</script>