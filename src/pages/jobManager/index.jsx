import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, setMenusData} from '@/store/actions';
import './style.css';
import {CANCELJOB, EXPORTDETAIL, GETJOBDETAIL, GETJOBMANAGER, ISPAID, RESTARTJOB, UPDATEJOBTITLE} from '@/api';
import {get, post, update} from '@/utils/request';
import {Alert, Button, Form, Input, message, Modal, Space, Table, Tabs, Tag, Tooltip} from 'antd';
import {EyeOutlined, SearchOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';
import store from '@/store';
import {type} from '@/components/plugin/Searchdata';
import ResultTable from '@/components/Table/ResultTable';

const jobMangerText = {
  title: 'Unsaved audience will be deleted after 30 days.',
};
const JobManger = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [isPayUser, setIsPayUser] = useState(false);
  const [viewDetail, setViewDetail] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [lookID, setLookID] = useState(null);
  const [lookType, setLookType] = useState(null);
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobType, setJobType] = useState(type() ?? 0);
  const [modalShow, setModalShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    type: jobType,
  });
  const onFinish = (value) => {
    const data = {
      ...value,
      id: editData.id,
    };
    // console.log(data);
    update(UPDATEJOBTITLE, data, {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      setModalShow(false);
      message.success('Success');
      creatJobForm.resetFields();
      getJobList({
        ...pagination,
        pageNum: pagination.current,
        type: jobType === false ? '' : jobType,
      });
      setEditData(null);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };

  const [creatJobForm] = Form.useForm();

  const getJobList = (page) => {
    setLoading(true);
    const data = {...page};
    if (parseInt(data.type) === 0 || !data.type) {
      data.type = '';
    }
    post(GETJOBMANAGER,
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
  useEffect(() => {
    getJobList({
      pageNum: 1,
      pageSize: 10,
      type: jobType === false ? '' : jobType,
    });
    isPay();
    // eslint-disable-next-line no-constant-condition
    if (false) {
      onView();
    }
  }, []);
  const onView = (record) => {
    if (record.type === 3) {
      return (<a type="link" onClick={() => getJobDetails(record.id)}><EyeOutlined/></a>);
    }
    return (<a onClick={() => viewDetails(record.id, record.type)} type="link">
      <EyeOutlined/>
    </a>);
  };
  const OperationsSlot = {
    left: null,
    right: <div style={{marginRight: 3}}>
      <Input size="small" style={{height: 40, width: 300}} placeholder="Search" prefix={<SearchOutlined/>}/>
    </div>,
  };

  return (
    <div className="margin_16">
      <Alert
        message={<p className="text-white text-center margin0">Job running has been successfully generated.</p>}
        banner type="success"
        closable/>

      <div className="paddingL32 paddingR32">
        <h1>Job Manager</h1>
        <h4 className="search-info marginB32">{jobMangerText.title}</h4>

        <Tabs
          tabBarExtraContent={OperationsSlot}
          defaultActiveKey={jobType}
          onChange={(key) => {
            setJobType(key);
            getJobList({
              pageNum: 1,
              pageSize: 10,
              type: key,
            });
          }}
        >
          <Tabs.TabPane tab="All" key={0}/>
          <Tabs.TabPane tab="Keyword" key={1}/>
          <Tabs.TabPane tab="Lookalike Audience" key={2}/>
          <Tabs.TabPane tab="Extend" key={3}/>
        </Tabs>
        <Table
          loading={loading}
          dataSource={jobList}
          pagination={pagination}
          onChange={(pagination) => getJobList({...pagination, pageNum: pagination.current, type: jobType})}
        >
          {/* <Table.Column title="Job Name" dataIndex="id" key="Job ID"/>*/}
          <Table.Column title="Job Name" dataIndex="title" key="Job Title"/>
          <Table.Column title="Type" dataIndex="type" key="Type" render={(type) => {
            return type === 1 ? 'Keyword' : type === 2 ? 'Lookalike Audience' : 'Extend';
          }}/>
          <Table.Column title="Start Time" dataIndex="startTime" key="Start Time"/>
          <Table.Column
            title="Complete Time"
            dataIndex="endTime"
            key="Complete Time"
            render={(endTime, record) => {
              return (endTime && (record.jobStatus === 1 || record.jobStatus === 5)) ? endTime + `(Estimate)` : endTime;
            }}/>
          <Table.Column title="Status" dataIndex="jobStatus" key="Status" render={(jobStatus) => (
            <Space>
              {(jobStatus === 1) ? (<Tag color="gold" className="no-border lg-tag">Running</Tag>) :
                (jobStatus === 2) ? (<Tag color="green" className="no-border lg-tag">Completed</Tag>) :
                  (jobStatus === 3) ? (<Tag color="purple" className="no-border lg-tag">Canceled</Tag>) :
                    (jobStatus === 4) ? (<Tag color="red" className="no-border lg-tag">Failed</Tag>) :
                      (<Tag color="lime" className="no-border lg-tag">Waiting</Tag>)}
            </Space>
          )}/>
          <Table.Column title="Action" key="Action" render={(record) => (
            <Space size="small">
              <Button type="text" className="btn-xs btn-red-link" onClick={() => {
                setEditData(record);
                setModalShow(true);
                creatJobForm.setFieldsValue({
                  jobTitle: record.title,
                });
              }}>Edit</Button>
              {(record.jobStatus === 1 || record.jobStatus === 5) ? (
                <Button
                  onClick={() => killJob(record.id)}
                  type="text"
                  className="btn-xs btn-red-link">
                  Cancel
                </Button>
              ) : (record.jobStatus === 2) ?
                (<Button
                  onClick={() => {
                    viewDetails(record.id, record.type);
                  }}
                  type="link"
                  className="btn-xs btn-red-link">
                    View
                </Button>
                ) :
                (<Button
                  onClick={() => {
                    restartJob(record.id);
                  }}
                  type="link"
                  className="btn-xs btn-red-link">
                  Restart
                </Button>)}
            </Space>
          )}/>
        </Table>
        <Modal
          title={null}
          visible={modalShow}
          footer={null}
          width={650}
          onCancel={() => {
            setModalShow(false);
            setEditData(null);
          }}>
          <h2>Edit Job</h2>
          <p className="marginB32">Name your audience for identification in Job & Audience Manager</p>
          <Form name="creatJob" form={creatJobForm} onFinish={onFinish}>
            <Form.Item
              name="jobTitle"
              rules={[{required: true, message: 'Please input job name!'}]}
            >
              <Input placeholder="Input job name, ex: game name, audience/keyword, etc. " maxLength={255}/>
            </Form.Item>
            <Form.Item className="text-right">
              <Button
                className="btn-lg marginR32 marginT32"
                onClick={() => {
                  setModalShow(false);
                  setEditData(null);
                  creatJobForm.resetFields();
                }}>Cancel</Button>
              <Button type="primary" className="btn-lg" htmlType="submit">Save</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Details"
          width={1200}
          visible={viewModal}
          className="height900"
          footer={null}
          onOk={() => {
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
                {isPayUser ? (<Button
                  download
                  href={`${EXPORTDETAIL}${lookID}/${lookType}/${userInfo.token}`}
                  disabled={!isPayUser}>
                    Export to CSV
                </Button>) :
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

      </div>

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
