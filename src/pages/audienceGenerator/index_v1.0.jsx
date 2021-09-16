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
  const [searchDataKW, setSearchDataKW] = useState(null);
  const [searchDataLA, setSearchDataLA] = useState(null);
  const [freeSearchData, setFreeSearchData] =useState(null);
  const [saveNameKW, setSaveNameKW]=useState('');
  const [saveNameLA, setSaveNameLA]=useState('');
  const [audienceID, setAudienceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [audienceIdItem, setAudienceIdItem] = useState([]);
  const [activeKey, setActiveKey]=useState(type()?type():1);
  const [isPayUser, setIsPayUser] =useState(false);
  const [saveStatus, setSaveStatus]= useState(null);

  const [showJobMangerTips, setShowJobManagerTips]=useState(false);
  const [showFreeSKData, setShowFreeSKData]=useState(false);
  const [showPaySKData, setShowPaySKData]=useState(false);
  const [showLAData, setShowLAData]=useState(false);

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
    // close all table show!
    setShowFreeSKData(false);
    setShowPaySKData(false);
    setShowJobManagerTips(false);
    setShowLAData(false);
    setLoading(true);
    post(SEARCHAUID, data, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      if (res.data.length>0) {
        // close job manager tips
        setShowJobManagerTips(false);
        // show LA data table
        setShowLAData(true);

        setSearchDataLA(res.data.kwResultVoList);
        setSaveStatus(res.data.status);
        // setShowJobInfoLA(false);
        setSaveNameLA(values.audienceId+moment().format('YYYYMMDDhhmmss'));
      } else {
        // show job manager tips,close LA data table
        setShowLAData(false);
        setShowJobManagerTips(true);
      }
    }).catch((error) => {
      // console.log(error);
      // message.error({
      //   content: error.toString(), key: 'netError', duration: 2,
      // });
    }).finally(()=>{
      setLoading(false);
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
      adAccountId: values.adAccountId,
      accessToken: values.accessToken.trim(),
      country: search.country.toString(),
    };
    // close all table show!
    setShowFreeSKData(false);
    setShowPaySKData(false);
    setShowJobManagerTips(false);
    setShowLAData(false);
    setLoading(true);
    let isPay;
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
      isPay=res.data===2;
    }).catch((error)=>{
      // console.log(error);
    }).finally(()=>{
      post(SEARCHKW, data, {
        // eslint-disable-next-line no-tabs
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then((res) => {
        if (res.data.kwResultVoList.length>0) {
          if (isPay) {
            setSearchDataKW(res.data.kwResultVoList??[]);
            setSaveStatus(res.data.status);
            setShowPaySKData(true);
            console.log(isPay);
          } else {
            setFreeSearchData(res.data.kwResultVoList[0].searchDetails??[]);
            setShowFreeSKData(true);

            console.log(isPay, freeSearchData, showFreeSKData);
          }
          console.log(isPay+'3');
          setSaveNameKW(values.keyWord[0]+moment().format('YYYYMMDDhhmmss'));
        } else {
          setShowJobManagerTips(true);
        }
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
        if (isPay) {
          setSearchDataKW(null);
        } else {
          setFreeSearchData(null);
        }
      }).finally(()=>{
        // close all table show!
        setLoading(false);
      });
    });
  };

  const getJobdetails = (id) => {
    setShowFreeSKData(false);
    setShowPaySKData(false);
    setShowJobManagerTips(false);
    setShowLAData(false);
    setLoading(true);
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
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
          if (res.data.isPayUser===2) {
            setShowPaySKData(true);
            setSearchDataKW(res.data.kwResultVoList);
            setSaveNameKW(res.data.keywords[0]+moment().format('YYYYMMDDHHmmss'));
          } else {
            const dd=res.data.kwResultVoList[0]?res.data.kwResultVoList[0].searchDetails:[];
            setShowFreeSKData(true);
            setFreeSearchData(dd);
          }
        } else {
          setShowLAData(true);
          setSearchDataLA(res.data.kwResultVoList || []);
          setSaveNameLA(res.data.audienceIdSearchRequest.audienceId+moment().format('YYYYMMDDHHmmss'));
          audienceIdSearchForm.setFieldsValue({
            ...AIDData,
          });
        }
        setSaveStatus(res.data.status);
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
      if (userInfo.adAccountId&&userInfo.accessToken&&userInfo.myAppId&&userInfo.myAppSecret) {
        const sdata={
          adAccountId: userInfo.adAccountId,
          accessToken: userInfo.accessToken,
          myAppId: userInfo.myAppId,
          myAppSecret: userInfo.myAppSecret,
        };
        post(GETAUDIENCEID, sdata, {
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
                  showSearch
                  maxTagCount={1}
                  maxTagTextLength={30}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
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
            <h1 className="search-title">
              {!isPayUser&&(
                <span>
                Access to 40 keywords is free. Need access to all 300 of your custom keyword audience?
                  <Link to="/plansAndPrices" className="target" onClick={() => {
                    store.dispatch(setMenusData('plansAndPrices', 'dashboard'));
                  }}> Upgrade now!</Link>
                </span>
              )}
              <p className="text-min marginT16">
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href={PDF} target="_blank">
                How to retrieve your token?
                </a>
              </p>
            </h1>
            <Form
              initialValues={{
                adAccountId: userInfo.adAccountId,
                accessToken: userInfo.accessToken,
              }}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 12,
              }}
              onFinish={onSearch}
              name="search"
              layout="horizontal"
              form={keywordsForm}
            >
              <Form.Item
                name="keyWord"
                label="Keywords"
                rules={[{required: true, message: 'Please input keyword!'}]}
                // initialValue={keyWords}
              >
                <Select
                  placeholder="One word only for free user, premium users are able add up to 10 keywords in one search."

                  mode="tags"
                  open={false}
                  tokenSeparators={[',']}/>
              </Form.Item>

              <Form.Item
                name="accessToken"
                label="Access Token"
                rules={[{required: true, message: 'Please input access token!'}]}>
                <Input placeholder="Access Token" maxLength={255} />
              </Form.Item>

              <Form.Item
                name="adAccountId"
                label="Facebook Ad Account"
                rules={[{required: true, message: 'Please input Facebook Ad account!'}]}>
                <Input placeholder="Facebook Ad Account" maxLength={100} />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 4,
                  span: 16,
                }}
              >
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
              <p className="text-min marginT16">
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href={PDF} target="_blank">
                  How to retrieve your token?
                </a>
              </p>
            </h1>

            <Form
              onFinish={LookalikeSearch}
              form={audienceIdSearchForm}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 12,
              }}
              initialValues={{
                adAccountId: userInfo.adAccountId,
                accessToken: userInfo.accessToken,
                myAppId: userInfo.myAppId,
                myAppSecret: userInfo.myAppSecret,
              }}
              onValuesChange={onLKSearchChange}
            >
              <Form.Item
                label="APP ID"
                name="myAppId"
                rules={[{required: true, message: 'Please input APP ID!'}]}>
                <Input placeholder="APP ID" maxLength={100} />
              </Form.Item>
              <Form.Item
                label="APP Secret"
                name="myAppSecret"
                rules={[{required: true, message: 'Please input APP secret!'}]}>
                <Input placeholder="APP Secret" maxLength={100} />
              </Form.Item>

              <Form.Item
                label="Access Token"
                name="accessToken"
                rules={[{required: true, message: 'Please input access token!'}]}>
                <Input placeholder="Access Token" maxLength={255} />
              </Form.Item>

              <Form.Item
                name="adAccountId"
                label="Facebook Ad Account"
                rules={[{required: true, message: 'Please input Facebook Ad account!'}]}>
                <Input placeholder="Facebook Ad Account" maxLength={100} />
              </Form.Item>
              <Form.Item
                label="Custom Audience ID"
                name="audienceId"
                rules={[{required: true, message: 'Please input custom audience ID!'}]}>
                <Select
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
              <Form.Item
                wrapperCol={{
                  offset: 4,
                  span: 16,
                }}
              >
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
      <div className={showJobMangerTips?'show':'hide'}>
        <p className="marginT30 search-content marginB30">
          Audience generation job has been created in
          <Link
            to={`/dashboard/jobManager?type=${JobType}`}
            className="target"
            onClick={() => {
              store.dispatch(setMenusData('jobManager', 'dashboard'));
            }
            }>Job Manager</Link>. You will receive &quot;notification&quot; once job completed.
        </p>
      </div>

      {showPaySKData&&(
        <KeyWordSearchDetails
          saveName={saveNameKW}
          searchData={searchDataKW}
          saveStatus={saveStatus}
          setSaveStatus={setSaveStatus}
        />)}
      {showLAData&& (
        <KeyWordSearchDetails
          saveName={saveNameLA}
          searchData={searchDataLA}
          saveStatus={saveStatus}
          setSaveStatus={setSaveStatus}
        />)}
      {showFreeSKData&&
      (<ResultTableBlur TableData={freeSearchData}/>)}
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
