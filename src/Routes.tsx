import React from "react";
import { Route, Switch } from "react-router-dom";
import WeatherPage from "./containers/WeatherPage";
import NotFound from "./containers/NotFound";

export default () =>
  <Switch>
    <Route path="/" exact component={WeatherPage} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
