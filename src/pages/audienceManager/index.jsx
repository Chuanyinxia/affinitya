import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {GETAUDIENCEMANAGER, GETSEARCHDETAIL, UPDATESEARCHRESULT} from '@/api/index';
import {get, post} from '@/utils/request';
import {Card, message} from 'antd';
import TaskItem from '@/pages/audienceManager/component/TaskItem';
import TaskCol from '@/pages/audienceManager/component/TaskCol';
import EditTable from '@/pages/audienceManager/component/EditTable';

const STATUS_CODE = {
  STATUS_GENERATED: 'Generated',
  STATUS_TEST: 'Test',
  STATUS_WINNER: 'Winner',
  STATUS_ARCHIVE: 'Archive',
};
const STATUS_GENERATED = 'STATUS_GENERATED';
const STATUS_TEST = 'STATUS_TEST';
const STATUS_WINNER = 'STATUS_WINNER';
const STATUS_ARCHIVE = 'STATUS_ARCHIVE';

const AudienceManger = ({userInfo, httpLoading, setHttpLoading}) => {
  const [tasks, setTasks] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [details, setDetails] = useState(null);
  const [editId, setEditId]=useState(null);
  const [searchWord, setSearchWord] =useState('');
  const getAudienceManager = () => {
    post(GETAUDIENCEMANAGER, {pageNum: 1, pageSize: 10000}, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res) => {
      setTasks(res.data.map((item) => {
        return {
          ...item,
          status: item.status === 1 ? STATUS_GENERATED :
            item.status === 2 ? STATUS_TEST :
              item.status === 3 ? STATUS_WINNER : STATUS_ARCHIVE,
          type: item.type === 1 ? 'Keyword' :'Lookalike',
        };
      }));
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
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
    getAudienceManager();
  }, []);
  // 拖拽部分
  const onDragStart = (id) => {
    setActiveId(id);
  };
  const dragTo = (status) => {
    const task = tasks[activeId];
    if (task.status !== status) {
      task.status = status;
      const statusCode = STATUS_CODE[status] === 'Generated' ? 1 :
        STATUS_CODE[status] === 'Test' ? 2 :
          STATUS_CODE[status] === 'Winner' ? 3 :
            STATUS_CODE[status] === 'Archive' ? 4 : null;
      updateSearchResult(task.id, statusCode);
      setTasks(tasks);
    }
    cancelSelect();
  };
  const cancelSelect = () => {
    setActiveId(null);
  };
  // 修改拖拽状态
  const updateSearchResult = (id, status) => {
    post(UPDATESEARCHRESULT,
        {searchId: id, status: status}, {
        // eslint-disable-next-line no-tabs
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res) => {
      message.success({
        content: res.msg,
      });
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      getAudienceManager();
    });
  };

  const onSearch=(e)=>{
    console.log(e.target.value);
    setSearchWord(e.target.value??'');
  };
  return (
    <div className="paddingB16">
      <div className="task-wrapper">
        {
          Object.keys(STATUS_CODE).map((status) =>
            <TaskCol
              status={status}
              key={status}
              onSearch={onSearch}
              dragTo={() => dragTo(status)}
              canDragIn={activeId !== null && tasks[activeId].status !== status}>
              {tasks && tasks.filter((t) => t.status === status).map((t, index) => {
                if (status==='STATUS_GENERATED'&&t.campaignName.indexOf(searchWord)===-1) {
                  return null;
                }
                return (<TaskItem
                  key={t.id}
                  active={index === activeId}
                  info={t}
                  onClicks={() => getDetails(t.id)}
                  onDragStart={() => onDragStart(index, t)}
                  onDragEnd={() => cancelSelect(index)}
                />);
              })
              }
            </TaskCol>,
          )
        }
      </div>
      {details && (
        <div>
          <div className="padding16">
            <h2>Audience Tracker</h2>
            <p>Fill ad testing results for tracking and your custom audience set&apos;s optimization.</p>
            <p>Click &ldquo;Extend&ldquo; to expand custom keywords from 50 to 300.</p>
          </div>
          <Card>
            {/* <div className="text-right"><Button>Save All</Button></div>*/}
            <EditTable details={details} id={editId} saveFunc={getDetails}/>
          </Card>
        </div>
      )}
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
