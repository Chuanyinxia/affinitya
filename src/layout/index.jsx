import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Avatar, Badge, Button, Dropdown, Layout, Menu, Space, Popover, message, List, Row, Col, Tooltip} from 'antd';
import {AlertOutlined, UserOutlined, CloseOutlined} from '@ant-design/icons';
import Router from '../routers';
import Menus from '../components/menus';
import {login, setMenusData, sider, updateIsPay} from '@/store/actions';
import logo from '../assets/lettering-logo.png';
import './style.css';
import {storage} from '@/utils/storage';
import store from '../store';
import {get, post} from '@/utils/request';
import {GETNOTICEMSG, ISPAID, UPDATEREADSTATUS} from '@/api/index';
import msg1 from '@/assets/msg01.png';
import msg2 from '@/assets/msg02.png';
import {timeFormat} from '@/components/plugin/TimeFormat';

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
  // const [popVisible, setpopVisible] = useState(false);
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
        }}>Subscription</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/login" onClick={handleLogoutButton} >Logout</Link>
      </Menu.Item>
    </Menu>
  );
  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
      store.dispatch(updateIsPay(res.data));
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
      itemLayout="horizontal"
      dataSource={noticeMsg}
      loading={loading}
      style={{minWidth: 584}}
      size="small"
      pagination={noticeMsg&&noticeMsg.length>0?{
        pageSize: 3,
        size: 'small',
      }:false}
      footer={noticeMsg&&noticeMsg.length>0?(<Button
        block className="margin0"
        onClick={readAllMsg}>Read All
      </Button>):false}
      renderItem={(item) => (
        <List.Item key={item.id} onClick={()=>readMsg([item.id])}>
          <List.Item.Meta
            avatar={<Avatar src={parseInt(item.readStatus)===1?msg1:msg2} />}
            title={<div>
              {item.type===3?
              <Row gutter={16}>
                <Col span={14}>Job <a onClick={(e)=>{
                  e.preventDefault();
                  e.stopPropagation();
                  history.push('/dashboard/jobManager?keyword='+item.jobTitle+'&id='+item.jobId);
                  store.dispatch(setMenusData('jobManager', 'dashboard'));
                  // setpopVisible(false);
                }}>{item.jobTitle}</a> : {item.title}</Col>
                <Col span={10} className="text-min text-right">{timeFormat(item.createTime)}</Col>
              </Row>:
              <Row>
                <Col span={14}>{item.title}</Col>
                <Col span={10} className="text-min text-right">{timeFormat(item.createTime)}</Col>
              </Row>
              }
            </div>}
            description={item.notice}
          />
        </List.Item>
      )}
    />
  );
  const timezone=()=>{
    const offset =(0 - new Date().getTimezoneOffset()) / 60;
    const offsetStr=offset.toString().split('.');
    let timezoneStr = '';
    const hour=offsetStr[0].split('-');
    let hourStr='';
    if (hour.length>1) {
      hourStr='-' +(hour[1]>9?hour[1]:'0'+hour[1]);
    } else {
      hourStr='+'+(hour[0]>9?hour[0]:'0'+hour[0]);
    }

    // const hour =parseInt(offsetStr[0])>9||parseInt(offsetStr[0])<-9?offsetStr[0]:'0'+offsetStr[0];
    if (offsetStr.length>1) {
      timezoneStr=hourStr+':'+offsetStr[1]*6;
    } else {
      timezoneStr=hourStr+':00';
    }
    const str='UTC'+timezoneStr;
    return str;
  };

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
        // message.error({
        //   content: error.toString(), key: 'netError', duration: 2,
        // });
      }).finally(()=>{
      });
    }, 60000);
    // clearInterval(messageTimer.current);
    return ()=>{
      clearInterval(messageTimer.current);
    };
  }, []);
  return (
    <div>
      {menuVisible?<div className="small-menu">
        <div className="small-menu-close"
          onClick={()=>setmenuVisible(false)}>
          <CloseOutlined />
        </div>
        <div className="logoBox">
          <a href="/home">
            <img src={logo} width={168}/>
          </a>
        </div>
        <Menus/>
      </div>:null}
      <Layout>

        <Sider
          width={284}
          breakpoint="lg"
          trigger={null}
          // collapsible={false}
          collapsedWidth={0}
          // style={{height: '100vh'}}
        >
          <div className="logoBox">
            <a href="/home">
              <img src={logo} width={168}/>
            </a>
          </div>
          <Menus/>
        </Sider>
        <Layout>
          <Header className="login-header">
            <div className="menu-icon" onClick={()=>setmenuVisible(true)}/>
            <div className="text-right">
              <Row>
                <Col xs={24} lg={0}>
                  <Space size="large">
                    <span className="h1" style={{color: '#120043'}}>
                      <span >Timezone: </span>
                      GMT{((0 - new Date().getTimezoneOffset()) / 60)>0?'+':''}
                      {((0 - new Date().getTimezoneOffset()) / 60)}</span>
                    <Tooltip title="Contact Sales" placement="top">
                      <div className="icon earphone" onClick={()=>{
                        store.dispatch(setMenusData('', ''));
                        history.push('/contactSales');
                      }}/>
                    </Tooltip>
                    <Tooltip title="FAQ" placement="top">
                      <div className="icon faq" onClick={()=>{
                        store.dispatch(setMenusData('', ''));
                        history.push('/faq');
                      }}/>
                    </Tooltip>

                    <Popover
                      content={content}
                      // placement={'bottomCenter'}
                      trigger="click"

                      title={null}
                      // onVisibleChange={()=>setpopVisible(!popVisible)}
                      // visible={popVisible}
                    >
                      <div className="icon bell">
                        <Tooltip title="Notice" >
                          {hasMessage?<div className="bell-dot"/>:null}
                        </Tooltip>
                      </div>
                    </Popover>

                    <div className="userName">
                      <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
                        <div className="userImg">
                          <UserOutlined style={{fontSize: 22}}/>
                        </div>
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
                      <span className="text-black username">{userInfo ? userInfo.nickName : 'Admin'}</span>
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
                  </Space></Col>
                <Col xs={0} lg={24}>
                  <Space size="large">
                    <span style={{color: '#120043'}}>
                      <span >Time Zone: </span>
                      {timezone()}
                    </span>
                    <span className="username">{userInfo ? userInfo.nickName : 'Admin'}</span>
                    <Tooltip title="Contact Sales">
                      <div className="icon earphone" onClick={()=>{
                        store.dispatch(setMenusData('', ''));
                        history.push('/contactSales');
                      }}/>
                    </Tooltip>
                    <Tooltip title="FAQ">
                      <div className="icon faq" onClick={()=>{
                        store.dispatch(setMenusData('', ''));
                        history.push('/faq');
                      }}/>
                    </Tooltip>
                    <Tooltip title="Notice">
                      <Popover content={content} trigger="click" placement="bottomRight"
                        // onVisibleChange={()=>setpopVisible(!popVisible)}
                        // visible={popVisible}
                      >
                        <div className="icon bell">
                          {hasMessage?<div className="bell-dot"/>:null}
                        </div>
                      </Popover>
                    </Tooltip>
                    <div className="userName">
                      <Dropdown overlay={menu} placement="bottomCenter">
                        <div className="userImg">
                          <UserOutlined style={{fontSize: 22}}/>
                        </div>
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
                      <span className="text-black username">{userInfo ? userInfo.nickName : 'Admin'}</span>
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
                </Col>
              </Row>
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

