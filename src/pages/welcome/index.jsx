import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {httpLoading, setFirst} from '@/store/actions';
import store from '../../store';
import {setMenusData} from '@/store/actions';
import './style.css';
import icon from '@/assets/default.png';
import {
  GETAUDIENCELIST,
  GETBLOGLIST,
  GETJOBLIST,
  GETTIPSLIST,
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
  Tooltip,
  Modal,
} from 'antd';
import {
  ArrowRightOutlined,
  TagOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const WelcomPage = ({userInfo, httpLoading, setHttpLoading, isFirst}) => {
  const history = useHistory();
  const [audienceWords, setAudienceWords]=useState([]);
  const [blogList, setblogList] = useState([]);
  const [jobList, setjobList] = useState({
    complete: [],
    failed: [],
    waiting: [],
  });
  const [firstModalVisible, setfirstModalVisible] = useState(isFirst);
  const [firstIndex, setfirstIndex] = useState(1);
  const [tipsList, settipsList] = useState([]);
  const getTipsList = () => {
    post(GETTIPSLIST, {
      pageSize: 999,
      PageNum: 1,
      type: 1,
    }, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      settipsList(res.data.items);
    }).catch((error) => {
      console.log(error);
    });
  };
  const getAudienceList = () => {
    get(GETAUDIENCELIST).then((res) => {
      setAudienceWords(res.data);
    }).catch((error) => {
      console.log(error);
    });
  };
  const goToNext = (index)=>{
    setfirstIndex(index+1);
  };
  const getBobList = () => {
    get(GETJOBLIST, userInfo.token).then((res) => {
      setjobList({
        complete: res.data.complete.slice(0, 3),
        failed: res.data.failed.slice(0, 3),
        waiting: res.data.waiting.slice(0, 3),
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
    history.push('/dashboard/audienceGenerator?keyword='+word);
    store.dispatch(setMenusData('audienceGenerator', 'audienceGenerator'));
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
    getTipsList();
  }, []);
  return (
    <div className="paddingB16">
      <div className="padding32 welcom-page">
        <Modal
          title={null}
          visible={firstModalVisible}
          footer={null}
          width={944}
          className="first-modal"
          onCancel={()=>setfirstModalVisible(false)}
          afterClose={()=>store.dispatch(setFirst(false))}
        >
          <div>
            <Row>
              <Col span={12}>
                <div className="first-left-box">
                  <div className="first-left-step-box">
                    <div className={firstIndex===1?'step-dot active':'step-dot'} onClick={()=>setfirstIndex(1)}></div>
                    <div className={firstIndex===2?'step-dot active':'step-dot'} onClick={()=>setfirstIndex(2)}></div>
                    <div className={firstIndex===3?'step-dot active':'step-dot'} onClick={()=>setfirstIndex(3)}></div>
                    <div className={firstIndex===4?'step-dot active':'step-dot'} onClick={()=>setfirstIndex(4)}></div>
                  </div>
                  <div className="first-left-title">
                    {firstIndex===1&&<h2>Welcome to <br/> Affinity Analysis</h2>}
                    {firstIndex===2&&<h2>Your Game, <br/>Your Audience</h2>}
                    {firstIndex===3&&<h2>View, Customize <br/> & Track</h2>}
                    {firstIndex===4&&<h2>Manage & Extend <br/> Audiences</h2>}
                  </div>
                  <div className="first-left-content">
                    {firstIndex===1&&<div>
                      <p>Begin your audience discovery success here.</p>
                      <br />
                      <p>Discover, customize, and manage your audiences now.</p>
                    </div>}
                    {firstIndex===2&&<div>
                      <p>Start with our AI powered Audience Generator - build on successful audience parameters
                         and keywords or try totally new. </p>
                    </div>}
                    {firstIndex===3&&<div>
                      <p>Once audiences are generated, view them in the Job Manager,
                        where you can view the progress of the keyword jobs,
                        customize the resulting keywords and save the results to the Audience Manager.</p>
                    </div>}
                    {firstIndex===4&&<div>
                      <p>Manage and edit all your saved audiences in the Audience Manager.
                        Expand the number of correlated keywords via our Extend feature,
                        driving further keyword possibilities and success.</p>
                    </div>}
                  </div>
                  <div className="first-left-button-group">
                    {firstIndex<4&&<Button type="default" size="large" onClick={()=>goToNext(firstIndex)}>Next</Button>}
                    <Button
                      type={firstIndex===4?'primary':'link'}
                      size="large"
                      onClick={()=>setfirstModalVisible(false)}
                    >
                      {firstIndex===4?'Start Now':'Skip'}
                    </Button>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="first-right-box">
                  {firstIndex===1&&<div className="first-img first-1"></div>}
                  {firstIndex===2&&<div className="first-img first-2"></div>}
                  {firstIndex===3&&<div className="first-img first-3"></div>}
                  {firstIndex===4&&<div className="first-img first-4"></div>}
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
        <Spin spinning={false}>
          <Row gutter={40}>
            <Col xl={17} lg={24} xs={24} sm={24}>
              <h1 className="welcome-user">Welcome back, {userInfo.nickName}!</h1>
              <h4 className="marginB32">
              Keep up to date with News & Updates, to make most of your audience discovery.
              </h4>
              <h3 className="marginB32">
                <span style={{fontWeight: 600}}>Jobs Overview</span>
                <span className="more-link" onClick={()=>{
                  history.push('/dashboard/audienceGenerator');
                  store.dispatch(setMenusData('audienceGenerator', 'audienceGenerator'));
                }}>Start Audience Generation <ArrowRightOutlined /></span>
              </h3>
              <Row>
                <Col span={7}>
                  <div className="overview-box">
                    <div className="overview-title-box">
                      <div className="overview-title-dot completed"></div>
                      <div className="overview-title-text">Completed</div>
                    </div>
                    <div className="job-list-box">
                      {jobList.complete.map((item)=>(
                        <a className="job-item" key={item.id}
                          onClick={()=>{
                            history.push('/dashboard/jobManager?keyword='+item.title+'&id='+item.id);
                            store.dispatch(setMenusData('jobManager', 'dashboard'));
                          }}
                        >{item.title}</a>
                      ))}
                    </div>
                    <div className="job-view-btn-box">
                      <Button type="primary" ghost onClick={()=>{
                        history.push('/dashboard/jobManager');
                        store.dispatch(setMenusData('jobManager', 'dashboard'));
                      }}>View</Button>
                    </div>
                  </div>
                </Col>
                <Col span={7} offset={1}>
                  <div className="overview-box">
                    <div className="overview-title-box">
                      <div className="overview-title-dot failed"></div>
                      <div className="overview-title-text">Failed</div>
                    </div>
                    <div className="job-list-box">
                      {jobList.failed.map((item)=>(
                        <a className="job-item" key={item.id}
                          onClick={()=>{
                            history.push('/dashboard/jobManager?keyword='+item.title+'&id='+item.id);
                            store.dispatch(setMenusData('jobManager', 'dashboard'));
                          }}
                        >{item.title}</a>
                      ))}
                    </div>
                    <div className="job-view-btn-box">
                      <Button type="primary" ghost onClick={()=>{
                        history.push('/dashboard/jobManager');
                        store.dispatch(setMenusData('jobManager', 'dashboard'));
                      }}>View</Button>
                    </div>
                  </div>
                </Col>
                <Col span={7} offset={1}>
                  <div className="overview-box">
                    <div className="overview-title-box">
                      <div className="overview-title-dot waiting"></div>
                      <div className="overview-title-text">Waiting</div>
                    </div>
                    <div className="job-list-box">
                      {jobList.waiting.map((item)=>(
                        <a className="job-item" key={item.id}
                          onClick={()=>{
                            history.push('/dashboard/jobManager?keyword='+item.title+'&id='+item.id);
                            store.dispatch(setMenusData('jobManager', 'dashboard'));
                          }}
                        >{item.title}</a>
                      ))}
                    </div>
                    <div className="job-view-btn-box">
                      <Button type="primary" ghost onClick={()=>{
                        history.push('/dashboard/jobManager');
                        store.dispatch(setMenusData('jobManager', 'dashboard'));
                      }}>View</Button>
                    </div>
                  </div>
                </Col>
              </Row>
              {blogList.length!==0?
                <>
                  <h3 className="marginT32 marginB32">
                    <div onClick={(e)=>{
                      e.preventDefault();
                      history.push('/blogs');
                    }}>
                      <span style={{fontWeight: 600}}>News and Updates</span>
                      <span className="more-link">Explore More <ArrowRightOutlined /></span>
                    </div>
                  </h3>
                  <Row>
                    {blogList.map((item, index)=>(
                      <Col span={7} offset={index!==0?1:0} key={item.id}>
                        <div className="overview-box image" onClick={()=>{
                          history.push('/blogs/detail/'+item.id);
                        }}>
                          <div className="overview-image-box">
                            <img src={item.img}
                              onError={(e)=>{
                                e.target.onerror=null;
                                e.target.src=icon;
                              }}/>
                          </div>
                          <div className="job-list-box image">
                            <div className="job-item title">{item.title}</div>
                            {item.tags&&<div className="job-item tag">
                              <TagOutlined style={{paddingRight: 8}}/>
                              {item.tags}
                            </div>}
                          </div>
                          <div className="job-view-btn-box image">
                            <span className="more-link">Read More</span>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>:null
              }
            </Col>
            <Col xl={6} md={24} xs={24} sm={24} className="tip-box">
              {audienceWords.length!==0?<>
                <h3 style={{fontWeight: 600}}>TRENDING AUDIENCE&nbsp;
                  <Tooltip
                    arrowPointAtCenter
                    placement="left"
                    title={<span>
                Trending audiences are audiences our engine identifies<br/>
                that are of significant correlation to the category.</span>}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </h3>
                <Space wrap>
                  {audienceWords.map((item) => (
                    <a key={item.id} type="link" onClick={()=>addKeywords(item.name)}>{item.name}</a>
                  ))}
                </Space>
              </>:null}
              {(tipsList.length===0||audienceWords.length===0)?null:<Divider/>}
              {tipsList.length!==0?
              <>
                <h3 style={{fontWeight: 600}}>DO YOU KNOW?</h3>
                {tipsList.map((item)=>(
                  <>
                    {item.link?
                  <a key={item.id} className="tip-text" onClick={()=>{
                    if (item.link.includes('http')) window.location.replace(item.link);
                    else window.location.replace('https://'+item.link);
                  }}>{item.content}</a>:
                  <p key={item.id} className="tip-text">{item.content}</p>}
                  </>
                ))}
              </>:null}
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
    isFirst: state.checkFirst.isFirst,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),
  };
};

WelcomPage.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WelcomPage);
