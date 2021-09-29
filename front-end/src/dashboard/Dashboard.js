import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../layout/ReservationList";
import TableList from "../layout/TableList";
import { useParams, useHistory } from "react-router-dom";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date, changeDate}) {
  let newDate = new Date()
  let day = newDate.getDate();
  let month = newDate.getMonth()+1;
  let year = newDate.getFullYear();

  let todayText = `${year}-${month}-${day}.`;
  todayText = new Date(todayText);

  const abortController = new AbortController();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log("PARAMS", params)

  const [formDate, setFormDate] = useState(params.date);
  const history = useHistory();
  
  useEffect(initialReservationList, [])
  async function initialReservationList() {
    setFormDate(params.date)
    changeDate(formDate)
    await listReservations({date: params.date}, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError)
  }
  async function dateSubmitHandler(event) {
    event.preventDefault();
    console.log("RELATED?", event)
    changeDate(formDate)
    await listReservations(params.date)
    .then(setReservations)
    .catch((setReservationsError))
    history.push(`/dashboard?date=${formDate}`)
    
  }


  function dateChangeHandler({target}) {
    console.log("RELATED?")
    setFormDate(target.value);
    console.log(target.value)
  }


  async function changeReservations() {
    console.log("RELATED?", date)
    await listReservations({date})
    .then(setReservations)
    .catch((setReservationsError))
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for</h4>
        <form onSubmit={dateSubmitHandler}>
          <label htmlFor="date"></label>
          <input
            name="date"
            type="date"
            value={formDate}
            onChange={dateChangeHandler}
          />
          <button type="submit">Enter</button>
        </form>
      </div>
     
      <ReservationList date={date} changeReservations={changeReservations} reservations={reservations}/>
      <TableList changeReservations={changeReservations} reservations={reservations}/>
    </main>
  );
}

export default Dashboard;
