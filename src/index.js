import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import enUS from 'antd/lib/locale/en_US';
import './index.css';
import App from './App.jsx';
import {Provider} from 'react-redux';
import store from '@/store';

ReactDOM.render(
    <ConfigProvider locale={enUS}>
      <Provider store={store}>
        <BrowserRouter>
          <Route path="/" component={App} />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>,
    document.getElementById('root'),
);
