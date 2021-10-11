import React, {useState, useEffect} from 'react';
import {Col, Layout, Row, Space, Button, Drawer} from 'antd';
import logo from '@/assets/lettering-logo.webp';
import {Link, useHistory} from 'react-router-dom';
import {UnorderedListOutlined} from '@ant-design/icons';

// const {SubMenu} = Menu;
const {Header} = Layout;
const Headers=()=>{
  const [key, setKey]=useState('home');
  const history = useHistory().location.pathname.split('/');
  useEffect(()=>{
    console.log(history);
    setKey(history[1]);
  }, []);
  const [menusShow, setMenusShow]=useState(false);
  return (

    <Header className="padding0 text-center bg-header">
      <Row>
        <Col xl={0} lg={24} md={24} xs={24} sm={24}>
          <Row className="content ">
            <Col span={8} className="paddingL32">
              <div className="text-left">
                <img alt="logo" src={logo} width={188}/>
              </div>
            </Col>
            <Col span={16} className="text-right paddingR32">

              <span className="navs" onClick={()=>setMenusShow(true)}>
                <UnorderedListOutlined />
              </span>
            </Col>
          </Row>
        </Col>
        <Col offset={1} xl={22} lg={0} md={0} sm={0} xs={0}>
          <Row className="content-home paddingL16 paddingR16" >
            <Col span={8}>
              <div className="text-left">
                <img alt="logo" src={logo} width={188}/>
              </div>
            </Col>
            <Col span={16} className="text-right">
              <Space size="large">
                <a href='/home#top' className={key==='home'?'navs activeNav':'navs'}>Home</a>
                {/* <Link to='/dashboard/audienceGenerator'*/}
                {/*  className="navs">About</Link>*/}
                <Link to='/plansPricing'
                  className={key==='plansPricing'?'navs activeNav':'navs'}
                >Plans & Pricing</Link>
                <Link to='/contactUs' className={key==='contactUs'?'navs activeNav':'navs '}>Contact Sales</Link>
                <span className="navs">|</span>
                <Link to='/login' className={key==='login'?'navs activeNav':'navs'}>Login</Link>
                <Button href="/signUp" className="navButton">Sign Up</Button>
              </Space>
            </Col>
          </Row></Col>
      </Row>
      <Drawer
        placement="right"
        className="menusDrawer"
        drawerStyle={{backgroundColor: '#120043', color: '#ffffff', width: 250}}
        onClose={()=>setMenusShow(false)} visible={menusShow}>
        <div className="smMenus">
          <div className="smMenus-top">
            <Space size="large" wrap>
              <Link to='/' className="navs">Product</Link>
              <Link to='/dashboard/audienceGenerator'
                className="navs">About</Link>
              <Link to='/plansPricing' className="navs">Plans & Pricing</Link>
              <Link to='/contactUs' className="navs">Contact Sales</Link>
            </Space>
          </div>
          <div className="smMenus-bottom">
            <Space size="large">
              <Link to='/login' className="navs">Login</Link>
              <Button href="/signUp" className="navButton">Sign Up</Button>
            </Space>
          </div>
        </div>
      </Drawer>
    </Header>


  );
};


Headers.propTypes = {};

export default Headers;
