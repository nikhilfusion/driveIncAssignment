// reservation.test.js

const request = require('supertest');
const express = require('express');
const db = require('../models/db'); // Mock the database
const reservationsRouter = require('../routes/reservations'); // Adjust path as necessary

const app = express();
app.use(express.json());
app.use('/api/reservations', reservationsRouter);

jest.mock('../models/db'); // Mock the db module

describe('Reservations API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/reservations should return reservations', async () => {
    const mockReservations = [{ id: 1, name: 'John Doe' }];
    db.query.mockResolvedValueOnce([mockReservations]);

    const response = await request(app).get('/api/reservations').query({ location: '1' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReservations);
  });

  // test('GET /api/reservations/:id should return a reservation', async () => {
  //   const mockReservation = { id: 1, name: 'John Doe' };
  //   db.query.mockResolvedValueOnce([[mockReservation]]);

  //   const response = await request(app).get('/api/reservations/1');

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(mockReservation);
  // });

  test('GET /api/reservations/:id should return 404 for non-existent reservation', async () => {
    db.query.mockResolvedValueOnce([[]]);

    const response = await request(app).get('/api/reservations/999');

    expect(response.status).toBe(404);
    expect(response.text).toBe('Reservation not found');
  });

  test('POST /api/reservations should create a reservation', async () => {
    const newReservation = { name: 'Jane Doe', vehicleId: 1, startTime: '2024-01-01', endTime: '2024-01-02' };
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);

    const response = await request(app).post('/api/reservations').send(newReservation);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, ...newReservation });
  });

  test('PATCH /api/reservations/:id should update a reservation', async () => {
    const updatedReservation = { name: 'Jane Smith' };
    db.query.mockResolvedValueOnce();

    const response = await request(app).patch('/api/reservations/1').send(updatedReservation);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedReservation);
  });

  test('POST /api/reservations/delete-reservation should delete a reservation', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const response = await request(app).post('/api/reservations/delete-reservation').send({ id: 1 });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Reservation deleted successfully');
  });

  test('POST /api/reservations/delete-reservation should return 404 for non-existent reservation', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const response = await request(app).post('/api/reservations/delete-reservation').send({ id: 999 });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Reservation not found');
  });

  test('should handle internal server error', async () => {
    db.query.mockRejectedValueOnce(new Error('DB error'));

    const response = await request(app).get('/api/reservations');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});