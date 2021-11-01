import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import icon from '@/assets/default.png';
import './style.css';
import {
  GETBLOGLIST,
} from '@/api/index';
import {
  post,
} from '@/utils/request';
import {
  Spin,
  Row,
  Col,
  Input,
  Pagination,
  Layout,
} from 'antd';
import {
  SearchOutlined,
  TagOutlined,
} from '@ant-design/icons';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';
const {Content} = Layout;

const UnsignBlogs = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [blogList, setblogList] = useState([]);
  const [total, settotal] = useState(0);
  const [current, setcurrent] = useState(1);
  const [keyword, setkeyword] = useState('');
  const getBlogList = (pageSize, PageNum, keyword) => {
    post(GETBLOGLIST, {
      pageSize: pageSize,
      PageNum: PageNum,
      keyword: keyword.trim(),
    }, {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'token': userInfo.token,
    }).then((res)=>{
      setblogList(res.data.items);
      settotal(res.data.pageSize * res.data.totalPage);
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  useEffect(() => {
    getBlogList(6, 1, '');
  }, []);
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content>
        <div style={{minHeight: 'calc(100vh - 100px)'}}>
          <Row justify="center">
            <Col xl={18} sm={24}>
              <div className="blog" style={{paddingTop: 148, paddingBottom: 30}}>
                <div style={{minWidth: 768}}>
                  <Spin spinning={false}>
                    <Row justify="center">
                      <Col span={24}>
                        <div style={{textAlign: 'center', fontSize: 24, fontWeight: 600}}>News & Updates</div>
                        <div style={{textAlign: 'center', fontSize: 14, color: '#6E7191', marginTop: 8}}>
                        Read important updates, feature usage tips and industry news here.</div>
                        <div className="blog-search-box marginB32" style={{marginTop: 24}}>
                          <Input
                            placeholder="input search text"
                            style={{width: 464}}
                            prefix={<SearchOutlined />}
                            allowClear
                            value={keyword}
                            onChange={(e)=>{
                              setkeyword(e.target.value);
                              if (e.target.value==='') getBlogList(6, 1, '');
                            }}
                            onPressEnter={(e)=>{
                              getBlogList(6, 1, e.target.value);
                            }}
                          />
                        </div>
                        <div className="blog-list-box">
                          {blogList.map((item, index)=>(
                            <div className="blog-item-box" key={index} onClick={()=>{
                              history.push('/unsignblogs/detail/'+item.id);
                            }}>
                              <div className="blog-item">
                                <div className="blog-image-box">
                                  <img src={item.img} onError={(e)=>{
                                    e.target.onerror=null;
                                    e.target.src=icon;
                                  }}/>
                                </div>
                                <div className="blog-text-box">
                                  <div className="job-item title">{item.title}</div>
                                  <div className="job-item tag">
                                    {item.tags&&<div className="job-item tag">
                                      <TagOutlined style={{paddingRight: 8}}/>
                                      {item.tags}
                                    </div>}
                                  </div>
                                </div>
                                <div className="blog-btn-box">
                                  <span className="more-link">Read More</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={40}>
                      <Col span={24} style={{textAlign: 'center'}}>
                        <Pagination
                          hideOnSinglePage
                          defaultCurrent={1}
                          pageSize={6}
                          total={total}
                          current={current}
                          onChange={(e)=>{
                            setcurrent(e);
                            getBlogList(6, e, keyword);
                          }}/>
                      </Col>
                    </Row>
                  </Spin>
                </div>
              </div>
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

UnsignBlogs.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UnsignBlogs);
