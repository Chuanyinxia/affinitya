import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, setMenusData} from '@/store/actions';
import './style.css';
import {GETJOBMANAGER, CANCELJOB, RESTARTJOB} from '@/api';
import {/* get,*/post} from '@/utils/request';
import {Table, Space, Tag, Tooltip, message, Card} from 'antd';
import {EyeOutlined, RedoOutlined, CloseOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';
import store from '@/store';
import {type} from '@/components/plugin/Searchdata';

const JobManger = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [jobList, setJobList]=useState([]);
  const [loading, setLoading]= useState(true);
  const [pagination, setPagination]=useState({
    current: 1,
    pageSize: 10,
    total: 0,
    type: type(),
  });
  const getJobList=(page)=>{
    setLoading(true);
    post( GETJOBMANAGER,
        {
          pageNum: page.current,
          pageSize: page.pageSize,
          type: pagination.type,
        }, {
          // eslint-disable-next-line no-tabs
          'Content-Type':	'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res)=>{
      setJobList(res.data.items);
      setPagination({
        current: res.data.pageNum,
        pageSize: res.data.pageSize,
        total: (res.data.pageSize*res.data.totalPage)??0,
      });
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setLoading(false);
    });
  };
  const killJob=(id)=>{
    console.log(id);
    post(CANCELJOB+id, '', {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      message.success(res.msg);
      getJobList({current: 1,
        pageSize: 10});
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const viewDetails=(id, type)=>{
    // type=>1 keyword
    history.push('/dashboard/audienceGenerator?id='+id+'&type='+type);
    store.dispatch(setMenusData('audienceGenerator', 'dashboard'));
  };
  const restartJob=(id)=>{
    post(RESTARTJOB+id, '', {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      message.success(res.msg);
      getJobList({current: 1,
        pageSize: 10});
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };

  useEffect(()=>{
    getJobList(pagination);
  }, []);
  return (
    <Card>
      <Table
        loading={loading}
        dataSource={jobList}
        pagination={pagination}
        onChange={(pagination)=>getJobList(pagination)}
      >
        <Table.Column title="Job ID" dataIndex="id" key="Job ID"/>
        <Table.Column title="Job Title" dataIndex="title" key="Job Title"/>
        <Table.Column title="Start  Time" dataIndex="startTime" key="Start  Time"/>
        <Table.Column title="Complete Time" dataIndex="endTime" key="Complete Time"/>
        <Table.Column title="Status" dataIndex="jobStatus" key="Status" render={(jobStatus) =>(
          <Space>
            {(jobStatus===1)?(<Tag color="purple">Running</Tag>):
            (jobStatus===2)?(<Tag color="green">Completed</Tag>):
              (jobStatus===3)?(<Tag>Canceld</Tag>):(<Tag color="error">Failed</Tag>)}
          </Space>
        )}/>
        <Table.Column title="Action" key="Action" render={(record) => (
          <Space size="middle">
            {(record.jobStatus===1)?(
              <Tooltip title="Kill the job">
                <a onClick={()=>killJob(record.id)} type="link">
                  <CloseOutlined />
                </a>
              </Tooltip>
              ): (record.jobStatus===2)?
              (<Tooltip title="View the audience generated">
                <a onClick={()=>viewDetails(record.id, record.type)} type="link">
                  <EyeOutlined />
                </a>
              </Tooltip>):
              (<Tooltip title="Restart the job">
                <a onClick={()=>restartJob(record.id)} type="link">
                  <RedoOutlined />
                </a>
              </Tooltip>)}
          </Space>
        )}/>
      </Table>
    </Card>
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

JobManger.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JobManger);
