import React, {useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Spin,
  Button,
  Form,
  Input,
  message,
  Checkbox,
  Row,
  Col,
} from 'antd';
import {Link} from 'react-router-dom';
import {
} from '@ant-design/icons';
import bg from '@/assets/login.png';
import {
  httpLoading,
  login,
  userInfo,
} from '@/store/actions';
import {post} from '@/utils/request';
import {LOGIN} from '@/api';
import {storage} from '@/utils/storage';
import cookie from 'react-cookies';
import logo from '@/assets/login/sm-logo.png';
import './style.css';
import {Email, isEmail} from '@/components/plugin/Searchdata';
import Footers from '@/components/Footers';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
const responseFacebook = (response) => {
  console.log(response);
};
const Login = ({history, httpLoading, setHttpLoading, setLogged, setUserInfo}) => {
  // eslint-disable-next-line new-cap
  const [email]=useState(isEmail()? Email():cookie.load('email'));
  const [password]=useState(!isEmail()?cookie.load('password'):'');

  const handleLogin = (values)=>{
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
      history.push('/dashboard/audienceGenerator');
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
          <Col lg={12} xs={0} className="paddingT90">
            <img src={bg} style={{width: '100%'}} alt="bg"/>
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
                <Col span={24}>
                  <FacebookLogin
                    appId="919383638998271"
                    callback={responseFacebook}
                    render={(renderProps) => (
                      <button onClick={renderProps.onClick}>This is my custom FB button</button>
                    )}
                  />

                </Col>
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
              <div className="marginT16">
                Not a member? <Link to="/signUp" >Sign up now</Link>
              </div>

            </Form>
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
