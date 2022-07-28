import React from "react";

class AddFacts extends React.Component {
  render() {
    return (
      <div class="ui form">
        <div class="field">
          <label>Text</label>
          <textarea></textarea>
        </div>
        <div class="ui submit button">Submit</div>
      </div>
    );
  }
}

export default AddFacts;
