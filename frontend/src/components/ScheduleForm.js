import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button, notification } from 'antd';
import moment from 'moment';
import axios from "axios";

const { Option } = Select;
const URL = "http://localhost:3000";

const ScheduleForm = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [locationsData, setLocations] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [slotsData, setSlotsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response1= await axios.get(URL + "/locations")
      console.log("Locations: ", response1.data);
      setLocations(response1.data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error', description: 'An error occurred while fetching locations!' });
    }
  };

  const retrieveStartAndEndTime = (ScheduleDate, ScheduleTime) => {
    const [start, end] = ScheduleTime.split('-');
    // Format the date into 'YYYY-MM-DD' format
    const formattedDate = moment(ScheduleDate).format('YYYY-MM-DD');
    console.log("formattedDate", formattedDate);
    // Combine the date with the start and end times
    const startTime = moment(`${formattedDate} ${start}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(`${formattedDate} ${end}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
    return [startTime, endTime];
  }

  const onFinish = (values) => {
    const [startTime, endTime] = retrieveStartAndEndTime(selectedDate, values.time);
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.mobile,
      vehicleId: selectedVehicleId,
      startTime: startTime,
      endTime: endTime,
      isDeleted: false
    }
    console.log("payload is ", payload);
    axios.post(URL + "/reservations", payload);
    notification.success({ message: 'Success', description: 'Test drive scheduled successfully!' });
    form.resetFields();
  };

  const handleLocationChange = async(value) => {
    console.log('Selected Location: ', value);
    const response2 = await axios.get(URL + "/vehicles?location=" + value);
    console.log("Vehicles: ", response2.data);
    setVehicleData(response2.data);
  }

  const handleVehicleChange = (value) => {
    console.log('Selected Vehicle: ', value);
    setSelectedVehicleId(value);
  };

  // Disable past dates and enable only available days for the next 2 weeks
  const disabledDate = (current) => {
    const selectedVehicle = vehicleData.find(({ id }) => id === selectedVehicleId);
    const today = moment().startOf('day');
    const twoWeeksLater = moment().add(2, 'weeks').endOf('day');

    // Check if the current date is in the past
    if (current.isBefore(today)) {
      return true;
    }

    // Check if the date is beyond the next 2 weeks
    if (current.isAfter(twoWeeksLater)) {
      return true;
    }

    // Get the current day's name (e.g., 'Mon', 'Tue')
    const currentDayName = current.format('ddd');

    // Disable the date if it's not in the availableDays list
    if (!selectedVehicle.availableDays.includes(currentDayName)) {
      return true;
    }

    return false;
  };

  const handleDateChange = async(date, dateString) => {
    console.log('Selected Date: ', dateString);
    const selectedVehicle = vehicleData.find(({ id }) => id === selectedVehicleId);
    const payload = {
      selectedVehicle,
      date: dateString
    }
    const resp = await axios.post(URL + "/vehicles/get-slots", payload, {});
    console.log("Slots: ", resp.data);
    setSlotsData(resp.data);
    setSelectedDate(dateString);
  }

  return (
    <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '10px' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your full name!' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="mobile"
          rules={[
            { required: true, message: 'Please enter your mobile number!' },
            { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit mobile number!' }
          ]}
        >
          <Input placeholder="Enter your mobile number" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: 'Please select a location!' }]}
        >
          <Select placeholder="Select a location" onChange={handleLocationChange}>
            {locationsData.map(({ id, name }) => (
              <Option key={id} value={id}>{name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Vehicle"
          name="vehicle"
          rules={[{ required: true, message: 'Please select a vehicle!' }]}
        >
          <Select placeholder="Select a vehicle" onChange={handleVehicleChange}>
            {vehicleData.map(({ id, type }) => (
              <Option key={id} value={id}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select a date!' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            disabledDate={disabledDate}
            onChange={handleDateChange}
            disabled={selectedVehicleId === null}
            format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Time"
          name="time"
          rules={[{ required: true, message: 'Please select a time!' }]}
        >
          <Select placeholder="Select a Time slot" >
            {slotsData.map(({ start, end }) => (
              <Option key={start} value={`${start}-${end}`}>{`${start}-${end}`}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Schedule Test Drive
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ScheduleForm;
