import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationList from "../ReservationList";

function Search({mobile_number, changeMobileNumber}) {

    const [reservations, setReservations] = useState([])
    const [reservationsError, setReservationsError] = useState([null])
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

    if (reservations.length) {
        return <div>
            <form>
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
    } else {
        return <div>
             <form>
                <label htmlFor="mobile_number">
                    <input 
                        type="text"
                        name="mobile_number"
                        id="mobile_number"
                        placeholder="Enter a customer's phone number"
                        onChange={changeHandler}
                    />
                    <button type="submit" onClick={submitHandler}>Find</button>
                </label>
            </form>
            <h1>No reservations found</h1>
        </div>
    }
}

export default Search;