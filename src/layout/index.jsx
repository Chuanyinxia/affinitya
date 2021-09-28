import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Avatar, Badge, Button, Dropdown, Layout, Menu, Space, Popover, message, List, Row, Col, Tooltip} from 'antd';
import {AlertOutlined, UserOutlined, CloseOutlined} from '@ant-design/icons';
import Router from '../routers';
import Menus from '../components/menus';
import {login, setMenusData, sider} from '@/store/actions';
import logo from '../assets/lettering-logo.webp';
import './style.css';
import {storage} from '@/utils/storage';
import store from '../store';
import {get, post} from '@/utils/request';
import {GETNOTICEMSG, ISPAID, UPDATEREADSTATUS} from '@/api/index';
import msg1 from '@/assets/msg01.png';
import msg2 from '@/assets/msg02.png';

const Customlayout = ({history, activeKey, setLogged}) => {
  const {Header, Content, Sider} = Layout;
  const messageTimer = useRef();
  const [hasMessage, sethasMessage] = useState(false);
  const [isPayUser, setIsPayUser] =useState(false);
  const [userInfo] = useState(storage.getData('userInfo') ?? null);
  const [noticeMsg, seNoticeMsg]= useState([]);
  const [loading, setLoading] =useState(false);
  const [dotShow, setDotShow] = useState(false);
  const [menuVisible, setmenuVisible] = useState(false);
  const getNoticeMsg=()=>{
    setLoading(true);
    get(GETNOTICEMSG, userInfo.token).then((res)=>{
      seNoticeMsg(res.data);
      const newMsg=res.data.filter((item)=> {
        return parseInt(item.readStatus) === 1;
      });
      setDotShow(newMsg.length>0);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
      console.log(error.toString());
      if (error.toString()==='Error: Token 过期或失效，请重新登录!') {
        history.push('/login');
      }
    }).finally(()=>{
      setLoading(false);
    });
  };
  const handleLogoutButton = () => {
    setLogged(false);
    storage.clearData('local', 'userInfo');
    storage.clearData('session', 'userInfo');
    history.push('/login');
  };
  const menu = (
    <Menu inlineCollapsed={false}>
      <Menu.Item>
        <Link to="/profile" onClick={() => {
          store.dispatch(setMenusData('', ''));
        }}>Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/changePassword' onClick={() => {
          store.dispatch(setMenusData('', ''));
        }}>Change Password</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/transactions" onClick={() => {
          store.dispatch(setMenusData('', ''));
        }}>Transactions</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/subscribe" onClick={() => {
          store.dispatch(setMenusData('', ''));
        }}>Subscribe</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/login" onClick={handleLogoutButton} >Logout</Link>
      </Menu.Item>
    </Menu>
  );
  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const readMsg=(id)=>{
    const data={
      ids: id,
    };
    post(UPDATEREADSTATUS, data, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      getNoticeMsg();
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const readAllMsg=()=>{
    const ids=[];
    noticeMsg.forEach((item)=>{
      ids.push(item.id);
    });
    readMsg(ids);
  };
  const content=(
    <List
      style={{width: 500}}
      itemLayout="horizontal"
      dataSource={noticeMsg}
      loading={loading}
      pagination={noticeMsg.length>0?{
        pageSize: 5,
        size: 'small',
      }:false}
      footer={noticeMsg.length>0?(<Button block onClick={readAllMsg}>Read All</Button>):false}
      renderItem={(item) => (
        <List.Item key={item.id} onClick={()=>readMsg([item.id])}>
          <List.Item.Meta
            avatar={<Avatar src={parseInt(item.readStatus)===1?msg1:msg2} />}
            title={<Row>
              <Col span={14}>{item.title}</Col>
              <Col span={10} className="text-min text-right">{item.createTime}</Col>
            </Row>}
            description={item.notice}
          />
        </List.Item>
      )}
    />
  );
  useEffect(() => {
    isPay();
  }, []);
  useEffect(() => {
    getNoticeMsg();
  }, [activeKey]);
  useEffect(() => {
    messageTimer.current = setInterval(() => {
      get(GETNOTICEMSG, userInfo.token).then((res) => {
        sethasMessage(res.data.some((item)=>item.readStatus===1));
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(()=>{
      });
    }, 5000);
    return ()=>{
      clearInterval(messageTimer.current);
    };
  }, []);
  return (
    <div>
      {menuVisible?<div className="small-menu">
        <div className="small-menu-close" onClick={()=>setmenuVisible(false)}><CloseOutlined /></div>
        <Menus/>
      </div>:null}
      <Layout style={{minHeight: '100vh'}}>
        <div className="sider-wrapper"><Sider
          width={230}
          breakpoint="lg"
          trigger={null}
          // collapsible={false}
          collapsedWidth={0}
          style={{minHeight: '100vh'}}
        >
          <div className="logoBox">
            <a href="/"><img src={logo} width={168}/></a>
          </div>
          <Menus/>
        </Sider>
        </div>
        <Layout>
          <Header className="login-header">
            <div className="menu-icon" onClick={()=>setmenuVisible(true)}></div>
            <div className="text-right">
              <Space size="large">
                <Tooltip title="Contact Sales">
                  <div className="icon earphone" onClick={()=>{
                    isPayUser?history.push('/contactSales'):history.push('/contactUs');
                  }}></div>
                </Tooltip>
                <Tooltip title="Tech Help">
                  <div className="icon faq"></div>
                </Tooltip>
                <div className="icon bell">
                  {hasMessage?
                  <Popover content={content} trigger="click" placement="bottomRight">
                    <div className="bell-dot"></div>
                  </Popover>:null}
                </div>
                <div className="userImg">
                  <UserOutlined style={{fontSize: 22}}/>
                </div>
                <div className="userName">
                  <Dropdown overlay={menu} placement="bottomCenter">
                    <span>{userInfo ? userInfo.nickName : 'Admin'}</span>
                  </Dropdown>
                </div>
                <div>
                  {!isPayUser?( <Button type="primary" style={{height: 44}} onClick={() => {
                    store.dispatch(setMenusData('plansAndPrices', ''));
                  }} >
                    <Link to='/plansAndPrices' >Upgrade Now</Link>
                  </Button>):<span style={{color: '#B23730'}}>Current Plan:Paid</span>}
                </div>
                <div style={{display: 'none'}}>
                  <span className="text-black">{userInfo ? userInfo.nickName : 'Admin'}</span>
                  <Dropdown overlay={menu} placement="bottomCenter">
                    <Avatar icon={<UserOutlined/>} size={26}/>
                  </Dropdown>
                  <Badge dot={dotShow}>
                    <Popover content={content} trigger="click" placement="bottomRight">
                      <AlertOutlined style={{fontSize: 16}}/>
                    </Popover>
                  </Badge>
                  {!isPayUser&&( <Button type="primary" className="btn-md" onClick={() => {
                    store.dispatch(setMenusData('plansAndPrices', ''));
                  }} >
                    <Link to='/plansAndPrices' >Upgrade Now</Link>
                  </Button>)}
                  {isPayUser&&( <Button type="primary" disabled>Paid</Button>)}
                </div>
              </Space>
            </div>
          </Header>
          <Content style={{margin: 0}}>
            <div className="site-layout-background" style={{minHeight: 'calc(100vh - 89px)'}}>
              <Router/>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sider: state.toggleSider.collapsed,
    logged: state.toggleLogin.logged,
    activeKey: state.menus.activeKey,
    userInfo: state.getUserInfo.info,
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
  activeKey: PropTypes.string.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Customlayout));

