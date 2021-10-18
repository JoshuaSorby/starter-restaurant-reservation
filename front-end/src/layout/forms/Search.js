import React, { useEffect, useState } from "react";
import { listReservations } from "../../utils/api";
import ReservationList from "../ReservationList";
import "../Layout.css"

function Search({mobile_number, changeMobileNumber}) {

    const [reservations, setReservations] = useState([])
    const [reservationsError, setReservationsError] = useState("")
    const [formData, setFormData] = useState("")



    async function changeReservations() {
        await listReservations({mobile_number})
        .then(setReservations)
        .catch((setReservationsError))
    }
    
    useEffect(changeReservations, [mobile_number])

    function changeHandler({ target }) {
        setFormData(target.value);
    }

    function submitHandler(event) {
        event.preventDefault();
        changeMobileNumber(formData);
        setFormData("")
    }

        return <div>
            <form id="searchForm">
                <label htmlFor="mobile_number">
                    <input 
                        type="text"
                        name="mobile_number"
                        id="mobile_number"
                        placeholder="Enter a customer's phone number"
                        onChange={changeHandler}
                        value={formData}
                    />
                    <button type="submit" onClick={submitHandler}>Find</button>
                </label>
            </form>
            <ReservationList mobile_number={mobile_number} changeReservations={changeReservations} reservations={reservations}/>
            </div>
}

export default Search;