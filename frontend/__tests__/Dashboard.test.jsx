// Dashboard.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard'; // Adjust the import path as necessary

describe('Dashboard Component', () => {
  test('renders the Dashboard with correct title and footer', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const title = screen.getByText(/Test Drive Scheduler/i);
    const footer = screen.getByText(/Dashboard ©2024 Created by Nikhil/i);

    expect(title).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  test('renders the correct selected menu item for Home', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Dashboard />
      </MemoryRouter>
    );

    const selectedMenuItem = screen.getByRole('link', { name: /Home/i }).closest('li');
    expect(selectedMenuItem).toHaveAttribute('class', expect.stringContaining('ant-menu-item-selected'));
  });

  test('renders the correct selected menu item for Reservations', () => {
    render(
      <MemoryRouter initialEntries={['/reservations']}>
        <Dashboard />
      </MemoryRouter>
    );

    const selectedMenuItem = screen.getByRole('link', { name: /Reservations/i }).closest('li');
    expect(selectedMenuItem).toHaveAttribute('class', expect.stringContaining('ant-menu-item-selected'));
  });

  test('renders the correct selected menu item for Vehicles', () => {
    render(
      <MemoryRouter initialEntries={['/vehicles']}>
        <Dashboard />
      </MemoryRouter>
    );

    const selectedMenuItem = screen.getByRole('link', { name: /Vehicles/i }).closest('li');
    expect(selectedMenuItem).toHaveAttribute('class', expect.stringContaining('ant-menu-item-selected'));
  });

  test('renders the correct selected menu item for Settings', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Dashboard />
      </MemoryRouter>
    );

    const selectedMenuItem = screen.getByRole('link', { name: /Settings/i }).closest('li');
    expect(selectedMenuItem).toHaveAttribute('class', expect.stringContaining('ant-menu-item-selected'));
  });
});