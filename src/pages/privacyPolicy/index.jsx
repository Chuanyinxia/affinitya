import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Layout} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';
const {Content} = Layout;


const PrivacyPolicy = ({userInfo, httpLoading, setHttpLoading}) => {
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content className="marginTop90 ">
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

PrivacyPolicy.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PrivacyPolicy);
