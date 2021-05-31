import React from 'react';
import {Col, Layout, Row} from 'antd';
import {Link} from 'react-router-dom';
const {Footer} = Layout;
const Footers =()=>(
  <Footer className="home-footer">
    <Row className="footer-nav">
      <Col span={6} className="text-left">
        <Link className="navs" to='/termsService?type=3'>Terms of Service</Link>
      </Col>
      <Col span={6} className="text-left">
        <Link className="navs" to="/privacyPolicy?type=4">Privacy Policy</Link>
      </Col>
      <Col span={6} className="text-left">
        <Link className="navs" to="/contactUs">Contact Us</Link>
      </Col>
      <Col span={6} className="text-right navs"> ©2021 by Affinity Analyst.</Col>
    </Row>
  </Footer>
);


export default Footers;
