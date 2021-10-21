import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {httpLoading, updateIsPay} from '@/store/actions';
import {Form, InputNumber, message, Space, Table, Tooltip, Modal, Button, Input} from 'antd';
import {
  AppstoreAddOutlined,
  CloseCircleOutlined,
  FileSearchOutlined,
  FileProtectOutlined,
  SaveOutlined,
  FormOutlined,
  FolderViewOutlined,
} from '@ant-design/icons';
import store from '@/store';
import {setMenusData} from '@/store/actions';
import {get, post} from '@/utils/request';
import {
  SAVESEARCHRESULT,
  EXPORTDETAIL,
  ISPAID,
  GETEXTENDBYAUDI,
} from '@/api/index';
import ResultTable from '@/components/Table/ResultTable';
import './style.css';

const EditableCell = ({
  // eslint-disable-next-line react/prop-types
  editing, dataIndex, title, inputType, value, record, index, children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ?
    <InputNumber min={0}/> :
    <InputNumber min={1}/>;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
            height: 45,
          }}
          rules={[
            {
              required: true,
              message: `Required field`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditTable = ({userInfo, httpLoading, setHttpLoading, details, saveFunc, id}) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [creatJobForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState([]);
  const [viewDetails, setViewDetails] = useState([]);
  const [viewModal, setViewModal]= useState(false);
  const [lookID, setLookID]=useState(null);
  const [lookType, setLookType]=useState(null);
  const [dataTitle, setDataTitle] = useState('Details');
  const [isPayUser, setIsPayUser] =useState(false);
  const [extendModal, setextendModal] = useState(true);
  const isEditing = (record) => record.id === editingKey;

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
  useEffect(()=>{
    isPay();
  }, [isPayUser]);

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });

    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const valuesChange = (changedValues, allValues) => {
    if (Object.keys(changedValues).toString() === 'spend' ||
      Object.keys(changedValues).toString() === 'install' ||
      Object.keys(changedValues).toString() === 'cpi'
    ) {
      const Cpi = parseFloat(allValues.spend / allValues.install) ?? 0;
      form.setFieldsValue({cpi: Cpi});
    }
  };
  const saveSearchResult = (data) => {
    post(SAVESEARCHRESULT, {resultList: data}, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/json',
      'token': userInfo.token,
    }).then((res) => {
      console.log(res);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      saveFunc(id);
    });
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      console.log(key);
      const index = newData.findIndex((item) => key === item.key);
      console.log(index);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setData(newData);
        newData[0].id = editingKey;
        setHttpLoading(true);
        saveSearchResult(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        newData[0].id = editingKey;
        saveSearchResult(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const extend=()=>{
    setextendModal(true);
  };

  // const running=(itemId)=>{
  //   post(RESTARTJOB+itemId, {}, {
  //     // eslint-disable-next-line no-tabs
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'token': userInfo.token,
  //   }).then((res)=>{
  //     console.log(res);
  //   }).catch((error) => {
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   }).finally(() => {
  //     saveFunc(id);
  //   });
  // };
  // const killJob=(id)=>{
  //   console.log(id);
  //   post(CANCELJOB+id, '', {
  //     // eslint-disable-next-line no-tabs
  //     'Content-Type':'application/x-www-form-urlencoded',
  //     'token': userInfo.token,
  //   }).then((res)=>{
  //     message.success(res.msg);
  //   }).catch((error)=>{
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   }).finally(() => {
  //     saveFunc(id);
  //   });
  // };

  const columns = [
    {
      title: 'Audience ID',
      width: '150px',
      dataIndex: 'groupId',
    },
    {
      title: 'Spend',
      dataIndex: 'spend',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Impression',
      dataIndex: 'impression',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Click',
      dataIndex: 'clickCount',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Install',
      dataIndex: 'install',
      inputType: 'install',
      editable: true,
    },
    {
      title: 'Purchase',
      dataIndex: 'purchase',
      inputType: 'number',
      editable: true,
    },
    {
      title: 'ROAS',
      dataIndex: 'roas',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'CPI(Spend/Install)',
      dataIndex: 'cpi',
      inputType: 'number',
      editable: true,
    },
    {
      title: 'Action',
      // eslint-disable-next-line react/display-name
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="large">
            <Tooltip title="Save">
              <a type="link" onClick={() => save(record.key)}>
                <SaveOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
            <Tooltip title="Cancel">
              <a type="link" onClick={cancel}>
                <CloseCircleOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
          </Space>
        ) : (
          <Space size="large">
            <Tooltip title="Edit">
              <a type="link" onClick={() => edit(record)} disabled={editingKey !== ''}>
                <FormOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
            <Tooltip title="View Details">
              <a type="link" onClick={()=>{
                setViewModal(true);
                setLookID(record.id);
                setLookType(1);
                setViewDetails(record.searchDetails??[]);
                setDataTitle('Details');
              }}>
                <FileSearchOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
            {record.status===0&&(<Tooltip title="Extend">
              <a type="link" onClick={()=>extend()}>
                <AppstoreAddOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>)}
            {record.status===2&&(<Tooltip title="View Result">
              <a type="link" onClick={()=>{
                setViewModal(true);
                setLookID(record.id);
                setLookType(2);
                setDataTitle('Extend Search Results');
                setViewDetails(record.extendDetail??[]);
              }}>
                <FileProtectOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>)}
            {(record.status!==2&&record.status!==0)&&(<Tooltip title="View Job">
              <a type="link" onClick={()=>{
                history.push('/dashboard/jobManager?keyword='+record.jobName+'&id='+record.jobId);
                store.dispatch(setMenusData('jobManager', 'dashboard'));
              }}>
                <FolderViewOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>)}
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const addIndex=(data)=>{
    const tableData=data.map((item, index)=>{
      return {...item, index: index+1};
    })??[];
    return tableData;
  };
  const extendConfim = (title, id)=>{
    post(GETEXTENDBYAUDI, {
      searchResultId: id,
      jobName: title,
    }, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      store.dispatch(setMenusData('jobManager', 'dashboard'));
      history.push('/dashboard/jobManager?newID='+res.data.jobId+'&jobName='+res.data.jobName);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  return (
    <div >
      <Modal
        title={null}
        visible={extendModal}
        footer={null}
        width={650}
        onCancel={() => {
          setextendModal(false);
        }}>
        <h2>Create Job</h2>
        <p className="marginB32">Name your audience for identification in Job & Audience Manager</p>
        <Form name="creatJob" form={creatJobForm} onFinish={(values)=>{
          extendConfim(values.title, details[0].id);
          // history.push('/dashboard/jobManager?jobName='+values.title);
        }}>
          <Form.Item
            name="title"
            rules={[{required: true, message: 'Please input job name!'}]}
          >
            <Input placeholder="Input job name, ex: game name, audience/keyword, etc. " maxLength={255}/>
          </Form.Item>
          <Form.Item className="text-right">
            <Button
              className="btn-lg marginR32 marginT32"
              onClick={() => {
                setextendModal(false);
                creatJobForm.resetFields();
              }}>Cancel</Button>
            <Button type="primary" className="btn-lg" htmlType="submit">Save</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={dataTitle}
        width={1200}
        visible={viewModal}
        className="height900"
        footer={null}
        onOk={()=>{
          setViewDetails([]);
          setViewModal(false);
        }}
        onCancel={()=>{
          setViewDetails([]);
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
          {<ResultTable TableData={addIndex(viewDetails)}/>}
        </div>
      </Modal>
      <Form form={form} component={false} onValuesChange={valuesChange} >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={details}
          rowKey={(record) => record.id}
          rowClassName="editable-row"
          pagination={false}
          className="marginT16 amTable"
          loading={httpLoading}
        />
      </Form>
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

EditTable.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  details: PropTypes.arrayOf.isRequired,
  saveFunc: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditTable);
