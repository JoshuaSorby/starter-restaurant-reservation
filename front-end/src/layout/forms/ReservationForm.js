import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";


function ReservationForm() {
    const initialForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: ""
    }

    const history = useHistory();
    const [formData, setFormData] = useState({ ...initialForm })
    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    };
    const submitHandler = (event) => {
        event.preventDefault();
        createReservation(formData);
        console.log(`Reservation:`, formData, `Post:`, createReservation(formData))
        setFormData({ ...initialForm });
        history.push("/")
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
        </div>
    )
}

export default ReservationForm;