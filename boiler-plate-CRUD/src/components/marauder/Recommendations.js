import React from "react";
import { connect } from "react-redux";
import { getRecommendations, getKnowledgeRecommendations } from "../../actions";

class Recommendations extends React.Component {
  componentDidMount() {
    this.props.getRecommendations();
    this.props.getKnowledgeRecommendations();
  }

  onSubmit = (formValues) => {
    this.props.createStream(formValues);
  };

  renderRecommendationsList(recoList) {
    return recoList.map((eachRecommendation) => {
      return (
        <tr>
          {/* <td>{eachRecommendation.s}</td>
          <td>{eachRecommendation.p}</td>  */}
          <td>{eachRecommendation.sLabel}</td>
          {/* <td>{eachRecommendation.pLabel}</td>
          <td>{eachRecommendation.s2}</td> */}
          <td>{eachRecommendation.s2Label}</td>
        </tr>
      );
    });
  }

  renderKnowledgeRecommendationsList(recoList) {
    if (recoList) {
      return recoList.map((eachRecommendation) => {
        return (
          <tr>
            <td>{eachRecommendation.subject}</td>
            <td>{eachRecommendation.predicate}</td>
          </tr>
        );
      });
    } else {
      return <div></div>;
    }
  }

  renderRecommendations() {
    if (this.props.recommendations) {
      return (
        <div>
          <h2>External Graph Database</h2>
          <table className="ui celled table">
            <thead>
              <tr>
                {/* <th>S</th>
              <th>P</th> */}
                <th>Subject</th>
                {/* <th>pLabel</th>
              <th>s2</th> */}
                <th>Relation</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRecommendationsList(this.props.recommendations)}
            </tbody>
          </table>
        </div>
      );
    }
  }

  renderKnowledgeRecommendations() {
    if (this.props.recommendations) {
      return (
        <div>
          <h2>Internal Graph Database</h2>
          <table className="ui celled table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Relation</th>
              </tr>
            </thead>
            <tbody>
              {this.renderKnowledgeRecommendationsList(
                this.props.knowledgeRecommendations
              )}
            </tbody>
          </table>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h1>Recommendations</h1>
        {this.renderRecommendations()}
        {this.renderKnowledgeRecommendations()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recommendations: state.cityguide.recommendations,
    knowledgeRecommendations: state.cityguide.knowledgeRecommendations,
  };
};

export default connect(mapStateToProps, {
  getRecommendations,
  getKnowledgeRecommendations,
})(Recommendations);
