import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row, Space} from 'antd';
import {httpLoading} from '@/store/actions';
import {Link} from 'react-router-dom';
import './style.css';
import logo from '@/assets/lettering-logo.webp';
import logo1 from '@/assets/home/logo1.webp';
import logo2 from '@/assets/home/logo2.webp';
import logo3 from '@/assets/home/logo3.webp';
import logo4 from '@/assets/home/logo4.webp';

const {Header, Content, Footer} = Layout;


const PrivacyPolicy = ({userInfo, httpLoading, setHttpLoading}) => {
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
        <Row className="content">
          <Col span={24}>
            <h2 className="text-center developers-title">Trusted by leading Developers & Studios.</h2>
          </Col>
          <Col span={6} className="text-center">
            <img src={logo1} style={{width: '90%'}} alt="logo"/>
          </Col>
          <Col span={6} className="text-center">

            <img src={logo2} style={{width: '90%'}} alt="logo"/>
          </Col>
          <Col span={6} className="text-center">
            <img src={logo3} style={{width: '90%'}} alt="logo"/>
          </Col>
          <Col span={6} className="text-center">
            <img src={logo4} style={{width: '90%'}} alt="logo"/>
          </Col>
        </Row>
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

PrivacyPolicy.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PrivacyPolicy);
