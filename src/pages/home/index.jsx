import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Col, Form, Input, Layout, Row, Card, message, Space, Divider} from 'antd';
import {httpLoading} from '@/store/actions';
import {Link} from 'react-router-dom';
import './style.css';
import logo from '@/assets/lettering-logo.webp';
import banner from '@/assets/home/banner.png';
import info1 from '@/assets/home/info1.png';
import info2 from '@/assets/home/info2.png';
import info3 from '@/assets/home/info3.png';
import {get} from '@/utils/request';
import {ISEXISTED} from '@/api';
import {useHistory} from 'react-router-dom';
import {GETPAYMENTLIST} from '@/api/index';
const {Header, Content, Footer} = Layout;


const Home = ({userInfo, httpLoading, setHttpLoading}) => {
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
  const selectPayment = (index)=>{
    const data = [...paymentList];
    data.forEach((item)=>item.checked=false);
    data[index].checked = true;
    setPaymentList(data);
    history.push('/login');
  };
  const Finish = (value) => {
    console.log(value);

    get(ISEXISTED+value.email).then((res)=>{
      if (res.code!==200) {
        message.error(res.msg);
      } else {
        if (res.data===1) {
          console.log(res);
          history.push('/login?email='+value.email);
        } else {
          history.push('/signUp?email='+value.email);
        }
      }
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  return (
    <Layout className="layout">
      <Header className="padding0 text-center bg-header">
        <Row className="content">
          <Col span={14}>
            <div className="text-left">
              <img alt="logo" src={logo} width={189}/>
            </div>
          </Col>
          <Col span={10} className="text-right">
            <Space size="large">

              <Link to='/' className="navs">Home</Link>


              <Link to='/dashboard/audienceGenerator'
                className="navs">Dashboard</Link>

              <a href="#Plans" className="navs" onClick={(e)=>{
                getPaymentList();
              }}>Plans &
                  Pricing</a>
              <Link to='/login' className="navs">Login</Link>
            </Space>
          </Col>
        </Row>
      </Header>
      <Content className="marginTop90 banner">
        <Row className="content">
          <Col span={14}>
            <h1 className="bannerText">Insights Powered By the Players
              A.I. Social Data Platform
            </h1>
            <p className="banner-info">try free-use A.I. for a 360° degree view of your players</p>
            <Form onFinish={Finish} layout="inline">
              <Form.Item
                name="email"
                rules={[{required: true, type: 'email', message: 'Please input your Email address !'}]}
              >
                <Input placeholder="Email Address*" className="bannerInput"/>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{width: 120}}>
                  Access for free
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={10} className="text-right">
            <img src={banner} alt={banner} width={375}/>
          </Col>
        </Row>
      </Content>
      <Content className="">
        <Row className="content">
          <Col span={24}>
            <h1 className="info-title">Why Choose Affinity Analyst?</h1>
          </Col>
        </Row>
        <Row className="content">
          <Col span={12} className="text-left">
            <img src={info1} alt={banner} width={395}/>
          </Col>
          <Col span={12}>
            <h2 className="info-sec-title">Supercharge your targetingfor the post IDFA world </h2>
            <p className="info-sub-title">Post-IDFA, players are a fragmented collection of interests,
              our proprietary interests analyst algorithms
              help you discover accurate and granular audiences, at scale.</p>
            <p className="info-content">Affinity Accelerator+, our proprietary affinity analysis engine processes
              real-time interests, volume, and topical patterns - uncovering hidden opportunities for player
              acquisition.</p>
          </Col>
        </Row>
        <Row className="content marginTop90">
          <Col span={12}>
            <h2 className="info-sec-title">No User Profiling? No Problem. </h2>
            <p className="info-sub-title">An interest represents only one piece of the profile puzzle, but interests
              change, profiles don&apos;t.
              Utilize affinity data overlap and extensions to test and drive the growth of your
              audience.</p>
            <p className="info-content">
              Affinity Accelerator+ isn&apos;t only about uncovering potential interests, it&apos;s also
              about creating interest audience sets - we mesh audience data, cross-platform signals, and provide the key
              use-side configurations and filters to go from discovering to creating.</p>
          </Col>
          <Col span={12} className="text-right">
            <img src={info2} alt={banner} width={395}/>
          </Col>
        </Row>
        <Row className="content marginTop90 paddingB90">
          <Col span={12} className="text-left">
            <img src={info3} alt={banner} width={395}/>
          </Col>
          <Col span={12}>
            <h2 className="info-sec-title">Real-time, Real Players.</h2>
            <p className="info-sub-title">
              Players&apos; interests evolve, they experience Ad fatigue, and undergo a constant
              shift in social perceptions. We merge dynamic social data signals with effective interests to create a
              unified mesh, for developers and advertisers to find the story and insights above the interest.</p>
            <p className="info-content">
              Nexus A.I. builds upon our Affinity Accelerator technology - we capture real-time social content to
              integrate with the interests data - adding an invaluable dimension to better comprehend your players,
              their complex webs of interests, and methods of approach.
            </p>
          </Col>
        </Row>
      </Content>
      <Content className="bg-price " id="Plans">
        <div className="content">
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
        </div>
      </Content>
      <Footer className="home-footer">
        <Row className="content">
          <Col span={6} className="text-left">Terms of service</Col>
          <Col span={6} className="text-left">Privacy Policy</Col>
          <Col span={6} className="text-left">Mailbox: fbad-marketing@XXXX.com.cn</Col>
          <Col span={6} className="text-right"> ©2021 by Affinity Analyst.</Col>
        </Row>
      </Footer>
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

Home.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home);
