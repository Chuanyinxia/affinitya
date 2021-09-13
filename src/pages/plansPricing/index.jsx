import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row, message, Button, Divider, Card, Tooltip} from 'antd';
import {
  CheckCircleFilled,
} from '@ant-design/icons';

import {httpLoading} from '@/store/actions';
import {GETPAYMENTLIST} from '@/api/index';
import {get} from '@/utils/request';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';
import './style.css';
import {useHistory} from 'react-router-dom';

const {Content} = Layout;


const PlansPricing = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [paymentList, setPaymentList] = useState([]);
  const getPaymentList = ()=>{
    setHttpLoading(true);
    get(GETPAYMENTLIST).then((res) => {
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
  const selectPayment = ()=>{
    history.push('/login');
  };
  useEffect(() => {
    getPaymentList();
  }, []);
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content>
        <div className="marginTop90 PPContent" style={{minHeight: 'calc(100vh - 180px)', paddingTop: 30}}>
          <Row gutter={[60, 24]} style={{marginTop: 48}}>
            <Col span={24}>
              <div style={{textAlign: 'center', fontSize: 24, fontWeight: 600}}>Plans and pricing</div>
              <div style={{textAlign: 'center', fontSize: 14, color: '#6E7191', marginTop: 8}}>
                Choose the best plan for your business.</div>
            </Col>
          </Row>
          <Row gutter={[60, 24]} style={{marginTop: 28}}>
            {paymentList.map((payment, idx) => (
              <Col
                span={8}
                className={payment.checked?'plans checked':'plans'}
                key={payment.name}
              >
                <Card title={null} bordered={false} className="priceCard">
                  <Row>
                    <Col span={24} className="paymentPrice">
                      <div className="price-box">
                        <div className="price-title">{payment.price?
                        <><span className="priceTag">$</span><span>{payment.price}</span></>:
                        <span>{payment.price}</span>}</div>
                        <div className="month-tag">/month</div>
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
                      {payment.clickState===0?
                      <Tooltip title="Not available for now.">
                        <Button type="primary" block disabled>
                        Sign up Now</Button>
                      </Tooltip>:
                      <Button type="primary" block onClick={()=>{
                        selectPayment(idx);
                      }}>Sign up Now</Button>}
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footers/>
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

PlansPricing.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PlansPricing);
