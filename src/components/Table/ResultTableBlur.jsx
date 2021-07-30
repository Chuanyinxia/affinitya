import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Button, Space, Table, Tooltip, Card} from 'antd';

const ResultTableBlur = ({userInfo, TableData}) => {
  const blurData=(TableData)=>{
    if (!TableData) {
      return [];
    }
    const datas = TableData.map((item, index) => {
      return {
        ...item,
        index: index+1,
      };
    });
    if (datas.length===40) {
      for (let i = 41; i < 51; i++) {
        datas.push({
          index: i,
          keyword: 'BlursData',
          size: 3500000,
          path: 'Interests/Additional Interests/Sports betting',
        });
      }
    } else if (datas.length>40) {
      for (let i = 41; i < 51; i++) {
        datas[i-1].keyword='BlursData';
      }
    }
    return datas;
  };
  return (
    <Card className="marginT30">
      <div className="text-right marginB16">
        <Space>
          <Tooltip title="Pls upgrade to use this function.">
            <Button disabled>Save Audience</Button>
          </Tooltip>
          <Tooltip title="Pls upgrade to use this function.">
            <Button disabled>
                Export to CSV
            </Button>
          </Tooltip>
        </Space>
      </div>
      <Table dataSource={blurData(TableData)} pagination={{pageSize: 50}} >
        <Table.Column
          title="ID"
          key="id"
          dataIndex="index"
        />
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
    </Card>
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
