import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Card, Col, Layout, Row} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
import banner from '@/assets/home/banner_img.png';
import info1 from '@/assets/home/info1.png';
import info2 from '@/assets/home/info2.png';
// import info3 from '@/assets/home/info3.png';
import info4 from '@/assets/home/info4.png';
import logo1 from '@/assets/home/logo1.webp';
import logo2 from '@/assets/home/logo2.webp';
import logo3 from '@/assets/home/logo3.webp';
import logo4 from '@/assets/home/logo4.webp';
import icon1 from '@/assets/home/icon1.png';
import icon2 from '@/assets/home/icon2.png';
import icon3 from '@/assets/home/icon3.png';
import step1 from '@/assets/home/step_01.png';
import step2 from '@/assets/home/step_02.png';
import step3 from '@/assets/home/step_03.png';
import step4 from '@/assets/home/step_04.png';

import Headers from '@/components/Headers';
import Footers from '@/components/Footers';

const {Content} = Layout;

const homeText = {
  banner: {
    title: 'Discover Your Game’s Audience Here',
    describe: 'AI - Enabled Player Intelligence Platform',
  },
  feature: {
    title: 'Why Choose Affinity Analyst?',
  },
  developers: {
    title: 'Trusted by Leading Developers & Studios',
  },
  easySimple: {
    title: 'Just a few simple steps to access your custom audiences!',
    content: [
      {
        title: '1. Register',
        describe: 'Fill out your name, phone and email to get started right away!',
        icon: step1,
      },
      {
        title: '2. Input Keyword',
        describe: 'Input your keywords and our engine generates audiences for you',
        icon: step2,
      },
      {
        title: '3. Save Audience',
        describe: 'View and edit your audiences and save for tracking',
        icon: step3,
      },
      {
        title: '4. Manage Audience',
        describe: 'Manage your winning audiences and extend them for further success!',
        icon: step4,
      },
    ],
  },
};

