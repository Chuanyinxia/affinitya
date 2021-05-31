import axios from 'axios';
// import {storage} from '@/utils/storage';

axios.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  switch (response.data.code) {
    case 200:
      return response.data;
    // check token
    case 401:
      // storage.clearData();
      // window.location.reload();
      return Promise.reject(new Error('Token 过期或失效，请重新登录!'));
    case 314:
      return Promise.reject(response.data.msg);
    default:
      return Promise.reject(new Error(response.data.msg ??
        '服务器错误!'));
  }
}, (error) => {
  return Promise.reject(error);
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
