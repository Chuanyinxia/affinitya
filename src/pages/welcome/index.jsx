import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {
  GETAUDIENCELIST,
} from '@/api/index';
import {
  get,
} from '@/utils/request';
import {
  Spin,
  Row,
  Col,
  Space,
  Divider,
  Button,
} from 'antd';
import {
  ArrowRightOutlined,
} from '@ant-design/icons';

const Welcome = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [audienceWords, setAudienceWords]=useState([]);
  const getAudienceList = () => {
    get(GETAUDIENCELIST).then((res) => {
      setAudienceWords(res.data);
    }).catch((error) => {
      console.log(error);
    });
  };
  const addKeywords=(word)=>{
    // if (keyWordForm.getFieldValue().keyWord) {
    //   keyWordForm.setFieldsValue({
    //     keyWord: [...keyWordForm.getFieldValue().keyWord, word],
    //   });
    // } else {
    //   keyWordForm.setFieldsValue({
    //     keyWord: [word],
    //   });
    // }
    // console.log(keyWordForm.getFieldValue().keyWord);
  };
  useEffect(() => {
    getAudienceList();
  }, []);
  return (
    <div className="paddingB16">
      <div className="padding32">
        <Spin spinning={false}>
          <Row gutter={40}>
            <Col xl={17} md={17} xs={24} sm={24}>
              <h1>Welcome back, {userInfo.nickName}!</h1>
              <h4 className="marginB32">
              Keep up to date with News & Updates, to make most of your audience discovery.
              </h4>
              <h3 className="marginB32">
              Jobs Overview <span className="more-link" onClick={()=>{
                  history.push('/blogs');
                }}>Start Audience Generation <ArrowRightOutlined /></span>
              </h3>
              <Row>
                <Col span={8}>
                  <div className="overview-box">
                    <div className="overview-title-box">
                      <div className="overview-title-dot completed"></div>
                      <div className="overview-title-text">Completed</div>
                    </div>
                    <div className="job-list-box">
                      <div className="job-item">1</div>
                    </div>
                    <div className="job-view-btn-box">
                      <Button type="primary" ghost>View</Button>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="overview-box">
                    <div className="overview-title-box">
                      <div className="overview-title-dot failed"></div>
                      <div className="overview-title-text">Failed</div>
                    </div>
                    <div className="job-list-box">
                      <div className="job-item">1</div>
                    </div>
                    <div className="job-view-btn-box">
                      <Button type="primary" ghost>View</Button>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="overview-box">
                    <div className="overview-title-box">
                      <div className="overview-title-dot waiting"></div>
                      <div className="overview-title-text">Waiting</div>
                    </div>
                    <div className="job-list-box">
                      <div className="job-item">1</div>
                    </div>
                    <div className="job-view-btn-box">
                      <Button type="primary" ghost>View</Button>
                    </div>
                  </div>
                </Col>
              </Row>
              <h3 className="marginT32 marginB32">
              Blogs <span className="more-link">Explore More <ArrowRightOutlined /></span>
              </h3>
              <Row>
                <Col span={8}>
                  <div className="overview-box image">
                    <div className="overview-image-box">
                    </div>
                    <div className="job-list-box image">
                      <div className="job-item">1111</div>
                      <div className="job-item">2222</div>
                    </div>
                    <div className="job-view-btn-box image">
                      <span className="more-link">Read More</span>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="overview-box image">
                    <div className="overview-image-box">
                    </div>
                    <div className="job-list-box image">
                      <div className="job-item">1111</div>
                      <div className="job-item">2222</div>
                    </div>
                    <div className="job-view-btn-box image">
                      <span className="more-link">Read More</span>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="overview-box image">
                    <div className="overview-image-box">
                    </div>
                    <div className="job-list-box image">
                      <div className="job-item">1111</div>
                      <div className="job-item">2222</div>
                    </div>
                    <div className="job-view-btn-box image">
                      <span className="more-link">Read More</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xl={6} md={7} xs={24} sm={24}>
              <h3>Trending Audience</h3>
              <p className="marginB64">These words is using for SLG...</p>
              <Space wrap>
                {audienceWords.map((item) => (
                  <a key={item.id} type="link" onClick={()=>addKeywords(item.name)}>{item.name}</a>
                ))}
              </Space>
              <Divider/>
              <h3>Tips</h3>
              {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <a
                href={''}
                target="_blank">
              Full guide to retrieve token
              </a>
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

Welcome.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Welcome);
