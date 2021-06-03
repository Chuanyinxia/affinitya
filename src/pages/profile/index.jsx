import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import {Button, Card, Col, Form, Input, message, Row, Spin} from 'antd';
import './style.css';
import {IMPROVEPROFILE, MEMBERINFO} from '@/api/index';
import {post, get} from '@/utils/request';


const Profile = ({userInfo, httpLoading, setHttpLoading}) => {
  const [form] = Form.useForm();
  const onChangePassword = (value) => {
    setHttpLoading(true);
    post(IMPROVEPROFILE, value, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      message.success(res.msg);
      memberInfo();
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      setHttpLoading(false);
    });
  };
  const memberInfo = ()=>{
    get(MEMBERINFO, userInfo.token).then((res) => {
      console.log(res);
      form.setFieldsValue({
        email: res.data.email,
        nickName: res.data.nickName,
        companyName: res.data.companyName,
      });
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  useEffect(()=>{
    memberInfo();
  }, []);

  return (
    <Spin spinning={httpLoading}>
      <h2 className="mangerTitle">Profile</h2>
      <Card>
        <Row>
          <Col span={10}>
            <Form onFinish={onChangePassword} layout="vertical" form={form}>
              <Form.Item
                label="Email"
                name="email"
              >
                <Input disabled/>
              </Form.Item>
              <Form.Item
                label="Nickname"
                name="nickName"
                rules={[{required: true, message: 'Please input nickname!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{required: true, message: 'Please input company name!'}]}
              >
                <Input/>
              </Form.Item>
              <Form.Item className="marginT90">
                <Button type="primary" size="large" htmlType="submit" style={{width: '260px'}}>
                  Save
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

Profile.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Profile);
