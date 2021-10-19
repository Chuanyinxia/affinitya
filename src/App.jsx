import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import './locales/i18n';
import './App.less';
import Customlayout from './layout';
import {
  login,
  userInfo,
} from '@/store/actions';
import {storage} from '@/utils/storage';
import Login from '@/pages/login';
import Home from '@/pages/home';
import SignUp from '@/pages/signUp';
import ForgotPassword from '@/pages/forgotPassword';
import ContactUS from '@/pages/contactUs';
import PrivacyPolicy from '@/pages/privacyPolicy';
import PlansPricing from '@/pages/plansPricing';
import TermsService from '@/pages/termsService';
const App = ({history, logged, setLogged, setUserInfo}) => {
  const userInfo = storage.getData('userInfo');
  const checkLogin = ()=>{
    if (logged) {
      // history.push('home');
      setUserInfo(userInfo);
    } else {
      if (userInfo) {
        setLogged(true);
        setUserInfo(userInfo);
      } else {
        // history.push('login');
        storage.clearData();
        setUserInfo({});
      }
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <div className="App">
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/privacyPolicy" component={PrivacyPolicy} />
        <Route path="/termsService" component={TermsService} />
        <Route path="/plansPricing" component={PlansPricing} />
        <Route path="/contactUS" component={ContactUS} />
        <Route path="/login" component={Login} />
        <Route path="/signUp" component={SignUp} />
        <Route path="/forgotPassword" component={ForgotPassword} />
        <Route path="/" exact component={Home} />
        <Route
          render={() => userInfo ? <Customlayout />:
            <Redirect to={{
              pathname: '/login',
              search: window.location.search,
            }} />
          }>
        </Route>
      </Switch>
    </div>
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

App.propTypes = {
  logged: PropTypes.bool.isRequired,
  setLogged: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(App));
