import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setMenusData, updateIsPay} from '@/store/actions';
import {
  Alert,
  Badge,
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
  Tooltip,
} from 'antd';
import './style.css';
import FacebookLoginP from 'react-facebook-login/dist/facebook-login-render-props';
import FacebookLogin from 'react-facebook-login';

import {InfoCircleOutlined, LockOutlined} from '@ant-design/icons';
import {Countrys} from '@/components/plugin/Country';
import {get, post, update} from '@/utils/request';
import {
  ABANDONFBUSER,
  GETAUDIENCEID,
  GETAUDIENCELIST,
  GETFBUSER,
  GETUSERMESSAGE,
  ISPAID,
  SAVEFBUSER,
  SEARCHAUID,
  SEARCHKW,
} from '@/api';
import {Link, useHistory} from 'react-router-dom';
import store from '@/store';

const FBLoginData = {
  accessToken: 'EAANELK82ZCP8BAMDeeGvNFXOTzaQd9hZBVSwexjClE6Y0BxZB' +
    'Osyi8mR7O9zGF0JLOYcj1JsEvbElL0UiI7NqfIsIZBtDocFfGDuj1IIbpfTyaCg' +
    'i5SJFoR2uoZCCqoSY23NLdhaQgim7o6l4X5lEjoueZBdmqanjJRSeXK7d3PQZDZD',
  myAppId: '919383638998271',
  myAppSecret: '3eb781cc0cf396c8f62e1685ea80ebc5',
};

