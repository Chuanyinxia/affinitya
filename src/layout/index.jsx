import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Avatar, Badge, Button, Dropdown, Layout, Menu, Space, Tooltip} from 'antd';
import {AlertOutlined, UserOutlined} from '@ant-design/icons';
import Router from '../routers';
import Menus from '../components/menus';
import {login, setMenusData, sider} from '@/store/actions';
import logo from '../assets/lettering-logo.webp';
import './style.css';
import {storage} from '@/utils/storage';
import store from '../store';

const Customlayout = ({history, sider, toggleSider, logged, setLogged}) => {
  const {Header, Content, Sider} = Layout;
  const [userInfo] = useState(storage.getData('userInfo') ?? null);
  const [headerFooterShow, setHeaderFooterShow] = useState(true);
  const handleLogoutButton = () => {
    setLogged(false);
    storage.clearData('local', 'userInfo');
    storage.clearData('session', 'userInfo');
    history.push('/login');
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <Tooltip placement="left" title="This function is not available yet.">
          <a>Change Password</a>
        </Tooltip>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    console.log(window.location.pathname);
    setHeaderFooterShow(!window.location.pathname.includes('result'));
  }, []);
  return (
    <div>
      <Layout style={{minHeight: '100vh'}}>
        {headerFooterShow?<Sider
          breakpoint="lg"
          trigger={null}
          style={{width: 270}}
        >
          <div className="logoBox">
            <img src={logo} width={168}/>
          </div>
          <Menus/>
        </Sider>:null}
        <Layout>
          {headerFooterShow?<Header className="login-header">

            <div className="text-right">
              <Space size="large">
                <span className="text-black">{userInfo ? userInfo.nickName : 'Admin'}</span>
                <Dropdown overlay={menu} placement="bottomCenter">
                  <Avatar icon={<UserOutlined/>} size={26}/>
                </Dropdown>
                <Badge dot>
                  <Link to="/alarm" onClick={() => {
                    store.dispatch(setMenusData('', ''));
                  }}>
                    <AlertOutlined style={{fontSize: 16}}/>
                  </Link>
                </Badge>
                <Button type="primary" onClick={handleLogoutButton}>Upgrade</Button>
              </Space>
            </div>
          </Header>:null}
          <Content>
            <div className="site-layout-background" style={{minHeight: 'calc(100vh - 89px)'}}>
              <Router/>
            </div>
          </Content>
        </Layout>
        {/* <Footer style={{textAlign: 'center'}}>一个可爱的页脚@HYCTech</Footer> */}
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sider: state.toggleSider.collapsed,
    logged: state.toggleLogin.logged,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    toggleSider: (f) => dispatch(sider(f)),
    setLogged: (f) => dispatch(login(f)),
  };
};


Customlayout.propTypes = {
  sider: PropTypes.bool.isRequired,
  toggleSider: PropTypes.func.isRequired,
  logged: PropTypes.bool.isRequired,
  setLogged: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Customlayout));

