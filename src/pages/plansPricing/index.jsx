import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
import logo1 from '@/assets/home/logo1.webp';
import logo2 from '@/assets/home/logo2.webp';
import logo3 from '@/assets/home/logo3.webp';
import logo4 from '@/assets/home/logo4.webp';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';

const {Content} = Layout;


const PlansPricing = ({userInfo, httpLoading, setHttpLoading}) => {
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content>
        <Row className="content">
          <Col span={24}>
            <h2 className="text-center developers-title">Trusted by leading Developers & Studios.</h2>
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

PlansPricing.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PlansPricing);
