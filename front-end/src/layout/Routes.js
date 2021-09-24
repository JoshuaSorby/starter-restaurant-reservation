import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationForm from "./forms/ReservationForm";
import { today } from "../utils/date-time";
import TableForm from "./forms/TableForm";
import Seat from "./Seat"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  
  const [date, setDate] = useState(today())
  function changeDate(newDate) {
    setDate(newDate);
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} changeDate={changeDate}/>
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationForm changeDate={changeDate}/>
      </Route>
      <Route exact={true} path="/tables/new">
        <TableForm />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
