<template>
  <footer class="chat-input">
    <div class="input-wrapper">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter.exact.prevent="$emit('send')"
        placeholder="Send a message..."
        ref="textarea"
      />
      <button @click="$emit('send')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
        </svg>
      </button>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'send'],
  methods: {
    focus() {
      this.$refs.textarea.focus()
    }
  }
}
</script>

<style scoped>
.chat-input {
  padding: 20px;
  background: rgb(34, 34, 34);
  border-top: 1px solid #2e2e2e;
  display: flex;
  justify-content: center;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 750px;
  background: rgb(48, 48, 48);
  border-radius: 18px;
  padding: 12px;
}

.input-wrapper textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  resize: none;
  font-size: 1rem;
  line-height: 1.4;
  padding-right: 40px;
}

.input-wrapper button {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
</style>