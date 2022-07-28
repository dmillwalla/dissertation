import React from "react";
import { connect } from "react-redux";

class TripletsCreated extends React.Component {
  renderFacts(factsList) {
    return factsList.map((eachFact) => {
      return (
        <tr>
          <td>{eachFact.subject}</td>
          <td>{eachFact.predicate}</td>
          <td>{eachFact.object}</td>
        </tr>
      );
    });
  }

  render() {
    if (this.props.facts) {
      return (
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Relation</th>
              <th>Object</th>
            </tr>
          </thead>
          <tbody>{this.renderFacts(this.props.facts)}</tbody>
        </table>
      );
    } else {
      return <h1>None</h1>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    facts: state.cityguide.facts,
  };
};

export default connect(mapStateToProps, {})(TripletsCreated);
