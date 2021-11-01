import React from 'react';
import {Col, Layout, Row} from 'antd';
import {Link} from 'react-router-dom';

const {Footer} = Layout;
const Footers =()=> (
  <div>
    <Footer className="home-footer">
      <Row className="footer-nav">
        <Col lg={4} xs={0} sm={0} md={0} className="text-left">
          <Link className="footerNav" to='/termsService?type=3'>Terms of Service</Link>
        </Col>
        <Col lg={4} xs={0} sm={0} md={0} className="text-left">
          <Link className="footerNav" to="/privacyPolicy?type=4">Privacy Policy</Link>
        </Col>
        <Col lg={4} xs={0} sm={0} md={0} className="text-left">
          <Link className="footerNav" to="/contactUs">Contact Sales</Link>
        </Col>
        <Col lg={4} xs={0} sm={0} md={0} className="text-left">
          <Link className="footerNav" to="/ufaq">FAQ</Link>
        </Col>
        <Col lg={0} xs={6} sm={6} md={6} className="text-center">
          <Link className="footerNav" to='/termsService?type=3'>Terms of Service</Link>
        </Col>
        <Col lg={0} xs={6} sm={6} md={6} className="text-center">
          <Link className="footerNav" to="/privacyPolicy?type=4">Privacy Policy</Link>
        </Col>
        <Col lg={0} xs={6} sm={6} md={6} className="text-center">
          <Link className="footerNav" to="/contactUs">Contact Sales</Link>
        </Col>
        <Col lg={0} xs={6} sm={6} md={6} className="text-center">
          <Link className="footerNav" to="/ufaq">FAQ</Link>
        </Col>
        <Col lg={6} xs={0} sm={0} md={0} className="text-right footerNav"> ©2021 by Affinity Analyst.</Col>
      </Row>
    </Footer>
    <Row className="bg-gray">
      <Col xs={24} sm={24} md={24} lg={0}
        className="text-center footerNav marginT16 marginB16 "> ©2021 by Affinity Analyst.</Col>
    </Row>
  </div>

);


export default Footers;
