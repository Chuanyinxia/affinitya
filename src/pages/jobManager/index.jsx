import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, setMenusData, updateIsPay} from '@/store/actions';
import './style.css';
import {CANCELJOB, GETJOBDETAIL, GETJOBMANAGER, ISPAID, RESTARTJOB, UPDATEJOBTITLE} from '@/api';
import {get, post, update} from '@/utils/request';
import {Alert, Button, Form, Input, message, Modal, Space, Table, Tabs, Tag, Tooltip} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';
// import store from '@/store';
import {type} from '@/components/plugin/Searchdata';
// import ResultTable from '@/components/Table/ResultTable';
import KeyWordSearchDetails from '@/components/Table/KeyWordSearchDetails';
import {Link} from 'react-router-dom';
import qs from 'querystring';
import store from '@/store';

const jobMangerText = {
  title: 'Unsaved audience will be deleted after 30 days.',
};
const JobManger = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [jobName, setJobName]=useState('');
  const [, setIsPayUser] = useState(false);
  const [viewDetail, setViewDetail] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [saveStatusType, setSaveStatusType]=useState(0);
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
    size: 'small',
    showSizeChanger: false,
    hideOnSinglePage: true,
  });
  const [newID, setNewID]=useState(null);
  const [creatJobForm] = Form.useForm();
  const [searchTitle, setSearchTitle]=useState('');
  const [saveManger, setSaveManger]= useState(null);

  const loadPageVar = (sVar) => {
    return decodeURI(
        window.location.search.replace(
            new RegExp('^(?:.*[&\\?]' +
          encodeURI(sVar).replace(/[.+*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  };
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
        pageSize: 10,
        pageNum: pagination.current,
        title: searchTitle,
        type: jobType === false ? '' : jobType,
      });
      setEditData(null);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
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
        ...pagination,
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
    post(CANCELJOB+id, '', {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      message.success(res.msg);
      getJobList({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        title: searchTitle,
        type: jobType,
      });
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const getJobDetails=(id)=>{
    get(GETJOBDETAIL+id, userInfo.token).then((res)=>{
      setViewDetail(res.data.kwResultVoList);
      setSaveStatusType(res.data.status);
      setViewModal(true);
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
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        title: searchTitle,
        type: jobType,
      });
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
      store.dispatch(updateIsPay(res.data));
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const onSearch=(e)=>{
    let searchData;
    if (e&&e.target) searchData = e.target.value;
    else searchData = e;
    setSearchTitle(searchData.trim()??'');
    getJobList({
      pageNum: 1,
      pageSize: pagination.pageSize,
      title: searchData.trim()??'',
      type: jobType,
    });
  };

  useEffect(() => {
    const data=history.location.search.split('?');
    const searchData = loadPageVar('id');
    const params={pageNum: 1,
      pageSize: 10,
      title: searchData,
      type: jobType === false ? '' : jobType};
    isPay();
    // eslint-disable-next-line no-constant-condition
    if (data.length>1) {
      const search=qs.parse(data[1]);
      if (search.newID) {
        setNewID(search.newID);
        setJobName(search.jobName);
      }
      if (search.searchID) {
        params.id=search.searchID;
        setSearchTitle(search.jobName);
      }
    }
    getJobList(params);
  }, []);
  // useEffect(() => {
  //   const searchData = loadPageVar('id');
  //   if (searchData!=='') onSearch(searchData);
  // }, []);
  // useEffect(() => {
  //   const searchData = loadPageVar('jobName');
  //   if (searchData!=='') onSearch(location.search.split('=')[1]);
  // }, []);
  const OperationsSlot = {
    left: null,
    right: <div style={{marginRight: 3}}>
      <Input
        size="small"
        style={{height: 40, width: 220}}
        placeholder="Search"
        value={searchTitle}
        onChange={(e)=>setSearchTitle(e.target.value)}
        onPressEnter={onSearch}
        prefix={<SearchOutlined/>}
      />
    </div>,
  };

  return (
    <div className="margin_16">
      {newID&&( <Alert
        message={<p className="text-white text-center margin0">
          Job {jobName} has been successfully generated.
        </p>}
        banner type="success"
        closable/>)}
      {saveManger&&( <Alert
        onClose={()=> {
          setSaveManger(null);
          setJobName('');
        }}
        className="alertFixed"
        message={<p className="text-white text-center margin0">
          <Link
            onClick={()=>{
              store.dispatch(setMenusData('audienceManager', 'dashboard'));
            }}
            to={`/dashboard/audienceManager?searchId=${saveManger.searchId}${saveManger.groupId?
              '&groupId='+saveManger.groupId:''}` }>
            {jobName} has been added to Audience Manager for testing.
          </Link>
        </p>}
        banner type="success"
        closable/>)}
      <div className="padding32">
        <h1 >Job Manager</h1>
        <h4 className="search-info marginB16">{jobMangerText.title}</h4>

        <Tabs
          tabBarExtraContent={OperationsSlot}
          defaultActiveKey={jobType}
          onChange={(key) => {
            setJobType(key);
            getJobList({
              pageNum: 1,
              pageSize: 10,
              title: searchTitle,
              type: key,
            });
          }}
        >
          <Tabs.TabPane tab="&nbsp;&nbsp;All&nbsp;&nbsp;" key={0}/>
          <Tabs.TabPane tab="Keyword" key={1}/>
          <Tabs.TabPane tab="Lookalike Audience" key={2}/>
          <Tabs.TabPane tab="Extend" key={3}/>
        </Tabs>
        <Table
          loading={loading}
          dataSource={jobList}
          pagination={pagination}
          onChange={(pagination) =>
            getJobList({
              ...pagination,
              pageNum: pagination.current,
              title: searchTitle,
              type: jobType,
            })}
        >
          {/* <Table.Column title="Job Name" dataIndex="id" key="Job ID"/>*/}
          <Table.Column
            title="Job Name"
            dataIndex="title"
            key="Job Title"
            style={{wordBreak: 'break-all'}}
            render={(title, record)=>{
              return parseInt(record.id)===parseInt(newID)?
                (<span><span className="text-red">*</span>{title}</span>):title;
            }}/>
          <Table.Column title="Type" dataIndex="type" key="Type" render={(type) => {
            return type === 1 ? 'Keyword' : type === 2 ? 'Lookalike Audience' : 'Extend';
          }}/>
          <Table.Column title="Detail" dataIndex="detail" key="detail"/>
          <Table.Column title="Start Time" dataIndex="startTime" key="Start Time"/>
          <Table.Column
            title="Complete Time"
            dataIndex="endTime"
            key="Complete Time"
            render={(endTime, record) => {
              return (endTime && (record.jobStatus === 1 || record.jobStatus === 5)) ? endTime + `(Estimate)` : endTime;
            }}/>
          <Table.Column title="Status" dataIndex="jobStatus" key="Status" render={(jobStatus, record) => (
            <Space>
              {(jobStatus === 1) ? (<Tag color="gold" className="no-border lg-tag">Running</Tag>) :
                (jobStatus === 2) ? (<Tag color="green" className="no-border lg-tag">Completed</Tag>) :
                  (jobStatus === 3) ? (<Tag color="purple" className="no-border lg-tag">Canceled</Tag>) :
                    (jobStatus === 4) ? ( <Tooltip title={record.failReason}>
                      <Tag color="red" className="no-border lg-tag">Failed</Tag>
                    </Tooltip>) :
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
                    getJobDetails(record.id);
                    setJobName(record.title);
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
          className="hideOverFlow"
          title={null}
          width={1200}
          visible={viewModal}
          destroyAll
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
            {<KeyWordSearchDetails
              searchData={viewDetail}
              statusType={saveStatusType}
              jobSave={setSaveManger}
              jobName={jobName}
            />}
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
