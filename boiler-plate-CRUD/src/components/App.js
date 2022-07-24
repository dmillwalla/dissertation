import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Recommendations from "./marauder/Recommendations";
import UserPreferences from "./marauder/UserPreferences";
import Header from "./Header";
import history from "../history";

const App = () => {
  return (
    <div className="ui container">
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={UserPreferences} />
            <Route path="/recommendations" exact component={Recommendations} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
