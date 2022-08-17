import React from "react";
import { connect } from "react-redux";

import { addFacts, addFactsTextacy } from "../../actions";

class AddFacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = { summary: "" };
  }
  onClick = () => {
    if (this.state.summary && this.state.summary.trim()) {
      this.props.addFacts(this.state.summary);
      this.props.addFactsTextacy(this.state.summary);
    }
  };
  handleSummaryChange = (event) => {
    this.setState({ summary: event.target.value });
  };
  render() {
    return (
      <div className="ui form">
        <div className="field">
          <label>Text</label>
          <textarea
            value={this.state.summary}
            onChange={this.handleSummaryChange}
          ></textarea>
        </div>
        <div className="ui submit button" onClick={this.onClick}>
          Submit
        </div>
      </div>
    );
  }
}

export default connect(null, { addFacts, addFactsTextacy })(AddFacts);
