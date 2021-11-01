import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
// import {post} from '@/utils/request';
// import {CONTACTUS} from '@/api';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';
import ContactUsForm from '@/components/ContactUs';

const {Content} = Layout;


const ContactUS = () => {
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
        <div className="login-content" style={{
          minHeight: 'calc(100vh - 180px)',
          paddingTop: 32,
          paddingBottom: 80,
        }}>
          <Row>
            <Col span={24}>
              <Row style={{marginTop: 18}}>
                <Col span={24}>
                  <div style={{textAlign: 'center', fontSize: 24, fontWeight: 600}}>Contact Sales</div>
                  <div style={{textAlign: 'center', fontSize: 14, color: '#6E7191', marginTop: 8}}>
                    Fill out the form below to contact sales team.</div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={0} lg={12}>
              <div className="contact-log-box">
                <div className="contact-log"/>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <ContactUsForm type={'notLogin'}/>
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
