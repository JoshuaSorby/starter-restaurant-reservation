import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, seatReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";



function Seat({date}) {
    const abortController = new AbortController();
    const [tables, setTables] = useState([])
    const history = useHistory();
    const {reservation_id} = useParams();
    const [tableId, setTableId] = useState(0)
    const [seatError, setSeatError] = useState("")
    

    useEffect(() => {
        listTables(abortController.signal)
        .then(setTables)
    }, [])
    
    const tableOptions = (tables) => {
        return tables.map((table) => {
            if (table.status === 'free') {
                return <option value={table.table_id} key={table.table_id}>{table.table_name} - {table.capacity}</option>
            }
        })
    }

    async function submitHandler(event) {
        event.preventDefault()
        let error = false;
        await seatReservation(reservation_id, tableId)
        .catch((err) => {
            setSeatError(err);
            error = true;
        })
        if (error === false) history.push(`/dashboard?date=${date}`);
    }

    function changeHandler({ target }) {
        setTableId(target.value)
    }

    async function cancelHandler(event) {
        event.preventDefault();
        history.goBack()
    }

    return <div>
        <select name="table_id" onChange={changeHandler}>
            <option value="" key="blank">Select a table number</option>
            {tableOptions(tables)}
        </select>
        <button type="button" onClick={cancelHandler}>Cancel</button>
        <button type="submit" onClick={submitHandler}>Seat</button>
        <ErrorAlert className="alert alert-danger" error={seatError} />
    </div>
}

export default Seat;