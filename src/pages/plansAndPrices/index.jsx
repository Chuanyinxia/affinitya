import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row, message, Button, Divider, Card, Tooltip, Modal, Checkbox, Result, Spin} from 'antd';
import {
  CheckCircleFilled,
} from '@ant-design/icons';

import {httpLoading, setMenusData} from '@/store/actions';
import {GETPAYMENTLIST, ISPAID, PAY} from '@/api/index';
import {get, post} from '@/utils/request';
import './style.css';
import {useHistory} from 'react-router-dom';
import store from '@/store';
const {Content} = Layout;
const PlansAndPrices = ({userInfo, httpLoading, setHttpLoading}) => {
  const [isPayUser, setIsPayUser] = useState(false);
  const history = useHistory();
  const [paymentList, setPaymentList] = useState([]);
  const [payModalVisible, setpayModalVisible] = useState(false);
  const [statusModalVisible, setstatusModalVisible] = useState(false);
  const [payUrl, setPayUrl] = useState('');
  const [payStatus, setpayStatus] = useState(false);
  const [payRadio, setpayRadio] = useState(true);
  const [current, setcurrent] = useState({});
  const magicRef = useRef();
  const [payLoading, setpayLoading] = useState(false);
  const getPaymentList = ()=>{
    setHttpLoading(true);
    get(GETPAYMENTLIST).then((res) => {
      const data = res.data.items.map((item) => {
        item.checked = false;
        return item;
      });
      data.sort((a, b)=> a.packageType - b.packageType);
      setPaymentList(data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  const pay = (id)=>{
    setpayLoading(true);
    setpayModalVisible(false);
    post(PAY, {
      paymentPackageId: id,
    }, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      setPayUrl(res.data.payUrl);
      setTimeout(()=>{
        magicRef.current.click();
        setpayLoading(false);
      });
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      setpayLoading(false);
    });
  };
  const loadPageVar = (sVar) => {
    return decodeURI(
        window.location.search.replace(
            new RegExp('^(?:.*[&\\?]' +
          encodeURI(sVar).replace(/[.+*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  };
  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  useEffect(() => {
    getPaymentList();
    isPay();
  }, []);
  useEffect(() => {
    setpayStatus(loadPageVar('payStatus')==='success');
    setstatusModalVisible(loadPageVar('payStatus')===''?false:true);
  }, []);
  return (
    <Layout className="layout Home">
      {/* <Headers/> */}
      <Content>
        <Spin spinning={payLoading}>
          <div className="PPContent" style={{minHeight: 'calc(100vh - 180px)', paddingTop: 30}}>
            <Row style={{marginTop: 18}}>
              <Col span={24}>
                <div style={{textAlign: 'center', fontSize: 24, fontWeight: 600}}>Plans and pricing</div>
                <div style={{textAlign: 'center', fontSize: 14, color: '#6E7191', marginTop: 8}}>
                  Choose the best plan for your business.</div>
              </Col>
            </Row>
            <div style={{
              marginTop: 28, marginBottom: 64, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
              {paymentList.map((payment, idx) => (
                <div
                  key={payment.name}
                  className="price-card-wrap"
                >
                  <Card title={null} bordered={false} className="price-card">
                    <Row>
                      <Col span={24} className="paymentPrice">
                        <div className="price-box">
                          <div className="price-title">
                            {idx===0?'Free':idx===1?<span>USD${payment.price}</span>:'Custom'}
                          </div>
                          {idx===1?<div className="month-tag">/month</div>:null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className="price-name">{payment.name}</Col>
                    </Row>

                    {/* <Row>
                      <Col span={24} className="paymentType" >
                        {payment.paymentType?payment.paymentType:<span/>}
                      </Col>
                    </Row> */}
                    <Row>
                      <Col span={24} className="price-desc">
                        {payment.desc}
                      </Col>
                    </Row>
                    {/*   <Row>
                      <Col flex="auto" span={8} offset={8} className="paymentValid">
                        {
                          idx===0?'Valid for 3 months':'Valid for 6 months'
                        }
                      </Col>
                    </Row>*/}
                    <div className="divider-box">
                      <Divider/>
                    </div>
                    <Row>
                      <Col className="price-fun"span={24}>
                        {payment.functionList.map((fun, index)=>(
                          <div key={`fun_${index}`}>
                            <div style={{float: 'left'}}>
                              <CheckCircleFilled style={{marginRight: 9}}/>
                            </div>
                            <div>{fun}</div>
                          </div>
                        ))}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className="price-btn">
                        {payment.packageType===1?
                        <Tooltip>
                          <Button type="primary" block disabled>
                            {isPayUser?'Free Plan':'Current Plan'}
                          </Button>
                        </Tooltip>:
                        payment.packageType===2?
                        <Button
                          type="primary"
                          block
                          disabled={isPayUser}
                          onClick={()=>{
                            setpayModalVisible(true);
                            setpayRadio(true);
                            setcurrent(payment);
                          }}> {isPayUser?'Current Plan':'Upgrade Now'}</Button>:
                        <Button type="primary" block onClick={()=>{
                          store.dispatch(setMenusData('', ''));
                          history.push('/contactSales');
                        }}>Contact Sales</Button>
                        }
                      </Col>
                    </Row>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </Spin>
      </Content>
      <Modal visible={payModalVisible}
        footer={null} width={776} onCancel={()=>setpayModalVisible(false)}>
        <p style={{
          fontSize: 24,
          fontWeight: 600,
          paddingLeft: 44,
          marginTop: 36,
        }}>Subscribe to Affinity Analyst Paid</p>
        <p style={{
          paddingLeft: 44,
        }}
        >Up to 300 Affinity Tags + Monthly industry newsletter </p>
        <div style={{
          height: 40,
          lineHeight: '40px',
          paddingLeft: 44,
          marginTop: 56,
        }}>
          <div style={{float: 'left'}}>Payment Method:</div>
          <div className="pay-pal"></div>
        </div>
        <div style={{
          height: 40,
          lineHeight: '40px',
          marginTop: 24,
          paddingLeft: 44,
        }}>Payment Amount: <span style={{fontSize: 24, paddingLeft: 16}}>${current.price}</span></div>
        <div style={{marginTop: 48, paddingLeft: 44}}>
          <Checkbox checked={payRadio} onChange={()=>{
            setpayRadio(!payRadio);
          }}>I have read and agreed to the&nbsp;&nbsp;
            <a href="/privacyPolicy?type=4" target="_blank">
              Payment Policy.
            </a>
          </Checkbox>
        </div>
        {payRadio?null:<div style={{paddingLeft: 44, color: '#E92C3A'}}>You should accept the payment policy.</div>}
        <div style={{marginLeft: 350, marginTop: 72}}>
          <Button style={{width: 174, height: 48}} onClick={()=>setpayModalVisible(false)}>Cancel</Button>
          <Button
            style={{width: 174, height: 48, marginLeft: 14}}
            type="primary"
            onClick={()=>pay(current.id)}
            disabled={!payRadio}>Pay Now</Button>
        </div>
      </Modal>
      <Modal visible={statusModalVisible} footer={null} width={740} onCancel={()=>setstatusModalVisible(false)}>
        {payStatus?<Result
          status="success"
          title="Payment successful!"
          extra={[
            <Button key="back" style={{width: 152, height: 48}} onClick={()=>setstatusModalVisible(false)}>
              Back
            </Button>,
            <Button key="start" type="primary" style={{width: 152, height: 48}}
              onClick={()=>history.push('/dashboard/audienceGenerator')}>Get Started</Button>,
          ]}
        />:
        <Result
          status="error"
          title="Payment failed. Please try again."
          extra={[
            <Button key="back" style={{width: 152, height: 48}} onClick={()=>setstatusModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="start" type="primary" style={{width: 152, height: 48}}
              onClick={()=>{
                setstatusModalVisible(false);
                setpayModalVisible(true);
              }}
            >Restart</Button>,
          ]}
        />}
      </Modal>
      <a href={payUrl} ref={magicRef} target="_self" rel="noreferrer">&nbsp;</a>
    </Layout>
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

PlansAndPrices.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PlansAndPrices);
