import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Room from '../Components/Room';
import Loader from '../Components/Loader';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css';

const { RangePicker } = DatePicker;

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  const [duplicaterooms, setDuplicaterooms] = useState([]);
  const [searchkey, setSearchkey] = useState('');
  const [type, setType] = useState('all');
  const user = JSON.parse(localStorage.getItem('currentuser'));

  if(!user)
  {
    window.location.href='/login'
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = (await axios.get('/api/rooms/getallrooms')).data;
        setRooms(data);
        setDuplicaterooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates) {
    setFromdate(dates[0].format("DD-MM-YYYY"));
    setTodate(dates[1].format("DD-MM-YYYY"));

    const temprooms = duplicaterooms.filter(room => {
      const isRoomAvailable = room.currentbookings.every(booking => {
        const startDateNotBetween = !moment(dates[0].format("DD-MM-YYYY")).isBetween(booking.fromdate, booking.todate, null, '[]');
        const endDateNotBetween = !moment(dates[1].format("DD-MM-YYYY")).isBetween(booking.fromdate, booking.todate, null, '[]');

        return startDateNotBetween && endDateNotBetween;
      });

      return isRoomAvailable;
    });

    setRooms(temprooms);
  }

  function filterBySearch() {
    const tempRooms = duplicaterooms.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()));
    setRooms(tempRooms);
  }

  function filterByType(selectedType) {
    setType(selectedType)

    if (selectedType.toLowerCase() !== 'all' && selectedType.toLowerCase() !== 'all') {
      const tempRooms = duplicaterooms.filter(room => room.type.toLowerCase() === selectedType.toLowerCase());
      setRooms(tempRooms);
    } else {
      // Handle the case when 'all' or 'All' is selected
      setRooms(duplicaterooms);
    }

    
    
  }


  return (
    <div className='container'>
      <div className='row mt-5 bs'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-3'>
              <RangePicker
                format='DD-MM-YYYY'
                onChange={filterByDate}
              />
            </div>
            <div className='col-md-3'>
              <input
                type="text"
                className='form-control'
                placeholder='Search Rooms'
                value={searchkey}
                onChange={(e) => setSearchkey(e.target.value)}
                onKeyUp={filterBySearch}
              />
            </div>
            <div className='col-md-3'>
              <select className='form-control' value={type} onChange={(e) => filterByType(e.target.value)}>
                <option value="All">All</option>
                <option value="Deluxe">Deluxe</option>
                <option value="NonDeluxe">NonDeluxe</option>
              </select>

            </div>
          </div>
        </div>
      </div>
      <div className='row justify-content-center mt-5'>
        {loading ? (
          <Loader />
        ) : (
          rooms.map((room) => (
            <div className='col-md-9 mt-2' key={room._id}>
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Homescreen;
