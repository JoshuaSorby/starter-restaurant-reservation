const knex = require("../db/connection");

function listByDate(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .andWhereNot({ status: "finished" })
        .orderBy("reservation_time")
}

function listByNumber(number) {
    return knex("reservations")
        .select("*")
        .where('mobile_number', 'like', `%${number}%`)
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation, "*")
        .then((createdRecords) => createdRecords[0])
}

function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .then((records) => records[0])
}

function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((updatedReservations) => updatedReservations[0])
}

module.exports = {
    listByDate,
    listByNumber,
    create,
    read,
    update
}