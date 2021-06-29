import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Card,
  message,
  Divider,
  Form,
  Checkbox,
  Image,
  Button,
  Spin,
  Tooltip,
  Modal,
} from 'antd';
import {httpLoading} from '@/store/actions';
import {GETPAYMENTLIST, PAY, GETAGREEMENT} from '@/api/index';
import {get, post} from '@/utils/request';
import paypal from '@/assets/PayPal.png';

import './style.css';

const PlansAndPrices = ({userInfo, httpLoading, setHttpLoading}) => {
  const [paymentList, setPaymentList] = useState([]);
  const [payUrl, setPayUrl] = useState('');
  const [agreement, setAgreement] = useState(null);
  const magicRef = useRef();
  const [agreementModalVivible, setAgreementModalVivible] = useState(false);
  const getAgreement = () => {
    get(GETAGREEMENT + 2).then((res) => {
      setAgreement(res.data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const getPaymentList = ()=>{
    setHttpLoading(true);
    get(GETPAYMENTLIST, userInfo.token).then((res) => {
      const data = res.data.items.map((item) => {
        item.checked = false;
        return item;
      });
      console.log(data);
      setPaymentList(data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  const selectPayment = (index)=>{
    const data = [...paymentList];
    data.forEach((item)=>item.checked=false);
    data[index].checked = true;
    setPaymentList(data);
  };
  const payNow = ()=>{
    if (paymentList.every((item) => item.checked === false)) {
      message.error('You should choose a package.');
      return;
    }
    setHttpLoading(true);
    post(PAY, {paymentPackageId: paymentList.filter((item) => item.checked===true)[0].id}, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      setPayUrl(res.data.payUrl);
      setTimeout(()=>{
        magicRef.current.click();
      });
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  useEffect(() => {
    getPaymentList();
  }, []);
  useEffect(() => {
    getAgreement();
  }, []);
  return (
    <div className="content">
      <Spin spinning={httpLoading}>
        <Row gutter={[46]} >
          {paymentList.map((payment, idx) => (
            <Col
              span={7}
              offset={idx===0?0:1}
              className={payment.checked?'plans checked':'plans'}
              key={payment.name}
            >
              <Card title={null} bordered={false} className="priceCard">
                <Row>
                  <Col span={24} className="paymentName">{payment.name}</Col>
                </Row>
                <Row>
                  <Col span={24} className="paymentPrice">
                    <div>
                      {payment.price?<span className="priceTag">$</span>:<span>&nbsp;</span>}
                      {payment.price?<span>{payment.price}</span>:<span>&nbsp;</span>}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className="paymentType">
                    {payment.paymentType?<span>{payment.paymentType}</span>:<span>&nbsp;</span>}
                  </Col>
                </Row>
                <Row>
                  <Col span={14} offset={5} className="paymentDesc">
                    {payment.desc}
                  </Col>
                </Row>
                {/* <Row>
                  <Col flex="auto" span={8} offset={8} className="paymentValid">
                    {payment.paymentCycle?<span>{payment.paymentCycle}</span>:<span>&nbsp;</span>}
                  </Col>
                </Row>*/}
                <Row>
                  <Col flex="auto" span={8} offset={8} className="paymentBtn">
                    {payment.clickState===0?<Tooltip title="Not available for now.">
                      <Button type="primary" block disabled>select</Button>
                    </Tooltip>:<Button type="primary" block onClick={()=>{
                      selectPayment(idx);
                    }}>select</Button>}
                  </Col>
                </Row>
                <Divider style={{marginTop: 48}}/>
                <Row>
                  <Col flex="auto" span={20} offset={2} className="paymentFun">
                    {payment.functionList.map((fun, index)=>(
                      <div key={`fun_${index}`} style={{height: 32}}>{fun}</div>
                    ))}
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[46]} >
          <Col span={23}>
            <Card title={null} bordered={false} className="payCard">
              <Form onFinish={()=>{
                payNow();
              }}>
                <Form.Item label="Payment Method：">
                  <Image src={paypal} preview={false}></Image>
                </Form.Item>
                <Form.Item label="Payment Amount：">
                  <div style={{textAlign: 'left', fontSize: 20}}>
                    <span className="priceTag">{paymentList.filter((item) => item.checked===true).length===0?
                    '':'$'}</span>
                    <span>{paymentList.filter((item) => item.checked===true).length===0?
                    '':paymentList.filter((item) => item.checked===true)[0].price}</span>
                  </div>
                </Form.Item>
                <Form.Item style={{position: 'relative', marginTop: 16}}>
                  <Form.Item
                    rules={[{
                      validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Should accept the payment policy! ')),
                    }]}
                    name="payCheckbox"
                    valuePropName="checked"
                    style={{float: 'left'}}
                  >
                    <Checkbox ></Checkbox>
                  </Form.Item>
                  <Form.Item style={{position: 'absolute', left: 24}}>
                    <span>I have read and agreed to the <a href="" onClick={(e)=>{
                      e.preventDefault();
                      setAgreementModalVivible(true);
                    }}>Payment Policy</a>.</span>
                  </Form.Item>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Pay Now</Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
      <a href={payUrl} ref={magicRef} target="_self" rel="noreferrer">&nbsp;</a>
      <Modal
        title="Payment Policy"
        visible={agreementModalVivible}
        width={800}
        footer={null}
        onOk={() => setAgreementModalVivible(false)}
        onCancel={() => setAgreementModalVivible(false)}
      >
        <div dangerouslySetInnerHTML={{__html: agreement}} style={{maxHeight: 720, overflow: 'auto'}}></div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.getUserInfo.info,
    httpLoading: state.toggleHttpLoading.loading,
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
