import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Table} from 'antd';

const ResultTableBlur = ({userInfo, TableData}) => {
  const blurData=(TableData)=>{
    const datas=[...TableData];
    for (let i=40; i<50; i++) {
      datas.push({index: i, keyword: 'BlursData', size: 1999, path: '111'});
    }
    return datas;
  };
  return (
    // eslint-disable-next-line new-cap
    <Table dataSource={blurData(TableData)} pagination={{pageSize: 50}} >
      <Table.Column
        title="ID"
        key="id"
        dataIndex="index"
        render={(index, record)=>(
          <span className={record.keyword==='BlursData'?'blurs':''}>
            {index}
          </span>
        )}/>
      <Table.Column
        title="Keyword"
        key="Keyword"
        dataIndex="keyword"
        render={(keyword, record)=>(
          <span className={record.keyword==='BlursData'?'blurs':''}>
            {keyword}
          </span>)}
      />
      <Table.Column
        title="Size"
        key="size"
        dataIndex="size"
        render={(size, record)=>(
          <span className={record.keyword==='BlursData'?'blurs':''}>
            {size}
          </span>)}
        sorter={ (a, b) => a.size - b.size}/>
      <Table.Column
        title="Path"
        key="Path"
        dataIndex="path"
        render={(path, record)=>(
          <span className={record.keyword==='BlursData'?'blurs':''}>
            {path}
          </span>)}
      />
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

ResultTableBlur.propTypes = {
  userInfo: PropTypes.object.isRequired,
  TableData: PropTypes.array.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResultTableBlur);
