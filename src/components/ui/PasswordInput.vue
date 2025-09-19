<template>
  <div class="password-wrapper">
    <FormInput
      :type="showPassword ? 'text' : 'password'"
      :modelValue="modelValue"
      :placeholder="placeholder"
      :required="required"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    <span class="toggle-eye" @click="showPassword = !showPassword">
      {{ showPassword ? 'Ẩn' : 'Hiện' }}
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormInput from './FormInput.vue'

defineProps({
  modelValue: String,
  placeholder: String,
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)
</script>

<style scoped>
.password-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.password-wrapper :deep(.form-input) {
  padding-right: 40px;
}

.toggle-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
}
</style>