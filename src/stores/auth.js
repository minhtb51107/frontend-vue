import apiClient from '@/services/api';

const state = {
  user: null,
  // ✅ Lấy token từ localStorage ngay khi store được tạo
  token: localStorage.getItem('token') || null
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
    // Cập nhật localStorage tương ứng
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  LOGOUT(state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
  }
};

const actions = {
  /**
   * Action này sẽ được gọi khi tải lại trang và sau khi đăng nhập.
   * Nó sẽ tự lấy token từ state.
   */
  async initializeUserFromToken({ commit, state }) {
    // Nếu trong state không có token -> không làm gì cả
    if (!state.token) {
      return Promise.resolve(); // Trả về promise đã hoàn thành
    }

    try {
      // API client đã tự động thêm token vào header rồi
      const userResponse = await apiClient.get('/chat/sessions/users/me'); // Cập nhật endpoint lấy user
      commit('SET_USER', userResponse.data);
    } catch (error) {
      console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất.", error);
      // Nếu có lỗi (token sai), xóa token và user đi
      commit('LOGOUT');
    }
  },

  async login({ commit, dispatch }, credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    const token = response.data.token; // Giả sử backend trả về { token: '...' }

    if (token) {
      commit('SET_TOKEN', token);
      await dispatch('initializeUserFromToken'); // Gọi action để lấy thông tin user
    }
  },

  logout({ commit }) {
    commit('LOGOUT');
  },
  // ... các actions khác
};

const getters = {
  isAuthenticated: state => !!state.token && !!state.user, // ✅ An toàn hơn: kiểm tra cả user
  currentUser: state => state.user
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};