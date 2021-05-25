import React from 'react';
import {Link} from 'react-router-dom';
import {Result, Button} from 'antd';
import {connect} from 'react-redux';

const ErrorPage=()=> {
  return (
    <Result
      className="marginT32"
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary"><Link to="/" >Back Home</Link></Button>}
    />
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(ErrorPage);
