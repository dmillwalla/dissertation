import React from "react";
import AddFacts from "./AddFacts";
import TripletsCreated from "./TripletsCreated";

class KnowledgeBase extends React.Component {
  render() {
    return (
      <div className="ui container">
        <div className="ui segment">
          <AddFacts />
        </div>
        <div className="ui segment">
          <TripletsCreated />
        </div>
      </div>
    );
  }
}

export default KnowledgeBase;
