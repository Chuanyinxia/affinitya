import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Col, Form, Input, Layout, message, Row} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
import {post} from '@/utils/request';
import {CONTACTUS} from '@/api';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';

const contactText={
  title: 'Contact Us',
  form: {
    label1: 'First Name',
    label2: 'Last Name',
    label3: 'Email',
    label4: 'Phone',
    label5: 'Type you message here...',
  },
};

const {Content} = Layout;
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
      message.success('Send success，thank you for your inquiry!');
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>setHttpLoading(false));
  };
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content>
        <div className="contact-us" style={{
          marginTop: 90,
          minHeight: 'calc(100vh - 180px )',
          paddingTop: 'calc((100vh - 548px )/2)',
        }}>
          <Row>
            <Col span={12} offset={6}>
              <Form layout="vertical" validateMessages={validateMessages} onFinish={(v) => submit(v)}>
                <Row>
                  <Col>
                    <h2>{contactText.title}</h2>
                  </Col>
                </Row>
                <Row className="form-wrapper">
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="firstName">
                      <Input placeholder={contactText.form.label1} bordered={false}/>
                    </Form.Item>
                  </Col>
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="lastName">
                      <Input placeholder={contactText.form.label2} bordered={false}/>
                    </Form.Item>
                  </Col>
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="email" rules={[{required: true, type: 'email'}]}>
                      <Input placeholder={contactText.form.label3} bordered={false}/>
                    </Form.Item>
                  </Col>
                  <Col span={12} className="input-Wrapper">
                    <Form.Item name="phone">
                      <Input placeholder={contactText.form.label4} bordered={false}/>
                    </Form.Item>
                  </Col>
                  <Col span={24} className="input-Wrapper">
                    <Form.Item name="suggestMsg">
                      <Input.TextArea placeholder={contactText.form.label5} bordered={false} style={{resize: 'none'}}/>
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
      <Footers/>
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
