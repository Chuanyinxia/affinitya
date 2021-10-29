import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Checkbox, Col, Form, Input, message, Row, Spin} from 'antd';
import bg from '@/assets/login/Log In-192x360.png';
import {httpLoading, login, userInfo} from '@/store/actions';
import {post} from '@/utils/request';
import {LOGIN} from '@/api';
import {storage} from '@/utils/storage';
import cookie from 'react-cookies';
import logo from '@/assets/login/sm-logo.png';
import './style.css';
import {Email, isEmail} from '@/components/plugin/Searchdata';
import Footers from '@/components/Footers';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import FB from '@/assets/alipay-circle.png';
// const responseFacebook = (response) => {
//   console.log(response);
// };
const Login = ({history, httpLoading, setHttpLoading, setLogged, setUserInfo}) => {
  // eslint-disable-next-line new-cap
  const [email]=useState(isEmail()? Email():cookie.load('email'));
  const [password]=useState(!isEmail()?cookie.load('password'):'');
  const loadPageVar = (sVar) => {
    return decodeURI(
        window.location.search.replace(
            new RegExp('^(?:.*[&\\?]' +
          encodeURI(sVar).replace(/[.+*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  };
  const handleLogin = (values)=>{
    const type = loadPageVar('type');
    setHttpLoading(true);
    const param={email: values.email,
      password: values.password};
    post(LOGIN, param, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }).then((res)=>{
      if (values.remember) {
        cookie.save('email', param.email);
        cookie.save('password', param.password);
        storage.saveData('local', 'userInfo', res.data);
      } else {
        storage.saveData('session', 'userInfo', res.data);
      }
      setUserInfo(res.data);
      setLogged(true);
      // eslint-disable-next-line new-cap
      const m=Email();
      if (isEmail()&&values.email===m) {
        history.push('/dashboard/jobManager'+window.location.search);
      } else {
        if (type!==''&&type==='2') {
          history.push('/plansAndPrices');
        } else {
          history.push('/dashboard');
        }
      }
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>setHttpLoading(false));
  };

  return (
    <div>
      <Spin spinning={httpLoading}>
        <div className="padding32">
          <a href="/home" >
            <img src={logo} alt="logo"/>
          </a>
        </div>
        <Row className="login-content paddingT32 paddingB90">
          <Col lg={12} xs={0} className="paddingT32 text-center">
            <img src={bg} style={{height: 550}} alt="bg"/>
          </Col>
          <Col lg={12} xs={24} className="paddingL36 paddingR36">
            <h1 className="login-title">Log In </h1>
            <Form
              name="loginForm"
              layout="vertical"
              onFinish={(values)=>handleLogin(values)}
              initialValues={{
                remember: true,
                password: password,
                email: email,
              }}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {required: true, message: 'Please input your email!'},
                  {type: 'email', message: 'Please input a valid email!'},
                ]}
              >
                <Input
                  bordered={false}
                  size="large"
                  placeholder="Please enter your email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{required: true, message: 'Please input your password!'}]}
              >
                <Input.Password
                  bordered={false}
                  size="large"
                  placeholder="Please enter your password"
                  // iconRender={(visible) => (visible ? null : null)}
                />
              </Form.Item>
              <Row >
                <Col span={12}>
                  <Form.Item name="remember" valuePropName="checked" noStyle >
                    <Checkbox> Remember me</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12} className="text-right">
                  <Link to='/forgotPassword'>Forgot password?</Link>
                </Col>
              </Row>

              <Form.Item className="marginT40">
                <Button type="primary" size="large" htmlType="submit" block>
                  Log In
                </Button>
              </Form.Item>

            </Form>
            <Row>
              {/* <Col span={24}>*/}
              {/*  <h3>Quick Sign-in:&nbsp;&nbsp;&nbsp;&nbsp;*/}
              {/*    <FacebookLogin*/}
              {/*      appId="919383638998271"*/}
              {/*      callback={responseFacebook}*/}
              {/*      render={(renderProps) => (*/}
              {/*        <img onClick={renderProps.onClick} src={FB}/>*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  </h3>*/}
              {/* </Col>*/}
              <Col>
                <div className="marginT32 text-center">
                  Not a member? <Link to="/signUp">Sign up now</Link>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Footers/>
      </Spin>
    </div>

  );
};

const mapStateToProps = (state) => {
  return {
    httpLoading: state.toggleHttpLoading.loading,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f)=>dispatch(httpLoading(f)),
    setLogged: (f)=>dispatch(login(f)),
    setUserInfo: (f)=>dispatch(userInfo(f)),
  };
};

Login.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  setLogged: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Login));
