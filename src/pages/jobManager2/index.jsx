import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, setMenusData, updateIsPay} from '@/store/actions';
import './style.css';
import {
  CANCELJOB,
  DELETEJOB,
  GETJOBDETAIL,
  GETJOBMANAGER,
  ISPAID,
  READJOBMANGER,
  RESTARTJOB,
  UPDATEJOBTITLE,
} from '@/api';
import {get, post, update} from '@/utils/request';
import {Alert, Button, Form, message, Modal, Popconfirm, Space, Table, Tabs, Tag, Tooltip, Typography} from 'antd';

import EditSvg from './../../icons/edit.svg';
import DeleteSvg from './../../icons/delete.svg';
import ViewSvg from './../../icons/view.svg';
import StopSvg from './../../icons/stop.svg';
import RestartSvg from './../../icons/restart.svg';

import {Link, useHistory} from 'react-router-dom';
import {type} from '@/components/plugin/Searchdata';
import KeyWordSearchDetails from '@/components/Table/KeyWordSearchDetails';
import qs from 'querystring';
import store from '@/store';
import {timeFormat} from '@/components/plugin/TimeFormat';
import {getColumnSearchProps} from '@/components/search/SearchOption';
import {getColumnSelectProps} from '@/components/search/SelectOption';
import {toDecodeSort, toTrim} from '@/components/search/TrimData';
import {countryStr} from '@/components/plugin/CountryStr';
// import {DeleteSvg, EditSvg, ViewSvg} from '@/icons/Icons';

