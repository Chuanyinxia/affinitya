import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Table} from 'antd';

const ResultTable = ({userInfo, TableData}) => {
  return (
    // eslint-disable-next-line new-cap
    <Table dataSource={TableData} pagination={{pageSize: 50}} >
      <Table.Column title="ID" key="id" dataIndex="index"/>
      <Table.Column title="Keyword" key="Keyword" dataIndex="keyword"/>
      <Table.Column title="Size" key="size" dataIndex="size" sorter={ (a, b) => a.size - b.size}/>
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResultTable);
