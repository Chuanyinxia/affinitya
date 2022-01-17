import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, updateIsPay} from '@/store/actions';
import './style.css';
import {Button, Card, Col, Empty, message, Row, Space, Tabs, Tooltip} from 'antd';
import ResultTable from '@/components/Table/ResultTable';
import {get} from '@/utils/request';
import {EXPORTCVS, EXPORTCVS2, ISPAID} from '@/api';
import ReactClipboard from 'react-clipboardjs-copy';
import store from '@/store';
// import {CopyToClipboard} from 'react-copy-to-clipboard';
// import ClipboardJS from 'clipboard';
const {TabPane} = Tabs;


const KeyWordSearchDetails = ({
  userInfo, searchData, searchID, searchType, source, jobName, hideCheckbox, searchConfig,
}) => {
  const [isPayUser, setIsPayUser] = useState(false);
  const [copyValue, setCopyValues] = useState('');
  const tableData = (tableData) => {
    const data = tableData.map((item, index) => {
      return {...item, index: index + 1};
    });
    return data;
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

  const downloadButton=()=>{
    const url=source===1?`${EXPORTCVS}${searchID}/${searchType}/1/${userInfo.token}`:
    source===2?`${EXPORTCVS2}${searchID}/${searchType}/${userInfo.token}`:
                `${EXPORTCVS}${searchID}/${searchType}/2/${userInfo.token}`
    ;
    if (isPayUser) {
      if (searchData.length<1) {
        return ( <Tooltip title="The search result is empty and cannot be exported.">
          <Button disabled className="btn-md">
            Export to CSV
          </Button>
        </Tooltip>);
      }
      return (<Button
        className="btn-md"
        download
        target="_blank"
        href={url}
        disabled={!isPayUser}>
        Export to CSV
      </Button>);
    }
    return (
      <Tooltip title="Pls upgrade to use this function.">
        <Button disabled className="btn-md">
          Export to CSV
        </Button>
      </Tooltip>);
  };

  const copyKeyword = () => {
    return (
      <ReactClipboard
        target={'#copy'}
        onSuccess={() => message.success('Copy success!')}
        onError={() => message.success('Copy error!')}>
        <Button size="md" className="btn-md" >
          Copy All to Clipboard
        </Button>
      </ReactClipboard>


    // </CopyToClipboard>
    );
  };


  useEffect(() => {
    isPay();
  }, []);
  useEffect(()=>{
    let str='';
    const commafy=(num)=>{
      if ((num+'').trim()==='') {
        return '';
      }
      if (isNaN(num)) {
        return '';
      }
      num = num+'';
      if (/^.*\..*$/.test(num)) {
        const pointIndex =num.lastIndexOf('.');
        let intPart = num.substring(0, pointIndex);
        const pointPart =num.substring(pointIndex+1, num.length);
        intPart = intPart +'';
        const re =/(-?\d+)(\d{3})/;
        while (re.test(intPart)) {
          intPart =intPart.replace(re, '$1,$2');
        }
        num = intPart+'.'+pointPart;
      } else {
        num = num +'';
        const re =/(-?\d+)(\d{3})/;
        while (re.test(num)) {
          num =num.replace(re, '$1,$2');
        }
      }
      return num;
    };
    setCopyValues('');
    if (searchData.length>0) {
      str = `<table>
                      <thead>
                      <tr>
                          <th>Audience</th>
                          <th>ID</th>
                          <th>Keyword</th>
                          <th>Size</th>
                          <th>Path</th>
                      </tr>
                  </thead><tbody>`;
      searchData.forEach((item) => {
        item.searchDetails.forEach((data, index) => {
          str += `<tr>
                      <td>${item.groupId}</td>
                      <td>${index+1}</td>
                      <td>${data.keyword??''}</td>
                      <td>${commafy(data.size)}</td>
                      <td>${data.path??''}</td>
                  </tr>`;
        });
      });
      str += `</tbody></table>`;
      setCopyValues(str);
    } else {
      setCopyValues('');
    }
  }, [searchData]);

  return (
    <div>
      <div id="copy" dangerouslySetInnerHTML={{__html: copyValue}}/>
      <Row>
        <Col span={6}>
          <h2 className="search-content">
            {jobName}
          </h2>
        </Col>
        <Col span={18} className="text-right marginB16 paddingR32">
          <Space>
            {copyKeyword()}
            {downloadButton()}
          </Space>
        </Col>
      </Row>
      {searchConfig&&(<Row gutter={32} className="padding32">
        <Col span={6} className="border-right">
          <Row>
            <Col flex="120px" className="search-config-title">
              Country
            </Col>
            <Col flex="auto" className="search-config-details">
              {searchConfig.country}
            </Col>
          </Row>
          <Row>
            <Col flex="120px" className="search-config-title">
              Age
            </Col>
            <Col flex="auto" className="search-config-details">
              {searchConfig.age.split(',')[0]}
               -
              {searchConfig.age.split(',')[1]}
            </Col>
          </Row>
          <Row>
            <Col flex="120px" className="search-config-title">
              Gender
            </Col>
            <Col flex="auto" className="search-config-details">
              {searchConfig.gender==='1,2'?'All':searchConfig.gender===1?'Male':'Female'}
            </Col>
          </Row>
        </Col>
        <Col span={6} className="border-right">
          <Row>
            <Col flex="120px" className="search-config-title">
              Language
            </Col>
            <Col flex="auto" className="search-config-details">
              {searchConfig.language}
            </Col>
          </Row>
          <Row>
            <Col flex="120px" className="search-config-title">
              Device
            </Col>
            <Col flex="auto" className="search-config-details">
              {searchConfig.platform==='all'?'All':searchConfig.platform==='mobile'?'Mobile':'Desktop'}
            </Col>
          </Row>
          <Row>
            <Col flex="120px" className="search-config-title">
              OS
            </Col>
            <Col flex="auto" className="search-config-details">
              {searchConfig.os==='na'?'All':searchConfig.os}
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col flex="120px" className="search-config-title">
              {searchConfig.keywords?'Keywords':
                searchConfig.extend?'Extend':'Audience'}
            </Col>
            <Col flex="auto" className="search-config-title">
              {searchConfig.keywords?searchConfig.keywords.join(','):
                searchConfig.extend?searchConfig.extend:searchConfig.extend}
            </Col>
          </Row>
        </Col>
      </Row>)}
      <Card>
        {searchData.length>0?(<Tabs
          defaultActiveKey={searchID}
          destroyInactiveTabPane
        >
          {searchData.map((item)=>(
            <TabPane tab={`Audience ${item.groupId} (${item.searchDetails.length})`} key={item.id} >
              <ResultTable
                TableData={tableData(item.searchDetails ?? [])}
                groupId={item.groupId}
                hideCheckbox={hideCheckbox}
              />
            </TabPane>))}
        </Tabs>):(<Empty />)
        }
      </Card>
    </div>

  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),
  };
};

KeyWordSearchDetails.propTypes = {
  userInfo: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  statusType: PropTypes.string.isRequired,
  hideFirstButton: PropTypes.bool,
  jobSave: PropTypes.func.isRequired,
  jobName: PropTypes.string.isRequired,
  hideTesting: PropTypes.bool.isRequired,
  hideCheckbox: PropTypes.bool.isRequired,
  searchID: PropTypes.string.isRequired,
  searchType: PropTypes.string.isRequired,
  source: PropTypes.number.isRequired,
  searchConfig: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KeyWordSearchDetails);

