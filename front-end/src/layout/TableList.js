import React, { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import {finishTable, listTables} from "../utils/api";
import "./Layout.css"


function TableList({changeReservations }) {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const tablesTable = (tables) => {
    if (tables) {
          let i = 0;
          return tables.map((table) => {
            i++;
            return <tr key={i}>
              <td>{table.table_name}</td>
              <td>{table.capacity}</td>
              <td><p data-table-id-status={table.table_id}>{table.status}</p></td>
              <td ><button data-table-id-finish={table.table_id} value={table.table_id} onClick={finishHandler}> finish </button></td>
            </tr>
          })
    }
  }

    useEffect(() => {
        listTables()
        .then(setTables)
        .catch(setTablesError)
    }, [])

    async function finishHandler({ target }) {
        const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
        if (result === true) {
          await finishTable(target.value)
          await listTables()
          .then(setTables)
          changeReservations()
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tablesTable(tables)}
            </tbody>
        </table>
    </div>
}

export default TableList;