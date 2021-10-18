import React, {useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import Welcome from '@/pages/welcome';
import AudienceGenerator from '@/pages/audienceGenerator';
import JobManger from '@/pages/jobManager';
import AudienceManger from '@/pages/audienceManager';
import Roles from '../pages/roles';
import Users from '../pages/users';
import PlansAndPrices from '../pages/plansAndPrices';
import Transactions from '../pages/transactions';
import ResultPage from '../pages/resultPage';
import ErrorPage from '../pages/ErrorPage';
import ChangePassword from '@/pages/changePassword';
import Profile from '@/pages/profile';
import Subscribe from '@/pages/subscribe';
import ContactSales from '@/pages/contactSales';
import Blogs from '@/pages/blogs';
import BlogDtail from '@/pages/blogs/details';
import {storage} from '@/utils/storage';
const Router = () => {
  const userInfo = storage.getData('userInfo');
  const checkLogin = ()=>{
    if (!userInfo) {
      history.push('login');
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <Switch>
      <Route path="/dashboard" exact component={Welcome} />
      <Route path="/blogs" exact component={Blogs} />
      <Route path="/blogs/detail/:id" exact component={BlogDtail} />
      <Route path="/dashboard/audienceGenerator" component={AudienceGenerator} />
      <Route path="/dashboard/jobManager" component={JobManger} />
      <Route path="/dashboard/audienceManager" component={AudienceManger} />
      <Route path="/access/users" component={Users} />
      <Route path="/access/roles" component={Roles} />
      <Route path="/plansAndPrices" component={PlansAndPrices} />
      <Route path="/contactSales" component={ContactSales} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/result" component={ResultPage} />
      <Route path="/changePassword" component={ChangePassword} />
      <Route path="/profile" component={Profile} />
      <Route path="/Subscribe" component={Subscribe} />
      <Route component={ErrorPage} />
    </Switch>
  );
};

export default Router;
