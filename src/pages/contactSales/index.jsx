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
            {/* <Col sm={24} md={12}>
              <div className="contact-log-box">
                <div className="contact-log"></div>
              </div>
            </Col> */}
            <Col sm={24} md={24}>
              <div className="contact-form-box" style={{margin: '0 auto'}}>
                <ContactUsForm/>
              </div>
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
