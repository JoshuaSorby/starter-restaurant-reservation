import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


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

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  async function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    await listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    await listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }

  function dateChangeHandler({target}) {
    changeDate(target.value)
  }
  
  const reservationsTable = (reservations) => {
    if (reservations) {
      let i = 0;
      return reservations.map((reservation) => {
        i++;
        return <tr key={i}>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td><Link to={`/reservations/${reservation.reservation_id}/seat`}><button>Seat</button></Link></td>
        </tr>
      })
    }
  }

  const tablesTable = (tables) => {
    if (tables) {
      let i = 0;
      return tables.map((table) => {
        i++;
        return <tr key={i}>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td>{table.status}</td>
        </tr>
      })
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for</h4>
        <form>
          <label htmlFor="date"></label>
          <input
            name="date"
            type="date"
            value={date}
            onChange={dateChangeHandler}
          />
        </form>
      </div>
      <ErrorAlert error={reservationsError} />
     
      <table>
        <thead>
          <tr key="1">
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>People</th>
          </tr>
        </thead>
        <tbody>
          {reservationsTable(reservations)}
        </tbody>
      </table>

      <ErrorAlert error={tablesError} />
      <table>
        <thead>
          <tr key="1">
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tablesTable(tables)}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
