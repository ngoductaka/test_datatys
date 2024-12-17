import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useForm } from 'react-hook-form';

import './profile.css';
import axios from '../../tools/api';

function Profile({ user }) {
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });

  useEffect(() => {
    if (user) {
      Object.keys(user).forEach((key) => {
        setValue(key, user[key]);
      });
      setFile(user.avatar);
    }
  }, [user]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      await axios.patch('/v1/user', data);
      alert('Update user successfully');
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleUpload = async (event) => {
    const fileUpload = event.target.files[0];
    const formData = new FormData();
    formData.append('image', fileUpload);

    try {
      const response = await fetch('http://localhost:3002/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setFile(`${process.env.REACT_APP_API_URL}/${data.file.path}`);
      setValue('avatar', `${process.env.REACT_APP_API_URL}/${data.file.path}`);
      console.log('data_load', file, data);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      {file ? (
        <div className="profile-image-container">
          <img
            src={file}
            alt="Profile"
            className="profile-image"
          />
        </div>
      ) : null}
      <h1>Profile Information</h1>
      <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <span htmlFor="first-name">First Name</span>
          <input
            type="text"
            id="first_name"
            {...register('first_name', { required: 'First Name is required' })}
          />
          {errors.first_name && <span>{errors.first_name.message}</span>}
        </div>

        <div className="form-group">
          <span htmlFor="last-name">Last Name</span>
          <input
            type="text"
            id="last_name"
            {...register('last_name', { required: 'Last Name is required' })}
          />
          {errors.last_name && <span>{errors.last_name.message}</span>}
        </div>

        <div className="form-group">
          <span htmlFor="country">Country</span>
          <input
            type="text"
            id="country"
            {...register('country', { required: 'Country is required' })}
          />
          {errors.country && <span>{errors.country.message}</span>}
        </div>

        <div className="form-group">
          <span htmlFor="city">City</span>
          <input
            type="text"
            id="city"
            {...register('city', { required: 'City is required' })}
          />
          {errors.city && <span>{errors.city.message}</span>}
        </div>

        <div className="form-group">
          <span htmlFor="email">Email</span>
          <input
            disabled
            type="email"
            className="disabled"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <span htmlFor="phone_number">Phone Number</span>
          <input
            type="tel"
            id="phone_number"
            {...register('phone_number', {
              required: 'Phone Number is required',
            })}
          />
          {errors.phone_number && <span>{errors.phone_number.message}</span>}
        </div>
        <div className="form-group">
          <span htmlFor="first-name">Profile</span>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
};
Profile.defaultProps = {
  user: { },
};

export default Profile;
