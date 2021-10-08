import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
import ContactUsForm from '@/components/ContactUs';

const {Content} = Layout;

const ContactSales = ({userInfo, httpLoading, setHttpLoading}) => {
  return (
    <Layout className="layout Home">
      <Content>
        <div style={{textAlign: 'center', fontSize: 24, fontWeight: 600}}>Contact Sales</div>
        <div style={{textAlign: 'center', fontSize: 14, color: '#6E7191', marginTop: 8}}>
          Fill out the form below to contact sales team</div>
        <div className="contact-us" style={{
          minHeight: 'calc(100vh - 180px )',
          paddingTop: 40,
        }}>
          {/* <Row>
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
          </Row> */}
          <Row>
            <Col md={6}/>
            <Col sm={24} md={12} className="marginB32">
              <ContactUsForm/>
            </Col>
          </Row>
        </div>
      </Content>
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

ContactSales.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ContactSales);