const Home = ({userInfo, httpLoading, setHttpLoading}) => {
  const feature = (index) => {
    switch (index) {
      case 1:
        return (<div style={{marginTop: 32}}>
          <div className="text-h3">Begin from Your Success
          </div>
          <div className="text-p">
            Discover audiences built from your successful UA ad campaigns.
            Our audience intelligence engine processes affinity data to deliver
            accuracy and range for your current and future campaigns.
          </div>
        </div>);
      case 2:
        return (<div style={{marginTop: 32}}>
          <div className="text-h3">Discover Hidden Gems</div>
          <div className="text-p">
            Every player’s interests overlap in part and deviate in others,
            creating opportunities to discover their unique potential for acquisition or for creative inspiration.
            Access our audience extension and lookalike audience features to find unique interests and audiences
            to build a robust campaign strategy that scales.
          </div>
        </div>);
      case 3:
        return (<div style={{marginTop: 32}}>
          <div className="text-h3">Utilize Dynamic Audiences</div>
          <div className="text-p">
            Audience interests change and evolve with real-world events and industry progression.
            Affinity Analyst’s audience intelligence engine is built to dynamically process
            audience parameters and consolidate multiple key social media
            platform content and features - enabling sustainable audience hotspot discovery,
            serving your creative and live operations at a fraction of the time for a fraction of the cost.
          </div>
        </div>);
      case 4:
        return (<div style={{marginTop: 32}}>
          <div className="text-h3">Manage Your Success</div>
          <div className="text-p">
            Every type of player is unique, and each player’s interests broadly deviate from one another. Access our
            audience extension and lookalike audience features to find unique interests and audiences to build a robust
            campaign strategy that scales.
          </div>
        </div>);
      default:
        return null;
    }
  };
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content className="marginTop90 banner">
        <Row className="home-content paddingT90">
          <Col lg={14} xs={12} sm={12} md={12}>
            <h1 className="homeBannerText">{homeText.banner.title}</h1>
            <p className="banner-info">{homeText.banner.describe}</p>
            <Button href="/signUp" className="BannerButton">Register Today</Button>
          </Col>
          <Col lg={10} xs={12} sm={12} md={12}>
            <img src={banner} className="banner-img"/>
          </Col>
        </Row>
        <div className="home-content marginTop90">
          <Row gutter={64}>
            <Col className="marginB64" lg={8} md={0} sm={0} xs={0}>
              <Card hoverable className="text-center Cards">
                <img style={{width: 64}} src={icon1}/>
                <div className="card-title">AI Enabled</div>
                <div className="card-info">
                  We deploy AI to drive processing time, breadth, and accuracy of correlative inferences
                </div>

              </Card>
            </Col>
            <Col className="marginB64" lg={8} md={0} sm={0} xs={0}>
              <Card hoverable className="text-center Cards">
                <img style={{width: 64}} src={icon2}/>
                <div className="card-title">Digital Anthropology&trade;</div>
                <div className="card-info">
                  We recreate accurate player-meta identities,
                  recreating insightful real-time narratives and actionable insights
                </div>
              </Card>
            </Col>
            <Col className="marginB64" lg={8} md={0} sm={0} xs={0}>
              <Card hoverable className="text-center Cards">
                <img style={{width: 64}} src={icon3}/>
                <div className="card-title">Social Data Mesh&trade;</div>
                <div className="card-info">
                  We utilize our player data consolidation mesh,
                  allowing you to engage dynamically and evolve with your players in real-time
                </div>
              </Card>
            </Col>
            <Col className="marginB16" lg={0} md={24} sm={24} xs={24}>
              <Card hoverable className="text-left">
                <Row gutter={16}>
                  <Col sm={3} xs={4}>
                    <img style={{width: 64}} src={icon1}/>
                  </Col>
                  <Col sm={21} xs={20}>
                    <div className="card-title marginT0">AI Enabled</div>
                    <div className="card-info">
                      We deploy AI to drive processing time, breadth, and accuracy of correlative inferences
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col className="marginB16" lg={0} md={24} sm={24} xs={24}>
              <Card hoverable className="text-left">
                <Row gutter={16}>
                  <Col sm={3} xs={4}>
                    <img style={{width: 64}} src={icon2}/>
                  </Col>
                  <Col sm={21} xs={20}>
                    <div className="card-title marginT0">Digital Anthropology</div>
                    <div className="card-info">
                  We contextualize the player metaverse to comprehend fundamentally with a Game industry-specific BI
                  framework accurately and actionable insights
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col className="marginB64" lg={0} md={24} sm={24} xs={24}>
              <Card hoverable className="text-left">
                <Row gutter={16}>
                  <Col sm={3} xs={4}>
                    <img style={{width: 64}} src={icon3}/>
                  </Col>
                  <Col sm={21} xs={20}>
                    <div className="card-title marginT0">Social Data Mesh</div>
                    <div className="card-info ">
                  We process directly related content across multiple social media content sources, integrate to our
                  data consolidation mesh to engage dynamically and evolve with player real-world interests
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Content className="bg-white">
        <div className="home-content marginTop90">
          <Row gutter={64}>
            <Col span={12} className="text-left">
              <img src={info1} alt="banner" style={{width: '80%'}}/>
            </Col>
            <Col span={12} className="padding16">
              {feature(1)}
            </Col>
          </Row>
          <Row gutter={64} className="marginTop90">
            <Col span={12} className="padding16">
              {feature(2)}
            </Col>
            <Col span={12} className="text-right">
              <img src={info2} alt="banner" style={{width: '80%'}}/>
            </Col>
          </Row>
          <Row gutter={64} className="marginTop90 paddingB90">
            <Col span={12} className="text-left">
              <img src={info4} alt="banner" style={{width: '80%'}}/>
            </Col>
            <Col span={12} className="padding16">
              {feature(3)}
            </Col>
          </Row>
          {/* <Row gutter={64} className="marginTop90 paddingB90">*/}
          {/*  <Col span={12} className="padding16">*/}
          {/*    {feature(4)}*/}
          {/*  </Col>*/}
          {/*  <Col span={12} className="text-right">*/}
          {/*    <img src={info4} alt="banner" style={{width: '80%'}}/>*/}
          {/*  </Col>*/}
          {/* </Row>*/}
        </div>
      </Content>
      <Content className="bg-white">
        <div className="home-content ">
          <Row gutter={64} className="marginB64">
            <Col span={24}>
              <h2 className="text-center developersTitle">{homeText.developers.title}</h2>
            </Col>
            <Col span={6} className="text-center">
              <img src={logo1} style={{width: '100%'}} alt="logo"/>
            </Col>
            <Col span={6} className="text-center">

              <img src={logo2} style={{width: '100%'}} alt="logo"/>
            </Col>
            <Col span={6} className="text-center">
              <img src={logo3} style={{width: '100%'}} alt="logo"/>
            </Col>
            <Col span={6} className="text-center">
              <img src={logo4} style={{width: '100%'}} alt="logo"/>
            </Col>
          </Row>
        </div>
      </Content>
      <Content className="bg-dark">
        <div className="home-content step text-center">
          <Row gutter={64}>
            <Col span={24}>
              <div className="stepTitle">{homeText.easySimple.title}</div>
            </Col>
            {homeText.easySimple.content.map((step, index) => (
              <Col lg={6} xs={12} sm={12} key={index + 'step'} className="text-center marginB30">
                <div className="marginB30">
                  <img src={step.icon} width={80}/>
                </div>
                <div className="stepSubTitle">{step.title}</div>
                <div className="stepInfo">{step.describe}</div>
              </Col>
            ))}

            <Col span={24} className="text-center marginT64 marginB64">
              <Button href="/signUp" className="BannerButton">Register Today</Button>
            </Col>
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

Home.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home);
