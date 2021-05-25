import {combineReducers} from 'redux';
import {storage} from '@/utils/storage';

const toggleHttpLoading = (state = {loading: false}, action) => {
  switch (action.type) {
    case 'http_loading':
      return {loading: action.loading};
    default:
      return state;
  }
};

const toggleSider = (state = {collapsed: false}, action) => {
  switch (action.type) {
    case 'sider':
      return {collapsed: action.collapsed};
    default:
      return state;
  }
};

const toggleLogin = (state = {logged: false}, action) => {
  switch (action.type) {
    case 'login':
      return {logged: action.logged};
    default:
      return state;
  }
};

const getUserInfo = (state = {info: storage.getData('userInfo')}, action) => {
  switch (action.type) {
    case 'user_info':
      return {info: action.info};
    default:
      return state;
  }
};

const toggleAdvancedSearch = (state = {can: false}, action) => {
  switch (action.type) {
    case 'can_do_advanced_search':
      return {can: action.can};
    default:
      return state;
  }
};
const menus=(state={activeKey: 'home',
  openKeys: 'home'}, action)=> {
  switch (action.type) {
    case 'layout/menus-path-data':
      return {activeKey: (action.activeKey !== null) ? action.activeKey : state.activeKey,
        openKeys: action.openKeys};
    default:
      return state;
  }
};

const reducer = combineReducers({
  toggleHttpLoading,
  toggleSider,
  toggleLogin,
  getUserInfo,
  toggleAdvancedSearch,
  menus,
});

export default reducer;
