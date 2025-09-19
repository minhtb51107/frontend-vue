<template>
  <li
    :class="{ active: isActive }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="handleClickSession"
  >
    <span v-if="!isRenaming" @dblclick="handleRename">
      {{ session.title || 'New chat' }}
    </span>

    <input
      v-else
      ref="renameInput"
      v-model="newTitle"
      @keyup.enter="submitRename"
      @keyup.esc="cancelRename"
      @blur="cancelRename"
      class="rename-input"
    />

    <!-- Nút mở menu -->
    <button
      v-if="hovered && !isRenaming"
      class="options-button"
      @click.stop="toggleMenu"
    >⋮</button>

    <!-- Menu tuỳ chọn -->
    <div
      v-if="showMenu"
      class="options-menu"
      v-click-outside="closeMenu"
    >
      <div @click.stop="handleRename">Đổi tên</div>
      <div @click.stop="$emit('delete')">Xoá</div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SessionItem',
  props: {
    session: Object,
    isActive: Boolean
  },
  data() {
    return {
      hovered: false,
      showMenu: false,
      isRenaming: false,
      newTitle: ''
    }
  },
  methods: {
    handleClickSession() {
      if (!this.showMenu && !this.isRenaming) {
        this.$emit('click')
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    closeMenu() {
      this.showMenu = false
    },
    handleRename() {
      this.isRenaming = true
      this.newTitle = this.session.title || ''
      this.showMenu = false

      this.$nextTick(() => {
        this.$refs.renameInput.focus()
      })
    },
    submitRename() {
  const trimmed = this.newTitle.trim()
  if (trimmed !== this.session.title) {
    console.log('Submitting rename:', this.session.id, trimmed) // Debug
    this.$emit('rename', { 
      id: this.session.id, 
      title: trimmed 
    }) // Truyền object thay vì từng param
  }
  this.isRenaming = false
},
    cancelRename() {
      this.isRenaming = false
      this.newTitle = ''
    }
  },
  directives: {
    'click-outside': {
      bind(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
li {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 12px;
  cursor: pointer;
  border-bottom: 1px solid #2e2e2e;
  border-radius: 10px;
  margin: 6px;
  transition: background 0.2s;
}

li.active,
li:hover {
  background: #505050;
}

.rename-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  padding: 2px 4px;
  border-bottom: 1px solid white;
  outline: none;
}

.options-button {
  background: transparent;
  border: none;
  color: #bbb;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 6px;
}

.options-button:hover {
  color: #fff;
}

.options-menu {
  position: absolute;
  top: 34px;
  right: 10px;
  background: #2e2f38;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  font-size: 14px;
}

.options-menu div {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.options-menu div:hover {
  background: #929292;
}
</style>
