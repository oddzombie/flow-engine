import { Avatar, Chip } from '@material-ui/core';
import React from 'react';

import './ResultComponent.scss';

export default (props) => (
  <div className="result">
    <Chip
      avatar={<Avatar>{props.result.ruleId}</Avatar>}
      label={props.result.passed ? 'Pass' : 'Fail'}
      style={{ backgroundColor: props.result.passed ? '#10d13d' : '#f74c4c' }}
    />
  </div>
);
