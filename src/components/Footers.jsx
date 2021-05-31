import React from 'react';
import {Col, Layout, Row} from 'antd';
import {Link} from 'react-router-dom';
const {Footer} = Layout;
const Footers =()=>(
  <Footer className="home-footer">
    <Row className="footer-nav">
      <Col span={6} className="text-left"><Link to='/'>Terms of service</Link></Col>
      <Col span={6} className="text-left"><Link to="/privacyPolicy">Privacy Policy</Link></Col>
      <Col span={6} className="text-left">Mailbox: fbad-marketing@XXXX.com.cn</Col>
      <Col span={6} className="text-right"> ©2021 by Affinity Analyst.</Col>
    </Row>
  </Footer>
);


export default Footers;
