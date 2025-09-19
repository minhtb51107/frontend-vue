<template>
  <button
    :type="type"
    :class="['btn', variant, { loading: isLoading }]"
    :disabled="isLoading || disabled"
    @click="$emit('click')"
  >
    <span v-if="isLoading">Đang xử lý...</span>
    <span v-else><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.btn {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid #aaa;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: #000;
  color: #fff;
}

.btn.secondary {
  background: #fff;
  color: #000;
}

.btn.outline {
  background: transparent;
  border: 1px solid #000;
  color: #000;
}

.btn:hover:not(:disabled) {
  background: #333;
  color: #fff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.loading {
  cursor: wait;
}
</style>