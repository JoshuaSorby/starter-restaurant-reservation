# Restaurant Reservation Application

The deployed application can be viewed [here](https://warm-journey-81167.herokuapp.com/dashboard)

# Summary

This is a simple restaurant reservation application. It can be used for any restaurant that takes reservations. The user can add reservations
for certain dates at certain times- as well as add tables to reserve.

There are 4 tabs for this application. The Dashboard, Search, New Reservation and New Table.

# Dashboard

This page displays all the reservations of the current date by default. The date can be changed using the previous, next and today buttons.
If there are no reservations for the current date, the text "No Reservations Found" will display. Each reservation has a 'seat' button that will redirect the user to a screen where they can select a table to seat the reservations at. There is also and 'edit' button where the user can edit a reservation- aswell as a 'cancel' button, allowing the user to cancel a reservation. This page also displays all of the tables
created for the restaurant. Each table has a status. If the status reads 'occupied', the user can click the 'finish' button to change the 
table status to 'free'.

[Dashboard screen](./images/Dash.PNG)

# Search

This page initially displays an empty text input field. When part of a phone number is entered into the field, the page will display any
reservations that have that phone number entered into the mobile number field. It will even display finished and cancelled reservations.

[Search screen](./images/Search.PNG)

# New Reservation

This page displays a form to create a new reservation. All fields must be filled in. The Reservation Date cannot be before or equak to
the current date. The Reservation Time must be after 10:30 am and before 9:30 pm to be valid. Once all the fields are entered properly,
upon submission, the user will be redirected to the Dashboard displaying all reservations on the date of the just entered Reservation
Date.

[New Reservation screen](./images/NewRes.PNG)

# New Table

This page has a form to create a new table. The table name and capacity must be entered for the creation. Once created, the user will
be redirected to the Dashboard and the tables list will have updated to display the newly added table.

[New Reservation screen](./images/NewTab.PNG)

# API

reservations.controller...

- create({data: {reservation}}) creates a reservation
- list({date: date}) returns all reservations with that date
- update(data: {reservation}) updates an already existing reservation
- updatesStatus({data: status}) will update the status of an already existing reservation
- read(reservation_id) will return the reservation with the entered id.

tables.controller...

  - list() will list all tables
  - read({table_id}) will return the table with the matching id
  - create({data: {table}}) will create a new table
  - seat({data: reservation_id}) will seat the reservation with the entered reservation id to the select table
  - destroy() will change the status of a table back to 'free'

  # Technologies

  This project was built with Node.js

  - Knex
  - express
  - cors
  - React

  # installation 

  - Fork and clone this repository.
  - Run npm install to install project dependencies.
  - Run npm run start:dev to start your server in development mode.