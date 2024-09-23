import React, { useEffect, useState } from 'react';
import { Select, Table, notification, DatePicker, Button, Input, Popconfirm } from 'antd';
import axios from 'axios';
import VehicleModal from '../components/VehicleModal';

const URL = "http://localhost:3000";
const { Option } = Select;

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleName, setVehicleName] = useState(undefined);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(URL + "/locations"),
        axios.get(URL + `/vehicles?location=${selectedLocation}&vehicleName=${vehicleName}`)
      ]);
      setLocations(res1.data);
      setVehicles(res2.data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while fetching reservations!' });
    }
  }

  const handleSearch = async () => {
      try {
      const response = await axios.get(URL + `/vehicles?location=${selectedLocation}&vehicleName=${vehicleName}`);
      setVehicles(response.data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while fetching vehicles!' });
    }
  }

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.post(URL + `/reservations/delete-reservation`, { id });
      notification.success({ message: 'Success', description: 'Reservation deleted successfully!' });
      fetchData();
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while deleting reservation!' });
    }
  }

  const handleEditClick = (record) => {
    setIsModalVisible(true);
    setEditData(record);
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const handleSubmit = async(values, recordId) => {
    console.log('Form values:', values);
    if(values.availableDays) {
      values.availableDays = JSON.stringify(values.availableDays);
    }
    try {
      if(recordId) {
        await axios.patch(URL + `/vehicles/${recordId}`, values);
      } else {
        await axios.post(URL + "/vehicles", values);
      }
      notification.success({ message: 'Success', description: 'Vehicle created/updated successfully!' });
      handleCancel();
      fetchData();
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while create/update vehicles!' });
    }
  };


const columns = [
  {
    title: 'Vehicle Name',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Location',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Available Days',
    dataIndex: 'availableDays',
    key: 'availableDays',
    render: (text) => {
      console.log('text', text, typeof text)
      return (
      <span>{text ? text.join(', ') : ''}</span>
    )
  }
  },
  {
    title: 'Available From',
    dataIndex: 'availableFromTime',
    key: 'availableFromTime',
  },
  {
    title: 'Available Till',
    dataIndex: 'availableToTime',
    key: 'availableToTime',
  },
  {
    title: 'Buffer Time(minutes)',
    dataIndex: 'minimumMinutesBetweenBookings',
    key: 'minimumMinutesBetweenBookings',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <>
        <Button
          type="primary"
          style={{ marginRight: '10px'}}
          onClick={() => handleEditClick(record)}
        >
          Edit
        </Button>
        <Popconfirm
          title="Are you sure you want to delete selected vehicle?"
          onConfirm={() => handleDeleteVehicle(record.id)}
          okText="Delete"
          cancelText="Cancel">
          <Button
            type="primary"
            danger
          >
            Delete
          </Button>
        </Popconfirm>
      </>
    )
  }
];
  return (
    <>
      <div>
        <h1 style={{textAlign: 'center'}}>Vehicles</h1>
      </div>
      <div style={{ padding: '20px', textAlign: 'center'}}>
        <Select
          allowClear
          placeholder="Select a location"
          onClear={() => setSelectedLocation(undefined)}
          onChange={setSelectedLocation}
          style={{ margin: '0 16px', width: '200px'}}
        >
          {locations.map(({ id, name }) => (
            <Option key={id} value={id}>{name}</Option>
          ))}
        </Select>
        <Input placeholder="Search by name" style={{ margin: '0 16px', width: '200px'}} onChange={(e) => setVehicleName(e.target.value)}/>
        <Button type="primary" style={{ margin: '0 16px', width: '200px'}} onClick={handleSearch}>Search</Button>
        <Button type="primary" style={{ margin: '0 16px', width: '200px'}} onClick={() => setIsModalVisible(true)}>+Add Vehicle</Button>
      </div>
      <Table
        columns={columns}
        dataSource={vehicles}
      />
      <VehicleModal
        visible={isModalVisible}
        onCancel={handleCancel}
        locations={locations}
        initialValues={editData}
        onSubmit={handleSubmit}
      />
    </>
  )
};

export default Vehicles;
