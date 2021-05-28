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
} from 'antd';
import {httpLoading} from '@/store/actions';
import {GETPAYMENTLIST, PAY} from '@/api/index';
import {get, post} from '@/utils/request';
import paypal from '@/assets/PayPal.png';

import './style.css';

const PlansAndPrices = ({userInfo, httpLoading, setHttpLoading}) => {
  const [paymentList, setPaymentList] = useState([]);
  const [payUrl, setPayUrl] = useState('');
  const magicRef = useRef();
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
    setHttpLoading(true);
    if (paymentList.every((item) => item.checked === false)) {
      message.error('You should choose a paceakge.');
      return;
    }
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
              onClick={()=>{
                selectPayment(idx);
              }}
            >
              <Card title={null} bordered={false} className="priceCard">
                <div className="cardContent">
                  <div className="paymentName">{payment.name}</div>
                  <div className="paymentPrice">
                    <span className="priceTag">$</span>
                    {payment.price}
                  </div>
                  <div className="paymentDesc">{payment.desc}</div>
                  <div className="paymentValid">{
                    idx===0?'Valid for 3 months':'Valid for 6 months'
                  }</div>
                  <Divider style={{marginTop: 100}}/>
                  <div className="paymentFun">
                    {payment.functionList.map((fun, index)=>(
                      <div key={`fun_${index}`} style={{height: 40}}>{fun}</div>
                    ))}
                  </div>
                </div>
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
                  <Image src={paypal}></Image>
                </Form.Item>
                <Form.Item label="Payment Amount：" className="paymentPrice">
                  <div style={{textAlign: 'left', height: 52, lineHeight: '52px'}}>
                    <span className="priceTag">{paymentList.filter((item) => item.checked===true).length===0?
                    '':'$'}</span>
                    <span>{paymentList.filter((item) => item.checked===true).length===0?
                    '':paymentList.filter((item) => item.checked===true)[0].price}</span>
                  </div>
                </Form.Item>
                <Form.Item style={{position: 'relative'}}>
                  <Form.Item
                    rules={[{
                      validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                    }]}
                    name="payCheckbox"
                    valuePropName="checked"
                    style={{float: 'left'}}
                  >
                    <Checkbox ></Checkbox>
                  </Form.Item>
                  <Form.Item style={{position: 'absolute', left: 24}}>
                    <span>I have read and agre <a href="">Payment Policy</a></span>
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
      <a href={payUrl} ref={magicRef} target="_blank" rel="noreferrer">&nbsp;</a>
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
