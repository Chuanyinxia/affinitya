/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Table,
  message,
  Row,
  Col,
  Radio,
  Space,
  Button,
} from 'antd';
import {httpLoading} from '@/store/actions';
import {GETTRANSACTION} from '@/api/index';
import {post} from '@/utils/request';


import './style.css';
const columns = [
  {
    title: 'Order Time',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: 'Package Name',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: 'Describtion',
    dataIndex: 'describe',
    key: 'describe',
  },
  {
    title: 'Amount',
    key: 'grossAmount',
    dataIndex: 'grossAmount',
  },
  {
    title: 'Payment Method',
    key: 'paymentMethod',
    dataIndex: 'paymentMethod',
  },
  {
    title: 'Action',
    render: (r) => (
      r.payStatus===1?<a>Invoice</a>:null
    ),
  },
];
const options = [
  {label: 'All', value: -1},
  {label: 'Paid', value: 1},
  {label: 'Unpaid', value: 0},
];

const Transactions = ({userInfo, httpLoading, setHttpLoading}) => {
  const [transaction, setTransaction] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getTransaction = (status) => {
    post(GETTRANSACTION, {
      pageNum: 1,
      pageSize: 99,
      status: status,
    }, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      setTransaction(res.data.items);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  useEffect(() => {
    getTransaction(1);
  }, []);
  return (
    <div className="content">
      <Row>
        <Col span={8}>
          <Space>
            <Radio.Group
              options={options}
              optionType="button"
              onChange={(e)=>{
                getTransaction(e.target.value);
              }}
              defaultValue={1}
            />
            <Button type="primary" disabled={selectedRowKeys.length===0?true:false}>Invoice All</Button>
          </Space>

        </Col>
      </Row>
      <Table
        rowKey={(r)=> r.id}
        columns={columns}
        dataSource={transaction}
        style={{marginTop: 24}}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows)=>{
            setSelectedRowKeys(selectedRowKeys);
          },
          type: 'CheckBox',
          getCheckboxProps: (record)=>{
            return {
              disabled: !(record.payStatus === 1),
            };
          },
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.getUserInfo.info,
    httpLoading: state.toggleHttpLoading.loading,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),
  };
};

Transactions.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Transactions);
