import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, setMenusData} from '@/store/actions';
import {Button, Card, Col, Divider, Form, Input, InputNumber, message, Row, Select, Spin, Tabs, Popconfirm} from 'antd';
import './style.css';
import {Link} from 'react-router-dom';
import {Countrys} from '@/components/plugin/Country';
import {GETAUDIENCEID, GETJOBDETAIL, ISPAID, SEARCHAUID, SEARCHKW} from '@/api/index';
import {get, post} from '@/utils/request';
import KeyWordSearchDetails from '@/components/Table/KeyWordSearchDetails';
import {PlusOutlined} from '@ant-design/icons';
import moment from 'moment';
import store from '@/store';
import {useHistory} from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import {search, type} from '@/components/plugin/Searchdata';
import PDF from '@/assets/Guide to get App ID, Token(1).pdf';
import ResultTableBlur from '@/components/Table/ResultTableBlur';

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};


const AudienceGenerator = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [baseSearchForm] = Form.useForm();
  const [audienceIdSearchForm]= Form.useForm();
  const [keywordsForm] =Form.useForm();
  const [searchDataKW, setSearchDataKW] = useState([]);
  const [searchDataLA, setSearchDataLA] = useState([]);
  const [freeSearchData, setFreeSearchData] =useState([]);
  const [saveNameKW, setSaveNameKW]=useState('');
  const [saveNameLA, setSaveNameLA]=useState('');
  const [audienceID, setAudienceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [audienceIdItem, setAudienceIdItem] = useState([]);
  const [activeKey, setActiveKey]=useState(type()?type():1);
  const [showJobInfoKW, setShowJobInfoKW]=useState(false);
  const [showJobInfoLA, setShowJobInfoLA]=useState(false);
  const [isPayUser, setIsPayUser] =useState(false);

  // const [keyWords, setKeyWords]=useState(null);
  const addItem = () => {
    if (audienceID) {
      audienceIdItem.push({audienceId: audienceID});
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
    setShowJobInfoLA(true);
    setSearchDataLA([]);
    post(SEARCHAUID, data, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      setSearchDataLA(res.data);
      setShowJobInfoLA(false);
      setSaveNameLA(values.audienceId+moment().format('YYYYMMDDhhmmss'));
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
    setShowJobInfoKW(true);
    setSearchDataKW([]);
    setFreeSearchData([]);
    let isPay;
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
      isPay=res.data===2;
    }).catch((error)=>{
      console.log(error);
    }).finally(()=>{
      post(SEARCHKW, data, {
        // eslint-disable-next-line no-tabs
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then((res) => {
        if (isPay) {
          setSearchDataKW(res.data);
        } else {
          setFreeSearchData(res.data[0].searchDetails);
        }
        setSaveNameKW(values.keyWord[0]+moment().format('YYYYMMDDhhmmss'));
        if (res.data) {
          setShowJobInfoKW(false);
        }
      }).catch((error) => {
        if (isPay) {
          setSearchDataKW([]);
        } else {
          setFreeSearchData([]);
        }
      });
    });
  };

  const getJobdetails = (id) => {
    setLoading(true);
    let isPay;
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
      isPay = (res.data===2);
    }).catch((error)=>{
      console.log(error);
    }).finally(()=>{
      get(GETJOBDETAIL + id, userInfo.token).then((res) => {
        const baseData=res.data.baseSearchRequest;
        const AIDData= res.data.audienceIdSearchRequest;
        if (parseInt(activeKey)===1) {
          keywordsForm.setFieldsValue({
            keyWord: res.data.keywords,
          });
          if (isPay) {
            setSearchDataKW(res.data.kwResultVoList);
            setSaveNameKW(res.data.keywords[0]+moment().format('YYYYMMDDHHmmss'));
          } else {
            setFreeSearchData(res.data.kwResultVoList[0].searchDetails||[]);
          }
        } else {
          setSearchDataLA(res.data.kwResultVoList || []);
          setSaveNameLA(res.data.audienceIdSearchRequest.audienceId+moment().format('YYYYMMDDHHmmss'));
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
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(() => {
        setLoading(false);
      });
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

  const JobType=isPayUser?activeKey:0;

  const onLKSearchChange=(changedValues, allValues)=>{
    console.log(changedValues, allValues);
    const adAccountId=allValues.adAccountId;
    const accessToken=allValues.accessToken;
    const myAppId=allValues.myAppId;
    const myAppSecret = allValues.myAppSecret;
    if (Object.keys(changedValues)!=='audienceId'&&
      adAccountId&&
      myAppSecret&&
      myAppId&&
      myAppSecret
    ) {
      const data={
        adAccountId: adAccountId,
        accessToken: accessToken,
        myAppId: myAppId,
        myAppSecret: myAppSecret,
      };
      console.log(data);
      post(GETAUDIENCEID, data, {
        'token': userInfo.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((res) => {
        setAudienceIdItem(res.data);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      });
    }
  };

  useEffect(() => {
    const data=search();
    if (data) {
      getJobdetails(data.id);
    } else {
      isPay();
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
                <Form.Item name="minAge" noStyle initialValue={13}>
                  <InputNumber
                    min={13}
                    max={65}
                    decimalSeparator={0}
                  />
                </Form.Item>
                <span className="text-center width50">
                  —
                </span>
                <Form.Item name="maxAge" noStyle initialValue={65}>
                  <InputNumber
                    min={13}
                    max={65}
                    decimalSeparator={0}
                  />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="os" label="User OS" labelAlign="right" initialValue={['na']}>
                <Select >
                  <Select.Option value="na">All</Select.Option>
                  <Select.Option value="iOS">iOS</Select.Option>
                  <Select.Option value="Android">Android</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="language" label="Language" labelAlign="right" initialValue={['en_US']}>
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
        <Tabs type="card" defaultActiveKey={activeKey} onChange={(key)=> {
          setActiveKey(key);
        }}>
          <Tabs.TabPane tab="Keyword Search" key="1">
            {!isPayUser&&(
              <h1 className="search-title">
                Access to 40 keywords is free. Need access to all 300 of your custom keyword audience?
                <Link to="/plansAndPrices" className="target" onClick={() => {
                  store.dispatch(setMenusData('plansAndPrices', 'dashboard'));
                }}> Upgrade now!</Link>
              </h1>)}

            <Form onFinish={onSearch} name="search" layout="horizontal" form={keywordsForm}>
              <Form.Item
                name="keyWord"
                rules={[{required: true, message: 'Please input keyword!'}]}
                // initialValue={keyWords}
              >
                <Select
                  placeholder="One word only for free user, premium users are able add up to 10 keywords in one search."
                  className="width60P"
                  mode="tags"
                  size="large"
                  open={false}
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
              {!isPayUser&&(<Link to="/plansAndPrices" className="target" onClick={() => {
                store.dispatch(setMenusData('plansAndPrices', 'dashboard'));
              }}> Upgrade now!</Link>)}
            </h1>
            <Form onFinish={LookalikeSearch} form={audienceIdSearchForm} onValuesChange={onLKSearchChange}>
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
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a href={PDF} target="_blank">
                    How to retrieve your token?
                  </a>
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
                  <Popconfirm
                    placement="topLeft"
                    title="Pls upgrade to use this function."
                    onConfirm={()=>{
                      store.dispatch(setMenusData('plansAndPrices', 'dashboard'));
                      history.push('/plansAndPrices');
                    }}
                    okText="Upgrade"
                    cancelText="Cancel">
                    <Button type="primary" size="large" >
                      Generate Audience
                    </Button>
                  </Popconfirm>
                  )}
              </Form.Item>
            </Form>
            <p className="search-info">
              By clicking &quot;Genereate Audience&quot; button, Affinity Analayst extends high correlation audiences
              from your custom audiences, organized in high relation groups for optimal audience sets and ranked per
              affinity data.
            </p>
          </Tabs.TabPane>
        </Tabs>
      </div>
      {parseInt(activeKey)===1&&(<div className={showJobInfoKW?'show':'hide'}>
        <p className="marginT30 search-content">
          Audience generation job has been created in
          <Link
            to={`/dashboard/jobManager?type=${JobType}`}
            className="target"
            onClick={() => {
              store.dispatch(setMenusData('jobManager', 'dashboard'));
            }
            }>Job Manager</Link>. You will receive &quot;notification&quot; once job completed.
        </p>
      </div>)}
      {parseInt(activeKey)===2&&(<div className={showJobInfoLA?'show':'hide'}>
        <p className="marginT30 search-content">
          Audience generation job has been created in
          <Link
            to={`/dashboard/jobManager?type=${JobType}`}
            className="target"
            onClick={() => {
              store.dispatch(setMenusData('jobManager', 'dashboard'));
            }
            }>Job Manager</Link>. You will receive &ldquo;notification&ldquo; once job completed.
        </p>
      </div>)}
      {(isPayUser && !showJobInfoKW && parseInt(activeKey)===1)&&(
        <KeyWordSearchDetails saveName={saveNameKW} searchData={searchDataKW}/>)}
      {(!showJobInfoLA && parseInt(activeKey)===2)&& (
        <KeyWordSearchDetails saveName={saveNameLA} searchData={searchDataLA}/>)}
      {(!isPayUser &&!showJobInfoKW && parseInt(activeKey)===1)&& <ResultTableBlur TableData={freeSearchData}/>}
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
