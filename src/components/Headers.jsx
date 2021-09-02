import React from 'react';
import {Col, Layout, Row, Space, Button} from 'antd';
import logo from '@/assets/lettering-logo.webp';
import {Link} from 'react-router-dom';

const {Header} = Layout;
const Headers=()=>( <Header className="padding0 text-center bg-header">
  <Row className="content">
    <Col span={8}>
      <div className="text-left">
        <img alt="logo" src={logo} width={189}/>
      </div>
    </Col>
    <Col span={16} className="text-right">
      <Space size="large">
        <Link to='/' className="navs">Product</Link>
        <Link to='/dashboard/audienceGenerator'
          className="navs">About</Link>
        <Link to='/plansPricing' className="navs">Plans & Pricing</Link>
        <Link to='/contactUs' className="navs">Contact Sales</Link>
        <span className="navs">|</span>
        <Link to='/login' className="navs">Login</Link>
        <Button href="/signUp" className="navButton">Sign Up</Button>
      </Space>
    </Col>
  </Row>
</Header>);


Headers.propTypes = {};

export default Headers;
