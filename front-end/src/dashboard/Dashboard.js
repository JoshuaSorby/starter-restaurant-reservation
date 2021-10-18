import React, { useEffect, useState } from "react";
import { listReservations} from "../utils/api";
import ReservationList from "../layout/ReservationList";
import TableList from "../layout/TableList";
import { useHistory } from "react-router-dom";
import { today, next, previous } from "../utils/date-time";

//WHen the test makes a new Table, it does so with a reservation Id already in it. Make the reservation with that id seat and status of the table occupied to beign with

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date, changeDate}) {
  let newDate = new Date(date)
  let day = newDate.getDate();
  let month = newDate.getMonth()+1;
  let year = newDate.getFullYear();


  let todayText = `${year}-${month}-${day}`;

  const abortController = new AbortController();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const history = useHistory();

  async function initialReservationList() {
    if (params.date) {
      changeDate(params.date)
    }
    await listReservations({date: params.date}, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError)
  }

  useEffect(() => {
    initialReservationList()
  }, [])
  

  async function changeReservations() {
    await listReservations({date: date}, abortController.signal)
    .then(setReservations)
    .catch(reservationsError)
  }

  async function todayDate(event) {
    changeDate(today())
    await listReservations({date: today()})
    .then(setReservations)
    .catch((setReservationsError))
    history.push(`/dashboard?date=${today()}`)
  }

  async function previousDate(event) {
    event.preventDefault()
    changeDate(previous(date))
    await listReservations({date: previous(date)})
    .then(setReservations)
    .catch((setReservationsError))
    history.push(`/dashboard?date=${previous(date)}`)
  }

  async function nextDate(event) {
    event.preventDefault()
    changeDate(next(date))
    await listReservations({date: next(date)})
    .then(setReservations)
    .catch((setReservationsError))
    history.push(`/dashboard?date=${next(date)}`)
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="today">
        <h4 className="mb-0">Reservations for {todayText}</h4>
          <button onClick={previousDate}>Previous</button>
          <button onClick={todayDate}>Today</button>
          <button onClick={nextDate}>Next</button>
      </div>
     
      <ReservationList date={date} changeReservations={changeReservations} reservations={reservations}/>
      <hr/>
      <TableList changeReservations={changeReservations}/>
    </main>
  );
}

export default Dashboard;
