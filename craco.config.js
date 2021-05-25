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
              '@primary-color': '#7121EA',
              '@link-color': '#2677F2',
              '@success-color': '#00AB79', // 成功色
              '@error-color': '#EA526F', // 错误色
              '@font-size-base': '14px', // 主字号
              '@heading-color': '#222222', // 标题色
              '@text-color': '#272727', // 主文本色
              '@text-color-secondary': '#666666', // 次文本色
              '@disabled-color': '#999999', // 失效色
              '@border-radius-base': '2px', // 组件/浮层圆角
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
