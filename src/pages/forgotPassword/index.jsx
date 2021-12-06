import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Col, Form, Input, message, Row, Spin, Tooltip} from 'antd';

import {httpLoading, login, userInfo} from '@/store/actions';
import {post} from '@/utils/request';
import {FORGETPASSWORD, GETVERIFICATIONCODE} from '@/api';
import './style.css';
import bg from '@/assets/login.png';
import logo from '@/assets/login/sm-logo.png';
import Footers from '@/components/Footers';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

const ForgotPassword = ({history, httpLoading, setHttpLoading, setLogged, setUserInfo}) => {
  // eslint-disable-next-line new-cap
  const [form] = Form.useForm();
  const [getCode, setGetCode] = useState(true);

  const handleLogin = (values) => {
    setHttpLoading(true);
    const param = {
      email: values.email,
      password: Base64.stringify(Utf8.parse(values.password)),
      confirmPassword: Base64.stringify(Utf8.parse(values.password)),
      verificationCode: values.verificationCode,
    };
    post(FORGETPASSWORD, param, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }).then((res) => {
      message.success(res.msg);
      history.push('/login');
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => setHttpLoading(false));
  };

  const getVerificationCode = () => {
    const e = form.getFieldsValue('email').email;
    post(GETVERIFICATIONCODE + '2', {email: e}, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }).then((res) => {
      message.success(res.msg);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const onEmailChange = (e) => {
    const value = e.target.value;
    // eslint-disable-next-line no-useless-escape
    const reg = /^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (reg.test(value)) {
      setGetCode(false);
    } else {
      setGetCode(true);
    }
  };

  return (
    <div>
      <div className="padding32">
        <a href="/home" ><img src={logo} width={260} alt="logo"/></a>
      </div>
      <Spin spinning={httpLoading}>
        <Row className="login-content  paddingT32 paddingB64">
          <Col lg={12} xs={0} className="paddingT90">
            <img src={bg} style={{width: '100%'}} alt="bg"/>
          </Col>
          <Col lg={12} xs={24} className="paddingL36 paddingR36">
            <h1 className="login-title">Forgot Password</h1>
            <Form
              name="loginForm"
              layout="vertical"
              form={form}
              onFinish={(values) => handleLogin(values)}
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
                  onChange={onEmailChange}
                  size="large"
                  placeholder="Please enter your email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{required: true, message: 'Please input your new password!'}]}
              >
                <Input.Password
                  bordered={false}
                  size="large"
                  placeholder="Please enter your new password"
                  // iconRender={(visible) => (visible ? null : null)}
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[{required: true, message: 'Please confirm your password!'},
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  })]}
              >
                <Input.Password
                  bordered={false}
                  size="large"
                  placeholder="Please confirm your password"
                  // iconRender={(visible) => (visible ? null : null)}
                />
              </Form.Item>
              <Form.Item
                name="verificationCode"
                label="Verification Code"
                rules={[{required: true, message: 'Please input verification code!'}]}
              >
                <Input
                  bordered={false}
                  size="large"
                  placeholder="Verification Code"
                  suffix={(
                    <Tooltip title="Please input your email first">
                      <Button
                        type="text"
                        disabled={getCode}
                        onClick={getVerificationCode}>
                        Get verification code
                      </Button>
                    </Tooltip>
                  )}
                />
              </Form.Item>
              <Form.Item className="marginT40">
                <Button type="primary" size="large" htmlType="submit" block>
                  Reset Password
                </Button>
              </Form.Item>
              <div className="marginT16">
                <Link to="/login">Back to login.</Link>
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
    setHttpLoading: (f) => dispatch(httpLoading(f)),
    setLogged: (f) => dispatch(login(f)),
    setUserInfo: (f) => dispatch(userInfo(f)),
  };
};

ForgotPassword.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  setLogged: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ForgotPassword));
