# car-rental-service

A car rental api service built with Nodejs, Expressjs and MongoDB. <br />
Link to the server : *https://damian-car-rental-service.herokuapp.com/*

------------

### Assumptions -

- There are two types of users who interact with the APIs:
1. Customer,
1. Administrator

- Only administrators can add/update/delete cars.
- A customer can only book a car for themselves.
- Cars can not be booked beyond 2 months from current time of booking.
- Users need not authenticate to see the availability of cars or car details.
- The registration number of a car cannot be updated.

------------


### API calls -

BASE URI :  *https://damian-car-rental-service.herokuapp.com/api/*

##### 1.  POST /customer/login
**Request** = email and password. <br/>
if authenticated - <br/>
**Response** = “status: 200” and jwt for the customer account. <br/>
else - <br/>
**Response** = “status: 400” and message=”invalid credentials”.

##### 2.  GET /customer/show_cars
**Request** = json of filter. <br/>
**Response** = “status : 200” and list of cars with their details.

##### 3.  POST /customer/book_car
**Request** = jwt of user and vehicle number of car, start time and end time of booking. <br/>
If user is authenticated and car is available - <br/>
**Response** = “status: 200” and message= “booking complete” <br/>
else - <br/>
**Response** = “status: 400” and message=”booking failed”

##### 4.  GET /customer/car_details
**Request** = vehicle number of the car. <br/>
If a car with given vehicle number exists - <br/>
**Response** = “status : 200” and json data containing details of car. <br/>
else - <br/>
**Response** = "status : 404" and message="no such car exists."

###### (API calls exclusive to administrators) -

##### 5.  POST /admin/login
**Request** = email and password.  <br/>
if authenticated - <br/>
**Response** = “status: 200” and jwt for the customer account.  <br/>
else - <br/>
**Response** = “status: 400” and message=”invalid credentials”. <br/>

##### 6.  POST /admin/add_car
**Request** = jwt of admin and json data of new car to be added.  <br/>
if authenticated and a car with given vehicle number does not exist - <br/>
**Response** = “status: 200” and message = "Successfully added car to the service". <br/>
else - <br/>
**Response** = “status: 400” and message=”couldn't add car”.

##### 7. PUT /admin/update_car
**Request** = jwt of admin and json data of updated details of car. <br/>
if authenticated and a car with given vehicle number exists - <br/>
**Response** = “status: 200” and message = "Successfully updated car". <br/>
else - <br/>
**Response** = “status: 400” and message=”couldn't update car”.

##### 8. DELETE /admin/delete_car
**Request** = jwt of admin and vehicle number of car to be deleted. <br/>
if authenticated and a car with given vehicle number exists - <br/>
**Response** = “status: 200” and message = "Successfully deleted the car". <br/>
else - <br/>
**Response** = “status: 400” and message=”couldn't delete car”. <br/>


------------


### File Structure (Description for uncommon folders) -
 - **Utilities** folder contains some frequently used functions.
 - **Models/Classes** folder contains classes for models. These classes provide both instance and static methods for model <br/>
 (e.g., bookCar() in car.class.js).
 - **Controllers/Queries** folder contains queries for each model. This is used to quickly inspect a query and change it if needed.
 - **Postman test APIs** folder contains the exported requests for testing from postman client.
