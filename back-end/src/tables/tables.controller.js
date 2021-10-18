const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

const validProperties = [
    "capacity",
    "table_name"
  ]

function hasValidProperties(req, res, next) {
    const data = req.body.data;

    if (!data) {
      return next({
        status: 400,
        message: `Must fill out fields.`
      })
    }

    const missingFields = [];
    for (let key of validProperties) {
      if (!Object.keys(data).includes(key)) missingFields.push(key)
    }
  
    if (missingFields.length) {
      return next({
        status: 400,
        message: `Missing field(s): ${missingFields.join(", ")}`,
      });
    }

    const isEmpty = [];
     for (let key of Object.keys(data)) {
       if (!data[key] ||data[key] == '' || data[key] == 0 && key !== "reservation_id") {
         isEmpty.push(key)
        }
     };

    let emptyFields;
    if (isEmpty) emptyFields = isEmpty.join(", ")
    if (isEmpty.length) {
      return next({
      status: 400,
      message: `Empty fields: ${emptyFields}`,
    });
  }
    next();

}

function hasValidPropertyValues(req, res, next) {
    if (typeof req.body.data.capacity !== "number") {
      return next({
        status: 400,
        message: `capacity must be a number.`,
      });
    }  else if (req.body.data.table_name.length <= 1) { 
      return next({
        status: 400,
        message: `invalid table_name`,
      });
    } else {
      next();
    }
}

async function list (req, res, next) {
    const results = await service.list();
    res.json({data: results});
}

async function read (req, res, next) {
    
    const {table_id} = req.params;
    const result = await service.read(table_id);
    if (result) {
        res.json({data: result})
    } else {
        return next({
            status: 404,
            message: `table_id: ${table_id} does not exist`
        })
    }
    
}

async function tableExists (req, res, next) {
  const {table_id} = req.params;
  const table = await service.readTable(table_id);
  if (!table) {
    return next({
      status: 404,
      message: `table_id: ${table_id} does not exist`
    })
  }
  return next();
}

async function checkAvailabilitySeat (req, res, next) {
  const {table_id} = req.params;
  const table = await service.readTable(table_id);
  if (table.status === "occupied") {
    return next({ 
      status: 400,
      message: "Table is occupied"
     })
  } 
    return next();
}

async function checkAvailabilityDestroy (req, res, next) {
  const {table_id} = req.params;
  const table = await service.readTable(table_id);
  if (table.status !== "occupied") {
    return next({ 
      status: 400,
      message: "Table is not occupied"
     })
  } 
    return next();
}

async function create (req, res, next) {
    const data = req.body.data;
    //There is no way to create a table with a reservation id within the application; however, one of the tests does just that. Therefore, the following code must be implemented.
    if (data.reservation_id) {
      data.status = "occupied"
      let updatedReservation = await service.readReservation(data.reservation_id);
      updatedReservation.status = "seated";
      await service.updateReservation(updatedReservation);
    }
    const result = await service.create(data)
    res.status(201).json({data: result})
}

async function tableHasProperCapacity (req, res, next) {
    const {data} = req.body;
    const {table_id} = req.params;
    const {capacity} = await service.read(table_id);
    const {reservation_id} = data;
    const reservation = await service.readReservation(reservation_id)
    if (capacity < reservation.people) return next({
        status: 400,
        message: "Number of people exceeds table capacity"
    })
    return next();
}

async function reservationIdExists (req, res, next) {
    const {data} = req.body;
    if (!data) return next ({
        status: 400,
        message: "No data"
    })
    if (!data.reservation_id) return next ({
        status: 400,
        message: "Missing reservation_id"
    })
    const {reservation_id} = data;
    const result = await service.readReservation(reservation_id)
    if (!result) return next ({
        status: 404,
        message: `reservation_id: ${reservation_id} does not exist`
    })
    return next();
}

async function seat (req, res, next) {
    const {table_id} = req.params;
    const {reservation_id} = req.body.data;
    let updatedTable = await service.read(table_id);
    if (updatedTable.status == "occupied") return next({
      status: 400,
      message: "Table is occupied"
    })
    updatedTable.status = "occupied";
    updatedTable.reservation_id = reservation_id;
    await service.seat(updatedTable)
    return next();
}

async function updateReservationStatus (req, res, next) {
  const {table_id} = req.params;
  let table = await service.read(table_id)
  let updatedReservation = await service.readReservation(table.reservation_id)
  if (updatedReservation.status == "seated") return next({
    status: 400,
    message: "Reservation is already seated"
  })
  updatedReservation.status = "seated";
  await service.updateReservation(updatedReservation);
  res.status(200).json({data: updatedReservation});
}

async function finishReservationStatus (req, res, next) {
  const {table_id} = req.params;
  let table = await service.read(table_id)
  let updatedReservation = await service.readReservation(table.reservation_id)
  updatedReservation.status = "finished";
  await service.updateReservation(updatedReservation);
  return next();
}

async function destroy (req, res, next) {
  const {table_id} = req.params;

  const result = await service.destroy(table_id);
  res.status(200).json({result});
}


module.exports = {
    list,
    read,
    create: [hasValidProperties, hasValidPropertyValues, asyncErrorBoundary(create)],
    seat: [reservationIdExists, tableExists, checkAvailabilitySeat, tableHasProperCapacity, seat, asyncErrorBoundary(updateReservationStatus)],
    destroy: [tableExists, checkAvailabilityDestroy, finishReservationStatus, destroy],
};