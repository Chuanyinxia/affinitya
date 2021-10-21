import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Col, Layout, Row, Space, Button, Drawer} from 'antd';
import logo from '@/assets/lettering-logo.webp';
import {Link, useHistory, withRouter} from 'react-router-dom';
import {UnorderedListOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {login, userInfo} from '@/store/actions';
import {storage} from '@/utils/storage';

// const {SubMenu} = Menu;
const {Header} = Layout;
const Headers=({logged, setLogged, setUserInfo})=>{
  const [key, setKey]=useState('home');
  const history = useHistory().location.pathname.split('/');
  useEffect(()=>{
    console.log(history);
    if (history[1]) {
      setKey(history[1]);
    }
  }, []);
  const [menusShow, setMenusShow]=useState(false);

  const logout=(e)=>{
    storage.clearData();
    setLogged(false);
    setUserInfo({});
    e.stopPropagation();
  };

  return (

    <Header className="padding0 text-center bg-header">
      <Row>
        <Col xl={0} lg={24} md={24} xs={24} sm={24}>
          <Row className="content ">
            <Col span={8} className="paddingL32">
              <div className="text-left">
                {key==='home'?(<a href="/home#top">
                  <img alt="logo" src={logo} width={188}/>
                </a>):(<Link to="/home">
                  <img alt="logo" src={logo} width={188}/>
                </Link>)}
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
                {key==='home'?(<a href="/home#top">
                  <img alt="logo" src={logo} width={188}/>
                </a>):(<Link to="/home">
                  <img alt="logo" src={logo} width={188}/>
                </Link>)}
              </div>
            </Col>
            <Col span={16} className="text-right">
              <Space size="large">
                {key==='home'?
                  (<a href='/home#top' className="navs activeNav">Home</a>):
                  (<Link to='/home' className="navs">Home</Link>)}
                {/* <Link to='/dashboard/audienceGenerator'*/}
                {/*  className="navs">About</Link>*/}
                <Link to='/plansPricing'
                  className={key==='plansPricing'?'navs activeNav':'navs'}
                >Plans & Pricing</Link>
                <Link to='/contactUs' className={key==='contactUs'?'navs activeNav':'navs '}>Contact Sales</Link>
                <span className="navs">|</span>
                {logged?(<Link to='/login' onClick={logout} className="navs">Logout</Link>):
                  ( <Link to='/login' className={key==='login'?'navs activeNav':'navs'}>Login</Link>)}

                {logged?(<Button href="/dashboard/audienceGenerator" className="navButton">Dashboard</Button>):
                  (<Button href="/signUp" className="navButton">Sign Up</Button>)}
              </Space>
            </Col>
          </Row>
        </Col>
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
              {logged&&(<Link to='/dashboard/audienceGenerator' className="navs">Dashboard</Link>)}
            </Space>
          </div>
          <div className="smMenus-bottom">
            {!logged&&(<Space size="large">
              <Link to='/login' className="navs">Login</Link>
              <Button href="/signUp" className="navButton">Sign Up</Button>
            </Space>)}
            {logged&&(<div className="text-center">
              <Button onClick={logout} href="/home" className="navButton">Logout</Button>
            </div>)}
          </div>
        </div>
      </Drawer>
    </Header>


  );
};
const mapStateToProps = (state) => {
  return {
    logged: state.toggleLogin.logged,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLogged: (f)=>dispatch(login(f)),
    setUserInfo: (f)=>dispatch(userInfo(f)),
  };
};

Headers.propTypes = {
  logged: PropTypes.bool.isRequired,
  setLogged: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Headers));
