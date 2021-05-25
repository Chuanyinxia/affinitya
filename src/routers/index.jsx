import React from 'react';
import {Route, Switch} from 'react-router-dom';
import AudienceGenerator from '@/pages/audienceGenerator';
import JobManger from '@/pages/jobManager';
import AudienceManger from '@/pages/audienceManager';
import Roles from '../pages/roles';
import Users from '../pages/users';
import ErrorPage from '../pages/ErrorPage';

const Router = () => {
  return (
    <Switch>
      <Route path="/dashboard" exact component={AudienceGenerator} />
      <Route path="/dashboard/audienceGenerator" component={AudienceGenerator} />
      <Route path="/dashboard/jobManager" component={JobManger} />
      <Route path="/dashboard/audienceManager" component={AudienceManger} />
      <Route path="/access/users" component={Users} />
      <Route path="/access/roles" component={Roles} />
      <Route component={ErrorPage} />
    </Switch>
  );
};

export default Router;
