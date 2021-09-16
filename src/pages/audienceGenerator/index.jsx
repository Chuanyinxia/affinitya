import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import {Button, Card, Col, Divider, Form, Input, InputNumber, Radio, Row, Select, Space, Spin} from 'antd';
import './style.css';

import {InfoCircleOutlined} from '@ant-design/icons';


const AudienceGenerator = ({userInfo, httpLoading, setHttpLoading}) => {
  const [loading, setLoading] = useState(false);


  // new
  const [startForm] = Form.useForm();
  const [baseForm] = Form.useForm();

  // const isPay=()=>{
  //   get(ISPAID, userInfo.token).then((res)=>{
  //     setIsPayUser(res.data===2);
  //   }).catch((error)=>{
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   });
  // };


  useEffect(() => {
    setLoading(false);
    // isPay()
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
                >
                  <Select mode="tags"/>
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
                <Form.Item label="Age">
                  <Input.Group compact>
                    <Form.Item name={['age', 'min']}>
                      <InputNumber/>
                    </Form.Item>
                    <Form.Item name={['age', 'max']}>
                      <InputNumber/>
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
                <Form.Item label="Gender" name="gender">
                  <Radio.Group>
                    <Radio value="1, 2">All</Radio>
                    <Radio value="1">Male</Radio>
                    <Radio value="2">Female</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Language" name="language">
                  <Radio.Group>
                    <Radio value="en_US">en_US</Radio>
                    <Radio value="zh_CN">zh_CN</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="User OS" name="os">
                  <Radio.Group>
                    <Radio value="na">All</Radio>
                    <Radio value="iOS">IOS</Radio>
                    <Radio value="Android">Android</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Device Platform" name="platform">
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
              <h4>Input one or more keywords, it is suggested to try different combinations.</h4>
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
            <Space>
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
