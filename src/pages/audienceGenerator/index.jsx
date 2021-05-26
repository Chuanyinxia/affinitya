import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, setMenusData} from '@/store/actions';
import {Button, Card, Col, Divider, Form, Input, InputNumber, message, Row, Select, Spin, Tabs} from 'antd';
import './style.css';
import {Link} from 'react-router-dom';
import {Countrys} from '@/components/plugin/Country';
import {GETJOBDETAIL, SEARCHAUID, SEARCHKW, ISPAID} from '@/api/index';
import {get, post} from '@/utils/request';
import KeyWordSearchDetails from '@/components/Table/KeyWordSearchDetails';
import {PlusOutlined} from '@ant-design/icons';
import store from '@/store';
// eslint-disable-next-line no-unused-vars
import {search, type} from '@/components/plugin/Searchdata';
import ResultTable from '@/components/Table/ResultTable';
const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

const AudienceGenerator = ({userInfo, httpLoading, setHttpLoading}) => {
  const [baseSearchForm] = Form.useForm();
  const [audienceIdSearchForm]= Form.useForm();
  const [keywordsForm] =Form.useForm();
  const [searchData, setSearchData] = useState(null);
  const [audienceID, setAudienceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [audienceIdItem, setAudienceIdItem] = useState([]);
  const [activeKey, setActiveKey]=useState(type??1);
  const [showJobInfo, setShowJobInfo]=useState(false);
  const [isPayUser, setIsPayUser] =useState(false);
  const [freeSearchData, setFreeSearchData] =useState(null);
  const addItem = () => {
    if (audienceID) {
      audienceIdItem.push({audienceId: audienceID});
      console.log(audienceIdItem);
      setAudienceIdItem(audienceIdItem);
      setAudienceID(null);
    }
  };

  const LookalikeSearch = (values) => {
    const search = baseSearchForm.getFieldsValue();
    const data = {
      age: [search.minAge, search.maxAge].join(','),
      os: search.os.toString(),
      language: search.language,
      gender: search.gender,
      platform: search.platform.trim(),
      country: search.country.toString(),
      adAccountId: values.adAccountId,
      accessToken: values.accessToken.trim(),
      myAppId: values.myAppId.trim(),
      myAppSecret: values.myAppSecret.trim(),
      audienceId: values.audienceId,
    };
    console.log(data);
    post(SEARCHAUID, data, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      setSearchData(res.data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };


  const onSearch = (values) => {
    const search = baseSearchForm.getFieldsValue();
    const data = {
      age: [search.minAge, search.maxAge].join(','),
      os: search.os.toString(),
      language: search.language,
      gender: search.gender,
      platform: search.platform.trim(),
      keyWord: values.keyWord,
      country: search.country.toString(),
    };
    setShowJobInfo(true);
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
    }).catch((error)=>{
      console.log(error);
    }).finally(()=>{
      post(SEARCHKW, data, {
        // eslint-disable-next-line no-tabs
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then((res) => {
        if (isPayUser) {
          setSearchData(res.data);
        } else {
          setFreeSearchData(res.data);
        }
        if (!res.data) {
          setShowJobInfo(false);
        }
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      });
    });
  };

  const getJobdetails = (id) => {
    setLoading(true);
    get(GETJOBDETAIL + id, userInfo.token).then((res) => {
      console.log(res);
      const baseData=res.data.baseSearchRequest;
      const AIDData= res.data.audienceIdSearchRequest;
      if (activeKey===1) {
        keywordsForm.setFieldsValue({
          keywords: res.data.keywords,
        });
      } else {
        audienceIdSearchForm.setFieldsValue({
          ...AIDData,
        });
      }
      baseSearchForm.setFieldsValue({
        ...baseData,
        country: baseData.country.split(','),
        minAge: baseData.age.split(',')[0],
        maxAge: baseData.age.split(',')[1],
      });
      setSearchData(res.data.kwResultVoList);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };

  useEffect(() => {
    isPay();
    const data=search();
    if (data) {
      getJobdetails(data.id);
    }
  },
  []);
  return (
    <Spin spinning={loading}>
      <Card className="SearchBox" hoverable>
        <Form form={baseSearchForm} className="SearchItem" {...layout}>
          <Row gutter={[30, 0]}>
            <Col span={8}>
              <Form.Item name="country" labelAlign="right" label="Country" initialValue={['US']}>
                <Select
                  mode="multiple"
                  maxTagCount={1}
                  maxTagTextLength={30}
                >
                  {Countrys.map((item) => (
                    <Select.Option key={item.country_code} value={item.country_code}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gender" labelAlign="right" label="Gender" initialValue="1,2">
                <Select>
                  <Select.Option value="1,2">All</Select.Option>
                  <Select.Option value="1">Male</Select.Option>
                  <Select.Option value="2">Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="platform" labelAlign="right" label="Device Platform" initialValue={'mobile'}>
                <Select>
                  <Select.Option value="mobile">Mobile</Select.Option>
                  <Select.Option value="desktop">Desktop</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="age" labelAlign="right" label="Age" initialValue="1,2">
                <Form.Item name="minAge" noStyle initialValue={18}>
                  <InputNumber
                    min={0}
                    max={120}
                    decimalSeparator={0}
                  />
                </Form.Item>
                <span className="text-center width50">
                  —
                </span>
                <Form.Item name="maxAge" noStyle initialValue={28}>
                  <InputNumber
                    min={0}
                    max={120}
                    decimalSeparator={0}
                  />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="os" label="User OS" labelAlign="right" initialValue={['na']}>
                <Select mode="multiple">
                  <Select.Option value="na">All</Select.Option>
                  <Select.Option value="iOS">iOS</Select.Option>
                  <Select.Option value="Android">Android</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="language" label="Language" labelAlign="right">
                <Select>
                  <Select.Option value="en_US">en_US</Select.Option>
                  <Select.Option value="zh_CN">zh_CN</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{display: 'none'}}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div className="card-container marginT16">
        <Tabs type="card" defaultActiveKey={activeKey} onChange={(key)=>setActiveKey(key)}>
          <Tabs.TabPane tab="Keyword Search" key="1">
            <h1 className="search-title">
              Access to 40 keywords is free. Need access to all 300 of your custom keyword audience?
              {!isPayUser&&(<Link to="/upgrade" className="target" onClick={() => {
                store.dispatch(setMenusData('plans', 'dashboard'));
              }}> Upgrade now!</Link>)}
            </h1>
            <Form onFinish={onSearch} name="search" layout="horizontal" form={keywordsForm}>
              <Form.Item
                name="keyWord"
                initialValue={['Games12', 'book23']}
                rules={[{required: true, message: 'Please input keyword!'}]}
              >
                <Select
                  placeholder="Keyword"
                  className="width60P"
                  mode="tags"
                  size="large"
                  tokenSeparators={[',']}/>
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="large" htmlType="submit">
                  Generate Audience
                </Button>
              </Form.Item>
            </Form>
            <p className="search-info">
              By clicking &ldquo;Genereate Audience&ldquo; button,
              Affinity Analayst extends high correlation audiences
              from your custom audiences, organized in high relation groups for optimal audience sets and ranked per
              affinity data.
            </p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Lookalike Audience Search" key="2">
            <h1 className="search-title">
              Generate 300 affinity based keyword audiences from your custom audiences.
              {!isPayUser&&(<Link to="/plans" className="target" onClick={() => {
                store.dispatch(setMenusData('plans', 'dashboard'));
              }}> Upgrade now!</Link>)}
            </h1>
            <Form onFinish={LookalikeSearch} form={audienceIdSearchForm}>
              <Form.Item name="myAppId" rules={[{required: true, message: 'Please input APP ID!'}]}>
                <Input placeholder="APP ID" maxLength={100} className="width50P"/>
              </Form.Item>
              <Form.Item name="myAppSecret" rules={[{required: true, message: 'Please input APP secret!'}]}>
                <Input placeholder="APP Secret" maxLength={100} className="width50P"/>
              </Form.Item>
              <Row>
                <Col span={10} noStyle>
                  <Form.Item name="accessToken" rules={[{required: true, message: 'Please input access token!'}]}>
                    <Input placeholder="Access Token" maxLength={255} className="width50P"/>
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <a>How to retrive your token?</a>
                </Col>
              </Row>

              <Form.Item
                name="adAccountId"
                rules={[{required: true, message: 'Please input Facebook Ad account!'}]}>
                <Input placeholder="Facebook Ad Account" maxLength={100} className="width50P"/>
              </Form.Item>
              <Form.Item name="audienceId" rules={[{required: true, message: 'Please input custom audience ID!'}]}>
                <Select
                  style={{width: '40%'}}
                  placeholder="Custom Audience ID"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{margin: '4px 0'}}/>
                      <div style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
                        <Input
                          style={{flex: 'auto'}}
                          value={audienceID}
                          onChange={(e) => setAudienceID(e.target.value)}
                          maxLength={255}/>
                        <a
                          style={{flex: 'none', padding: '8px', display: 'block', cursor: 'pointer'}}
                          onClick={addItem}
                        >
                          <PlusOutlined/> Add item
                        </a>
                      </div>
                    </div>
                  )}
                >
                  {audienceIdItem.map((item) => (
                    <Select.Option key={item.audienceId}>{item.audienceId}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                {isPayUser? (<Button type="primary" size="large" htmlType="submit">
                  Generate Audience
                </Button>):(
                    <Button type="primary" size="large" >
                      <Link to={'/plans'}
                        className="target"
                        onClick={() => {
                          store.dispatch(setMenusData('plans', 'dashboard'));
                        }}>
                      Generate Audience
                      </Link>
                    </Button>
                  )}
              </Form.Item>
            </Form>
            <p className="search-info">
              By clicking &ldquo;Genereate Audience&ldquo; button, Affinity Analayst extends high correlation audiences
              from your custom audiences, organized in high relation groups for optimal audience sets and ranked per
              affinity data.
            </p>
          </Tabs.TabPane>
        </Tabs>
        <div className={showJobInfo?'show':'hide'}>
          <p className="marginTop90 search-content">
            Audience generation job has been created in
            <Link
              to={`/dashboard/jobManager?type=${activeKey}`}
              className="target"
              onClick={() => {
                store.dispatch(setMenusData('jobManager', 'dashboard'));
              }
              }>Job Manager</Link>.
          </p>
          <p className="search-content">You will receive &ldquo;notification&ldquo; once job completed.</p>
        </div>
      </div>
      {searchData && <KeyWordSearchDetails searchData={searchData}/>}
      {freeSearchData&& <ResultTable TableData={freeSearchData}/>}
    </Spin>
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

AudienceGenerator.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AudienceGenerator);
