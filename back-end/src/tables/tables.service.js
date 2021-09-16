const knex = require("../db/connection");

function readReservation(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .then((records) => records[0])
}

function updateReservation(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((updatedRecords) => updatedRecords[0])
}

function readTable(tableId) {
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .first();
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

function read(tableId) {
    return knex("tables")
        .select("*")
        .where({table_id: tableId})
        .then((records) => records[0])
}

function create(table) {
    return knex("tables")
        .insert(table, "*")
        .then((createdRecrods) => createdRecrods[0])
}

function seat (updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
        .then((updatedReservations) => updatedReservations[0])
}

function destroy (tableId) {
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .del()
}
module.exports = {
    list,
    read,
    create,
    readReservation,
    seat,
    readTable, 
    destroy,
    updateReservation
}