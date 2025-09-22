import { createStore } from 'vuex'
import auth from './auth' // Import auth module của bạn

// Thêm các modules khác của bạn ở đây nếu có
// import chat from './chat'

export default createStore({
  modules: {
    auth
    // chat
  }
})