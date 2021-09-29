import React, { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import {finishTable, listTables} from "../utils/api"


function TableList({changeReservations, reservations}) {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  console.log(tables, "TABLES HERE")

  const tablesTable = (tables) => {
    if (tables) {
          let i = 0;
          return tables.map((table) => {
            i++;
            return <tr key={i}>
              <td>{table.table_name}</td>
              <td>{table.capacity}</td>
              <td>{table.status}</td>
              <td><button data-reservation-id-finish={table.table_id} value={table.table_id} onClick={finishHandler}> finish </button></td>
            </tr>
          })
    }
  }

    useEffect(() => {
        listTables()
        .then(setTables)
    }, [])

    async function finishHandler({ target }) {
        const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
        if (result) {
          let error = false;
          await finishTable(target.value)
          .then(() => listTables())
          .then(setTables)
          .catch((err) => {
            setTablesError(err);
            error = true;
          })
          if (error === false) {
            await changeReservations();
          };
        }
    }
    

    return <div>
        <ErrorAlert className="alert alert-danger"  error={tablesError}/>
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
    </div>
}

export default TableList;