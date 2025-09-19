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
  async login({ commit }, credentials) {
    const response = await axios.post('/api/auth/login', credentials);
    commit('SET_TOKEN', response.data.token);
    
    // Lấy thông tin user
    const userResponse = await axios.get('/api/user', {
      headers: { Authorization: `Bearer ${response.data.token}` }
    });
    commit('SET_USER', userResponse.data);
  },
  
  async register({ commit }, userData) {
    await axios.post('/api/auth/register', userData);
  },
  
  async sendVerificationCode({ commit }, email) {
    await axios.post('/api/auth/send-code', { email });
  },
  
  logout({ commit }) {
    commit('LOGOUT');
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