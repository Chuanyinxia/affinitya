import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Col,
  Layout,
  Row,
  Space,
  Form,
  Input,
  Button,
  message,
} from 'antd';
import {httpLoading} from '@/store/actions';
import {Link} from 'react-router-dom';
import './style.css';
import logo from '@/assets/lettering-logo.webp';
import {post} from '@/utils/request';
import {CONTACTUS} from '@/api';

const {Header, Content, Footer} = Layout;
const validateMessages = {
  types: {
    email: 'It\'s not a valid email',
  },
  required: 'Email is required',
  // ...
};

const ContactUS = ({userInfo, httpLoading, setHttpLoading}) => {
  const submit = (values)=>{
    setHttpLoading(true);
    post(CONTACTUS, values, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }).then((res)=>{
      message.success('Send success.Thank you for your xxx.');
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>setHttpLoading(false));
  };
  return (
    <Layout className="layout Home">
      <Header className="padding0 text-center bg-header">
        <Row className="content">
          <Col span={14}>
            <div className="text-left">
              <img alt="logo" src={logo} width={189}/>
            </div>
          </Col>
          <Col span={10} className="text-right">
            <Space size="large">

              <Link to='/' className="navs">Home</Link>
              <Link to='/dashboard/audienceGenerator'
                className="navs">Dashboard</Link>
              <Link to='/contactUs' className="navs">Contact Us</Link>
              <Link to='/plansPricing' className="navs">Plans & Pricing</Link>
              <Link to='/login' className="navs">Login</Link>
            </Space>
          </Col>
        </Row>
      </Header>
      <Content>
        <div className="contact-us" style={{marginTop: 120}}>
          <Row>
            <Col span={12} offset={6}>
              <Form layout="vertical" validateMessages={validateMessages} onFinish={(v)=>submit(v)}>
                <Row>
                  <Col>
                    <h2>Contact Us</h2>
                  </Col>
                </Row>
                <Row className="form-wrapper">
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="firstName">
                      <Input placeholder="First Name" bordered={false}></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="lastName">
                      <Input placeholder="Last Name" bordered={false}></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="email" rules={[{required: true, type: 'email'}]}>
                      <Input placeholder="Email" bordered={false}></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="phone">
                      <Input placeholder="Phone" bordered={false}></Input>
                    </Form.Item>
                  </Col>
                  <Col span={24} className="input-Wrapper">
                    <Form.Item name="suggestMsg">
                      <Input.TextArea placeholder="Type you message here..." bordered={false} style={{resize: 'none'}}/>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button size="large" type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="home-footer">
        <Row className="footer-nav">
          <Col span={6} className="text-left"><Link to='/'>Terms of service</Link></Col>
          <Col span={6} className="text-left"><Link to="/privacyPolicy">Privacy Policy</Link></Col>
          <Col span={6} className="text-left">Mailbox: fbad-marketing@XXXX.com.cn</Col>
          <Col span={6} className="text-right"> ©2021 by Affinity Analyst.</Col>
        </Row>
      </Footer>
    </Layout>
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

ContactUS.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ContactUS);
