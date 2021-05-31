import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Avatar, Badge, Button, Dropdown, Layout, Menu, Space, Popover, message, List, Row, Col} from 'antd';
import {AlertOutlined, UserOutlined} from '@ant-design/icons';
import Router from '../routers';
import Menus from '../components/menus';
import {login, setMenusData, sider} from '@/store/actions';
import logo from '../assets/lettering-logo.webp';
import './style.css';
import {storage} from '@/utils/storage';
import store from '../store';
import {get, post} from '@/utils/request';
import {GETNOTICEMSG, UPDATEREADSTATUS} from '@/api/index';
import msg1 from '@/assets/msg01.png';
import msg2 from '@/assets/msg02.png';

const Customlayout = ({history, activeKey, setLogged}) => {
  const {Header, Content, Sider} = Layout;
  const [userInfo] = useState(storage.getData('userInfo') ?? null);
  const [headerFooterShow, setHeaderFooterShow] = useState(true);
  const [noticeMsg, seNoticeMsg]= useState([]);
  const [loading, setLoading] =useState(false);
  const getNoticeMsg=()=>{
    setLoading(true);
    get(GETNOTICEMSG, userInfo.token).then((res)=>{
      console.log(res);
      seNoticeMsg(res.data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
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
    <Menu>
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
      pagination={{
        pageSize: 5,
        size: 'small',
      }}
      footer={<Button block onClick={readAllMsg}>Read All</Button>}
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
    setHeaderFooterShow(!window.location.pathname.includes('result'));
  }, []);
  useEffect(() => {
    getNoticeMsg();
  }, [activeKey]);
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
                  <Popover content={content} trigger="click" placement="bottomRight">
                    <AlertOutlined style={{fontSize: 16}}/>
                  </Popover>
                </Badge>
                <Button type="primary" ><Link to='/plansAndPrices' >Upgrade</Link></Button>
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

