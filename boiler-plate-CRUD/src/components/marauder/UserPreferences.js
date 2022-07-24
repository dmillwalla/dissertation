import React from "react";
import { connect } from "react-redux";

import { getPreference } from "../../actions";
import AttributeButton from "./AttributeButton";
import Preferences from "./../../const/Preferences.json";

class UserPreferences extends React.Component {
  componentDidMount() {
    // console.log(Preferences);
    this.props.getPreference();
  }

  renderPreferenceList() {
    return Preferences.preferences.map((eachPref) => {
      return (
        <div className="ui segment" key={eachPref.title}>
          <h4 className="ui horizontal divider header">
            <i className="tag icon"></i>
            {eachPref.title}
          </h4>
          {this.renderAttributeBoxes(eachPref.values)}
        </div>
      );
    });
  }

  renderAttributeBoxes(valuelist) {
    if (this.props.preferences) {
      return valuelist.map((eachValue) => {
        return (
          <AttributeButton
            icon="check"
            label={eachValue}
            key={eachValue}
            enabled={this.props.preferences.includes(eachValue)}
          />
        );
      });
    }
  }

  render() {
    return <div className="ui container">{this.renderPreferenceList()}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    preferences: state.cityguide.preferences,
    currentUserId: state.auth.userId,
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { getPreference })(UserPreferences);