const jobMangerText = {
  title: 'Unsaved audience will be deleted after 30 days.',
};
const JobManger2 = ({userInfo, httpLoading, setHttpLoading}) => {
  const history = useHistory();
  const [jobName, setJobName] = useState('');
  const [, setIsPayUser] = useState(false);
  const [viewDetail, setViewDetail] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [saveStatusType, setSaveStatusType]=useState(0);
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobType, setJobType] = useState(type() ?? 0);
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
  const [searchID, setSearchID] = useState('');
  const [searchName, setSearchName]=useState('');
  const [searchType, setSearchType] = useState('');
  const [searchConfig, setSearchConfig] = useState({});
  const loadPageVar = (sVar) => {
    return decodeURI(
        window.location.search.replace(
            new RegExp('^(?:.*[&\\?]' +
          encodeURI(sVar).replace(/[.+*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  };
  const onJobTitleChange = (value, id) => {
    const data = {
      jobTitle: value,
      id: id,
    };
    update(UPDATEJOBTITLE, data, {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      message.success('Success');
      creatJobForm.resetFields();
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      getJobList({
        pageSize: 10,
        pageNum: pagination.current,
        title: searchTitle,
        type: jobType === false ? '' : jobType,
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
  const getJobDetails=(id)=> {
    setLoading(true);
    get(GETJOBDETAIL + id, userInfo.token).then((res) => {
      setSearchConfig({
        ...res.data.baseSearchRequest,
        keywords: res.data.keywords,
        extend: res.data.extend,
        audience: res.data.audience,
      } || {});
      setViewDetail(res.data.kwResultVoList || []);
      setSearchID(res.data.kwResultVoList[0] ? res.data.kwResultVoList[0].searchId : '');
      setSaveStatusType(res.data.status);
      setViewModal(true);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setLoading(false);
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
  const jobReader=()=>{
    update(READJOBMANGER, '', {
      'token': userInfo.token,
    }).then(()=>{}).catch((error)=>{});
  };
  const deleteJob = (id) =>{
    update(DELETEJOB+id, '', {
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
  useEffect(() => {
    const data=history.location.search.split('?');
    const searchId = loadPageVar('id');
    const searchName = loadPageVar('keyword');
    setSearchName(searchName);
    const params={pageNum: 1,
      pageSize: 10,
      title: searchName,
      type: jobType === false ? '' : jobType,
      id: searchId,
    };
    isPay();
    // 新增Job阅读
    jobReader();
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
    if (searchName!=='') setSearchTitle(searchName);
    getJobList(params);
  }, [history.location]);

  const Columns=[{
    title: 'Job',
    dataIndex: 'title',
    key: 'title',
    ...getColumnSearchProps('job name', 'title', searchName),
    width: 220,
    // eslint-disable-next-line react/display-name
    render: (title, record)=> parseInt(record.id)===parseInt(newID)?
      (<span style={{wordBreak: 'break-all'}}>
        <span className="text-red">*</span>
        <Typography.Paragraph
          editable={{
            icon: <img src={EditSvg} width={18}/>,
            tooltip: 'Edit',
            onChange: (e) => onJobTitleChange(e, record.id),
          }}
        >
          {title}
        </Typography.Paragraph>
      </span>):(<Typography.Paragraph
        editable={{
          icon: <img src={EditSvg} width={18}/>,
          tooltip: 'Edit',
          onChange: (e) => onJobTitleChange(e, record.id),
        }}
      >
        {title}
      </Typography.Paragraph>),
  }, {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type) => type === 1 ? 'Keyword' :
      type === 2 ? 'Lookalike Audience' : 'Extend',
  }, {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    ...getColumnSelectProps('country', 'country'),
    render: (country) => countryStr(country),
  }, {
    title: 'OS',
    dataIndex: 'os',
    width: 80,
    key: 'os',
    filters: [
      {text: 'iOS', value: 'IOS'},
      {text: 'Android', value: 'Android'},
    ],
    filterMultiple: false,
    render: (os) => os === 'na' ? 'All' : os,
  }, {
    title: 'Start',
    dataIndex: 'startTime',
    key: 'start_time',
    sorter: true,
    render: (startTime)=>timeFormat(startTime),
  }, {
    title: 'End',
    dataIndex: 'endTime',
    key: 'end_time',
    sorter: true,
    render: (endTime, record) => (endTime && (record.jobStatus === 1 || record.jobStatus === 5)) ?
        timeFormat(endTime) + `(Estimate)` :
        timeFormat(endTime),
  }, {
    title: 'Status',
    dataIndex: 'jobStatus',
    key: 'status',
    filters: [
      {text: 'Running', value: 1},
      {text: 'Completed', value: 2},
      {text: 'Canceled', value: 3},
      {text: 'Failed', value: 4},
      {text: 'Waiting', value: 5},
    ],
    filterMultiple: false,
    // eslint-disable-next-line react/display-name
    render: (jobStatus, record) => <Space>
      {(jobStatus === 1) ? (<Tag color="gold" className="no-border lg-tag">Running</Tag>) :
        (jobStatus === 2) ? (<Tag color="green" className="no-border lg-tag">Completed</Tag>) :
          (jobStatus === 3) ? (<Tag color="purple" className="no-border lg-tag">Canceled</Tag>) :
            (jobStatus === 4) ? (<Tooltip title={record.failReason}>
              <Tag color="red" className="no-border lg-tag">Failed</Tag>
            </Tooltip>) :
              (<Tag color="lime" className="no-border lg-tag">Waiting</Tag>)}
    </Space>,
  }, {
    title: 'Action',
    key: 'Action',
    // eslint-disable-next-line react/display-name
    render: (record)=><Space size="small">
      <Popconfirm
        title="Are you sure to delete this job?"
        onConfirm={()=>deleteJob(record.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="text" size="small" className="btn-theme-link">
          <img src={DeleteSvg} width={18}/>
        </Button>
      </Popconfirm>
      {(record.jobStatus === 1 || record.jobStatus === 5) ? (
        <Popconfirm
          title="Are you sure to stop this job?"
          onConfirm={()=> killJob(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text" size="small"
            className="btn-theme-link">
            <img src={StopSvg} width={18}/>
          </Button>
        </Popconfirm>
      ) : (record.jobStatus === 2) ?
        (
          <Button
            onClick={() => {
              getJobDetails(record.id);
              setJobName(record.title);
              setSearchType(record.type);
            }}
            type="text" size="small"
            className="btn-theme-link">
            <img src={ViewSvg} width={18}/>
          </Button>
        ) :
        (
          <Popconfirm
            title="Are you sure to restart this job?"
            onConfirm={()=> restartJob(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text" size="small"
              className="btn-theme-link">
              <img src={RestartSvg} width={18}/>
            </Button>
          </Popconfirm>)}
    </Space>,
  },
  ];
  return (
    <div className="margin_16">
      {newID && (<Alert
        message={<p className="text-white text-center margin0">
          Job {jobName} has been successfully generated.
        </p>}
        banner type="success"
        closable/>)}
      {saveManger && (
        <Alert
          onClose={() => {
            setSaveManger(null);
            setJobName('');
          }}
          className="alertFixed"
          message={<p className="text-white text-center margin0">
            <Link
              onClick={() => {
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
          columns={Columns}
          scroll={{x: 910}}
          onChange={(pagination, filters, sort) =>{
            const filter = toTrim(filters);
            if (filters.title&&filters.title===' ') {
              setSearchName('');
            }
            const sorts=toDecodeSort(sort);
            getJobList({
              ...pagination,
              ...sorts,
              ...filter,
              pageNum: pagination.current,
              type: jobType,
            });
          }}
        />
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
          onCancel={() => {
            setViewDetail([]);
            setSearchConfig({});
            setViewModal(false);
          }}>
          <div>
            {viewDetail && (<KeyWordSearchDetails
              searchData={viewDetail}
              searchID={searchID}
              searchType={searchType}
              searchConfig={searchConfig}
              source={1}
              statusType={saveStatusType}
              jobSave={setSaveManger}
              jobName={jobName}
              hideCheckbox={true}
            />)}
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

JobManger2.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JobManger2);
