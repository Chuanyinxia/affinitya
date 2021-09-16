import React from 'react';
import {Route, Switch} from 'react-router-dom';
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
const Router = () => {
  return (
    <Switch>
      <Route path="/dashboard" exact component={AudienceGenerator} />
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
      <Route path="/Subscribe" component={Subscribe} />
      <Route component={ErrorPage} />
    </Switch>
  );
};

export default Router;
