import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import {Button, Card, Col, Divider, Form, Input, InputNumber, message, Radio, Row, Select, Space, Spin} from 'antd';
import './style.css';

import {InfoCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Countrys} from '@/components/plugin/Country';
import {get, post} from '@/utils/request';
import {GETAUDIENCEID, ISPAID} from '@/api';


const AudienceGenerator = ({userInfo, httpLoading, setHttpLoading}) => {
  const [loading, setLoading] = useState(false);
  const [audienceID, setAudienceID] = useState('');
  const [audienceIdItem, setAudienceIdItem] = useState([]);
  const [isPayUser, setIsPayUser] = useState(false);
  const [searchType, setSearchType] = useState(1);
  // new
  const [startForm] = Form.useForm();
  const [baseForm] = Form.useForm();
  const [baseFormRadio] = Form.useForm();
  const [keyWordForm] = Form.useForm();
  const [lookalikeForm] = Form.useForm();


  const addItem = () => {
    if (audienceID) {
      audienceIdItem.push({audienceId: audienceID});
      setAudienceIdItem(audienceIdItem);
      setAudienceID(null);
    }
  };
  const onLKSearchChange = (changedValues, allValues) => {
    const adAccountId = allValues.adAccountId;
    const accessToken = allValues.accessToken;
    const myAppId = allValues.myAppId;
    const myAppSecret = allValues.myAppSecret;
    if (Object.keys(changedValues) !== 'audienceId' &&
      adAccountId &&
      myAppSecret &&
      myAppId &&
      myAppSecret
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
        setAudienceIdItem(res.data);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
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


  useEffect(() => {
    setLoading(false);
    isPay();
    if (userInfo.adAccountId && userInfo.accessToken && userInfo.myAppId && userInfo.myAppSecret) {
      const sdata = {
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
  },
  []);
  const keywords = ['Basketball', 'Tennis', 'Dancing', 'Assemblage', 'Real Estate', 'Urna', 'Bibendum', 'Pellentesque'];
  return (
    <div className="padding32">
      <Spin spinning={loading}>

        <Row gutter={40}>
          <Col xl={17} md={17} xs={24} sm={24}>
            <h1>Audience Generator</h1>
            <h4 className="marginB32">
              Affinity Analayst extends high correlation audiences from your custom
              audiences</h4>
            <Card className="marginB32 padding64" hoverable>
              <h2>1.Start with your FB</h2>
              <h4 className="marginB64">Fill in the following required Facebook information below.</h4>
              <Form form={startForm} name="accountInfo" layout="vertical">
                <Form.Item
                  name="adAccountId"
                  label="Facebook AD ID"
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined/>,
                  }}>
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="accessToken"
                  label="Access Token"
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined/>,
                  }}>
                  <Input/>
                </Form.Item>
              </Form>
            </Card>
            <Card className="marginB32 padding64" hoverable>
              <h2>2. Fill in your audiences segments</h2>
              <h4 className="marginB64">Fill in from existing successful campaigns, or try new parameters.</h4>
              <Form form={baseForm} name="segmentsInfo" layout="vertical">
                <Form.Item
                  name="country"
                  label="Country"
                  initialValue={['US']}
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
                      <Form.Item name={['age', 'min']} initialValue={13}>
                        <InputNumber className="width40"
                          min={13}
                          max={65}
                          decimalSeparator={0}/>
                      </Form.Item>
                    </Col>
                    <Col span={4} className="ages text-center">-</Col>
                    <Col span={10}>
                      <Form.Item name={['age', 'max']} initialValue={65}>
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
            <Card className="marginB32 padding64" hoverable>
              <h2>3. Last small step to get your generated keywords</h2>
              <h4 className="marginB64">Input one or more keywords, it is suggested to try different combinations.</h4>
              <Radio.Group onChange={onSearchTypeChange} value={searchType} className="marginB32">
                <Radio value={1} >Keyword Search</Radio>
                <Radio value={2} className="paddingL32" disabled={!isPayUser}>Lookalike Audience Search</Radio>
              </Radio.Group>
              <Form form={keyWordForm} name="keywords" className={searchType === 1 ? 'show' : 'hide'}>
                <Form.Item name="keyWord" rules={[{required: true, message: 'Please input keyword!'}]}>
                  <Select
                    placeholder="Input keywords....."
                    mode="tags"
                    open={false}
                    tokenSeparators={[',']}/>
                </Form.Item>
              </Form>
              <Form
                form={lookalikeForm}
                name="lookalike"
                layout="vertical"
                onValuesChange={onLKSearchChange}
                className={searchType === 2 ? 'show' : 'hide'}>
                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item
                      label="App ID"
                      rules={[{required: true, message: 'Please input App ID!'}]}
                      tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined/>,
                      }}>
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="App Secret"
                      rules={[{required: true, message: 'Please input App secret!'}]}
                      tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined/>,
                      }}>
                      <Input/>
                    </Form.Item>
                  </Col>
                </Row>
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
              </Form>
            </Card>
          </Col>
          <Col xl={6} md={7} xs={24} sm={24}>
            <h3>Trending Audience</h3>
            <p className="marginB64">These words is using for SLG...</p>
            <Space wrap>
              {keywords.map((item) => (
                <Button key={item} type="link">{item}</Button>
              ))}
            </Space>
            <Divider/>
            <h3>Tips</h3>
            <a>Full guide to retrieve token </a>
          </Col>
        </Row>

        <Row>
          <Col span={24} className="text-center">
            <Space size="large">
              <Button className="btn-xl">Reset All</Button>
              <Button type="primary" className="btn-xl">Generate Audience</Button>
            </Space>
          </Col>
        </Row>

      </Spin>
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

AudienceGenerator.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AudienceGenerator);
