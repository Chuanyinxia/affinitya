import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
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
} from 'antd';
import {
  SearchOutlined,
  TagOutlined,
} from '@ant-design/icons';

const Blogs = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [blogList, setblogList] = useState([]);
  const [total, settotal] = useState(0);
  const [current, setcurrent] = useState(1);
  const [keyword, setkeyword] = useState('');
  const getBlogList = (pageSize, PageNum, keyword) => {
    post(GETBLOGLIST, {
      pageSize: pageSize,
      PageNum: PageNum,
      keyword: keyword,
    }, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
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
    <div className="paddingB16 blog">
      <div className="padding32" style={{minWidth: 768}}>
        <Spin spinning={false}>
          <Row gutter={40} justify="center">
            <Col span={24}>
              <h1 style={{textAlign: 'center'}}>News & Updates</h1>
              <h4 className="marginB32" style={{textAlign: 'center'}}>
              Read important updates, feature usage tips and industry news here.
              </h4>
              <div className="blog-search-box marginB32">
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
                  <div className="blog-item" key={index}>
                    <div className="blog-image-box">
                      <img src={item.img} alt="none" />
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
                      <span className="more-link" onClick={()=>{
                        history.push('/blogs/detail/'+item.id);
                      }}>Read More</span>
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
