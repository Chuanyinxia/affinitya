import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import {Button, Card, Form, Input, message, Row, Spin, Col} from 'antd';
import './style.css';
import {UPDATEPASSWORD} from '@/api/index';
import {post} from '@/utils/request';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

const ChangePassword = ({userInfo, httpLoading, setHttpLoading}) => {
  const [form] = Form.useForm();
  const onChangePassword = (value) => {
    setHttpLoading(true);
    post(UPDATEPASSWORD, {
      password: Base64.stringify(Utf8.parse(value.password)),
      confirmPassword: Base64.stringify(Utf8.parse(value.confirmPassword)),
    }, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      message.success(res.msg);
      form.resetFields();
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      setHttpLoading(false);
    });
  };
  return (
    <div className="padding32 paddingT16">
      <Spin spinning={httpLoading}>
        <h1>Change Password</h1>
        <Card hoverable>
          <Row>
            <Col lg={12} xs={24}>
              <Form onFinish={onChangePassword} layout="vertical" form={form}>
                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input new password!',
                    },
                  ]}
                >
                  <Input.Password/>
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: 'Please input confirm password!',
                    },
                  ]}
                >
                  <Input.Password/>
                </Form.Item>
                <Form.Item className="marginT90">
                  <Button type="primary" size="large" className="btn-xl" htmlType="submit">
                  Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>

        </Card>
      </Spin>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    httpLoading: state.toggleHttpLoading.loading,
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),
  };
};

ChangePassword.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChangePassword);
