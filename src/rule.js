export default class Rule {
  constructor(obj = {}) {
    this.id = obj.id;
    this.body = obj.body;
    this.true_id = obj.true_id || null;
    this.false_id = obj.false_id || null;
    this.run = Function('obj', `{ ${this.body} }`); // eslint-disable-line no-new-func
  }
}
