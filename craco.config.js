const path = require('path');
const CracoLessPlugin = require('craco-less');

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);
module.exports = {
  'webpack': {
    alias: {
      '@/api': pathResolve('./src/api'),
      '@/components': pathResolve('./src/components'),
      '@/store': pathResolve('./src/store'),
      '@/pages': pathResolve('./src/pages'),
      '@/utils': pathResolve('./src/utils'),
      '@/assets': pathResolve('./src/assets'),
      '@/layout': pathResolve('./src/layout'),
      '@/routers': pathResolve('./src/routers'),
    },
  },
  'plugins': [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#120043',
              '@link-color': '#1CC8EE',
              '@success-color': '#00BA88', // 成功色
              '@error-color': '#E92C3A', // 错误色
              '@warning-color': '#F4B740', // 警告色
              '@font-size-base': '16px', // 主字号
              '@heading-color': '#14142B', // 标题色
              '@text-color': '#4E4B66', // 主文本色
              '@text-color-secondary': '#4E4B66', // 次文本色
              '@disabled-color': '#A0A3BD', // 失效色
              '@border-radius-base': '16px', // 组件/浮层圆角
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
