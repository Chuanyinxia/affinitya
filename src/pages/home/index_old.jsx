import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Col, Form, Input, Layout, message, Row} from 'antd';
import {httpLoading} from '@/store/actions';
import {useHistory} from 'react-router-dom';
import './style.css';

import {get} from '@/utils/request';
import {ISEXISTED} from '@/api';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';

const {Content} = Layout;

const homeText = {
  banner: {
    title1: 'Insights Powered',
    title2: 'By the Players',
    subTitle: 'A.I. Social Data Platform',
    describe: 'Try free - use A.I. for a 360° view of your players.',
  },
  feature: {
    title: 'Why Choose Affinity Analyst?',
  },
  developers: {
    title: 'Trusted by leading Developers & Studios.',
  },
};

const Home = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const feature = (index) => {
    switch (index) {
      case 1:
        return (<div>
          <h2 className="info-sec-title">Supercharge your targeting
            <br/>for the post IDFA world
          </h2>
          <p className="info-sub-title">
            Post-IDFA, players are a fragmented collection of interests, our<br/>
            proprietary interests analyst algorithms help you discover<br/>
            accurate and granular audiences, at scale.
          </p>
          <p className="info-content">
            <u>Affinity Accelerator+</u>, our proprietary affinity analysis engine<br/>
            processes real-time interests, volume, and topical patterns -<br/>
            uncovering hidden opportunities for player acquisition.</p>
        </div>);
      case 2:
        return (<div>
          <h2 className="info-sec-title">No User Profiling? No Problem. </h2>
          <p className="info-sub-title">
            An interest represents only one piece of the profile puzzle, but<br/>
            interests change, profiles don&apos;t. Utilize affinity data overlap<br/>
            and extensions to test and drive the growth of your audience.
          </p>
          <p className="info-content">
            <u>Affinity Accelerator+</u> isn&apos;t only about uncovering potential interests, <br/>
            it&apos;s also about creating interest audience sets - we mesh audience<br/>
            data, cross-platform signals, and provide the key use-side<br/>
            configurations and filters to go from discovering to creating.
          </p>
        </div>);
      case 3:
        return (<div>
          <h2 className="info-sec-title">Real-time, Real Players.</h2>
          <p className="info-sub-title">
            Players&apos; interests evolve, they experience Ad fatigue, and<br/> undergo a constant
            shift in social perceptions. We merge<br/>
            dynamic social data signals with effective interests to create a<br/>
            unified mesh, for developers and advertisers to find the story<br/>
            and insights above the interest.</p>
          <p className="info-content">
            <u>Nexus A.I.</u> builds upon our Affinity Accelerator technology - we<br/>
            capture real-time social content to integrate with the interests data -<br/>
            adding an invaluable dimension to better comprehend your<br/>
            players, their complex webs of interests, and methods of approach.
          </p>
        </div>);
      default:
        return null;
    }
  };
  const Finish = (value) => {
    get(ISEXISTED + value.email).then((res) => {
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        if (res.data === 1) {
          history.push('/login?email=' + value.email);
        } else {
          history.push('/signUp?email=' + value.email);
        }
      }
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content className="marginTop90 banner">
        <Row className="content bannerBg">
          <Col lg={2} xxl={5}/>
          <Col lg={22} xxl={19} className="homeBanner">
            <h1 className="homeBannerText">{homeText.banner.title1}</h1>
            <h1 className="homeBannerText">{homeText.banner.title2}</h1>
            <h2 className="homeBannerSubTitle">{homeText.banner.subTitle}</h2>
            <p className="banner-info">{homeText.banner.describe}</p>
            <Form onFinish={Finish} layout="inline">
              <Form.Item
                name="email"
                rules={[{required: true, message: 'Please input your email address!'},
                  {type: 'email', message: 'Please input a valid email address!'}]}
              >
                <Input placeholder="Email Address*" size="large" className="bannerInput" style={{width: 460}}/>
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="large" htmlType="submit" style={{width: 160}}>
                  Access for Free
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
      <Content className="bg-dark">
        <Row className="content">
          <Col span={24}>
            <h1 className="info-title text-white">{homeText.feature.title}</h1>
          </Col>
        </Row>
        <Row className="content">
          <Col span={12}>
            {feature(1)}
          </Col>
          <Col span={12} className="text-left">
            <img src={info1} alt={banner} style={{width: '100%'}}/>
          </Col>
        </Row>
        <Row className="content marginTop90">
          <Col span={12} className="text-right">
            <img src={info2} alt={banner} style={{width: '100%'}}/>
          </Col>
          <Col span={12}>
            {feature(2)}
          </Col>
        </Row>
        <Row className="content marginTop90 paddingB90">
          <Col span={12}>
            {feature(3)}
          </Col>
          <Col span={12} className="text-left">
            <img src={info3} alt={banner} style={{width: '100%'}}/>
          </Col>
        </Row>
      </Content>
      <Content>
        <Row className="content" >
          <Col span={24} >
            <h2 className="text-center developers-title">{homeText.developers.title}</h2>
          </Col>
          <Col span={6} className="text-center">
            <img src={logo1} style={{width: '90%'}} alt="logo"/>
          </Col>
          <Col span={6} className="text-center">

            <img src={logo2} style={{width: '90%'}} alt="logo"/>
          </Col>
          <Col span={6} className="text-center">
            <img src={logo3} style={{width: '90%'}} alt="logo"/>
          </Col>
          <Col span={6} className="text-center">
            <img src={logo4} style={{width: '90%'}} alt="logo"/>
          </Col>
        </Row>
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

Home.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home);
