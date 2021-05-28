import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Result} from 'antd';
import {httpLoading} from '@/store/actions';
// import {Link} from 'react-router-dom';
import './style.css';

import {} from '@/utils/request';
import {} from '@/api';
import {useHistory} from 'react-router-dom';
import {} from '@/api/index';

const ResultPage = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [payStatus, setPayStatus] = useState(false);
  const timer = useRef();
  const [counter, setCounter] = useState(10);
  let t = 10;
  useEffect(() => {
    const status = window.location.search;
    setPayStatus(status.includes('success'));
    timer.current = setInterval(()=>{
      if (t===1) {
        history.push('./');
      } else {
        t--;
        setCounter(t);
      }
    }, 1000);
    return ()=>{
      clearInterval(timer.current);
    };
  }, []);
  return (
    <div>
      {payStatus?(
        <Result
          status="success"
          title="Pay Success"
          extra={[
            <p key="text">{`After ${counter}s back to Affinity Analyst page automatically.`}</p>,
            <Button type="primary" key="back" onClick={()=>{
              history.push('/');
            }}>
              Back manually
            </Button>,
          ]}
        />):(<Result
          status="error"
          title="Pay Failed"
          extra={[
            <p key="text">{`After ${counter}s back to Affinity Analyst page automatically.`}</p>,
            <Button type="primary" key="back" onClick={()=>{
              history.push('/');
            }}>
              Back manually
            </Button>,
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
