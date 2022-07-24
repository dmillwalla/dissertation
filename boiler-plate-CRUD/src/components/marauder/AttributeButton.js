import React from "react";
import { connect } from "react-redux";

import { addPreference, deletePreference } from "../../actions";

class AttributeButton extends React.Component {
  constructor(props) {
    super(props);

    if (props.enabled) {
      this.state = {
        active: true,
        btnClasses: "green",
        iconClasses: " ",
      };
    } else {
      this.state = {
        active: false,
        btnClasses: "black basic",
        iconClasses: "question",
      };
    }
  }
  onClick = () => {
    if (this.state.active) {
      this.setState({
        active: false,
        btnClasses: "black basic",
        iconClasses: "question",
      });
      console.log("calling delete preference");
      this.props.deletePreference(this.props.label);
    } else {
      this.setState({ active: true, btnClasses: "green", iconClasses: " " });
      console.log("calling add preference");
      this.props.addPreference(this.props.label);
    }
  };
  renderButton() {
    return (
      <button
        className={`ui tiny button ${this.state.btnClasses}`}
        onClick={this.onClick}
      >
        <i className={`icon ${this.props.icon} ${this.state.iconClasses}`}></i>
        {this.props.label}
        {this.props.enabled}
      </button>
    );
  }
  render() {
    return this.renderButton();
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, { addPreference, deletePreference })(
  AttributeButton
);
