import {
  HTTPLOADING,
  SIDER,
  LOGIN,
  USERINFO,
  CANDOAS,
  GET_MENUS_DATA,
} from './actionTypes';

export const httpLoading = (f)=>{
  return {
    type: HTTPLOADING,
    loading: f,
  };
};

export const sider = (f)=>{
  return {
    type: SIDER,
    collapsed: f,
  };
};

export const login = (f)=>{
  return {
    type: LOGIN,
    logged: f,
  };
};

export const userInfo = (u)=>{
  return {
    type: USERINFO,
    info: u,
  };
};

export const canDoAs = (f)=>{
  return {
    type: CANDOAS,
    can: f,
  };
};

export const setMenusData = (activeKey, openKeys) => ({
  type: GET_MENUS_DATA,
  activeKey,
  openKeys,
});
