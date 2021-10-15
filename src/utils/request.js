import axios from 'axios';
import {Modal} from 'antd';
let isLogin=false;
// import {storage} from '@/utils/storage';
axios.defaults.timeout = 20000;
axios.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  if (!isLogin&&response.data.code === 401) {
    isLogin = true;
    Modal.error({
      title: 'Notice',
      content: 'Token has expired or user is not exist, please log in again.',
      okText: 'Log In',
      onOk() {
        window.location.replace('/login');
      },
    });
    return false;
  }
  switch (response.data.code) {
    case 200:
      return response.data;
    case 371:
      return Promise.reject(response.data);
    // check token
    case 401:
      return false;
    case 314:
      return Promise.reject(response.data.msg);
    default:
      return Promise.reject(new Error(response.data.msg ??
          'Network error'));
  }
}, (error) => {
  const msg=error.toString()==='Error: timeout of 20000ms exceeded'?
    'Network connection timed out':error;
  return Promise.reject(msg);
});

export const get = async (url, token)=>{
  return await axios({
    method: 'get',
    headers: {
      'token': token,
    },
    url,

  });
};

export const remove = async (url, token)=>{
  return await axios({
    method: 'delete',
    headers: {
      'token': token,
    },
    url,

  });
};

export const post = async (url, data, headers)=>{
  const d = (headers['Content-Type'] === 'application/x-www-form-urlencoded') ?
  dataFomart(data) : data;
  return await axios({
    method: 'post',
    headers,
    url,
    data: d,

  });
};

export const update = async (url, data, headers)=>{
  const d = (headers['Content-Type'] === 'application/x-www-form-urlencoded') ?
  dataFomart(data) : data;
  return await axios({
    method: 'put',
    headers,
    url,
    data: d,
  });
};

const dataFomart = (data)=>{
  const arr = [];
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      arr.push(`${key}=${data[key]}`);
    }
  }
  return arr.join('&');
};
