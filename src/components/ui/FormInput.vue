<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    @input="$emit('update:modelValue', $event.target.value)"
    class="form-input"
  />
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.form-input {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid #aaa;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #000;
}
</style>