const AudienceGenerator2 = ({userInfo}) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [userAudienceIdItem, setUserAudienceIdItem] = useState([]);
  const [isPayUser, setIsPayUser] = useState(false);
  const [searchType, setSearchType] = useState(1);
  const [read, setRead] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [link, setLink] = useState('');
  // const [addItemLoading, setAddItemLoading] = useState(false);
  const [audienceWords, setAudienceWords] = useState([]);
  // new
  const [creatJobForm] = Form.useForm();
  const [startForm] = Form.useForm();
  const [baseForm] = Form.useForm();
  const [baseFormRadio] = Form.useForm();
  const [keyWordForm] = Form.useForm();
  const [lookalikeForm] = Form.useForm();
  const [searchData, setSearchData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isFBLogin, setIsFBLogin] = useState({});
  // const [f, setFBAStatus] = useState(false);
  const getFBName = () => {
    get(GETFBUSER, userInfo.token).then((res) => {
      setIsFBLogin(res.data);
    }).catch((error) => {
    });
  };
  const abandonFB = () => {
    update(ABANDONFBUSER, '', {
      'token': userInfo.token,
    }).then((res) => {
      message.success(res.msg);
      setIsFBLogin({});
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const responseFacebook = (response) => {
    if (response.name) {
      setIsFBLogin({name: response.name});
      post(SAVEFBUSER, response, {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then(() => {
        message.success('Permission granted success!');
      }).catch((error) => {
        Modal.error({
          title: error.toString(),
          onOk() {
            window.location.reload();
          },
        });
      }).finally(()=>{
        getFBName();
      });
    }
  };

  const loadPageVar = (sVar) => {
    return decodeURI(
        window.location.search.replace(
            new RegExp('^(?:.*[&\\?]' +
          encodeURI(sVar).replace(/[.+*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  };
  // const addItem = () => {
  //   if (audienceID.trim()) {
  //     setAddItemLoading(true);
  //     post(SAVEAUDIENCEID, {audienceId: audienceID}, {
  //       'token': userInfo.token,
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     }).then((res) => {
  //       audienceIdItem.unshift({audienceId: audienceID, audienceParams: audienceID});
  //       setAudienceIdItem(audienceIdItem);
  //       setAudienceID(null);
  //     }).catch((error) => {
  //       message.error({
  //         content: error.toString(), key: 'netError', duration: 2,
  //       });
  //     }).finally(() => {
  //       setAddItemLoading(false);
  //     });
  //   } else {
  //     message.error('Please input lookalike audience!');
  //   }
  // };
  // const deleteOption = (e, id) => {
  //   e.stopPropagation();
  //   remove(DELETEAUDIENCEID + id, userInfo.token).then((res) => {
  //     message.success(res.msg);
  //     setAudienceIdItem(audienceIdItem.filter((item) => item.audienceParams !== id));
  //   }).catch((error) => {
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   });
  // };
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
        setErrorMsg(error.toString());
      });
    }
  };
  const isPay = () => {
    get(ISPAID, userInfo.token).then((res) => {
      setIsPayUser(res.data === 2);
      store.dispatch(updateIsPay(res.data));
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const onSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const addKeywords = (word) => {
    const keyWords = keyWordForm.getFieldValue().keyWord;

    if (keyWords) {
      if (keyWords.length >= 10) {
        message.warn('Please input less than 10 keywords!');
        return false;
      }
      keyWordForm.setFieldsValue({
        keyWord: Array.from(new Set([...keyWords, word])),
      });
    } else {
      keyWordForm.setFieldsValue({
        keyWord: [word],
      });
    }
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

  const onFinish = (value) => {
    const data = {
      ...value,
      ...searchData,
    };
    if (searchType === 1) {
      post(SEARCHKW, data, {
        // eslint-disable-next-line no-tabs
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then((res) => {
        store.dispatch(setMenusData('jobManager', 'dashboard'));
        history.push('/dashboard/jobManager?newID=' + res.data + '&jobName=' + value.jobName);
      }).catch((error) => {
        // console.log(error);
        if (error.code === 371) {
          Modal.confirm({
            content: error.msg,
            key: 'netError',
            duration: 2,
            okText: 'View the Job',
            cancelText: 'Cancel',
            onOk: () => {
              store.dispatch(setMenusData('jobManager', 'dashboard'));
              history.push('/dashboard/jobManager?searchID=' + error.data.jobId + '&jobName=' + error.data.title);
            },
          });
        } else {
          message.error({
            content: error.toString(), key: 'netError', duration: 2,
          });
        }
      });
    } else {
      post(SEARCHAUID, data, {
        // eslint-disable-next-line no-tabs
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': userInfo.token,
      }).then((res) => {
        store.dispatch(setMenusData('jobManager', 'dashboard'));
        history.push('/dashboard/jobManager?newID=' + res.data + '&jobName=' + value.jobName);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      });
    }
  };

  const getAudienceList = () => {
    setLoading(true);
    get(GETAUDIENCELIST).then((res) => {
      setAudienceWords(res.data);
    }).catch((error) => {
    }).finally(()=>{
      setLoading(false);
    });
  };

  const getInitMessage = () => {
    setLoading(true);
    const token = userInfo.token;
    get(GETUSERMESSAGE, token).then((res) => {
      // console.log(res);
      if (res.data.adAccountId && res.data.accessToken && res.data.myAppId && res.data.myAppSecret) {
        const sdata = {
          adAccountId: res.data.adAccountId,
          ...FBLoginData,
        };
        setLoading(true);
        post(GETAUDIENCEID, sdata, {
          'token': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        }).then((res) => {
          setUserAudienceIdItem(res.data);
        }).catch((error) => {
          if (error.code) {
            setLink(error.data);
            setErrorMsg(error.msg.toString());
          } else {
            setLink('');
            setErrorMsg(error.toString());
          }
        }).finally(() => {
          setLoading(false);
        });
      }
      startForm.setFieldsValue({
        adAccountId: res.data?.adAccountId,
        ...FBLoginData,
      });
      lookalikeForm.setFieldsValue({
        audienceId: res.data.audienceId,
      });
    }).catch((error) => {

      // message.error({
      //   content: error.toString(), key: 'netError', duration: 2,
      // });
    }).finally(()=>{
      setLoading(false);
    });
  };

  useEffect(() => {
    isPay();
    getFBName();

    getAudienceList();
    setTimeout(() => {
      setRead(false);
      getInitMessage();
    }, 500);
  },
  []);
  useEffect(() => {
    const keyword = loadPageVar('keyword');
    if (keyword !== '') {
      addKeywords(keyword);
    }
  }, []);
  return (
    <div>
      {errorMsg && (
        <Alert
          onClose={() => {
            setErrorMsg(null);
          }}
          className="alertFixed"
          message={<p className="text-white text-center margin0">
            Audience ID cannot be retrieved from Facebook or empty. ???{errorMsg}???.
            {link && <span> Please click <a
              href={link}
              rel="noreferrer"
              target="_blank"
              className="links"
            >here</a> to check your account.
            </span>}
          </p>}
          banner type="error"
          closable/>)}
      <div className="padding32">
        <Spin spinning={loading}>
          <Row gutter={40}>
            <Col xl={17} xs={24}>
              <h1>Audience Generator</h1>
              <h4 className="marginB32">
                Affinity Analyst extends high correlation audiences from your custom
                audiences
              </h4>
              <Card className="marginB32 padding64 hover" hoverable>
                <h2>1.Start with your FB</h2>
                <h4 className="marginB32">Fill in the following required Facebook information below.</h4>
                <Form
                  form={startForm}
                  name="accountInfo"
                  layout="vertical"
                  onValuesChange={onLKSearchChange}
                  autocomplete="nope"
                  Autocomplete="nope">
                  <Form.Item
                    name="adAccountId"
                    label="Facebook AD Account ID"
                    readOnly={read}
                    autocomplete="nope"
                    Autocomplete="nope"
                    rules={[{required: true, message: 'Please input facebook AD ID!'}]}
                    tooltip={{
                      // eslint-disable-next-line react/jsx-no-target-blank
                      title: <div>Retrieve your Ad Account <a
                        href="https://business.facebook.com/settings/ad-accounts"
                        target="_blank">here</a>.</div>,
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
                  <div>
                    {!isFBLogin.name ? (<h4 className="required-title">
                      <span className="text-mark">*</span>Grant Facebook Permission:
                      <span className="marginR32"/>
                      <FacebookLogin
                        appId={FBLoginData.myAppId}
                        scope="public_profile,email,ads_read"
                        onlogin="checkLoginState();"
                        callback={responseFacebook}
                      />
                    </h4>) : (<h4 className="required-title">
                      <span className="text-mark">*</span>
                      {!isFBLogin.expire ? (<>
                        {isFBLogin.authorizationStatus === 1 ?
                          'Permission Granted by: ' : 'Permission grant is required: '}
                        {isFBLogin.authorizationStatus === 1 && (<span className="marginL8">{isFBLogin.name}</span>)}
                        {isFBLogin.authorizationStatus === 1 && (<span className="marginL8">
                          <Badge status="success"/>
                        </span>)}
                        <br/>
                        {isFBLogin.authorizationStatus === 1 ? (<Space className="marginT16">
                          <Button
                            type="primary"
                            className="marginL16 btn-lg"
                            ghost
                            onClick={abandonFB}
                          >Disconnect</Button>

                          <FacebookLoginP
                            appId="294011789405420"
                            scope="public_profile,email,ads_read"
                            onlogin="checkLoginState();"
                            callback={responseFacebook}
                            render={(renderProps) => (
                              <Button
                                type="primary"
                                className="marginL16  btn-lg"
                                ghost
                                onClick={renderProps.onClick}>
                                {isFBLogin.authorizationStatus === 1 ?
                                  'Switch Account' : 'Re Login with Facebook'}
                              </Button>
                            )}
                          />
                        </Space>) : (
                          <FacebookLogin
                            className="btn-lg"
                            appId={FBLoginData.myAppId}
                            scope="public_profile,email,ads_read"
                            onlogin="checkLoginState();"
                            callback={responseFacebook}
                          />
                        )}
                      </>) : (<>
                        Your Facebook login session has expired<Badge className="marginL8" status="error"/>
                        <br/>
                        <FacebookLogin
                          className="btn-lg"
                          appId={FBLoginData.myAppId}
                          scope="public_profile,email,ads_read"
                          onlogin="checkLoginState();"
                          callback={responseFacebook}
                        />
                      </>)}
                    </h4>)}
                  </div>
                  <Form.Item
                    name="accessToken"
                    label="User Token"
                    readOnly={read}
                    hidden
                    autocomplete="nope"
                    Autocomplete="nope"
                    rules={[{required: true, message: 'Please input access token!'}]}
                    tooltip={{
                      // eslint-disable-next-line react/jsx-no-target-blank
                      title: <div>In the <a
                        href="https://developers.facebook.com/tools/explorer/"
                        target="_blank">Graph API Explorer</a>, grant ???ads_management??? permission<br/>
                        and click ???Generate Access Token??? , then go to ???access token debugger??? <br/>
                        tool to generate extend access token.
                      </div>,
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
                        hidden
                        label="App ID"
                        name="myAppId"
                        rules={[{required: true, message: 'Please input App ID!'}]}
                        tooltip={{
                          // eslint-disable-next-line react/jsx-no-target-blank
                          title: <div>Click <a href="https://developers.facebook.com/apps" target="_blank">here</a>,
                            to create or retrieve an App ID.
                          </div>,
                          icon: <InfoCircleOutlined/>,
                        }}>
                        <Input placeholder="Input App ID..." maxLength={255}/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        hidden
                        label="App Secret"
                        name="myAppSecret"
                        rules={[{required: true, message: 'Please input App secret!'}]}
                        tooltip={{
                          // eslint-disable-next-line react/jsx-no-target-blank
                          title: <div>Visit your App page (<a
                            href="https://developers.facebook.com/apps"
                            target="_blank">https://developers.facebook.com/apps</a>),<br/>
                            click ???Settings??? then ???Basic??? to view your App Secret.Then go to <br/>
                            ???access token debugger??? tool generate an extended access <br/>token.
                          </div>,
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
                      maxTagCount={4}
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
                    span: 8,
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
                      <Radio value="iOS">iOS</Radio>
                      <Radio value="Android">Android</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Device Platform" name="platform"
                    initialValue={'mobile'}>
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
                {searchType === 1 && (<h4 className="marginB32">
                  Input one or more keywords, it is suggested to try different
                  combinations.</h4>)}
                {searchType === 2 && (<h4 className="marginB32">
                  Fill in the corresponding Facebook Lookalike Audience information.
                </h4>)}
                <Radio.Group onChange={onSearchTypeChange} value={searchType} className="marginB32">
                  <Radio value={1} style={{width: 260}} className="paddingR32">Keyword Search</Radio>
                  <Radio
                    value={2}
                    style={{width: 400}}
                    disabled={!isPayUser}
                  >Lookalike Audience Search</Radio>
                </Radio.Group>
                <Form
                  layout="vertical"
                  form={keyWordForm}
                  name="keywords"
                  className={searchType === 1 ? 'show' : 'hide'}
                >
                  {!isPayUser && (
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
                      title: <div>One word only for free user, premium users are able add up<br/>
                        to 10 keywords in one search.</div>,
                      icon: <InfoCircleOutlined/>,
                    }}
                    rules={[{required: true, message: 'Please input keyword!'}]}>
                    <Select
                      placeholder="Input keywords..."
                      mode="tags"
                      onChange={(value) => {
                        if (value.length > 10) {
                          message.warn('Please input less than 10 keywords!');
                          value.pop();
                          keyWordForm.setFieldsValue({
                            keyWord: value,
                          });
                        }
                      }}
                      open={false}
                    />
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
                    name="audienceId"
                  >
                    <Select
                      menuItemSelectedIcon={null}
                      // mode="tags"
                      allowClear
                      placeholder="Custom Audience ID..."
                      // dropdownRender={(menu) => (
                      //   <div>
                      //     {menu}
                      //     <Divider style={{margin: '4px 0'}}/>
                      //     <div className="padding16">
                      //       <Row className="margin16">
                      //         <Col flex={4}>
                      //           <Input
                      //             size="small"
                      //             value={audienceID}
                      //             onChange={(e) => setAudienceID(e.target.value)}
                      //             maxLength={255}/>
                      //         </Col>
                      //         <Col flex={1} className="text-center padding16">
                      //           <Button
                      //             type="link"
                      //             ghost
                      //             loading={addItemLoading}
                      //             onClick={addItem}
                      //           >
                      //             <PlusOutlined/>Lookalike Audience
                      //           </Button>
                      //         </Col>
                      //       </Row>
                      //     </div>
                      //
                      //   </div>
                      // )}
                    >
                      {/* {audienceIdItem.map((item) => (*/}
                      {/*  <Select.Option key={item.audienceParams} className="padding16">*/}
                      {/*    <Row>*/}
                      {/*      <Col flex="auto" className="paddingL16">*/}
                      {/*        {item.audienceParams}*/}
                      {/*      </Col>*/}
                      {/*      <Col flex="80px" className="text-right paddingR16">*/}
                      {/*        <DeleteOutlined onClick={(e) => deleteOption(e, item.audienceParams)}/>*/}
                      {/*      </Col>*/}
                      {/*    </Row>*/}
                      {/*  </Select.Option>*/}
                      {/* ))}*/}
                      {userAudienceIdItem.map((item) => (
                        <Select.Option key={item.audienceId} className="padding16">
                          <Row>
                            <Col flex="auto" className="paddingL16 break">
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
            <Col xl={6} xs={24}>
              {/* <div className="TOP"> */}
              {audienceWords.length !== 0 ? <><h3 style={{fontWeight: 600}}>TRENDING AUDIENCE&nbsp;
                <Tooltip
                  arrowPointAtCenter
                  placement="left"
                  title={<span>
                Trending audiences are audiences our engine identifies<br/>
                that are of significant correlation to the category.</span>}>
                  <InfoCircleOutlined/>
                </Tooltip>
              </h3>
              <Space wrap>
                {audienceWords.map((item) => (
                  <a key={item.id} type="link" onClick={() => addKeywords(item.name)}>{item.name}</a>
                ))}
              </Space>
              <Divider/></> : null}
              {/* <h3 style={{fontWeight: 600}}>TIPS</h3>*/}
              {/* eslint-disable-next-line react/jsx-no-target-blank */}
              {/* <a*/}
              {/*  href='/Guide'*/}
              {/*  target="_blank">*/}
              {/*  Full guide to retrieve token*/}
              {/* </a>*/}
              {/* </div> */}

            </Col>
          </Row>

          <Row style={{marginTop: 32}}>
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
            onCancel={() => {
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
                  onClick={() => {
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {};
};

AudienceGenerator2.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AudienceGenerator2);
