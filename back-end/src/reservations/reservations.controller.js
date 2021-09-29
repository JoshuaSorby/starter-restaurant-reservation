/**
 * List handler for reservation resources
 */
  const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

  const service = require("./reservations.service")

  const validProperties = [
    "mobile_number",
    "first_name",
    "last_name",
    "people",
    "reservation_date",
    "reservation_time"
  ]

  async function reservationExists(req, res, next) {
    console.log("req params:", req)
    const {reservation_id} = req.params;
    
    const reservation =  await service.read(reservation_id)

    if (reservation) {
      return next ();
    } else {
      return next ({
        status: 404,
        message: `Reservation with id:${reservation_id} does not exist`
      })
    }
  }

  function hasValidProperties(req, res, next) {
    console.log("THIS FAR", req.body)
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
       if (!data[key] ||data[key] == '' || 0) {
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
    if (typeof req.body.data.people !== "number") {
      return next({
        status: 400,
        message: `people must be a number.`,
      });
    } else if (!Date.parse(req.body.data.reservation_date)){
      return next({
        status: 400,
        message: `reservation_date must be a date.`,
      });
    } else if (req.body.data.reservation_time.length !== 5) { 
      return next({
        status: 400,
        message: `reservation_time must be a valid time.`,
      });
    } else {
      next();
    }
  }

  function dateNotPastOrTuesday(req, res, next) {
    //The following code converts the reservation_date in the date into a format that works with the Date constructor, allowing the getDay() method to be used
    let date = req.body.data.reservation_date;
    date = date.substr(5, 2) + "/" + date.substr(8, 2) + "/" + date.substr(2, 2)
    
    const today = new Date();
    const fullDate = new Date(date);
    const day = fullDate.getDay();

    if (day == 2) {
      
      return next ({
        status: 400,
        message: "closed on tuesday"
      })
    } else if (fullDate < today) {
      
      return next({
        status: 400,
        message: "reservation_date must be in the future"
      })
    } else {

      next();
    }
  }

  function validTime (req, res, next) {
    console.log("REQUEST: ", req.body)
    const { reservation_time } = req.body.data;

    if (Date.parse(`01/01/2011 ${reservation_time}`) < Date.parse('01/01/2011 10:30' ) ||
        Date.parse(`01/01/2011 ${reservation_time}`) > Date.parse('01/01/2011 21:30' )) {
      return next({
        status: 400,
        message: "reservation_time must be after 10:30 am and before 9:30 pm"
      })
    } else {
      return next();
    }
  }

  async function list(req, res) {
    console.log("WHERE AT LIST", req.query)
    let results;
    if (req.query.date) {
      results = await service.listByDate(req.query.date)
    } else if (req.query.mobile_number) {
      results = await service.listByNumber(req.query.mobile_number);
    }
    console.log("FINISHED LIST", results)
    res.status(201).json({ data: results})
  }

  async function read (req, res, next) {
    const {reservation_id} = req.params;
    const results = await service.read(reservation_id);
    res.status(201).json({data: results})
  }

  async function create(req, res, next) {
    console.log("WE'VE MADE IT TO CREATE")
    const {status} = req.body.data;
    if (status == "seated" || status == "finished") return next ({
      status: 400,
      message: "status cannot be 'seated' or 'finished'"
    })
    console.log("WE'Ve MADE IT PAST CREATE")
    const results = await service.create(req.body.data)
    res.status(201).json({data: results})

  }

  async function update(req, res, next) {
    let updatedReservation = {
      ...req.body.data
    }

    
    const data = await service.update(updatedReservation);
    res.json({ data })
  }

  async function updateStatus (req, res, next) {
    const {reservation_id} = req.params;
    console.log("reservationd id:", reservation_id)
    console.log("New status:", req.body.data)
    let updatedReservation = await service.read(reservation_id);
    const {status} = req.body.data
    if (updatedReservation.status == "finished" && status !== "cancelled") return next({
      status: 400,
      message: `cannot update a finished reservation ${status}`
    })
    if (status !== "booked" && status !== "seated" && status !== "finished" && status !== "cancelled") {
      return next({
        status: 400,
        message: `${status} is not a valid status.`
      })
    }
    updatedReservation.status = status;
    const result = await service.update(updatedReservation)
    res.status(200).json({ data: result })
  }


  

module.exports = {
  update: [asyncErrorBoundary(reservationExists), hasValidProperties, hasValidPropertyValues, dateNotPastOrTuesday, asyncErrorBoundary(update)],
  list: [asyncErrorBoundary(list)],
  create: [hasValidProperties, hasValidPropertyValues , dateNotPastOrTuesday, validTime, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(updateStatus)]
};