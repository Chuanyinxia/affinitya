import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {
  GETAUDIENCELIST,
  GETBLOGLIST,
  GETJOBLIST,
} from '@/api/index';
import {
  get,
  post,
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
  TagOutlined,
} from '@ant-design/icons';

const Welcome = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [audienceWords, setAudienceWords]=useState([]);
  const [blogList, setblogList] = useState([]);
  const [jobList, setjobList] = useState({
    complete: [],
    failed: [],
    waiting: [],
  });
  const getAudienceList = () => {
    get(GETAUDIENCELIST).then((res) => {
      setAudienceWords(res.data);
    }).catch((error) => {
      console.log(error);
    });
  };
  const getBobList = () => {
    get(GETJOBLIST, userInfo.token).then((res) => {
      setjobList({
        complete: res.data.complete.slice(0, 4),
        failed: res.data.failed.slice(0, 4),
        waiting: res.data.waiting.slice(0, 4),
      });
    }).catch((error) => {
      console.log(error);
    });
  };
  const getBlogLIst = () => {
    post(GETBLOGLIST, {
      pageSize: 3,
      PageNum: 1,
    }, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      setblogList(res.data.items);
    }).finally(()=>{
      setHttpLoading(false);
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
    getBlogLIst();
    getBobList();
  }, []);
  return (
    <div className="paddingB16">
      <div className="padding32">
        <Spin spinning={false}>
          <Row gutter={40}>
            <Col xl={17} md={17} xs={24} sm={24}>
              <h1 className="welcome-user">Welcome back, {userInfo.nickName}!</h1>
              <h4 className="marginB32">
              Keep up to date with News & Updates, to make most of your audience discovery.
              </h4>
              <h3 className="marginB32">
              Jobs Overview <span className="more-link" onClick={()=>{
                  history.push('/dashboard/audienceGenerator');
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
                      {jobList.complete.map((item)=>(
                        <div className="job-item" key={item.id}>{item.title}</div>
                      ))}
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
                      {jobList.failed.map((item)=>(
                        <div className="job-item" key={item.id}>{item.title}</div>
                      ))}
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
                      {jobList.waiting.map((item)=>(
                        <div className="job-item" key={item.id}>{item.title}</div>
                      ))}
                    </div>
                    <div className="job-view-btn-box">
                      <Button type="primary" ghost>View</Button>
                    </div>
                  </div>
                </Col>
              </Row>
              <h3 className="marginT32 marginB32" onClick={(e)=>{
                e.preventDefault();
                history.push('/blogs');
              }}>
              Blogs <span className="more-link">Explore More <ArrowRightOutlined /></span>
              </h3>
              <Row>
                {blogList.map((item)=>(
                  <Col span={8} key={item.id}>
                    <div className="overview-box image">
                      <div className="overview-image-box">
                        <img src={item.img} alt="none" />
                      </div>
                      <div className="job-list-box image">
                        <div className="job-item title">{item.title}</div>
                        <div className="job-item tag">
                          <TagOutlined style={{paddingRight: 8}}/>
                          {item.tags}
                        </div>
                      </div>
                      <div className="job-view-btn-box image">
                        <span className="more-link" onClick={()=>{
                          history.push('/blogs/detail/'+item.id);
                        }}>Read More</span>
                      </div>
                    </div>
                  </Col>
                ))}
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
