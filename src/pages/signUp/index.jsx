import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Checkbox, Col, Form, Input, message, Modal, Row, Spin, Tooltip} from 'antd';

import {httpLoading, login, userInfo} from '@/store/actions';
import {get, post} from '@/utils/request';
import {GETAGREEMENT, GETVERIFICATIONCODE, REGISTER} from '@/api';

import './style.css';
import bg from '@/assets/login/bg.png';
import {Email} from '@/components/plugin/Searchdata';
import {storage} from '@/utils/storage';

const SignUp = ({history, httpLoading, setHttpLoading, setLogged, setUserInfo}) => {
  // eslint-disable-next-line new-cap
  const [email] = useState(Email());
  const [form] = Form.useForm();
  const [getCode, setGetCode] = useState(true);
  const [agreement, setAgreement] = useState(null);
  const [agreementBox, setAgreementBox] = useState(false);
  useEffect(() => {
    getAgreement();
  }, []);

  const handleLogin = (values) => {
    setHttpLoading(true);
    const param = {
      email: values.email,
      password: values.password,
      confirmPassword: values.password,
      verificationCode: values.verificationCode,
    };
    post(REGISTER, param, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }).then((res) => {
      storage.saveData('session', 'userInfo', res.data);
      setUserInfo(res.data);
      setLogged(true);
      history.push('/dashboard/audienceGenerator');
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => setHttpLoading(false));
  };

  const getAgreement = () => {
    get(GETAGREEMENT + 1).then((res) => {
      setAgreement(res.data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const getVerificationCode = () => {
    const e = form.getFieldsValue('email').email;
    post(GETVERIFICATIONCODE + '1', {email: e}, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }).then((res) => {
      message.info(res.msg);
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
      <Spin spinning={httpLoading}>
        <Row className="login-content">
          <Col span={12}>
            <img src={bg} style={{width: '100%'}} alt="bg"/>
          </Col>
          <Col span={12} className="paddingL36 paddingR36">
            <h1 className="login-title">Sign Up</h1>
            <Form
              name="loginForm"
              layout="vertical"
              form={form}
              onFinish={(values) => handleLogin(values)}
              initialValues={{
                remember: true,
                email: email,
              }}
            >
              <Form.Item
                name="email"
                rules={[{required: true, type: 'email', message: 'Please input your email!'}]}
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
                rules={[{required: true, message: 'Please input your password!'}]}
              >
                <Input.Password
                  bordered={false}
                  size="large"
                  className="borderB"
                  placeholder="Password"
                  // iconRender={(visible) => (visible ? null : null)}
                />
              </Form.Item>
              <Form.Item
                name="verificationCode"
                rules={[{required: true, message: 'Please input Verification Code!'}]}
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
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Should accept privacy clause!')),
                  },
                ]}
              >
                <Checkbox>
                  I have read and agreed to the
                  <Button
                    type="link"
                    onClick={() => setAgreementBox(true)}
                    className="paddingL0"
                  >Privacy Clause</Button>
                </Checkbox>
              </Form.Item>
              <Form.Item className="marginT40">
                <Button type="primary" size="large" htmlType="submit" block>
                  Sign Up
                </Button>
              </Form.Item>
              <div className="marginT16">
                Have an account? <Link to="/login">Log In</Link>
              </div>

            </Form>
          </Col>
        </Row>

      </Spin>
      <Modal
        title="Privacy Clause"
        visible={agreementBox}
        width={800}
        footer={null}
        onOk={() => setAgreementBox(false)}
        onCancel={() => setAgreementBox(false)}
      >
        <div dangerouslySetInnerHTML={{__html: agreement}}></div>
      </Modal>
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

SignUp.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  setLogged: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(SignUp));
