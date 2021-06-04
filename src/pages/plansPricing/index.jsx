import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row, message, Button, Divider, Card, Tooltip} from 'antd';
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
        <div className="marginTop90 content" style={{minHeight: 'calc(100vh - 180px)', paddingTop: 30}}>
          <Row gutter={[60, 24]} >
            {paymentList.map((payment, idx) => (
              <Col
                span={8}
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
                        <span className="priceTag">$</span>
                        {payment.price}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} className="paymentType">
                      {payment.paymentType?payment.paymentType:' '}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={14} offset={5} className="paymentDesc">
                      {payment.desc}
                    </Col>
                  </Row>
                  <Row>
                    <Col flex="auto" span={8} offset={8} className="paymentValid">
                      {
                        idx===0?'Valid for 3 months':'Valid for 6 months'
                      }
                    </Col>
                  </Row>
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
