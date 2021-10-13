import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, userInfo} from '@/store/actions';
import {Button, Card, Col, Form, Input, message, Row, Spin} from 'antd';
import './style.css';
import {IMPROVEPROFILE, MEMBERINFO} from '@/api/index';
import {post, get} from '@/utils/request';
import {storage} from '@/utils/storage';


const Profile = ({userInfo, httpLoading, setHttpLoading, setUserInfo}) => {
  const [form] = Form.useForm();
  const onChangePassword = (value) => {
    value.nickName=value.nickName.trim();
    value.companyName=value.companyName.trim();
    if (value.nickName.length<1) {
      message.warn('Please input nickname!');
      return false;
    }
    if (value.companyName.length<1) {
      message.warn('Please input company name!');
      return false;
    }
    setHttpLoading(true);
    post(IMPROVEPROFILE, value, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      const userData={
        ...userInfo,
        nickName: value.nickName,
      };
      message.success(res.msg);
      storage.saveData('session', 'userInfo', userData);
      setUserInfo(userData);
      window.location.reload();
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
    <div className="padding32 paddingT16">
      <Spin spinning={false} >
        <h1>Profile</h1>
        <Card hoverable>
          <Row>
            <Col lg={12} xs={24}>
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
                  <Button type="primary" size="large" className="btn-xl" htmlType="submit" loading={httpLoading}>
                    Save
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
    setUserInfo: (f) => dispatch(userInfo(f)),
  };
};

Profile.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Profile);
