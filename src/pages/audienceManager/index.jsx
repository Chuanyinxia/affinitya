import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import store from '../../store';
import {httpLoading, getMangerCounts, updateIsPay} from '@/store/actions';
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
  UPDATENOREADAUDIENCE,
} from '@/api/index';
import {get, post, update} from '@/utils/request';
import {storage} from '@/utils/storage';
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
  Divider,
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
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import EditTable from '@/pages/audienceManager/component/EditTable';
import ResultTable from '@/components/Table/ResultTable';
import KeyWordSearchDetails from '@/components/Table/KeyWordSearchDetails';
const AudienceManger = ({userInfo, httpLoading, setHttpLoading}) => {
  const [renameForm] = Form.useForm();
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
  const [archiveDetailModal, setArchiveDetailModal] = useState(false);
  const [renameModal, setrenameModal] = useState(false);
  const [archiveDetail, setArchiveDetail] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [currentName, setcurrentName] = useState('');
  const [currentJob, setcurrentJob] = useState('');
  const [sortType, setsortType] = useState(1);
  const [filterType, setfilterType] = useState(0);
  const [sortedWinnerList, setsortedWinnerList] = useState([]);
  const [currentIndex, setcurrentIndex] = useState(-1);
  const [isFirst, setisFirst] = useState(true);
  const [searchID, setSearchID] = useState('');
  const [searchSource, setSearchSource] = useState(1);
  const [searchType, setSearchType] = useState('');
  const c = useRef();
  const tabRef = useRef();
  const renameLink = (
    <a rel="noopener noreferrer" href="javascript:void(0)"
      onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        setrenameModal(true);
        initWinnerList();
        setTimeout(()=>{
          renameForm.setFieldsValue({
            title: c.current.name,
          });
        }, 100);
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
        initWinnerList();
        updateWiner(tabType, 1, []);
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
        initWinnerList();
        updateWiner(tabType, 3, []);
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
        initWinnerList();
        updateWiner(tabType, 1, []);
      }}
    >
      Delete
    </a>
  );
  const initWinnerList = ()=>{
    const data = [...sortedWinnerList];
    data.forEach((item)=>item.check = false);
    setsortedWinnerList(data);
    settableVisible(false);
  };
  const sortMenuByT = (
    <Menu>
      <Menu.Item danger>
        <span>
          by time
        </span>
      </Menu.Item>
      <Menu.Item onClick={()=>{
        setsortType(2);
        initWinnerList();
        setsortedWinnerList(winnerList.sort((a, b)=>a.source.localeCompare(b.source)));
      }}
      >
        <span>
          by country
        </span>
      </Menu.Item>
    </Menu>
  );
  const sortMenuByC = (
    <Menu>
      <Menu.Item onClick={()=>{
        setsortType(1);
        initWinnerList();
        setsortedWinnerList(winnerList.sort((a, b)=>new Date(b.createTime).getTime()-new Date(a.createTime).getTime()));
      }}>
        <span>
          by time
        </span>
      </Menu.Item>
      <Menu.Item danger>
        <span>
          by country
        </span>
      </Menu.Item>
    </Menu>
  );
  const filterMenuByA = (
    <Menu>
      <Menu.Item onClick={()=>{
        setfilterType(0);
        initWinnerList();
        setsortedWinnerList(winnerList);
      }}>
        <span>
          all
        </span>
      </Menu.Item>
      <Menu.Item danger>
        <span>
          lookalike audience
        </span>
      </Menu.Item>
      <Menu.Item onClick={()=>{
        setfilterType(1);
        initWinnerList();
        setsortedWinnerList(winnerList.filter((item)=>item.type===1));
      }}>
        <span>
          keyword
        </span>
      </Menu.Item>
    </Menu>
  );
  const filterMenuByk = (
    <Menu>
      <Menu.Item onClick={()=>{
        setfilterType(0);
        initWinnerList();
        setsortedWinnerList(winnerList);
      }}>
        <span>
          all
        </span>
      </Menu.Item>
      <Menu.Item onClick={()=>{
        setfilterType(2);
        initWinnerList();
        setsortedWinnerList(winnerList.filter((item)=>item.type===2));
      }}>
        <span>
          lookalike audience
        </span>
      </Menu.Item>
      <Menu.Item danger>
        <span>
          keyword
        </span>
      </Menu.Item>
    </Menu>
  );
  const filterMenuA = (
    <Menu>
      <Menu.Item danger>
        <span>
          all
        </span>
      </Menu.Item>
      <Menu.Item onClick={()=>{
        setfilterType(2);
        initWinnerList();
        setsortedWinnerList(winnerList.filter((item)=>item.type===2));
      }}>
        <span>
          lookalike audience
        </span>
      </Menu.Item>
      <Menu.Item onClick={()=>{
        setfilterType(1);
        initWinnerList();
        setsortedWinnerList(winnerList.filter((item)=>item.type===1));
      }}>
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
      setsortType(1);
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
  const getWinnerList = (name, pageSize, pageNum)=>{
    const data = {
      name: name.trim(),
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
      setsortedWinnerList(res.data.items);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(()=>{
      setHttpLoading(false);
    });
  };
  const updateWiner = (t, type, checkList)=>{
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
      if (c.current.winner) getArchiveList(t, '', 999, 1);
      else {
        if (isFirst) {
          getArchiveList(t, '', 999, 1);
          setisFirst(false);
        } else {
          getArchiveList(t===1?3:1, '', 999, 1);
        }
      }
      setCheckedKeys([]);
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
          name: searchData.trim(),
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
            <div className="tree-title-box">
              <div className="tree-title" title={data[key][0].jobName}>
                {data[key].length>0?
                (<span>{data[key][0].readStatus===0?<i className="read-mark">* </i>:null}{data[key][0].jobName}</span>):
                'error'}
              </div>
              <span className="more-icon">
                <Dropdown overlay={menu} arrow trigger={['click']} placement="bottomLeft" onVisibleChange>
                  <MoreOutlined onClick={(e)=>{
                  }}/>
                </Dropdown>
              </span>
            </div>
          ),
          key: `${key}-${data[key][0].searchId}-${data[key][0].type}`,
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
                  <div className="tree-title-box sc">
                    <div className="tree-title" title={item.groupName}>
                      {item.groupName}
                    </div>
                    <span className="more-icon">
                      <Dropdown overlay={menu} arrow trigger={['click']} placement="bottomLeft" onVisibleChange>
                        <MoreOutlined onClick={(e)=>{
                        }}/>
                      </Dropdown>
                    </span>
                  </div>
                ),
                key: `${key}-${item.searchId}-${item.searchResultId}-${item.type}`,
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
    update(UPDATENOREADAUDIENCE, {}, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then(()=>{
      store.dispatch(getMangerCounts(0));
      storage.saveData('local', 'mangerCounts', 0);
    }).finally(()=>{
      setHttpLoading(false);
    });
  }, []);
  return (
    <div className="paddingB16 audience-menager">
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
        <Form onFinish={(values)=>updateGroupName(values.title, c.current.type, c.current.jobId)} form={renameForm}>
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
          <KeyWordSearchDetails
            source={searchSource}
            searchID={searchID}
            searchType={searchType}
            searchData={archiveDetail}
            statusType={0}
            hideTesting={true}
            hideCheckbox={true}/>
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
          <Col lg={24} xl={9} style={{width: '100%'}}>
            <div className="text-box">
              <div className="box-wrapper">
                <div className="tab-box">
                  <div className={tabType===1?'tab-title active':'tab-title'} onClick={()=>{
                    settabType(1);
                    getArchiveList(1, '', 99, 1);
                    setCheckedKeys([]);
                  }}><ExperimentOutlined style={{marginRight: 12}}/>Testing</div>
                  <div className={tabType===3?'tab-title active':'tab-title'} onClick={()=>{
                    settabType(3);
                    getArchiveList(3, '', 99, 1);
                    setCheckedKeys([]);
                  }}><SaveOutlined style={{marginRight: 12}}/>Archive</div>
                </div>
              </div>
              <div className="box-wrapper">
                <div className="search-box">
                  <Space split={<Divider type="vertical" />}>
                    <Input prefix={<SearchOutlined />} placeholder="search" allowClear
                      onChange={(e)=>{
                        if (e.target.value==='') getArchiveList(tabType, '', 99, 1);
                      }}
                      onPressEnter={(e)=>getArchiveList(tabType, e.target.value, 99, 1)}
                    ></Input>
                    <Button className="save-btn" onClick={
                      ()=>{
                        if (c.current) {
                          c.current.winner = true;
                        } else {
                          c.current = {
                            winner: true,
                          };
                        }
                        updateWiner(tabType, 2, selectedTreeData.checkedNodes);
                      }
                    } disabled={checkedKeys.length===0}
                    style={{float: 'right'}}
                    ><CrownOutlined/>Save&nbsp;&nbsp;as&nbsp;&nbsp;Winner</Button>
                  </Space>
                </div>
              </div>
              <div className="data-tree-box">
                <Tree
                  checkable
                  checkedKeys={checkedKeys}
                  onCheck={(checkedKeys, info)=>{
                    setCheckedKeys(checkedKeys);
                    setselectedTreeData(info);
                  }}
                  treeData={treeData}
                  // selectable={false}
                  onSelect={(selectedKeys, info)=>{
                    let data;
                    let type;
                    const name = info.node.title.props.children[0].props.title;
                    console.log(info.node.key);
                    if (info.node.children) {
                      data = info.node.children.map((item)=>item.key.split('-')[2]).join(',');
                      type = 1;
                      setSearchID(info.node.key.split('-')[1]);
                      setSearchSource(1);
                      setSearchType(info.node.key.split('-')[2]);
                    } else {
                      data = info.node.key.split('-')[2];
                      type = 2;
                      setSearchID(info.node.key.split('-')[2]);
                      setSearchSource(2);
                      setSearchType(info.node.key.split('-')[3]);
                    }
                    c.current = {
                      id: data,
                      name: name,
                      type: type,
                      jobId: info.node.key.split('-')[0],
                      winner: false,
                    };
                  }}
                />
              </div>
              {/* <div className="save-btn-box">
              </div> */}
            </div>
          </Col>
          <Col lg={24} xl={15} style={{width: '100%'}}>
            <div className="winner-box">
              <div className="box-wrapper">
                <div className="winner-title-box">
                  <div className="winner-title"><CrownOutlined style={{marginRight: 12}}/>Winner</div>
                  <div className="winner-icon" style={{marginRight: 24}}>
                    <Dropdown
                      overlay={sortType===1?sortMenuByT:sortMenuByC}
                      arrow trigger={['click']}
                      placement="bottomLeft"
                      onVisibleChange>
                      <LineHeightOutlined />
                    </Dropdown>
                  </div>
                  <div className="winner-icon">
                    <Dropdown overlay={filterType===0?filterMenuA:(filterType===1?filterMenuByk:filterMenuByA)}
                      arrow
                      trigger={['click']}
                      placement="bottomLeft"
                      onVisibleChange>
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
                  {sortedWinnerList.map((item, index)=>(
                    <div className={item.check?'card-item active':
                      item.saveStatus===0?'card-item':
                        'card-item edited'} key={item.searchResultId} onClick={()=>{
                      const data = [...sortedWinnerList];
                      data.forEach((item)=>item.check=false);
                      data[index].check = true;
                      setcurrentIndex(index);
                      setsortedWinnerList(data);
                      setSearchID(data[index].searchResultId);
                      setSearchType(data[index].type);
                      getDetails(item.searchResultId);
                      c.current = {
                        id: item.searchResultId,
                      };
                      setcurrentName(item.groupName);
                      setcurrentJob(item.jobName);
                      settableVisible(true);
                    }}>
                      <div className="card-group-name" title={item.groupName}>{item.groupName}</div>
                      <div className="card-job-name" title={item.jobName}>{item.jobName}</div>
                      <div className="card-job-ct">
                        <ClockCircleOutlined style={{fontSize: 20, fontWeight: '600', float: 'left', marginTop: 5}}/>
                        <div className="card-job-more">{item.createTime}</div>
                        <div style={{
                          paddingLeft: 16,
                          float: 'right',
                          fontSize: 32,
                          fontWeight: '600',
                        }}
                        onClick={(e)=>{
                          e.stopPropagation();
                          setSearchID(item.searchResultId);
                          setSearchSource(2);
                          setSearchType(item.type);
                          c.current = {
                            id: item.searchResultId,
                            jobId: item.searchResultId,
                            name: item.groupName,
                            winner: true,
                            type: 2,
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
        {tableVisible?<div className="table-wrap">
          <div style={{padding: '10px 10px', background: '#fff', borderRadius: '16px'}}>
            <div style={{overflow: 'hidden', marginBottom: 24}}>
              <div className="table-group-name">
                <div style={{fontSize: 24, fontWeight: 600}}>{currentName}</div>
                <div style={{fontSize: 12, marginTop: 8}}>{currentJob}</div>
              </div>
              <div style={{float: 'right', cursor: 'pointer'}}>
                <CloseOutlined style={{fontSize: 20}} onClick={()=>{
                  const data = [...sortedWinnerList];
                  data.forEach((item)=>item.check=false);
                  setcurrentIndex(-1);
                  setsortedWinnerList(data);
                  settableVisible(false);
                }}/>
              </div>
              <div
                className={sortedWinnerList.length===1||
                  currentIndex===sortedWinnerList.length-1?'arrow disabled':'arrow'}
                onClick={()=>{
                  const data = [...sortedWinnerList];
                  const index = data.findIndex((item)=>item.check===true);
                  if (index>=0&&index<data.length-1) {
                    data.forEach((item)=>item.check=false);
                    data[index+1].check=true;
                    setcurrentIndex(index+1);
                    setsortedWinnerList(data);
                    getDetails(data[index+1].searchResultId);
                    c.current = {
                      id: data[index+1].searchResultId,
                    };
                    setcurrentName(data[index+1].groupName);
                    setcurrentJob(data[index+1].jobName);
                    // tabRef.current.cancel();
                  }
                }}><ArrowDownOutlined /></div>
              <div
                className={sortedWinnerList.length===1||currentIndex<1?'arrow disabled':'arrow'}
                onClick={()=>{
                  const data = [...sortedWinnerList];
                  const index = data.findIndex((item)=>item.check===true);
                  if (index>0&&index<=data.length-1) {
                    data.forEach((item)=>item.check=false);
                    data[index-1].check=true;
                    setcurrentIndex(index-1);
                    setsortedWinnerList(data);
                    getDetails(data[index-1].searchResultId);
                    c.current = {
                      id: data[index-1].searchResultId,
                    };
                    setcurrentName(data[index-1].groupName);
                    setcurrentJob(data[index-1].jobName);
                    // tabRef.current.cancel();
                  }
                }}><ArrowUpOutlined /></div>
            </div>
            <EditTable
              refs={tabRef}
              details={details}
              id={editId}
              searchId={searchID}
              searchType={searchType}
              hideFirstButton={true}
              saveFunc={()=>{
                settableVisible(true);
                getDetails(c.current.id);
              }}
              style={{marginTop: 24}}/>
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
