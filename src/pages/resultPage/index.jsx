import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Result} from 'antd';
import {httpLoading} from '@/store/actions';
// import {Link} from 'react-router-dom';
import './style.css';

import {} from '@/utils/request';
import {} from '@/api';
// import {useHistory} from 'react-router-dom';
import {} from '@/api/index';

const ResultPage = ({userInfo, httpLoading, setHttpLoading}) => {
  // const history = useHistory();
  const [payStatus, setPayStatus] = useState(false);
  useEffect(() => {
    setPayStatus(false);
  }, []);
  return (
    <div>
      {payStatus?(
        <Result
          status="success"
          title="Successfully Purchased Cloud Server ECS!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="console">
              Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
          ]}
        />):(<Result
          status="error"
          title="Submission Failed"
          subTitle="Please check and modify the following information before resubmitting."
          extra={[
            <Button type="primary" key="console">
              Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
          ]}
        />)}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    httpLoading: state.toggleHttpLoading.loading,
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),

  };
};

ResultPage.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResultPage);
