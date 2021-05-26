import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Menu} from 'antd';
import './style.css';
import store from '../../store';
import {setMenusData} from '../../store/actions';
const {SubMenu} = Menu;


const Menus = ({history, activeKey, openKeys}) => {
  const onClick=(item)=>{
    const activeKey1=item.keyPath[0];
    const openKeys2=item.keyPath[1]??item.keyPath[0];
    store.dispatch(setMenusData(activeKey1, openKeys2 ));
  };
  const onOpenChange = (keys) => {
    store.dispatch(setMenusData(activeKey, keys[0] ));
  };
  useEffect(() => {
    const array=history.location.pathname.split('/');
    store.dispatch(setMenusData(array[2]??array[1], array[1]));
  }, [history]);

  return (
    <div className="muenu">
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={activeKey}
        openKeys={['dashboard']}
        onClick={(item)=>onClick(item)}
      >
        <SubMenu
          key="dashboard"
          title="Dashboard"
          onTitleClick={()=>onOpenChange(['dashboard'])}>
          <Menu.Item key="audienceGenerator" >
            <Link to="/dashboard/audienceGenerator">
              Audience Generator
            </Link>
          </Menu.Item>
          <Menu.Item key="jobManager" >
            <Link to="/dashboard/jobManager">
              Job Manager
            </Link>
          </Menu.Item>
          <Menu.Item key="audienceManager" >
            <Link to="/dashboard/audienceManager">
              Audience Manager
            </Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="plansAndPrices" >
          <Link to="/plansAndPrices">
            Plans & Pricing
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    activeKey: state.menus.activeKey,
    openKeys: state.menus.openKeys,
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Menus));
