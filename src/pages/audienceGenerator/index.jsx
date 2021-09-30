import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setMenusData} from '@/store/actions';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
} from 'antd';
import './style.css';
import PDF from '@/assets/Guide to get App ID, Token(1).pdf';

import {DeleteOutlined, InfoCircleOutlined, LockOutlined, PlusOutlined} from '@ant-design/icons';
import {Countrys} from '@/components/plugin/Country';
import {get, post, remove} from '@/utils/request';
import {
  DELETEAUDIENCEID,
  GETAUDIENCEID,
  GETAUDIENCEIDLIST,
  GETAUDIENCELIST,
  ISPAID,
  SAVEAUDIENCEID,
  SEARCHAUID,
  SEARCHKW,
} from '@/api';
import {Link, useHistory} from 'react-router-dom';
import store from '@/store';


const AudienceGenerator = ({userInfo}) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [audienceID, setAudienceID] = useState('');
  const [audienceIdItem, setAudienceIdItem] = useState([]);
  const [userAudienceIdItem, setUserAudienceIdItem] = useState([]);
  const [isPayUser, setIsPayUser] = useState(false);
  const [searchType, setSearchType] = useState(1);
  const [read, setRead] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [addItemLoading, setAddItemLoading]=useState(false);
  const [audienceWords, setAudienceWords]=useState([]);
  // new
  const [creatJobForm] = Form.useForm();
  const [startForm] = Form.useForm();
  const [baseForm] = Form.useForm();
  const [baseFormRadio] = Form.useForm();
  const [keyWordForm] = Form.useForm();
  const [lookalikeForm] = Form.useForm();
  const [searchData, setSearchData] = useState(null);

  const addItem = () => {
    if (audienceID.trim()) {
      setAddItemLoading(true);
      post(SAVEAUDIENCEID, {audienceId: audienceID}, {
        'token': userInfo.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((res) => {
        audienceIdItem.unshift({audienceId: audienceID, audienceParams: audienceID});
        setAudienceIdItem(audienceIdItem);
        setAudienceID(null);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(() => {
        setAddItemLoading(false);
      });
    } else {
      message.error('Please input lookalike audience!');
    }
  };
  const deleteOption = (e, id) => {
    e.stopPropagation();
    remove(DELETEAUDIENCEID + id, userInfo.token).then((res) => {
      message.success(res.msg);
      setAudienceIdItem(audienceIdItem.filter((item) => item.audienceId !== id));
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const onLKSearchChange = (changedValues, allValues) => {
    const adAccountId = allValues.adAccountId;
    const myAppId = allValues.myAppId;
    const myAppSecret = allValues.myAppSecret;
    const accessToken = allValues.accessToken;
    if (adAccountId &&
      myAppSecret &&
      myAppId &&
      accessToken
    ) {
      const data = {
        adAccountId: adAccountId,
        accessToken: accessToken,
        myAppId: myAppId,
        myAppSecret: myAppSecret,
      };
      post(GETAUDIENCEID, data, {
        'token': userInfo.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((res) => {
        setUserAudienceIdItem(res.data);
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  const isPay = () => {
    get(ISPAID, userInfo.token).then((res) => {
      setIsPayUser(res.data === 2);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const onSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const addKeywords=(word)=>{
    if (keyWordForm.getFieldValue().keyWord) {
      keyWordForm.setFieldsValue({
        keyWord: [...keyWordForm.getFieldValue().keyWord, word],
      });
    } else {
      keyWordForm.setFieldsValue({
        keyWord: [word],
      });
    }
    console.log(keyWordForm.getFieldValue().keyWord);
  };

  const toAddJob = () => {
    startForm.validateFields().catch(() => {
      return false;
    });
    baseForm.validateFields().catch(() => {
      return false;
    });
    if (searchType === 1) {
      keyWordForm.validateFields().catch(() => {
        return false;
      });
    } else {
      lookalikeForm.validateFields().catch(() => {
        return false;
      });
    }
    console.log(searchType);
    let data = {
      ...startForm.getFieldValue(),
      ...baseForm.getFieldValue(),
      ...baseFormRadio.getFieldValue(),
      age: baseForm.getFieldValue().age.min + ',' + baseForm.getFieldValue().age.max,
    };
    if (searchType === 1) {
      keyWordForm.validateFields().catch(() => {
        return false;
      }).then((value) => {
        if (value.keyWord) {
          data = {
            ...value,
            ...data,
          };
          setSearchData(data);
          setModalShow(true);
        }
      });
    } else {
      lookalikeForm.validateFields().catch(() => {
        return false;
      }).then((value) => {
        if (value.audienceId) {
          data = {
            ...value,
            ...data,
          };
          setModalShow(true);
          setSearchData(data);
        }
      });
    }
  };
  const onResetAll = () => {
    startForm.setFieldsValue({
      adAccountId: '',
      accessToken: '',
    });
    baseForm.setFieldsValue({
      country: ['US'],
    });
    baseFormRadio.setFieldsValue({
      gender: '1,2',
      language: 'en_US',
      os: 'na',
      platform: 'all',
    });
    keyWordForm.resetFields();
    lookalikeForm.resetFields();
  };

  const onFinish=(value)=>{
    const data={
      ...value,
      ...searchData,
    };
    if (searchType===1) {
      post(SEARCHKW, data, {
        // eslint-disable-next-line no-tabs
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then((res) => {
        console.log(res);
        store.dispatch(setMenusData('jobManager', 'dashboard'));
        history.push('/dashboard/jobManager?newID='+res.data+'&jobName='+value.jobName);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      });
    } else {
      post(SEARCHAUID, data, {
        // eslint-disable-next-line no-tabs
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then((res) => {
        console.log(res);
        store.dispatch(setMenusData('jobManager', 'dashboard'));
        history.push('/dashboard/jobManager?newID=' + res.data);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      });
    }
  };

  const getAudienceList = () => {
    get(GETAUDIENCELIST).then((res) => {
      setAudienceWords(res.data);
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    isPay();
    setLoading(true);
    get(GETAUDIENCEIDLIST, userInfo.token).then((res) => {
      setAudienceIdItem(res.data);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
    });

    if (userInfo.adAccountId && userInfo.accessToken && userInfo.myAppId && userInfo.myAppSecret) {
      const sdata = {
        adAccountId: userInfo.adAccountId,
        accessToken: userInfo.accessToken,
        myAppId: userInfo.myAppId,
        myAppSecret: userInfo.myAppSecret,
      };
      setLoading(true);
      post(GETAUDIENCEID, sdata, {
        'token': userInfo.token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }).then((res) => {
        setUserAudienceIdItem(res.data);
      }).catch((error) => {
        console.log(error);
      }).finally(()=>{
        setLoading(false);
      });
    }
    setTimeout(() => {
      setRead(false);
    }, 500);
    getAudienceList();
  },
  []);

  return (
    <div className="padding32 Audience">
      <Spin spinning={loading}>

        <Row gutter={40}>
          <Col xl={17} md={17} xs={24} sm={24}>
            <h1>Audience Generator</h1>
            <h4 className="marginB32">
              Affinity Analyst extends high correlation audiences from your custom
              audiences</h4>
            <Card className="marginB32 padding64 hover" hoverable>
              <h2>1.Start with your FB</h2>
              <h4 className="marginB32">Fill in the following required Facebook information below.</h4>
              <Form
                form={startForm}
                name="accountInfo"
                layout="vertical"
                onValuesChange={onLKSearchChange}
                initialValues={{
                  adAccountId: userInfo?.adAccountId,
                  accessToken: userInfo?.accessToken,
                  myAppId: userInfo?.myAppId,
                  myAppSecret: userInfo?.myAppSecret,
                }}
                autocomplete="nope"
                Autocomplete="nope">
                <Form.Item
                  name="adAccountId"
                  label="Facebook AD ID"
                  readOnly={read}
                  autocomplete="nope"
                  Autocomplete="nope"
                  rules={[{required: true, message: 'Please input facebook AD ID!'}]}
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined/>,
                  }}>
                  <Input
                    readOnly={read}
                    placeholder="Copy & paste your Facebook AD ID here..."
                    autocomplete="nope"
                    Autocomplete="nope"
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item
                  name="accessToken"
                  label="Access Token"
                  readOnly={read}
                  autocomplete="nope"
                  Autocomplete="nope"
                  rules={[{required: true, message: 'Please input access token!'}]}
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined/>,
                  }}>
                  <Input.Password
                    placeholder="Copy & paste your Access Token here..."
                    readOnly={read}
                    autocomplete="nope"
                    Autocomplete="nope"
                    maxLength={255}
                    iconRender={() => (<LockOutlined/>)}
                  />
                </Form.Item>
                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item
                      label="App ID"
                      name="myAppId"
                      rules={[{required: true, message: 'Please input App ID!'}]}
                      tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined/>,
                      }}>
                      <Input placeholder="Input App ID..." maxLength={255}/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="App Secret"
                      name="myAppSecret"
                      rules={[{required: true, message: 'Please input App secret!'}]}
                      tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined/>,
                      }}>
                      <Input placeholder="Input App secret..." maxLength={100}/>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card className="marginB32 padding64 hover" hoverable>
              <h2>2. Fill in your audiences segments</h2>
              <h4 className="marginB32">Fill in from existing successful campaigns, or try new parameters.</h4>
              <Form form={baseForm} name="segmentsInfo" layout="vertical">
                <Form.Item
                  name="country"
                  label="Country"
                  initialValue={['US']}
                  rules={[{required: true, message: 'Please select country!'}]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    maxTagCount={6}
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
                <Form.Item label="Age">
                  <Row>
                    <Col span={10}>
                      <Form.Item
                        name={['age', 'min']}
                        initialValue={13}
                        rules={[{required: true, message: 'Please input min age!'}]}
                      >
                        <InputNumber className="width40"
                          min={13}
                          max={65}
                          decimalSeparator={0}/>
                      </Form.Item>
                    </Col>
                    <Col span={4} className="ages text-center">-</Col>
                    <Col span={10}>
                      <Form.Item name={['age', 'max']} initialValue={65}
                        rules={[{required: true, message: 'Please input max age!'}]}
                      >
                        <InputNumber className="width40" min={13}
                          max={65}
                          decimalSeparator={0}/>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
              <Form
                form={baseFormRadio}
                name="segmentsRadioInfo"
                labelAlign="left"
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}>
                <Form.Item label="Gender" name="gender" initialValue={'1,2'}>
                  <Radio.Group size="large">
                    <Radio value="1,2">All</Radio>
                    <Radio value="1">Male</Radio>
                    <Radio value="2">Female</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Language"
                  name="language"
                  initialValue={'en_US'}>
                  <Radio.Group size="large">
                    <Radio value="en_US">en_US</Radio>
                    <Radio value="zh_CN">zh_CN</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="User OS"
                  name="os"
                  initialValue={'na'}>
                  <Radio.Group size="large">
                    <Radio value="na">All</Radio>
                    <Radio value="iOS">IOS</Radio>
                    <Radio value="Android">Android</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Device Platform" name="platform"
                  initialValue={'all'}>
                  <Radio.Group>
                    <Radio value="all">All</Radio>
                    <Radio value="mobile">Mobile</Radio>
                    <Radio value="desktop">Desktop</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Card>
            <Card className="marginB32 padding64 hover" hoverable>
              <h2>3. Last small step to get your generated keywords</h2>
              {searchType === 1&&(<h4 className="marginB32">
                Input one or more keywords, it is suggested to try different
                combinations.</h4>)}
              {searchType === 2&&(<h4 className="marginB32">
                Fill in the corresponding Facebook Lookalike Audience information.
              </h4>)}
              <Radio.Group onChange={onSearchTypeChange} value={searchType} className="marginB32">
                <Radio value={1}>Keyword Search</Radio>
                <Radio value={2} className="paddingL32" disabled={!isPayUser}>Lookalike Audience Search</Radio>
              </Radio.Group>
              <Form
                layout="vertical"
                form={keyWordForm}
                name="keywords"
                className={searchType === 1 ? 'show' : 'hide'}
              >
                {!isPayUser&&(
                  <h4 className="marginB32">
                Access to 40 keywords is free. Need access to all 300 of your custom keyword audience?
                    <Link to="/plansAndPrices" className="target" onClick={() => {
                      store.dispatch(setMenusData('plansAndPrices', 'dashboard'));
                    }}> Upgrade now!</Link>
                  </h4>
                )}
                <Form.Item
                  label="Keyword"
                  name="keyWord"
                  tooltip={{
                    title: 'One word only for free user, premium users are able add up to 10 keywords in one search.',
                    icon: <InfoCircleOutlined/>,
                  }}
                  rules={[{required: true, message: 'Please input keyword!'}]}>
                  <Select
                    placeholder="Input keywords..."
                    mode="tags"
                    open={false}
                    tokenSeparators={[',']}/>
                </Form.Item>
              </Form>
              <Form
                form={lookalikeForm}
                name="lookalike"
                layout="vertical"
                className={searchType === 2 ? 'show' : 'hide'}>
                <Form.Item
                  label="Lookalike Audience ID"
                  rules={[{required: true, message: 'Please input lookalike audience ID!'}]}
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined/>,
                  }}
                  name="audienceId"
                >
                  <Select
                    menuItemSelectedIcon={null}
                    maxTagCount={6}
                    maxTagTextLength={30}
                    mode="tags"
                    allowClear
                    placeholder="Custom Audience ID..."
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{margin: '4px 0'}}/>
                        <div className="padding16">
                          <Row className="margin16">
                            <Col flex={4}>
                              <Input
                                size="small"
                                value={audienceID}
                                onChange={(e) => setAudienceID(e.target.value)}
                                maxLength={255}/>
                            </Col>
                            <Col flex={1} className="text-center padding16">
                              <Button
                                type="link"
                                ghost
                                loading={addItemLoading}
                                onClick={addItem}
                              >
                                <PlusOutlined/>Lookalike Audience
                              </Button>
                            </Col>
                          </Row>
                        </div>

                      </div>
                    )}
                  >
                    {audienceIdItem.map((item) => (
                      <Select.Option key={item.audienceId} className="padding16">
                        <Row>
                          <Col flex="auto" className="paddingL16">
                            {item.audienceParams}
                          </Col>
                          <Col flex="80px" className="text-right paddingR16">
                            <DeleteOutlined onClick={(e) => deleteOption(e, item.audienceId)}/>
                          </Col>
                        </Row>
                      </Select.Option>
                    ))}
                    {userAudienceIdItem.map((item) => (
                      <Select.Option key={item.audienceId} className="padding16">
                        <Row>
                          <Col flex="auto" className="paddingL16 break">
                            {item.audienceId&&(<span>&nbsp;&nbsp;</span>)}
                            {item.audienceParams}
                          </Col>
                        </Row>
                      </Select.Option>
                    ))}

                  </Select>
                </Form.Item>
              </Form>
            </Card>
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
              href={PDF}
              target="_blank">
              Full guide to retrieve token
            </a>
          </Col>
        </Row>

        <Row>
          <Col span={24} className="text-center">
            <Space size="large">
              <Button className="btn-xl" onClick={onResetAll}>Reset All</Button>
              <Button type="primary" className="btn-xl" onClick={toAddJob}>Generate Audience</Button>
            </Space>
          </Col>
        </Row>
        <Modal
          title={null}
          visible={modalShow}
          footer={null}
          width={650}
          onCancel={()=> {
            setModalShow(false);
            setSearchData(null);
          }}>
          <h2>Create Job</h2>
          <p className="marginB32">Name your audience for identification in Job & Audience Manager</p>
          <Form name="creatJob" form={creatJobForm} onFinish={onFinish}>
            <Form.Item name="jobName" rules={[{required: true, message: 'Please input job name!'}]}>
              <Input placeholder="Input job name, ex: game name, audience/keyword, etc. " maxLength={255}/>
            </Form.Item>
            <Form.Item className="text-right">
              <Button
                className="btn-lg marginR32 marginT32"
                onClick={()=> {
                  setModalShow(false);
                  setSearchData(null);
                  creatJobForm.resetFields();
                }}>Cancel</Button>
              <Button type="primary" className="btn-lg" htmlType="submit">Save</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
  };
};

AudienceGenerator.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AudienceGenerator);
