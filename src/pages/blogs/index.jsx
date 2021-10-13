import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {
} from '@/api/index';
import {
} from '@/utils/request';
import {
  Spin,
  Row,
  Col,
  Input,
} from 'antd';
import {
  SearchOutlined,
} from '@ant-design/icons';

const Blogs = ({userInfo, httpLoading, setHttpLoading}) => {
  const blogList = ['', '', '', '', '', ''];
  useEffect(() => {
  }, []);
  return (
    <div className="paddingB16 blog">
      <div className="padding32">
        <Spin spinning={false}>
          <Row gutter={40}>
            <Col span={24}>
              <h1 style={{textAlign: 'center'}}>News & Updates</h1>
              <h4 className="marginB32" style={{textAlign: 'center'}}>
              Read important updates, feature usage tips and industry news here.
              </h4>
              <div className="blog-search-box marginB32">
                <Input placeholder="input search text" style={{width: 464}} prefix={<SearchOutlined />} />
              </div>
              <div className="blog-list-box">
                {blogList.map((item, index)=>(
                  <div className="blog-item" key={index}>
                    <div className="blog-box-image">
                    </div>
                    <div className="blog-text-box">
                      <div className="blog-text">1111</div>
                      <div className="blog-text">2222</div>
                    </div>
                    <div className="blog-btn-box">
                      <span className="more-link">Read More</span>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
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

Blogs.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Blogs);
