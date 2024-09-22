import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, TimePicker, Checkbox, Button, Tex } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const VehicleModal = ({ visible, onCancel, onSubmit, initialValues, locations }) => {
  const [form] = Form.useForm();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Set initial values for edit mode
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        availableFromTime: moment(initialValues.availableFromTime, 'HH:mm'),
        availableToTime: moment(initialValues.availableToTime, 'HH:mm'),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      availableFromTime: values.availableFromTime.format('HH:mm'),
      availableToTime: values.availableToTime.format('HH:mm'),
    };
    console.log("initialValues", initialValues);
    onSubmit(formattedValues, initialValues?.id);
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Edit Vehicle' : 'Create Vehicle'}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {initialValues ? 'Save Changes' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Name"
          name="type"
          rules={[{ required: true, message: 'Please enter the vehicle name!' }]}
        >
          <Input placeholder="Enter vehicle name" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="locationId"
          rules={[{ required: true, message: 'Please select the location!' }]}
        >
          <Select placeholder="Select Location">
            { locations.map(({ id, name }) => (
              <Option key={id} value={id}>{name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Available From Time"
          name="availableFromTime"
          rules={[{ required: true, message: 'Please select the start time!' }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          label="Available To Time"
          name="availableToTime"
          rules={[{ required: true, message: 'Please select the end time!' }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          label="Available Days"
          name="availableDays"
          rules={[{ required: true, message: 'Please select the available days!' }]}
        >
          <Checkbox.Group>
            {daysOfWeek.map(day => (
              <Checkbox key={day} value={day}>
                {day}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Buffer Time (minutes)"
          name="minimumMinutesBetweenBookings"
          rules={[{ required: true, message: 'Please enter buffer time between bookings!' }]}
        >
          <Input placeholder="Enter buffer time in minutes" type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VehicleModal;
