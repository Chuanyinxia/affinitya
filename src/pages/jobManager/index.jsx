import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, setMenusData} from '@/store/actions';
import './style.css';
import {GETJOBMANAGER, CANCELJOB, RESTARTJOB, EXPORTDETAIL, ISPAID, GETJOBDETAIL} from '@/api';
import {get, /* get,*/post} from '@/utils/request';
import {Table, Space, Tag, Tooltip, message, Card, Tabs, Button, Modal} from 'antd';
import {EyeOutlined, RedoOutlined, CloseOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';
import store from '@/store';
import {type} from '@/components/plugin/Searchdata';
import ResultTable from '@/components/Table/ResultTable';

const JobManger = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [isPayUser, setIsPayUser] =useState(false);
  const [viewDetail, setViewDetail] = useState([]);
  const [viewModal, setViewModal]= useState(false);
  const [lookID, setLookID]=useState(null);
  const [lookType, setLookType]=useState(null);
  const [jobList, setJobList]=useState([]);
  const [loading, setLoading]= useState(true);
  const [jobType, setJobType]=useState(type()??0);
  const [pagination, setPagination]=useState({
    current: 1,
    pageSize: 10,
    total: 0,
    type: jobType,
  });
  const getJobList=(page)=>{
    setLoading(true);
    const data={...page};
    if (parseInt(data.type)===0||!data.type) {
      data.type='';
    }
    post( GETJOBMANAGER,
        data, {
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
      getJobList({
        pageNum: 1,
        pageSize: 10,
        type: jobType,
      });
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
  const getJobDetails=(id)=>{
    get(GETJOBDETAIL+id, userInfo.token).then((res)=>{
      console.log(res);
      setViewModal(true);
      setLookID(res.data.kwResultVoList[0].id);
      setLookType(2);
      setViewDetail(res.data.kwResultVoList[0].searchDetails??[]);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const restartJob=(id)=>{
    post(RESTARTJOB+id, '', {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      message.success(res.msg);
      getJobList({
        pageNum: 1,
        pageSize: 10,
        type: jobType,
      });
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const addIndex=(data)=>{
    const tableData=data.map((item, index)=>{
      return {...item, index: index+1};
    })??[];
    return tableData;
  };
  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  useEffect(()=>{
    getJobList({
      pageNum: 1,
      pageSize: 10,
      type: jobType===false?'':jobType,
    });
    isPay();
  }, []);
  const View=(record)=>{
    if (record.type===3) {
      return ( <a type="link" onClick={()=>getJobDetails(record.id)}><EyeOutlined /></a>);
    }
    return ( <a onClick={()=>viewDetails(record.id, record.type)} type="link">
      <EyeOutlined />
    </a>);
  };
  return (
    <div>
      <p className="search-info">Unsaved audience will be deleted after 30 days.</p>
      <Card>
        <Tabs
          defaultActiveKey={jobType}
          onChange={(key)=>{
            setJobType(key);
            getJobList({
              pageNum: 1,
              pageSize: 10,
              type: key,
            });
          }}
        >
          <Tabs.TabPane tab="All" key={0} />
          <Tabs.TabPane tab="Keyword" key={1} />
          <Tabs.TabPane tab="Lookalike Audience" key={2} />
          <Tabs.TabPane tab="Extend" key={3} />
        </Tabs>
        <Table
          loading={loading}
          dataSource={jobList}
          pagination={pagination}
          onChange={(pagination)=>getJobList({...pagination, pageNum: pagination.current, type: jobType})}
        >
          <Table.Column title="Job ID" dataIndex="id" key="Job ID"/>
          <Table.Column title="Job Title" dataIndex="title" key="Job Title"/>
          <Table.Column title="Type" dataIndex="type" key="Type" render={(type)=>{
            return type===1?'Keyword':type===2?'Lookalike Audience':'Extend';
          }}/>
          <Table.Column title="Start Time" dataIndex="startTime" key="Start Time"/>
          <Table.Column
            title="Complete Time"
            dataIndex="endTime"
            key="Complete Time"
            render={(endTime, record)=>{
              return (endTime&&record.jobStatus===1)?endTime+`(Estimate)`:endTime;
            }}/>
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
                  {/* eslint-disable-next-line new-cap */}
                  {View(record)}
                </Tooltip>):
                (<Tooltip title="Restart the job">
                  <a onClick={()=>restartJob(record.id)} type="link">
                    <RedoOutlined />
                  </a>
                </Tooltip>)}
            </Space>
          )}/>
        </Table>
        <Modal
          title="Details"
          width={1200}
          visible={viewModal}
          className="height900"
          footer={null}
          onOk={()=>{
            setViewDetail([]);
            setViewModal(false);
          }}
          onCancel={()=>{
            setViewDetail([]);
            setViewModal(false);
          }}>
          <div >
            <div className="text-right marginB16">
              <Space>
                {isPayUser?(<Button
                  download
                  href={`${EXPORTDETAIL}${lookID}/${lookType}/${userInfo.token}`}
                  disabled={!isPayUser}>
                    Export to CSV
                </Button>):
                  (<Tooltip title="Pls upgrade to use this function.">
                    <Button
                      download
                      href={`${EXPORTDETAIL}${lookID}/${lookType}/${userInfo.token}`}
                      disabled={!isPayUser}>
                      Export to CSV
                    </Button>
                  </Tooltip>)
                }
              </Space>
            </div>
            {<ResultTable TableData={addIndex(viewDetail)}/>}
          </div>

        </Modal>
      </Card>
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

JobManger.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JobManger);
