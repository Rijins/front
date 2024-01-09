import React, { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import axios from 'axios';
import Loader from './Loader';
import Swal from 'sweetalert2';

function EditRoom({ roomId }) {
  const [loader, setLoader] = useState(false);
  const [roomDetails, setRoomDetails] = useState({
    name: '',
    rentperday: '',
    maxcount: '',
    description: '',
    phonennumber: '',
    type: '',
    imageurls: ['', '', ''],
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.post('/api/rooms/getroombyid', {
          roomid: roomId,
        });
        setRoomDetails(response.data);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleUpdateRoom = async () => {
    try {
      setLoader(true);

      const response = await axios.put(`/api/rooms/updateroom/${roomId}`, {
        // Include updated room details here
        ...roomDetails,
      });

      console.log(response.data);
      setLoader(false);
      Swal.fire({
        icon: 'success',
        title: 'Room Updated Successfully',
        showConfirmButton: false,
        timer: 1500,
      }).then(() =>
      {
        window.location.reload();
      })
    } catch (error) {
      console.error(error);
      setLoader(false);
      // Handle error
    }
  };

  const handleImageChange = (e, index) => {
    const newImageUrls = [...roomDetails.imageurls];
    newImageUrls[index] = e.target.value;

    setRoomDetails({
      ...roomDetails,
      imageurls: newImageUrls,
    });
  };

  const handleInputChange = (e, key) => {
    setRoomDetails({
      ...roomDetails,
      [key]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Edit Room</h2>
      <Input
        placeholder='Room Name'
        value={roomDetails.name}
        onChange={(e) => handleInputChange(e, 'name')}
      />
      <Input
        placeholder='Rent Per Day'
        value={roomDetails.rentperday}
        onChange={(e) => handleInputChange(e, 'rentperday')}
      />
      <Input
        placeholder='Max Count'
        value={roomDetails.maxcount}
        onChange={(e) => handleInputChange(e, 'maxcount')}
      />
      <Input
        placeholder='Description'
        value={roomDetails.description}
        onChange={(e) => handleInputChange(e, 'description')}
      />
      <Input
        placeholder='Phone Number'
        value={roomDetails.phonennumber}
        onChange={(e) => handleInputChange(e, 'phonennumber')}
      />
      <Input
        placeholder='Type'
        value={roomDetails.type}
        onChange={(e) => handleInputChange(e, 'type')}
      />
      {/* Input fields for image URLs */}
      {[0, 1, 2].map((index) => (
        <Input
          key={index}
          placeholder={`Image URL ${index + 1}`}
          value={roomDetails.imageurls[index]}
          onChange={(e) => handleImageChange(e, index)}
        />
      ))}

      <button className='btn btn-primary mt-3'  onClick={handleUpdateRoom}>
        Update Room
      </button>

      {loader && <Loader />}
    </div>
  );
}

export default EditRoom;
