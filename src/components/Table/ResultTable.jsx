import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Table, Statistic} from 'antd';

const ResultTable = ({userInfo, TableData, onSelect, groupId, hideCheckbox}) => {
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      onSelect(selectedRowKeys, selectedRows, groupId);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    // eslint-disable-next-line new-cap
    <Table
      rowSelection={
        !hideCheckbox?{...rowSelection}:null
      }
      dataSource={TableData}
      scroll={{y: 400}}
      rowKey={(record)=> record.id}
      pagination={{
        pageSize: 100,
        showSizeChanger: false,
        size: 'small',
        hideOnSinglePage: true,
      }}>
      <Table.Column title="ID" key="id" dataIndex="index"/>
      <Table.Column title="Keyword" key="Keyword" dataIndex="keyword"/>
      <Table.Column title="Size" key="size" dataIndex="size" sorter={(a, b) => a.size - b.size}
        render={(size)=><Statistic value={size} valueStyle={{fontSize: 12}}/>}
      />
      <Table.Column title="Path" key="Path" dataIndex="path"/>
    </Table>

  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),
  };
};

ResultTable.propTypes = {
  userInfo: PropTypes.object.isRequired,
  TableData: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
  hideCheckbox: PropTypes.bool.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResultTable);
