import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Input, Card, Modal, message, Space} from 'antd';
import {SAVECONTACTUS} from '../api/index';
import {post} from '@/utils/request';
import {storage} from '@/utils/storage';
import icon from '@/assets/check-circle.png';
const ContactUsForm = ({type}) => {
  const [modalShow, setModalShow]=useState(false);
  const [loading, setLoading]=useState(false);
  const onFinish=(value)=>{
    const userInfo = storage.getData('userInfo');
    setLoading(true);
    post(SAVECONTACTUS, value, {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      setModalShow(true);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setLoading(false);
    });
  };
  return (
    <div>
      <Modal title={null} footer={null} visible={modalShow} onCancel={()=>setModalShow(false)}>
        <div className="text-center padding16 paddingT32">
          <img src={icon} alt="icon"/>
          <h4 className="marginB32 marginT16">We’ll get back to you soon!</h4>
          <Space>
            {type?
              (<Button href="/home" className="btn-md">Back to Home</Button>):
              (<Button href="/dashboard" className="btn-md">Back to Dashboard</Button>)}
            <Button onClick={()=>setModalShow(false)} type="primary" className="btn-md">Submit again</Button>
          </Space>
        </div>
      </Modal>
      <Card hoverable className="margin16 padding32" >
        <Form layout="vertical" onFinish={onFinish} name="contacts">
          <Form.Item label='Name' name="name" rules={[{
            required: true,
            message: 'Please input your name!',
          }]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Email Address" name="email" rules={[{
            type: 'email',
            message: 'The input is not valid E-mail!',
          }, {
            required: true,
            message: 'Please input your Email address!',
          }]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Phone Number" name="phone" rules={[{
            required: true,
            message: 'Please input your phone number!',
          }]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Company Name" name="companyName" rules={[{
            required: true,
            message: 'Please input your company name!',
          }]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Title" name="title">
            <Input/>
          </Form.Item>
          <Form.Item label="Leave your messages" name="suggestMsg" rules={[{
            required: true,
            message: 'Please leave your messages!',
          }]}>
            <Input.TextArea rows={4} style={{
              resize: 'none',
              background: '#EFF0F7',
              border: 'none',
            }}/>
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary" block htmlType="submit" className="btn-xl marginT32">Submit</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

ContactUsForm.propTypes = {
  type: PropTypes.string,
};

export default ContactUsForm;
