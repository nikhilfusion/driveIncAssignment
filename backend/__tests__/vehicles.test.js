const request = require('supertest');
const express = require('express');
const vehicleRouter = require('../routes/vehicles'); // Path to your router file
const db = require('../models/db');
jest.mock('../models/db'); // Mock the db module

const app = express();
app.use(express.json());
app.use('/vehicles', vehicleRouter);

describe('Vehicles API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /vehicles - should return a list of vehicles', async () => {
    const mockResults = [
      { id: 1, name: 'Tesla Model S', locationId: 1, isActive: true },
      { id: 2, name: 'Nissan Leaf', locationId: 2, isActive: true },
    ];

    db.execute.mockResolvedValue([mockResults]);

    const response = await request(app).get('/vehicles');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(
      'SELECT v.*, l.name FROM vehicles as v left join locations as l on v.locationId=l.id WHERE v.isActive=?',
      [true]
    );
  });

  test('GET /vehicles/:id - should return a specific vehicle by ID', async () => {
    const mockVehicle = { id: 1, name: 'Tesla Model S', locationId: 1, isActive: true };
    
    db.query.mockResolvedValue([[mockVehicle]]);

    const response = await request(app).get('/vehicles/1');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockVehicle]);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM vehicles WHERE id = ?', ["1"]);
  });

  test('POST /vehicles - should create a new vehicle', async () => {
    const payload = { name: 'Tesla Model 3', locationId: 1, isActive: true };
    
    db.query.mockResolvedValue([{ insertId: 1 }]);

    const response = await request(app).post('/vehicles').send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, ...payload });
    expect(db.query).toHaveBeenCalledWith('INSERT INTO vehicles SET ?', payload);
  });

  test('PATCH /vehicles/:id - should update a vehicle', async () => {
    const payload = { name: 'Updated Vehicle', isActive: true };
    
    db.query.mockResolvedValue([{}]);

    const response = await request(app).patch('/vehicles/1').send(payload);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(payload);
    expect(db.query).toHaveBeenCalledWith('UPDATE vehicles SET ? WHERE id = ?', [payload, '1']);
  });

  test('POST /vehicles/delete-vehicle - should deactivate a vehicle', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app).post('/vehicles/delete-vehicle').send({ id: 1 });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Vehicle deleted successfully');
    expect(db.query).toHaveBeenCalledWith('UPDATE vehicles SET isActive=? WHERE id = ?', [false, 1]);
  });

  // test('POST /vehicles/get-slots - should return available slots', async () => {
  //   const mockVehicle = { id: 1, availableFromTime: '08:00', availableToTime: '18:00', availableDays: ['Mon', 'Tue'], minimumMinutesBetweenBookings: 15 };
  //   const mockReservations = [
  //     { id: 1, vehicleId: 1, startDateTime: '2023-09-23T10:00:00Z', endDateTime: '2023-09-23T10:45:00Z' },
  //     { id: 2, vehicleId: 1, startDateTime: '2023-09-23T11:00:00Z', endDateTime: '2023-09-23T11:45:00Z' },
  //   ];

  //   const mockAvailableSlots = [
  //     { start: '08:00', end: '08:45' },
  //     { start: '09:00', end: '09:45' },
  //     { start: '10:45', end: '11:30' },
  //     { start: '11:45', end: '12:30' },
  //     { start: '12:30', end: '13:15' },
  //     { start: '13:15', end: '14:00' },
  //     { start: '14:00', end: '14:45' },
  //     { start: '14:45', end: '15:30' },
  //     { start: '15:30', end: '16:15' },
  //     { start: '16:15', end: '17:00' },
  //     { start: '17:00', end: '17:45' },
  //     { start: '17:45', end: '18:00' },
  //   ];

  //   db.query.mockResolvedValue([mockReservations]);
  //   getAvailableSlots.mockReturnValue(mockAvailableSlots); // Mocking the getAvailableSlots function

  //   const response = await request(app)
  //     .post('/vehicles/get-slots')
  //     .send({ selectedVehicle: mockVehicle, date: '2023-09-23' });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(mockAvailableSlots);
  //   expect(db.query).toHaveBeenCalledWith(
  //     'SELECT * FROM reservations WHERE vehicleId = ? AND startTime > ? ',
  //     [1, '2023-09-23']
  //   );
  //   expect(getAvailableSlots).toHaveBeenCalledWith(mockVehicle, '2023-09-23', mockReservations);
  // });
});