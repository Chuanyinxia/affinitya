import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import {Button, Card, Form, Input, message, Row, Spin, Col} from 'antd';
import './style.css';
import {UPDATEPASSWORD} from '@/api/index';
import {post} from '@/utils/request';


const ChangePassword = ({userInfo, httpLoading, setHttpLoading}) => {
  const [form] = Form.useForm();
  const onChangePassword = (value) => {
    setHttpLoading(true);
    post(UPDATEPASSWORD, value, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      message.success(res.msg);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      setHttpLoading(false);
      form.resetFields();
    });
  };
  return (
    <Spin spinning={httpLoading}>
      <h2 className="mangerTitle">Change Password</h2>
      <Card>
        <Row>
          <Col span={10}>
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
                <Button type="primary" size="large" htmlType="submit">
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>

      </Card>
    </Spin>
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
