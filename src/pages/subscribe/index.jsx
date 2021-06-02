import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import {httpLoading} from '@/store/actions';
import {Card, Col, message, Row, Spin, Statistic} from 'antd';
import {InfoCircleTwoTone} from '@ant-design/icons';
import './style.css';
import {post} from '@/utils/request';
import {MEMBERSUBSCRIBEMSG} from '@/api/index';

const Subscribe = ({userInfo, httpLoading, setHttpLoading}) => {
  const [memberSubscribeMsg, setMemberSubscribeMsg]=useState(null);
  const getSubscribeMsg=()=>{
    setHttpLoading(true);
    post(MEMBERSUBSCRIBEMSG, '', {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      setMemberSubscribeMsg(res.data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  useEffect(()=>{
    getSubscribeMsg();
  }, []);
  return (
    <Spin spinning={httpLoading}>
      <h2 className="mangerTitle">Subscribe</h2>
      <Card>
        <Row>
          {memberSubscribeMsg ?
          (memberSubscribeMsg.paymentState===2?
          <Col span={10}>
            <h3 className="subscribe-title">{memberSubscribeMsg.name}</h3>
            <Statistic
              className="marginB30 marginT30"
              valueStyle={{fontSize: 36}}
              prefix={(<span style={{fontSize: 20}}>$</span>)} value={memberSubscribeMsg.price}/>
            <p className="subscribe-info">{memberSubscribeMsg.desc}</p>
            <p className="subscribe-tip">{memberSubscribeMsg.cycleMessage}</p>
            <p className="subscribe-tip">{memberSubscribeMsg.automaticMessage}</p>
            <a href="mailto:hello@affinityanalyst.com">Contact us to unsubscribe</a>
          </Col>:
          <Col span={12}>
            <h3 className="subscribe-title">{memberSubscribeMsg.name}</h3>
            <Statistic
              className="marginB30 marginT30"
              valueStyle={{fontSize: 36}}
              prefix={(<span style={{fontSize: 20}}>$</span>)} value={memberSubscribeMsg.price}/>
            <p className="subscribe-info">{memberSubscribeMsg.desc}</p>
            <p className="subscribe-tip">{memberSubscribeMsg.cycleMessage}</p>
            <p className="subscribe-tip">{memberSubscribeMsg.automaticMessage}</p>
            <p href="mailto:hello@affinityanalyst.com">
              <InfoCircleTwoTone twoToneColor="#F7A200" />&nbsp;
              You haven&apos;t paid for the order yet.
              The order will be cancelled automatically after&nbsp;
              <span style={{color: '#ff4d4f'}}>
                {15 - moment(new Date()).minute() + moment(memberSubscribeMsg.payCreateTime).minute()}</span>&nbsp;
              minutes.&nbsp;
              <a href={memberSubscribeMsg.payUrl} target="_self">Pay now</a>
            </p>
          </Col>):
          <Col>
            You haven&apos;t subscribed to any packages yet.
          </Col>}
        </Row>
      </Card>
    </Spin>
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

Subscribe.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Subscribe);
