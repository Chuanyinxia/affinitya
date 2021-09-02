import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Card, Col, Layout, Row} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
import banner from '@/assets/home/banner.webp';
import info1 from '@/assets/home/info1.webp';
import info2 from '@/assets/home/info2.webp';
import info3 from '@/assets/home/info3.webp';
import logo1 from '@/assets/home/logo1.webp';
import logo2 from '@/assets/home/logo2.webp';
import logo3 from '@/assets/home/logo3.webp';
import logo4 from '@/assets/home/logo4.webp';

import Headers from '@/components/Headers';
import Footers from '@/components/Footers';

const {Content} = Layout;

const homeText = {
  banner: {
    title1: 'Discover Your',
    title2: 'Game’s Audience',
    subTitle: 'Here',
    describe: 'AI - Enabled Player Intelligence Platform',
  },
  feature: {
    title: 'Why Choose Affinity Analyst?',
  },
  developers: {
    title: 'Trusted by leading Developers & Studios.',
  },
};

const Home = ({userInfo, httpLoading, setHttpLoading}) => {
  const feature = (index) => {
    switch (index) {
      case 1:
        return (<div>
          <div className="text-h3">Bring from Your success
          </div>
          <div className="text-p">
            Discover audiences directly correlated and built from successful campaigns. Our audience intelligence engine
            processes affinity data to deliver accuracy and range for your ongoing or next campaign.
          </div>
        </div>);
      case 2:
        return (<div>
          <div className="text-h3">Discover hidden gems</div>
          <div className="text-p">
            Every type of player is unique, and each player’s interests broadly deviate from one another. Access our
            audience extension and lookalike audience features to find unique interests and audiences to build a robust
            campaign strategy that scales.
          </div>
        </div>);
      case 3:
        return (<div>
          <div className="text-h3">Dynamic Audience</div>
          <div className="text-p">
            Discover audiences directly correlated and built from successful campaigns. Our audience intelligence engine
            processes affinity data to deliver accuracy and range for your ongoing or next campaign.
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
          <Col span={24}>
            <h1 className="homeBannerText">{homeText.banner.title1}</h1>
            <h1 className="homeBannerText">{homeText.banner.title2}</h1>
            <h2 className="homeBannerText">{homeText.banner.subTitle}</h2>
            <p className="banner-info">{homeText.banner.describe}</p>
            <Button href="/signUp" className="BannerButton">Register Today</Button>
          </Col>
        </Row>
        <div className="home-content">
          <Row gutter={64}>
            <Col lg={8} sm={24}>
              <Card hoverable className="text-center">
                <div>AI Enabled</div>
                <div>
                  We deploy AI to drive processing time, breadth, and accuracy of correlative inferences
                </div>
              </Card>
            </Col>
            <Col lg={8} sm={24}>
              <Card hoverable className="text-center">
                <div>Digital Anthropology</div>
                <div>
                  We contextualize the player metaverse to comprehend fundamentally with a Game industry-specific BI
                  framework accurately and actionable insights
                </div>
              </Card>
            </Col>
            <Col lg={8} sm={24}>
              <Card hoverable className="text-center">
                <div>Social Data Mesh</div>
                <div>
                  We process directly related content across multiple social media content sources, integrate to our
                  data consolidation mesh to engage dynamically and evolve with player real-world interests
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Content className="bg-white">
        <div className="home-content">
          <Row gutter={60}>
            <Col span={12} className="padding16">
              {feature(1)}
            </Col>
            <Col span={12} className="text-right">
              <img src={info1} alt={banner} style={{width: '100%'}}/>
            </Col>
          </Row>
          <Row gutter={60} className="marginTop90">
            <Col span={12} className="text-left">
              <img src={info2} alt={banner} style={{width: '100%'}}/>
            </Col>
            <Col span={12} className="padding16">
              {feature(2)}
            </Col>
          </Row>
          <Row gutter={60} className="marginTop90 paddingB90">
            <Col span={12} className="padding16">
              {feature(3)}
            </Col>
            <Col span={12} className="text-right">
              <img src={info3} alt={banner} style={{width: '100%'}}/>
            </Col>
          </Row>
        </div>
      </Content>
      <Content className="bg-white">
        <div className="home-content">
          <Row gutter={60}>
            <Col span={24}>
              <h2 className="text-center developers-title">{homeText.developers.title}</h2>
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
        <div className="home-content text-center">
          <Row gutter={60}>
            <Col span={24}>
              <h2 className="developers-title">Easy Simple Way to Get Your Game’s Audience</h2>
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
