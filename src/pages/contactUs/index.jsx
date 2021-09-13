import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row, Form, Input, Button} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
// import {post} from '@/utils/request';
// import {CONTACTUS} from '@/api';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';

const {Content} = Layout;


const ContactUS = ({userInfo, httpLoading, setHttpLoading}) => {
  // const submit = (values)=>{
  //   setHttpLoading(true);
  //   post(CONTACTUS, values, {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   }).then((res)=>{
  //     message.success('Send success，thank you for your inquiry!');
  //   }).catch((error)=>{
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   }).finally(()=>setHttpLoading(false));
  // };
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content>
        <div className="contact-us" style={{
          marginTop: 90,
          minHeight: 'calc(100vh - 180px )',
          paddingTop: 'calc((100vh - 548px )/2)',
          paddingBottom: 80,
        }}>
          <Row>
            <Col span={24}>
              <div style={{
                color: '#14142A',
                fontSize: '24px',
                fontWeight: 600,
                textAlign: 'center',
                width: '100%',
                marginTop: 52,
              }}>Contact Sales</div>
              <div style={{
                color: '#6E7191',
                fontSize: '14px',
                textAlign: 'center',
                width: '100%',
                marginBottom: 52,
              }}>Fill out the form below to contact sales</div>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <div className="contact-log-box">
                <div className="contact-log"></div>
              </div>
            </Col>
            <Col sm={24} md={12}>
              <div className="contact-form-box">
                <Form layout="vertical">
                  <Form.Item label="Name">
                    <Input></Input>
                  </Form.Item>
                  <Form.Item label="Email address">
                    <Input></Input>
                  </Form.Item>
                  <Form.Item label="Phone number">
                    <Input></Input>
                  </Form.Item>
                  <Form.Item label="Company name">
                    <Input></Input>
                  </Form.Item>
                  <Form.Item label="title">
                    <Input></Input>
                  </Form.Item>
                  <Form.Item label="title">
                    <Input.TextArea rows={4} style={{
                      resize: 'none',
                      background: '#EFF0F7',
                      border: 'none',
                    }}></Input.TextArea>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" block style={{
                      height: 58,
                      lineHeight: '58px',
                      marginTop: 28,
                    }}>Submit</Button>
                  </Form.Item>
                </Form>
              </div>
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
