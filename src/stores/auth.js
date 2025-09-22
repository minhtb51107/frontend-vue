import axios from 'axios';

const state = {
  user: null,
  token: localStorage.getItem('token') || null
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  LOGOUT(state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
  }
};

const actions = {
    /**
   * ACTION MỚI: Khởi tạo trạng thái người dùng từ token.
   * Action này sẽ được gọi cả khi tải lại trang và ngay sau khi đăng nhập thành công.
   */
  async initializeUserFromToken({ commit }, token) {
    if (!token) {
      commit('LOGOUT'); // Đảm bảo đăng xuất nếu không có token
      return;
    }

    commit('SET_TOKEN', token);
    
    // Tự động thêm token vào header cho mọi request của axios sau này
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      // Gọi API để lấy thông tin người dùng tương ứng với token
      const userResponse = await axios.get('/api/user');
      commit('SET_USER', userResponse.data);
    } catch (error) {
      console.error("Lỗi xác thực: Không thể lấy thông tin người dùng.", error);
      // Nếu token không hợp lệ, hãy xóa nó đi
      commit('LOGOUT');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  async login({ dispatch }, credentials) { // Sửa lại action login một chút
    const response = await axios.post('/api/auth/login', credentials);
    // Gọi action mới để tập trung logic
    await dispatch('initializeUserFromToken', response.data.token);
  },
  
  async register({ commit }, userData) {
    await axios.post('/api/auth/register', userData);
  },
  
  async sendVerificationCode({ commit }, email) {
    await axios.post('/api/auth/send-code', { email });
  },
  
  logout({ commit }) {
    commit('LOGOUT');
    delete axios.defaults.headers.common['Authorization']; // Xóa header khi logout
  }
};

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};