import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Layout, message} from 'antd';
import {httpLoading} from '@/store/actions';
import './style.css';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';
import {get} from '@/utils/request';
import {GETAGREEMENT} from '@/api';
const {Content} = Layout;
import {type} from '@/components/plugin/Searchdata';

const TermsService = ({userInfo, httpLoading, setHttpLoading}) => {
  const [agreement, setAgreement] = useState(null);
  const getAgreement = () => {
    get(GETAGREEMENT + type()).then((res) => {
      setAgreement(res.data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  useEffect(() => {
    getAgreement();
  }, []);
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content className="marginTop90">
        <div className="content" dangerouslySetInnerHTML={{__html: agreement}}></div>
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

TermsService.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TermsService);
