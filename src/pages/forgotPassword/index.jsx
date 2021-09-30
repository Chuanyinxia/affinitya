import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Col, Form, Input, message, Row, Spin, Tooltip} from 'antd';

import {httpLoading, login, userInfo} from '@/store/actions';
import {post} from '@/utils/request';
import {FORGETPASSWORD, GETVERIFICATIONCODE} from '@/api';
import './style.css';
import bg from '@/assets/singup.png';
import logo from '@/assets/login/sm-logo.png';

const ForgotPassword = ({history, httpLoading, setHttpLoading, setLogged, setUserInfo}) => {
  // eslint-disable-next-line new-cap
  const [form] = Form.useForm();
  const [getCode, setGetCode] = useState(true);

  const handleLogin = (values) => {
    setHttpLoading(true);
    const param = {
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
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
        <a href="/home" ><img src={logo}/></a>
      </div>
      <Spin spinning={httpLoading}>
        <Row className="login-content">
          <Col span={12}>
            <img src={bg} style={{width: '100%'}} alt="bg"/>
          </Col>
          <Col span={12} className="paddingL36 paddingR36">
            <h1 className="login-title">Forgot Password</h1>
            <Form
              name="loginForm"
              layout="vertical"
              form={form}
              onFinish={(values) => handleLogin(values)}
            >
              <Form.Item
                name="email"
                rules={[
                  {required: true, message: 'Please input your email!'},
                  {type: 'email', message: 'Please input a valid email!'},
                ]}
              >
                <Input
                  bordered={false}
                  onChange={onEmailChange}
                  size="large"
                  className="borderB"
                  placeholder="Email"/>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{required: true, message: 'Please input your new password!'}]}
              >
                <Input.Password
                  bordered={false}
                  size="large"
                  className="borderB"
                  placeholder="New Password"
                  // iconRender={(visible) => (visible ? null : null)}
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
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
                  className="borderB"
                  placeholder="Confirm Password"
                  // iconRender={(visible) => (visible ? null : null)}
                />
              </Form.Item>
              <Form.Item
                name="verificationCode"
                rules={[{required: true, message: 'Please input verification code!'}]}
              >
                <Input
                  bordered={false}
                  size="large"
                  className="borderB"
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
