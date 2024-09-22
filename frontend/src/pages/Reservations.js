import React, { useEffect, useState } from 'react';
import { Select, Table, notification, DatePicker, Button, Input, Popconfirm } from 'antd';
import axios from 'axios';
import moment from 'moment';

const URL = "http://localhost:3000";
const { Option } = Select;
const { RangePicker } = DatePicker;


const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [startEndTime, setStartEndTime] = useState([]);
  const [customerName, setCustomerName] = useState(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(URL + "/reservations"),
        axios.get(URL + "/locations")
      ]);
      setReservations(res1.data);
      setLocations(res2.data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while fetching reservations!' });
    }
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(URL + `/reservations?location=${selectedLocation}&startDateTime=${startEndTime[0]}&endDateTime=${startEndTime[1]}&customerName=${customerName}`);
      setReservations(response.data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while fetching reservations!' });
    }
  }

  const handleDeleteReservation = async (id) => {
    try {
      await axios.post(URL + `/reservations/delete-reservation`, { id });
      notification.success({ message: 'Success', description: 'Reservation deleted successfully!' });
      fetchData();
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while deleting reservation!' });
    }
  }


const columns = [
  {
    title: 'Customer Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Mobile Number',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Vehicle',
    dataIndex: 'vehicle',
    key: 'vehicle',
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Start Date Time',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (text, record) => (
      <span>{moment(text).format('YYYY-MM-DD hh:mm')}</span>
    )
  },
  {
    title: 'End Date Time',
    dataIndex: 'endTime',
    key: 'endTime',
    render: (text, record) => (
      <span>{moment(text).format('YYYY-MM-DD hh:mm')}</span>
    )
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <Popconfirm
        title="Are you sure you want to delete selected reservation?"
        onConfirm={() => handleDeleteReservation(record.id)}
        okText="Delete"
        cancelText="Cancel">
        <Button
          type="primary"
          danger
        >
          Delete
        </Button>
      </Popconfirm>
    )
  }
];
  return (
    <>
      <div>
        <h1 style={{textAlign: 'center'}}>Reservations</h1>
      </div>
      <div style={{ padding: '20px', textAlign: 'center'}}>
        <Input placeholder="Search by name" style={{ margin: '0 16px', width: '200px'}} onChange={(e) => setCustomerName(e.target.value)}/>
        <Select
          placeholder="Select a location"
          onClear={() => setSelectedLocation(undefined)}
          onChange={setSelectedLocation}
          style={{ margin: '0 16px', width: '200px'}}
        >
          {locations.map(({ id, name }) => (
            <Option key={id} value={id}>{name}</Option>
          ))}
        </Select>
        <RangePicker 
          showTime
          style={{ margin: '0 16px', width: '200px'}} 
          onChange={(date, dateString) => {
            setStartEndTime(dateString);
          }}
        />
        <Button type="primary" onClick={handleSearch}>Search</Button>
      </div>
      <Table
        columns={columns}
        dataSource={reservations}
      />
    </>
  )
};

export default Reservations;
