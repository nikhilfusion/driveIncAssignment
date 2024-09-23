const request = require('supertest');
const express = require('express');
const locationRouter = require('../routes/locations'); // Adjust the path as necessary
const db = require('../models/db');

jest.mock('../models/db'); // Mock the db module

const app = express();
app.use(express.json());
app.use('/locations', locationRouter);

describe('Locations API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /locations - should return all active locations', async () => {
    const mockLocations = [
      { id: 1, name: 'Cork', isActive: true },
      { id: 2, name: 'Dublin', isActive: true },
    ];
    
    db.query.mockResolvedValue([mockLocations]);

    const response = await request(app).get('/locations');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLocations);
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM locations where isActive=?", [true]);
  });

  test('GET /locations/:id - should return a location by id', async () => {
    const mockLocation = { id: 1, name: 'Cork', isActive: true };
    
    db.query.mockResolvedValue([mockLocation]);

    const response = await request(app).get('/locations/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLocation);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM locations WHERE id = ?', ['1']);
  });

  test('GET /locations/:id - should return 404 for non-existent location', async () => {
    db.query.mockResolvedValue([[]]); // No results

    const response = await request(app).get('/locations/999');

    expect(response.status).toBe(404);
    expect(response.text).toBe('Location not found');
  });

  test('POST /locations - should create a new location', async () => {
    const newLocation = { name: 'Limerick', isActive: true };
    const mockResult = { insertId: 3 };

    db.query.mockResolvedValue([mockResult]);

    const response = await request(app).post('/locations').send(newLocation);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 3, ...newLocation });
    expect(db.query).toHaveBeenCalledWith('INSERT INTO locations SET ?', newLocation);
  });

  test('PATCH /locations/:id - should update a location', async () => {
    const updatedLocation = { name: 'Updated Cork' };
    
    db.query.mockResolvedValue([{}]); // Mock successful update

    const response = await request(app).patch('/locations/1').send(updatedLocation);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedLocation);
    expect(db.query).toHaveBeenCalledWith('UPDATE locations SET ? WHERE id = ?', [updatedLocation, '1']);
  });

  // test('PATCH /locations/delete-location - should delete a location', async () => {
  //   const deletePayload = { id: 1 };
  //   db.query.mockResolvedValue([{ affectedRows: 1 }]); // Mock successful deletion

  //   const response = await request(app).patch('/locations/delete-location').send(deletePayload);

  //   expect(response.status).toBe(200);
  //   expect(response.text).toBe('Location deleted successfully');
  //   expect(db.query).toHaveBeenCalledWith('UPDATE locations SET isActive=? WHERE id = ?', [false, deletePayload.id]);
  // });

  // test('PATCH /locations/delete-location - should return 404 for non-existent location', async () => {
  //   const deletePayload = { id: 999 };
  //   db.query.mockResolvedValue([{ affectedRows: 0 }]); // No rows affected

  //   const response = await request(app).patch('/locations/delete-location').send(deletePayload);

  //   expect(response.status).toBe(404);
  //   expect(response.text).toBe('Location not found');
  // });

});