/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  console.log("here", url, options)
  try {
    console.log("before fetch")
    const response = await fetch(url, options);
    console.log("After fetch")
    if (response.status === 204) {
      console.log("null")
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    console.log(error.name, "error is here!")
    if (error.name !== "AbortError") {
      console.error(error.stack);
      console.log(error.message, "error here!")
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function createReservation(reservation, signal) {
  console.log("CREATERESERVATION: ", reservation)
  const url = `${API_BASE_URL}/reservations`;
  reservation.people = Number(reservation.people)
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
   };
   console.log("OPTIONS.BODY: ", options.body)
   return await fetchJson(url, options);
}

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  console.log(params)
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  table.capacity = Number(table.capacity)
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listTables(signal) {
   const url = `${API_BASE_URL}/tables`;
    return await fetchJson(url, { headers, signal }, []); 
  }

export async function seatReservation(reservation_id, tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({
       data: {
          reservation_id: reservation_id,
          table_id: tableId,
        }
      }),
      signal,
  };
  return await fetchJson(url, options);
}

export async function finishTable(table_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({
      table_id: table_id
    }),
  };
  return await fetchJson(url, options);
}

export async function updateStatus(reservation_id, status, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: status }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function editReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`;
  reservation.people = Number(reservation.people)
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({data: reservation}),
    signal
  };
  return await fetchJson(url, options)
}

export async function readReservation(reservation_id) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  return await fetchJson(url)
    .then(formatReservationDate)
    .then(formatReservationTime);
}
