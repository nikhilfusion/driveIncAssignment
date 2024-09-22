import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, notification } from 'antd';
import './settings.css';

const URL = "http://localhost:3000";

const Settings = () => {
  const handleDBInit = async () => {
    try {
      await axios.post(URL + "/db-init");
      notification.success({ message: 'Success', description: 'Database initialized successfully!' });
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while initializing the database!' });
    }
  }

  const handleTbInit = async () => {
    try {
      await axios.post(URL + "/tb-init");
      notification.success({ message: 'Success', description: 'Tables initialized successfully!' });
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while initializing the tables!' });
    }
  }

  const handleFillLocations = async () => {
    try {
      await axios.post(URL + "/fill-locations");
      notification.success({ message: 'Success', description: 'Locations data filled successfully!' });
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while filling locations data!' });
    }
  }

  const handleFillVehicles = async () => {
    try {
      await axios.post(URL + "/fill-vehicles");
      notification.success({ message: 'Success', description: 'Vehicles data filled successfully!' });
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while filling vehicles data!' });
    }
  }

  return (
    <>
      <div>
        <h1 style={{textAlign: 'center'}}>Settings</h1>
      </div>
      <div className="settingsContainer">
        <Button type="primary" style={{ margin: '16px'}} onClick={handleDBInit}>DB Initialization</Button>  
      </div>
      <div className="settingsContainer">
        <Button type="primary" style={{ margin: '16px'}} onClick={handleTbInit}>Table Initialization</Button>
      </div>
      <div className="settingsContainer">
        <Button type="primary" style={{ margin: '16px'}} onClick={handleFillLocations}>Fill Locations Data</Button>
      </div>
      <div className="settingsContainer">
        <Button type="primary" style={{ margin: '16px'}} onClick={handleFillVehicles}>Fill Vehicles Data</Button>
      </div>
    </>
  )
};

export default Settings;
