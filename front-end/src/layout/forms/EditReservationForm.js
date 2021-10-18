import React, { useEffect, useState } from "react";
import { useHistory, useParams} from "react-router-dom";
import { editReservation, readReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";


function EditReservationForm() {
    const abortController = new AbortController();
    
    const [creationError, setCreationError] = useState("")
    const {reservation_id} = useParams();
    const [reservation, setReservation] = useState(readReservation(reservation_id));
    const [reservationEror, setReservationError] = useState(null)
    

    async function fetchReservation(reservationId) {
        await readReservation(reservationId)
        .then(setReservation)
        .catch(setReservationError)
    }

    const initialForm = {
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        people: reservation.people,
        status: reservation.status,
        reservation_id: reservation_id
    }

    const [formData, setFormData] = useState({ ...initialForm })

    useEffect(() => {
        fetchReservation(reservation_id)
    }, []) 
    useEffect(() => {
        setFormData({...initialForm})
    }, [reservation])

    
    const history = useHistory();
    
    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    };
    async function submitHandler(event) {
        event.preventDefault();
        let error = false;
        await editReservation(formData, abortController.signal)
        .catch((err) => {
            setCreationError(err);
            error = true;
        });
        if (error === false) {
            setFormData({ ...initialForm });
            history.push(`/dashboard?date=${formData.reservation_date}`);
        }
    };

    const cancelHandler = (event) => {
        event.preventDefault();
        history.goBack()
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="first_name">
                    First Name:
                </label>
                <input 
                    id="first_name"
                    type="text"
                    name="first_name"
                    onChange={handleChange}
                    value={formData.first_name}
                />
                <label htmlFor="last_name">
                    Last Name:
                </label>
                <input 
                    id="last_name"
                    type="text"
                    name="last_name"
                    onChange={handleChange}
                    value={formData.last_name}
                />
                <label htmlFor="mobile_number">
                    Mobile Number:
                </label>
                <input 
                    id="mobile_number"
                    type="tel"
                    name="mobile_number"
                    onChange={handleChange}
                    value={formData.mobile_number}
                />
                <label htmlFor="reservation_date">
                    Reservation Date:
                </label>
                <input 
                    id="reservation_date"
                    type="date"
                    name="reservation_date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                />
                <label htmlFor="reservation_time">
                    Time:
                </label>
                <input 
                    id="reservation_time"
                    type="time"
                    name="reservation_time"
                    onChange={handleChange}
                    value={formData.reservation_time}
                />
                <label htmlFor="people">
                    Number of people:
                </label>
                <input 
                    id="people"
                    type="text"
                    name="people"
                    onChange={handleChange}
                    value={formData.people}
                />
            </form>

            <button 
                type="button"
                onClick={cancelHandler}
            >
            Cancel
            </button>
            <button 
                type="submit"
                onClick={submitHandler}
            >
            Submit
            </button>
            <ErrorAlert className="alert alert-danger" error={creationError} />
            <ErrorAlert className="alert alert-danger" error={reservationEror} />
        </div>
    )
}

export default EditReservationForm;