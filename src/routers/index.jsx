import React, {useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import Welcome from '@/pages/welcome';
import Faq from '@/pages/faq';
// import AudienceGenerator from '@/pages/audienceGenerator';
// import JobManger from '@/pages/jobManager';
import AudienceManger from '@/pages/audienceManager';
import AudienceGenerator2 from '@/pages/audienceGenerator2';
import JobManger2 from '@/pages/jobManager2';
import AudienceManger2 from '@/pages/audienceManager2';
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
      // const url='/dashboard/jobManager?userName=578150202@qq.com&jobId=729&jobName=ball-1011';
      // console.log(url);
      // console.log(window.location.href);
      // history.push('login');
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <Switch>
      <Route path="/dashboard" exact component={Welcome} />
      <Route path="/faq" component={Faq} />
      <Route path="/blogs" exact component={Blogs} />
      <Route path="/blogs/detail/:id" exact component={BlogDtail} />
      <Route path="/dashboard/audienceGenerator" component={AudienceGenerator2} />
      <Route path="/dashboard/jobManager" component={userInfo.FBTest?JobManger2:JobManger2} />
      <Route path="/dashboard/audienceManager" component={userInfo.FBTest?AudienceManger2:AudienceManger} />

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
