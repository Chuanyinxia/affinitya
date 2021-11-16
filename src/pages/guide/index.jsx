import React, {} from 'react';

import PDF from '@/assets/Guide2021.pdf';
const Guide = () => {
  return (
    <div>
      <iframe src={PDF} style={{width: '100vw', height: '100vh'}}/>
    </div>
  );
};

Guide.propTypes = {};

export default Guide;
