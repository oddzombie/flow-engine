import React, { Component } from 'react';
import { Button, Card, CardContent, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import './App.scss';
import Rule from './rule';
import { rules, obj } from './config';
import RuleEditComponent from './components/RuleEditComponent';
import ResultComponent from './components/ResultComponent';

let i = rules.length;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      rules: rules.reduce((acc, cur) => {
        acc[cur.id] = new Rule(cur);
        return acc;
      }, {}),
      entryRuleId: rules[0].id,
      ruleError: null,
      obj,
      objIsValid: true,
    };

    this.addRule = this.addRule.bind(this);
    this.removeRule = this.removeRule.bind(this);
    this.processRules = this.processRules.bind(this);
    this.updateRule = this.updateRule.bind(this);
  }

  componentDidMount() {
    this.processRules();
  }

  addRule() {
    i += 1;
    const rule = new Rule({ id: i.toString(), body: 'return !!obj;' });
    const updatedRules = { ...this.state.rules };
    updatedRules[rule.id] = rule;
    this.setState({ rules: updatedRules });
  }

  removeRule(ruleId) {
    const updatedRules = { ...this.state.rules };
    delete updatedRules[ruleId];
    Object.keys(updatedRules).forEach((id) => {
      if (updatedRules[id].true_id === ruleId) {
        updatedRules[id].true_id = null;
      }
      if (updatedRules[id].false_id === ruleId) {
        updatedRules[id].false_id = null;
      }
    });
    this.setState({ rules: updatedRules }, this.processRules);
  }

  updateRule(rule) {
    const updatedRules = { ...this.state.rules };
    updatedRules[rule.id] = new Rule(rule);
    const update = {
      rules: updatedRules,
    };
    if (rule.isEntry) {
      update.entryRuleId = rule.id;
    }
    this.setState(update, this.processRules);
  }

  processRules() {
    try {
      JSON.parse(this.state.obj);
      this.setState({ objIsValid: false });
    } catch (e) {
      this.setState({ objIsValid: false, results: [] });
    }
    const results = this.runRule(this.state.entryRuleId, []);
    if (results) {
      this.setState({ results, objIsValid: true });
    }
  }

  runRule(ruleId, processed) {
    const rule = this.state.rules[ruleId];
    let obj;
    try {
      obj = JSON.parse(this.state.obj);
    } catch (err) {
      this.setState({ objIsValid: false, results: [] });
      return;
    }

    let passed;
    try {
      passed = rule.run(obj);
    } catch (err) {
      this.setState({ ruleError: { ruleId, error: err.toString() }, results: [] });
      return;
    }

    processed.push({ ruleId, passed });

    if (passed && rule.true_id) {
      return this.runRule(rule.true_id, processed);
    } else if (!passed && rule.false_id) {
      return this.runRule(rule.false_id, processed);
    }
    return processed;
  }

  onObjectChange(obj) {
    this.setState({ obj }, this.processRules);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Flow Engine - Ian Holser</h1>
        </header>
        <div className="App-content">
          <div className="App-section">
            <div className="App-section-header">Input Object:</div>
            <Card>
              <CardContent>
                <div className={this.state.objIsValid ? '' : 'error-message'}>
                  <TextField
                    onChange={(e) => this.setState({ obj: e.target.value }, this.processRules)}
                    value={this.state.obj}
                    multiline
                    style={{ width: '100%' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="App-section">
            <div className="App-section-header">Rules:</div>
            <InputLabel htmlFor="entry_rule" className="label">
              Entry Rule:
            </InputLabel>
            <Select
              label="Entry Rule:"
              value={this.state.entryRuleId}
              onChange={(e) => this.setState({ entryRuleId: e.target.value, disabled: false }, this.processRules)}
              inputProps={{
                name: 'entry_rule',
                id: 'entry_rule',
              }}>
              >
              {Object.keys(this.state.rules).map((ruleId) => (
                <MenuItem key={`${this.state.id}_${ruleId}_option`} value={ruleId}>
                  {ruleId}
                </MenuItem>
              ))}
            </Select>
            <div />
            {Object.values(this.state.rules).map((rule) => (
              <RuleEditComponent
                key={rule.id}
                rule={rule}
                onSave={this.updateRule}
                onRemove={this.removeRule}
                hasError={this.state.ruleError && this.state.ruleError.ruleId === rule.id}
                possibleSuccessors={Object.keys(this.state.rules)}
                // TODO: precalculate possible list of successors to prevent circular logic
              />
            ))}
            <div className="add-rule">
              <Button variant="fab" aria-label="Add" onClick={this.addRule}>
                <AddIcon />
              </Button>
            </div>
          </div>
          <div className="App-section">
            <div className="App-section-header">Result:</div>
            <Card>
              <CardContent>
                {!!this.state.results &&
                  this.state.results.map((result) => (
                    <ResultComponent key={`${result.ruleId}_result`} result={result} />
                  ))}
                {!!this.state.ruleError && <p>{this.state.ruleError.error}</p>}
                {!this.state.objIsValid && <p>Input Object is not valid JSON</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
