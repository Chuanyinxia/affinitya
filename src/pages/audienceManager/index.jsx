import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {
  GETSEARCHDETAIL,
  GETARCHIVELIST,
  UPDATEWINNERLIST,
  GETWINNERLIST,
  ISPAID,
  // EXPORTDETAIL,
  GETARCHIVEDETAIL,
  UPDATEGROUPNAME,
} from '@/api/index';
import {get, post, update} from '@/utils/request';
import {
  Spin,
  Row,
  Col,
  Input,
  Tree,
  message,
  Button,
  Menu,
  Dropdown,
  Modal,
  Space,
  // Tooltip,
  Form,
} from 'antd';
import {
  SearchOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  FilterOutlined,
  CrownOutlined,
  ExperimentOutlined,
  SaveOutlined,
  CloseOutlined,
  LineHeightOutlined,
} from '@ant-design/icons';
import EditTable from '@/pages/audienceManager/component/EditTable';
import ResultTable from '@/components/Table/ResultTable';
import KeyWordSearchDetails from '@/components/Table/KeyWordSearchDetails';
const AudienceManger = ({userInfo, httpLoading, setHttpLoading}) => {
  const [details, setDetails] = useState(null);
  const [editId, setEditId] = useState(null);
  const [treeData, settreeData] = useState([]);
  const [tabType, settabType] = useState(1);
  const [winnerList, setwinnerList] = useState([]);
  const [selectedTreeData, setselectedTreeData] = useState({});
  const [tableVisible, settableVisible] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewDetails, setViewDetails] = useState([]);
  const [isPayUser, setIsPayUser] =useState(false);
  // const [lookID, setLookID]=useState(null);
  // const [lookType, setLookType]=useState(null);
  const [archiveDetailModal, setArchiveDetailModal] = useState(false);
  const [renameModal, setrenameModal] = useState(false);
  const [archiveDetail, setArchiveDetail] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [currentName, setcurrentName] = useState('');
  const c = useRef();
  const renameLink = (
    <a rel="noopener noreferrer" href="javascript:void(0)"
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        setrenameModal(true);
      }}
    >
      Rename
    </a>
  );
  const viewListLink = (
    <a rel="noopener noreferrer" href="javascript:void(0)"
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        getArchiveDetails(c.current.id);
        setArchiveDetailModal(true);
      }}
    >
      View List
    </a>
  );
  const testingLink = (
    <a rel="noopener noreferrer" href="javascript:void(0)"
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        updateWiner(1, []);
      }}
    >
      Testing
    </a>
  );
  const archiveLink = (
    <a rel="noopener noreferrer" href="javascript:void(0)"
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        updateWiner(3, []);
      }}
    >
      Archive
    </a>
  );
  const deleteLink = (
    <a rel="noopener noreferrer" href="javascript:void(0)"
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        updateWiner(1, []);
      }}
    >
      Delete
    </a>
  );
  const sortMenu = (
    <Menu>
      <Menu.Item>
        <span>
          by time
        </span>
      </Menu.Item>
      <Menu.Item>
        <span>
          by country
        </span>
      </Menu.Item>
    </Menu>
  );
  const filterMenu = (
    <Menu>
      <Menu.Item>
        <span>
          looklike audience
        </span>
      </Menu.Item>
      <Menu.Item>
        <span>
          keyword
        </span>
      </Menu.Item>
    </Menu>
  );
  const archiveTopMenu = (
    <Menu>
      <Menu.Item>
        {viewListLink}
      </Menu.Item>
      <Menu.Item>
        {renameLink}
      </Menu.Item>
      <Menu.Item>
        {testingLink}
      </Menu.Item>
      <Menu.Item>
        {deleteLink}
      </Menu.Item>
    </Menu>
  );
  const testingToppMenu = (
    <Menu>
      <Menu.Item>
        {viewListLink}
      </Menu.Item>
      <Menu.Item>
        {renameLink}
      </Menu.Item>
      <Menu.Item>
        {archiveLink}
      </Menu.Item>
      <Menu.Item>
        {deleteLink}
      </Menu.Item>
    </Menu>
  );
  const archiveMenu = (
    <Menu>
      <Menu.Item>
        {viewListLink}
      </Menu.Item>
      <Menu.Item>
        {renameLink}
      </Menu.Item>
      <Menu.Item>
        {testingLink}
      </Menu.Item>
      <Menu.Item>
        {deleteLink}
      </Menu.Item>
    </Menu>
  );
  const testMenu = (
    <Menu>
      <Menu.Item>
        {viewListLink}
      </Menu.Item>
      <Menu.Item>
        {renameLink}
      </Menu.Item>
      <Menu.Item>
        {archiveLink}
      </Menu.Item>
      <Menu.Item>
        {deleteLink}
      </Menu.Item>
    </Menu>
  );
  const winnerMenu = (
    <Menu>
      <Menu.Item>
        {viewListLink}
      </Menu.Item>
      <Menu.Item>
        {renameLink}
      </Menu.Item>
      <Menu.Item>
        {archiveLink}
      </Menu.Item>
      <Menu.Item>
        {testingLink}
      </Menu.Item>
      <Menu.Item>
        {deleteLink}
      </Menu.Item>
    </Menu>
  );
  const updateGroupName = (title, type=2, id)=>{
    update(UPDATEGROUPNAME,
        {
          title: title,
          type: type,
          id: id,
        }, {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res) => {
      setrenameModal(false);
      getArchiveList(tabType, '', 99, 1);
      getWinnerList('', 999, 1);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
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
    isPay();
  }, [isPayUser]);
  const getWinnerList = (name, pageSize, pageNum)=>{
    const data = {
      name: name,
      pageSize: pageSize,
      pageNum: pageNum,
    };
    data.groupName===''?delete data.groupName:false;
    post(GETWINNERLIST, data,
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res) => {
      setwinnerList(res.data.items);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  const updateWiner = (type, checkList)=>{
    let data;
    if (checkList.length>0) {
      data = checkList.filter((item)=>!(item.children)).map((item)=>item.key.split('-')[1]);
    } else {
      data = c.current.id;
    }
    update(UPDATEWINNERLIST,
        {
          searchResultIds: data,
          status: type,
        }, {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res) => {
      getWinnerList('', 999, 1);
      getArchiveList(type===1?3:1, '', 999, 1);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  const getArchiveList = (status, searchData, pageSize, pageNum)=>{
    post(GETARCHIVELIST,
        {
          status: status,
          name: searchData,
          pageSize: 999,
          pageNum: 1,
        }, {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res) => {
      const data = {...res.data.items};
      const tree = [];
      let menu;
      if (status===1) {
        menu = testingToppMenu;
      } else if (status===3) {
        menu = archiveTopMenu;
      }
      Object.keys(data).forEach((key)=>{
        tree.push({
          title: (
            <div style={{width: 476}}>
              <span className="tree-title">
                {data[key].length>0?data[key][0].jobName:'error'}
              </span>
              <span className="more-icon">
                <Dropdown overlay={menu} arrow trigger={['click']} placement="bottomLeft" onVisibleChange>
                  <MoreOutlined onClick={(e)=>{
                  }}/>
                </Dropdown>
              </span>
            </div>
          ),
          key: key,
          children: (()=>{
            const arr = [];
            data[key].forEach((item)=>{
              let menu;
              if (status===1) {
                menu = testMenu;
              } else if (status===3) {
                menu = archiveMenu;
              }
              arr.push({
                title: (
                  <div style={{width: 452}}>
                    <span className="tree-title" title={item.groupName}>
                      {item.groupName}
                    </span>
                    <span className="more-icon">
                      <Dropdown overlay={menu} arrow trigger={['click']} placement="bottomLeft" onVisibleChange>
                        <MoreOutlined onClick={(e)=>{
                        }}/>
                      </Dropdown>
                    </span>
                  </div>
                ),
                key: `${key}-${item.searchResultId}`,
              });
            });
            return arr;
          })(),
        });
      });
      settreeData(tree);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  const getArchiveDetails = (ids) => {
    setHttpLoading(true);
    get(GETARCHIVEDETAIL +'/'+ ids, userInfo.token).then((res) => {
      const data=res.data;
      setArchiveDetail(data);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  const getDetails = (id) => {
    setHttpLoading(true);
    get(GETSEARCHDETAIL + id, userInfo.token).then((res) => {
      setDetails(res.data);
      setViewDetails(res.data);
      setEditId(id);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  useEffect(() => {
    getArchiveList(1, '', 999, 1);
    getWinnerList('', 999, 1);
  }, []);
  return (
    <div className="paddingB16">
      <Modal
        title="Rename"
        width={600}
        visible={renameModal}
        className="height900"
        footer={null}
        destroyOnClose
        onOk={() => {
          setrenameModal(false);
        }}
        onCancel={()=>{
          setrenameModal(false);
        }}>
        <Form onFinish={(values)=>updateGroupName(values.title, c.current.type, c.current.jobId)}>
          <Form.Item rules={[{required: true, message: 'Please input job/audience name'}]} name="title">
            <Input placeholder="Input job/audience name" maxLength="50"></Input>
          </Form.Item>
          <Form.Item className="text-right">
            <Space>
              <Button size="large" onClick={()=>setrenameModal(false)}>Cancel</Button>
              <Button htmlType="submit" type="primary" size="large">Save</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={null}
        width={1200}
        visible={archiveDetailModal}
        className="height900"
        footer={null}
        onOk={() => {
          setArchiveDetailModal(false);
        }}
        onCancel={()=>{
          setArchiveDetailModal(false);
        }}>
        <div >
          <KeyWordSearchDetails searchData={archiveDetail} statusType={0}/>
        </div>
      </Modal>
      <Modal
        title="Details"
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
            {/* <Space>
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
            </Space> */}
          </div>
          {<ResultTable TableData={addIndex(viewDetails)}/>}
        </div>
      </Modal>
      <Spin spinning={httpLoading}>
        <h1 style={{paddingLeft: 32, paddingTop: 12}}>Audience Manager</h1>
        <h4 style={{paddingLeft: 32, marginBottom: 28}}>
          Manage and edit the audiences you are testing. Record the performance of the Winning audiences.</h4>
        <Row>
          <Col sm={24} md={9}>
            <div className="text-box">
              <div className="box-wrapper">
                <div className="tab-box">
                  <div className={tabType===1?'tab-title active':'tab-title'} onClick={()=>{
                    settabType(1);
                    getArchiveList(1, '', 99, 1);
                  }}><ExperimentOutlined style={{marginRight: 12}}/>Testing</div>
                  <div className={tabType===3?'tab-title active':'tab-title'} onClick={()=>{
                    settabType(3);
                    getArchiveList(3, '', 99, 1);
                  }}><SaveOutlined style={{marginRight: 12}}/>Archive</div>
                </div>
              </div>
              <div className="box-wrapper">
                <div className="search-box">
                  <Input prefix={<SearchOutlined />} placeholder="search" allowClear
                    onChange={(e)=>{
                      if (e.target.value==='') getArchiveList(tabType===1?3:1, '', 99, 1);
                    }}
                    onPressEnter={(e)=>getArchiveList(tabType===1?3:1, e.target.value, 99, 1)}
                  ></Input>
                </div>
              </div>
              <div className="data-tree-box">
                <Tree
                  checkable
                  onCheck={(checkedKeys, info)=>{
                    setCheckedKeys(checkedKeys);
                    setselectedTreeData(info);
                  }}
                  treeData={treeData}
                  // selectable={false}
                  onSelect={(selectedKeys, info)=>{
                    let data;
                    let type;
                    let jobId = info.node.key;
                    const name = info.node.title.props.children[0];
                    if (info.node.children) {
                      data = info.node.children.map((item)=>item.key.split('-')[1]).join(',');
                      type = 1;
                    } else {
                      data = info.node.key.split('-')[1];
                      type = 2;
                    }
                    if (jobId.includes('-')) jobId = jobId.split('-')[1];
                    c.current = {
                      id: data,
                      name: name,
                      type: type,
                      jobId: jobId,
                    };
                  }}
                />
              </div>
              <div className="save-btn-box">
                <Button className="save-btn" onClick={
                  ()=>updateWiner(2, selectedTreeData.checkedNodes)
                } disabled={checkedKeys.length===0}><CrownOutlined/>Save as Winner</Button>
              </div>
            </div>
          </Col>
          <Col sm={24} md={15}>
            <div className="winner-box">
              <div className="box-wrapper">
                <div className="winner-title-box">
                  <div className="winner-title"><CrownOutlined style={{marginRight: 12}}/>Winner</div>
                  <div className="winner-icon" style={{marginRight: 24}}>
                    <Dropdown overlay={sortMenu} arrow trigger={['click']} placement="bottomLeft" onVisibleChange>
                      <LineHeightOutlined />
                    </Dropdown>
                  </div>
                  <div className="winner-icon">
                    <Dropdown overlay={filterMenu} arrow trigger={['click']} placement="bottomLeft" onVisibleChange>
                      <FilterOutlined />
                    </Dropdown>
                  </div>
                  {/* <div className="winner-icon"><SearchOutlined /></div> */}
                  <div className="winner-search-box">
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="search"
                      allowClear
                      onChange={(e)=>{
                        if (e.target.value==='') {
                          getWinnerList('', 999, 1);
                        }
                      }}
                      onPressEnter={(e)=>getWinnerList(e.target.value, 999, 1)}
                      className="winner-search-input"
                    />
                  </div>
                </div>
              </div>
              <div className="box-wrapper">
                <div className="card-group">
                  {winnerList.map((item, index)=>(
                    <div className={item.check?'card-item active':
                      item.saveStatus===0?'card-item':
                        'card-item edited'} key={item.searchId} onClick={()=>{
                      const data = [...winnerList];
                      data.forEach((item)=>item.check=false);
                      data[index].check = true;
                      setwinnerList(data);
                      getDetails(item.searchResultId);
                      c.current = {
                        id: item.searchResultId,
                      };
                      setcurrentName(item.groupName);
                      settableVisible(true);
                    }}>
                      <div
                        style={{color: '#4E4B66', fontSize: 16, height: 48, lineHeight: '48px', fontWeight: '600'}}
                      >{item.groupName}</div>
                      <div
                        style={{color: '#4E4B66', fontSize: 12, height: 30, lineHeight: '30px', marginTop: 8}}
                      >{item.jobName}</div>
                      <div
                        style={{color: '#4E4B66', fontSize: 12, height: 30, lineHeight: '30px', marginTop: 20}}>
                        <ClockCircleOutlined style={{fontSize: 20, fontWeight: '600', float: 'left', marginTop: 5}}/>
                        <div
                          style={{paddingLeft: 16, height: 30, lineHeight: '30px', float: 'left'}}
                        >{item.createTime}</div>
                        <div style={{
                          paddingLeft: 16,
                          float: 'right',
                          fontSize: 32,
                          fontWeight: '600',
                        }}
                        onClick={(e)=>{
                          e.stopPropagation();
                          c.current = {
                            id: item.searchResultId,
                            jobId: item.searchResultId,
                          };
                        }}
                        >
                          <Dropdown onVisibleChange
                            overlay={winnerMenu} arrow trigger={['click']} placement="bottomLeft">
                            <span>...</span>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* <div className="card-item active">
                    <div
                      style={{color: '#4E4B66', fontSize: 16, height: 48, lineHeight: '48px', fontWeight: '600'}}
                    >name</div>
                    <div
                      style={{color: '#4E4B66', fontSize: 12, height: 30, lineHeight: '30px', marginTop: 8}}>desc</div>
                    <div
                      style={{color: '#4E4B66', fontSize: 12, height: 30, lineHeight: '30px', marginTop: 20}}>
                      <ClockCircleOutlined style={{fontSize: 20, fontWeight: '600'}}/>
                      <span style={{paddingLeft: 16}}>time</span>
                      <span style={{paddingLeft: 16, float: 'right', fontSize: 32, fontWeight: '600'}}>...</span>
                    </div>
                  </div> */}
                  {/* <div className="card-item edited">
                    <div
                      style={{color: '#4E4B66', fontSize: 16, height: 48, lineHeight: '48px', fontWeight: '600'}}
                    >name</div>
                    <div
                      style={{color: '#4E4B66', fontSize: 12, height: 30, lineHeight: '30px', marginTop: 8}}>desc</div>
                    <div
                      style={{color: '#4E4B66', fontSize: 12, height: 30, lineHeight: '30px', marginTop: 20}}>
                      <ClockCircleOutlined style={{fontSize: 20, fontWeight: '600'}}/>
                      <span style={{paddingLeft: 16}}>time</span>
                      <span style={{paddingLeft: 16, float: 'right', fontSize: 32, fontWeight: '600'}}>...</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {/* <Row>
          <Col span={24} className="edit-box">
            <EditTable details={details} id={editId} saveFunc={getDetails}/>
          </Col>
        </Row> */}
        {tableVisible?<div style={{width: '83.6%', padding: '0px 32px', position: 'fixed', bottom: 0}}>
          <div style={{padding: '20px 40px', background: '#fff', borderRadius: '16px'}}>
            <div style={{overflow: 'hidden', marginBottom: 24}}>
              <div style={{float: 'left'}}>{currentName}</div>
              <div style={{float: 'right', cursor: 'pointer'}}>
                <CloseOutlined style={{fontSize: 20}} onClick={()=>{
                  const data = [...winnerList];
                  data.forEach((item)=>item.check=false);
                  setwinnerList(data);
                  settableVisible(false);
                }}/>
              </div>
            </div>
            <EditTable details={details} id={editId} hideFirstButton={true} saveFunc={()=>{
              settableVisible(true);
              getDetails(c.current.id);
            }} style={{marginTop: 24}}/>
          </div>
        </div>:null}
      </Spin>
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

AudienceManger.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AudienceManger);
