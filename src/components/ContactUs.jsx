import React, {} from 'react';
// import PropTypes from 'prop-types';
import {Button, Form, Input} from 'antd';

const ContactUsForm = () => {
  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={<span>Name <i className="require-mark">*</i></span>}>
          <Input/>
        </Form.Item>
        <Form.Item label={<span>Email Address <i className="require-mark">*</i></span>}>
          <Input/>
        </Form.Item>
        <Form.Item label={<span>Phone Number <i className="require-mark">*</i></span>}>
          <Input/>
        </Form.Item>
        <Form.Item label={<span>Company Name <i className="require-mark">*</i></span>}>
          <Input/>
        </Form.Item>
        <Form.Item label={<span>Title</span>}>
          <Input/>
        </Form.Item>
        <Form.Item label={<span>Leave your messages <i className="require-mark">*</i></span>}>
          <Input.TextArea rows={4} style={{
            resize: 'none',
            background: '#EFF0F7',
            border: 'none',
          }}></Input.TextArea>
        </Form.Item>
        <Form.Item>
          <Button type="primary" block style={{
            height: 58,
            lineHeight: '58px',
            marginTop: 28,
          }}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

ContactUsForm.propTypes = {};

export default ContactUsForm;