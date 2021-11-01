import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {
  GETBLOG,
} from '@/api/index';
import {
  get,
} from '@/utils/request';
import {
  Spin,
  Row,
  Col,
  BackTop,
  Button,
  Layout,
} from 'antd';
import {
  ArrowLeftOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';
const {Content} = Layout;

const UnsignBlogDtail = ({userInfo, httpLoading, setHttpLoading, location}) => {
  const history = useHistory();
  const [blog, setblog] = useState({});
  const getBlog = (id) => {
    get(GETBLOG + id, userInfo.token).then((res)=>{
      setblog(res.data);
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  useEffect(() => {
    getBlog(location.pathname.split('/')[3]);
  }, []);
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content>
        <Row justify="center">
          <Col xl={18} sm={24}>
            <div className="paddingB16" style={{paddingTop: 72}}>
              <div className="padding32">
                <Spin spinning={false}>
                  <Row gutter={40}>
                    <Col span={24}>
                      <div className="back-link paddingB32" onClick={()=>{
                        history.push('/ublogs');
                      }}><ArrowLeftOutlined style={{paddingRight: 12}}/>Back to News & Updates</div>
                      <h1 style={{textAlign: 'center'}}>{blog.title}</h1>
                      <h4 className="marginB32" style={{textAlign: 'center'}}>
                        {blog.readTime}
                      </h4>
                      <div dangerouslySetInnerHTML={{__html: blog.content}}
                        style={{textAlign: 'center', marginTop: 32}}>
                      </div>
                      <BackTop visibilityHeight={100}>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<VerticalAlignTopOutlined />}
                        />
                      </BackTop>
                    </Col>
                  </Row>
                </Spin>
              </div>
            </div>
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

UnsignBlogDtail.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UnsignBlogDtail);
