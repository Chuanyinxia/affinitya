import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {GETSEARCHDETAIL, GETARCHIVELIST, UPDATEWINNERLIST, GETWINNERLIST} from '@/api/index';
import {get, post, update} from '@/utils/request';
import {Spin, Row, Col, Input, Tree, message, Button, Menu, Dropdown} from 'antd';
import {SearchOutlined, ClockCircleOutlined, MoreOutlined, FilterOutlined, LineHeightOutlined} from '@ant-design/icons';

// import TaskItem from '@/pages/audienceManager/component/TaskItem';
// import TaskCol from '@/pages/audienceManager/component/TaskCol';
import EditTable from '@/pages/audienceManager/component/EditTable';

// const STATUS_CODE = {
//   STATUS_GENERATED: 'Generated',
//   STATUS_TEST: 'Test',
//   STATUS_WINNER: 'Winner',
//   STATUS_ARCHIVE: 'Archive',
// };
// const STATUS_GENERATED = 'STATUS_GENERATED';
// const STATUS_TEST = 'STATUS_TEST';
// const STATUS_WINNER = 'STATUS_WINNER';
// const STATUS_ARCHIVE = 'STATUS_ARCHIVE';
// const aduienceMangerText = {
//   title: 'Organize your custom audience sets here.',
//   subtitle: '',
//   info: '',
// };
const AudienceManger = ({userInfo, httpLoading, setHttpLoading}) => {
  // const [tasks, setTasks] = useState(null);
  // const [activeId, setActiveId] = useState(null);
  const [details, setDetails] = useState(null);
  const [editId, setEditId] = useState(null);
  const [treeData, settreeData] = useState([]);
  const [tabType, settabType] = useState(1);
  const [winnerList, setwinnerList] = useState([]);
  const [selectedTreeData, setselectedTreeData] = useState({});
  // const [searchWord, setSearchWord] = useState('');
  // const getAudienceManager = () => {
  //   post(GETAUDIENCEMANAGER, {pageNum: 1, pageSize: 10000}, {
  //     // eslint-disable-next-line no-tabs
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'token': userInfo.token,
  //   }).then((res) => {
  //     setTasks(res.data.map((item) => {
  //       return {
  //         ...item,
  //         status: item.status === 1 ? STATUS_GENERATED :
  //           item.status === 2 ? STATUS_TEST :
  //             item.status === 3 ? STATUS_WINNER : STATUS_ARCHIVE,
  //         type: item.type === 1 ? 'Keyword' :'Lookalike',
  //       };
  //     }));
  //   }).catch((error) => {
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   }).finally(()=>{
  //     setHttpLoading(false);
  //   });
  // };
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          View List
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          Rename
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          Archive
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          Delete
        </a>
      </Menu.Item>
    </Menu>
  );
  const getWinnerList = (groupName, pageSize, pageNum)=>{
    const data = {
      groupName: groupName,
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
  const selectWiner = (checkList, pageSize, pageNum)=>{
    const data = checkList.filter((item)=>!(item.children)).map((item)=>item.key.split('-')[1]);
    update(UPDATEWINNERLIST,
        {
          searchResultIds: data,
          status: 2,
        }, {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res) => {
      console.log(res);
      getWinnerList('', 99, 1);
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
      Object.keys(data).forEach((key)=>{
        tree.push({
          title: (
            <div style={{width: 476}}>{key}
              <span className="more-icon" onClick={(e)=>{
                e.stopPropagation();
              }}>
                <Dropdown overlay={menu} arrow trigger={['click']} placement="bottomLeft">
                  <MoreOutlined />
                </Dropdown>
              </span>
            </div>
          ),
          key: key,
          children: (()=>{
            const arr = [];
            data[key].forEach((item)=>{
              arr.push({
                title: (
                  <div style={{width: 452}}>{item.groupName}
                    <span className="more-icon" onClick={(e)=>{
                      e.stopPropagation();
                    }}>
                      <Dropdown overlay={menu} arrow trigger={['click']} placement="bottomLeft">
                        <MoreOutlined />
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
  const getDetails = (id) => {
    setHttpLoading(true);
    get(GETSEARCHDETAIL + id, userInfo.token).then((res) => {
      setDetails(res.data);
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
    // getAudienceManager();
    getArchiveList(1, '', 99, 1);
  }, []);
  return (
    <div className="paddingB16">
      <Spin spinning={httpLoading}>
        <h2 style={{paddingLeft: 46}}>Audience Manager</h2>
        <p style={{paddingLeft: 46}}>
          Manage and edit the audiences you are testing. Record the performance of the Winning audiences.</p>
        <Row>
          <Col sm={24} md={9}>
            <div className="text-box">
              <div className="box-wrapper">
                <div className="tab-box">
                  <div className={tabType===1?'tab-title active':'tab-title'} onClick={()=>{
                    getArchiveList(1, '', 99, 1);
                    settabType(1);
                    setwinnerList([]);
                  }}>Testing</div>
                  <div className={tabType===2?'tab-title active':'tab-title'} onClick={()=>{
                    getArchiveList(2, '', 99, 1);
                    settabType(2);
                    setwinnerList([]);
                  }}>Archive</div>
                </div>
              </div>
              <div className="box-wrapper">
                <div className="search-box">
                  <Input prefix={<SearchOutlined />} placeholder="search"></Input>
                </div>
              </div>
              <div className="data-tree-box">
                <Tree
                  checkable
                  onCheck={(checkedKeys, info)=>setselectedTreeData(info)}
                  treeData={treeData}
                  selectable={false}
                />
              </div>
              <div className="save-btn-box">
                <Button className="save-btn" onClick={
                  ()=>selectWiner(selectedTreeData.checkedNodes, 99, 1)
                }>Save as Winner</Button>
              </div>
            </div>
          </Col>
          <Col sm={24} md={15}>
            <div className="winner-box">
              <div className="box-wrapper">
                <div className="winner-title-box">
                  <div className="winner-title">Winner</div>
                  <div className="winner-icon" style={{marginRight: 24}}><LineHeightOutlined /></div>
                  <div className="winner-icon"><FilterOutlined /></div>
                  <div className="winner-icon"><SearchOutlined /></div>
                </div>
              </div>
              <div className="box-wrapper">
                <div className="card-group">
                  {winnerList.map((item, index)=>(
                    <div className={item.check?'card-item active':'card-item'} key={item.searchId} onClick={()=>{
                      const data = [...winnerList];
                      data.forEach((item)=>item.check=false);
                      data[index].check = true;
                      setwinnerList(data);
                      getDetails(item.searchResultId);
                    }}>
                      <div
                        style={{color: '#4E4B66', fontSize: 16, height: 48, lineHeight: '48px', fontWeight: '600'}}
                      >{item.groupName}</div>
                      <div
                        style={{color: '#4E4B66', fontSize: 12, height: 30, lineHeight: '30px', marginTop: 8}}
                      >desc</div>
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
                        >...</div>
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
        <Row>
          <Col span={24} className="edit-box">
            <EditTable details={details} id={editId} saveFunc={getDetails}/>
          </Col>
        </Row>
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
