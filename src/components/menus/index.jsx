import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Menu, message} from 'antd';
import './style.css';
import store from '../../store';
import {get} from '@/utils/request';
import {setMenusData} from '../../store/actions';
import dashboard from '../../assets/Dashboard.png';
import plans from '../../assets/Dollar.png';
import {GETNEWMESSAGECOUNT} from '@/api/index';

// const {SubMenu} = Menu;


const Menus = ({userInfo, history, activeKey, openKeys}) => {
  const [messageCounter, setmessageCounter] = useState(0);
  const onClick=(item)=>{
    const activeKey1=item.keyPath[0];
    const openKeys2=item.keyPath[1]??item.keyPath[0];
    store.dispatch(setMenusData(activeKey1, openKeys2 ));
  };
  const onOpenChange = (keys) => {
    store.dispatch(setMenusData(activeKey, keys[0] ));
  };
  const messageTimer = useRef();
  useEffect(() => {
    const array=history.location.pathname.split('/');
    store.dispatch(setMenusData(array[2]??array[1], array[1]));
  }, [history]);
  useEffect(() => {
    messageTimer.current = setInterval(() => {
      get(GETNEWMESSAGECOUNT, userInfo.token).then((res) => {
        setmessageCounter(res.data);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(()=>{
      });
    }, 5000);
    // clearInterval(messageTimer.current);
    return ()=>{
      clearInterval(messageTimer.current);
    };
  }, []);
  return (
    <div className="muenu">
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={activeKey}
        openKeys={['dashboard']}
        onClick={(item)=>onClick(item)}
      >
        <div className="menus_group">KEYWORD ANALYSIS</div>
        {/* <SubMenu
          key="dashboard"
          title="Dashboard"
          className="menus_title"
          icon={<img src={dashboard} style={{marginRight: 10}}/>}
          onTitleClick={()=>onOpenChange(['dashboard'])}> */}
        <Menu.Item key="dashboard" className="menus_title"
          icon={<img src={dashboard} style={{marginRight: 10}}/>}
          onClick={()=>onOpenChange(['dashboard'])}>
          <Link to="/dashboard/audienceGenerator">
          Dashboard
          </Link>
        </Menu.Item>
        <Menu.Item key="audienceGenerator" className="menus_subTitle">
          <Link to="/dashboard/audienceGenerator">
            Audience Generator
          </Link>
        </Menu.Item>
        <Menu.Item key="jobManager" className="menus_subTitle">
          {messageCounter!==0?<div className="job-dot">{messageCounter}</div>:null}
          <Link to="/dashboard/jobManager">
            Job Manager
          </Link>
        </Menu.Item>
        <Menu.Item key="audienceManager" className="menus_subTitle">
          <Link to="/dashboard/audienceManager">
            Audience Manager
          </Link>
        </Menu.Item>
        {/* </SubMenu> */}
        <div className="menus_group">GENERAL INFO</div>
        <Menu.Item key="plansAndPrices" icon={<img src={plans}/>} className="menus_title">
          <Link to="/plansAndPrices">Plans & Pricing</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    activeKey: state.menus.activeKey,
    openKeys: state.menus.openKeys,
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {

  };
};

Menus.propTypes = {
  history: PropTypes.object.isRequired,
  activeKey: PropTypes.string.isRequired,
  openKeys: PropTypes.string.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Menus));
