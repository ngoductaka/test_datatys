import React, { useEffect, useState } from 'react';
import Profile from '../../componenets/Profile';
import axios from '../../tools/api';

function ProfilePage() {
  const [user, setUser] = useState({});
  const getProfile = async () => {
    try {
      const { data } = await axios.get('/v1/user/profile');
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };
  const loginRequest = async () => {
    try {
      const { data } = await axios.post('/v1/auth/login', {
        email: 'user-1-company@cementys.com',
        password: 'toto',
      });
      if (data.token) {
        await localStorage.setItem('token', data.token);
        getProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loginRequest();
  }, []);
  return (
    <div className="container">
      <Profile user={user} />
    </div>
  );
}

export default ProfilePage;
