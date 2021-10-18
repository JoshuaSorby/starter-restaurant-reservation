import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import "../Layout.css"


function TableForm() {
    const [creationError, setCreationError] = useState("");

    const initialForm = {
        table_name: "",
        capacity: "",
    }

    const history = useHistory();
    const [formData, setFormData] = useState({ ...initialForm })
    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    };
    async function submitHandler(event) {
        let error = false;
        event.preventDefault();
        await createTable(formData)
        .catch((err) => {
            setCreationError(err);
            error = true;
        })
        if (error === false) {
            setFormData({...initialForm})
            history.push("../dashboard")
        }
    };

    const cancelHandler = (event) => {
        event.preventDefault();
        history.goBack()
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="table_name">
                    table_name:
                </label>
                <input 
                    id="table_name"
                    type="text"
                    name="table_name"
                    onChange={handleChange}
                    value={formData.table_name}
                />
                <label htmlFor="capacity">
                    Capacity:
                </label>
                <input 
                    id="capacity"
                    type="integer"
                    name="capacity"
                    onChange={handleChange}
                    value={formData.capacity}
                />
                
            </form>
            <div className="buttons">
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
            <ErrorAlert className="alert alert-danger" error={creationError} />
        </div>
    )
}

export default TableForm;