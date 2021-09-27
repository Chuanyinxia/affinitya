import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {GETSEARCHDETAIL} from '@/api/index';
import {get} from '@/utils/request';
import {Spin, Row, Col, Input, Tree, message} from 'antd';
import {SearchOutlined, ClockCircleOutlined} from '@ant-design/icons';

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
  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
        },
      ],
    },
    {
      title: 'parent 2',
      key: '1-0',
      children: [
        {
          title: 'parent 2-0',
          key: '0-1-0',
        },
        {
          title: 'parent 2-1',
          key: '0-1-1',
        },
      ],
    },
    {
      title: 'parent 3',
      key: '2-0',
      children: [
        {
          title: 'parent 3-0',
          key: '0-2-0',
        },
        {
          title: 'parent 3-1',
          key: '0-2-1',
        },
      ],
    },
  ];
  useEffect(() => {
    // getAudienceManager();
  }, []);
  // 拖拽部分
  // const onDragStart = (id) => {
  //   setActiveId(id);
  // };
  // const dragTo = (status) => {
  //   const task = tasks.find((item)=>item.id===activeId);
  //   if (task.status !== status) {
  //     task.status = status;
  //     const statusCode = STATUS_CODE[status] === 'Generated' ? 1 :
  //       STATUS_CODE[status] === 'Test' ? 2 :
  //         STATUS_CODE[status] === 'Winner' ? 3 :
  //           STATUS_CODE[status] === 'Archive' ? 4 : null;
  //     console.log(task);
  //     updateSearchResult(task.id, statusCode);
  //   }
  //   cancelSelect();
  // };
  // const cancelSelect = () => {
  //   setActiveId(null);
  // };
  // 修改拖拽状态
  // const updateSearchResult = (id, status) => {
  //   setHttpLoading(true);
  //   post(UPDATESEARCHRESULT,
  //       {searchId: id, status: status}, {
  //       // eslint-disable-next-line no-tabs
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //         'token': userInfo.token,
  //       }).then((res) => {
  //     message.success({
  //       content: res.msg,
  //     });
  //   }).catch((error) => {
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   }).finally(() => {
  //     setTasks(tasks);
  //     getAudienceManager();
  //   });
  // };

  // const onSearch=(e)=>{
  //   setSearchWord(e.target.value??'');
  // };
  return (
    <div className="paddingB16">
      <Spin spinning={httpLoading}>
        <h2>Audience Manager</h2>
        <p>Manage and edit the audiences you are testing. Record the performance of the Winning audiences.</p>
        <Row>
          <Col sm={24} md={9}>
            <div className="text-box">
              <div className="box-wrapper">
                <div className="tab-box">
                  <div className="tab-title active">Testing</div>
                  <div className="tab-title">Archive</div>
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
                  treeData={treeData}
                />
              </div>
            </div>
          </Col>
          <Col sm={24} md={15}>
            <div className="winner-box">
              <div className="box-wrapper">
                <div className="winner-title-box">
                  <div className="winner-title">Winner</div>
                </div>
              </div>
              <div className="box-wrapper">
                {/* <div className="card-group-title">
                  Custom audiences with positive results.
                </div> */}
                <div className="card-group">
                  <div className="card-item">
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
                  </div>
                  <div className="card-item active">
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
                  </div>
                  <div className="card-item edited">
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
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="edit-box">
              <EditTable details={details} id={editId} saveFunc={getDetails}/>
            </div>
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
