import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './RuleEditComponent.scss';
import Rule from '../rule';

// TODO: add confirmation dialog for remove

export default class RuleEditComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.rule,
      disabled: true,
      isOpen: false,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ isEntry: newProps.isEntry });
  }

  render() {
    return (
      <ExpansionPanel
        expanded={this.state.isOpen}
        onChange={() => this.setState({ isOpen: !this.state.isOpen })}
        className={this.props.hasError ? 'error' : ''}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={this.props.hasError ? 'error' : ''}>
          <div>
            <TextField label="ID" disabled value={this.state.id} />
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <div className="rule-body">
              function(obj) {'{ '}
              <div>
                <TextField
                  multiline
                  value={this.state.body}
                  onChange={(e) => this.setState({ body: e.target.value, disabled: false })}
                  style={{ width: '100%' }}
                />
              </div>
              {' }'}
            </div>
            <div>
              <InputLabel htmlFor="true_id" className="label">
                Next Rule if Passed:
              </InputLabel>
              <Select
                label="Next Rule if Passed:"
                value={this.state.true_id || ''}
                onChange={(e) => this.setState({ true_id: e.target.value, disabled: false })}
                inputProps={{
                  name: 'true_id',
                  id: 'true_id',
                }}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {!!this.props.possibleSuccessors &&
                  this.props.possibleSuccessors.map((ruleId) => (
                    <MenuItem key={`${this.state.id}_${ruleId}_option`} value={ruleId}>
                      {ruleId}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="false_id" className="label">
                Next Rule if Failed:
              </InputLabel>
              <Select
                label="Next Rule if Failed: "
                value={this.state.false_id || ''}
                onChange={(e) => this.setState({ false_id: e.target.value, disabled: false })}
                inputProps={{
                  name: 'false_id',
                  id: 'false_id',
                }}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {!!this.props.possibleSuccessors &&
                  this.props.possibleSuccessors.map((ruleId) => (
                    <MenuItem key={`${this.state.id}_${ruleId}_option`} value={ruleId}>
                      {ruleId}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div className="button">
              <Button
                variant="raised"
                disabled={this.state.disabled}
                onClick={() => {
                  this.props.onSave(this.state);
                  this.setState({ disabled: true });
                }}>
                Apply
              </Button>
            </div>
            <div className="button">
              <Button variant="raised" color="secondary" onClick={() => this.props.onRemove(this.state.id)}>
                Remove
              </Button>
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

RuleEditComponent.propTypes = {
  rule: PropTypes.shape(Rule).isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  possibleSuccessors: PropTypes.arrayOf(PropTypes.string),
};
