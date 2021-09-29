import React, {useEffect, useState} from "react";
import { Link, useRouteMatch } from "react-router-dom";
import {listReservations, updateStatus} from "../utils/api";

function ReservationList({mobile_number, date, changeReservations, reservations}) {
    
    useEffect(changeReservations, [date]);
    useEffect(changeReservations, [mobile_number]);


    async function cancelHandler({target}) {
      const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
      if (result === true) {
        await updateStatus(target.value, {status:"cancelled"})
        await listReservations({date})
        .then(changeReservations);
        };
    }



    const reservationsTable = (reservations) => {
        if (reservations) {
          let i = 0;
          return reservations.map((reservation) => {
            let display = false;
            i++;
            if (reservation.status == "seated" && reservation.status !== "cancelled") {
              return <tr key={i}>
              <td>{reservation.first_name}</td>
              <td>{reservation.last_name}</td>
              <td>{reservation.mobile_number}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.people}</td>
              <td><p data-reservation-id-status={reservation.reservation_id}>{reservation.status}</p></td>
              <td><Link to={`/reservations/${reservation.reservation_id}/edit`}> <button value= {reservation.reservation_id}>edit</button></Link></td>
              <td><button data-reservation-id-cancel={reservation.reservation_id} value={reservation.reservation_id} onClick={cancelHandler}> cancel </button></td>
            </tr>
            }
            else if (reservation.status !== "cancelled")return <tr key={i}>
              <td>{reservation.first_name}</td>
              <td>{reservation.last_name}</td>
              <td>{reservation.mobile_number}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.people}</td>
              <td><p data-reservation-id-status={reservation.reservation_id}>{reservation.status}</p></td>
              <td><Link to={`/reservations/${reservation.reservation_id}/seat`}> <button type="button">seat</button> </Link></td>
              <td><Link to={`/reservations/${reservation.reservation_id}/edit`}> <button value= {reservation.reservation_id}>edit</button></Link></td>
              <td><button data-reservation-id-cancel={reservation.reservation_id} value={reservation.reservation_id} onClick={cancelHandler}> cancel </button></td>
            </tr>
          })
        }
    }

    return <div>
    <table>
        <thead>
            <tr key="1">
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile Number</th>
                <th>Reservation Date</th>
                <th>Reservation Time</th>
                <th>People</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {reservationsTable(reservations)}
        </tbody>
    </table>
    
    </div>
}

export default ReservationList;
