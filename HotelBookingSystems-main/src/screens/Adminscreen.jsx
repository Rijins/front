import React, { useState, useEffect } from 'react';
import { Tabs, Modal } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

import Loader from '../Components/Loader';
import EditRoom from '../Components/Editroom';

const { TabPane } = Tabs;

function Adminscreen() {
  const admin = JSON.parse(localStorage.getItem('currentadmin'));
  if(!admin)
  {
    window.location.href='/signin'
  }
  const [visible, setVisible] = useState(false);
  const [roomId, setRoomId] = useState('');
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  return (
    <div>
      <div className='ml-5 mt-3 mr-5 mb-5 bsx'>
        <h2 className='text-center' style={{ fontSize: '30px' }}>
          <b>Admin Panel</b>
        </h2>
        <Tabs defaultActiveKey='1' tabPosition='left'>
          <TabPane tab='Bookings' key='1'>
            
             <Bookings /> 
          </TabPane>
          <TabPane tab='Rooms' key='2'>
            
             <Rooms /> 
          </TabPane>
          <TabPane tab='Add Room' key='3'>
            
             <Addroom /> 
          </TabPane>
          <TabPane tab='Users' key='4'>
            
             <Users /> 
          </TabPane>
          
         
        </Tabs>
      </div>
    </div>
  );
}

export default Adminscreen;

//bookings list compnent


export function Bookings() {
    const [bookings, setBookings] = useState([])
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/bookings/getallbookings");
                const data = await response.json();
                setBookings(data);
                setLoader(false);
            } catch (error) {
                console.error(error);
                setLoader(false);
                setError(true);
            }
        };
        fetchData()
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                {loader && (<Loader />)}
                <h1>Bookings</h1>
                <table className='table table-border table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>BookigID</th>
                            <th>UserID</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length && (bookings.map(bookings => {
                            return <tr>
                                <td>{bookings._id}</td>
                                <td>{bookings.userid}</td>
                                <td>{bookings.room}</td>
                                <td>{bookings.fromdate}</td>
                                <td>{bookings.todate}</td>
                                <td>{bookings.status}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>



            </div>
        </div>
    );


}

//rooms list component





export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loader, setLoader] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch("/api/rooms/getallrooms");
      const data = await response.json();
      setRooms(data);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`/api/rooms/deleteroom/${roomId}`);
      fetchData();
      Swal.fire("Success", "Room deleted successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete room", "error");
    }
  };

  const handleEditRoom = (roomId) => {
    setVisible(true);
    setSelectedRoomId(roomId);
  };

  const handleModalCancel = () => {
    setVisible(false);
    setSelectedRoomId('');
  };

  return (
    <div className="row">
      <div className="col-md-12">
        {loader && <Loader />}
        <h1>Rooms</h1>
        <table className='table table-border table-dark'>
          <thead className='bs'>
            <tr>
              <th>RoomID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Day</th>
              <th>Max Count</th>
              <th>Phone NO</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <tr key={index}>
                  <td>{room._id}</td>
                  <td>{room.name}</td>
                  <td>{room.type}</td>
                  <td>{room.rentperday}</td>
                  <td>{room.maxcount}</td>
                  <td>{room.phonennumber}</td>
                  <td>
                    <button
                      className='btn btn-danger'
                      onClick={() => handleDeleteRoom(room._id)}
                    >
                      Delete
                    </button>
                    <button
                      className='btn btn-primary ml-2'
                      onClick={() => handleEditRoom(room._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No rooms available</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* EditRoom Modal */}
        <Modal
          title='Edit Room'
          visible={visible}
          onCancel={handleModalCancel}
          footer={null}
        >
          <EditRoom roomId={selectedRoomId} />
        </Modal>
      </div>
    </div>
  );
}


//users list component
export function Users() {
    const [users, setUsers] = useState([])
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/users/getallusers");
                const data = await response.json();
                setUsers(data);
                setLoader(false);
            } catch (error) {
                console.error(error);
                setLoader(false);
                setError(true);
            }
        };
        fetchData()
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                {loader && <Loader />}
                <h1>Users</h1>


                <table className='table table-dark table-border'>

                    <thead>
                        <tr>
                            <th>UserID</th>
                            <th>UserName</th>
                            <th>UserEmail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && (users.map(user => {
                            return <tr>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        }))}
                    </tbody>

                </table>
            </div>
        </div>
    )

}

//add room compoennt


export function Addroom() {
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState(false)

    const [name, setName] = useState('')
    const [rentperday, setRentperday] = useState('')
    const [maxcount, setMaxcount] = useState('')
    const [description, setDescription] = useState('')
    const [phonennumber, setPhonenumber] = useState('')
    const [type, setType] = useState('')
    const [imageurl1, setImageurl1] = useState('')
    const [imageurl2, setImageurl2] = useState('')
    const [imageurl3, setImageurl3] = useState('')

    async function addrooms() {
        const newroom = {
            name,
            rentperday, maxcount,
            description,
            phonennumber,
            type,
            imageurls: [imageurl1, imageurl2, imageurl3]
        }

        try {
            const result = await axios.post("/api/rooms/addroom", newroom)
            console.log(result.data)
            setLoader(true)
            Swal.fire("Congrats", "New Room Added Successfully", "success").then(result => {
                window.location.reload()
            })
        } catch (error) {
            console.log(error)
            setLoader(false)
            setError(true)
            Swal.fire("Oops", "Something Went Wrong", "error")
        }
    }

    return (
        <div className='row'>
            {loader && <Loader />}
            <div className="col-md-5">

                <input type="text" className="form-control" placeholder='Room Name'
                    value={name} onChange={(e) => {
                        setName(e.target.value)
                    }} /><br />
                <input type="text" className="form-control" placeholder='Rent Per Day' value={rentperday} onChange={(e) => {
                    setRentperday(e.target.value)
                }} /><br />
                <input type="text" className="form-control" placeholder='Max Count' value={maxcount} onChange={(e) => {
                    setMaxcount(e.target.value)
                }} /><br />
                <input type="text" className="form-control" placeholder='Description' value={description} onChange={(e) => {
                    setDescription(e.target.value)
                }} /><br />
                <input type="text" className="form-control" placeholder='Phone Number' value={phonennumber} onChange={(e) => {
                    setPhonenumber(e.target.value)
                }} /><br />


            </div>
            <div className="col-md-5">

                <input type="text" className="form-control" placeholder='Type' value={type} onChange={(e) => {
                    setType(e.target.value)
                }} /><br />
                <input type="text" className="form-control" placeholder='Image URL 1'
                    value={imageurl1} onChange={(e) => {
                        setImageurl1(e.target.value)
                    }} /><br />
                <input type="text" className="form-control" placeholder='Image URL 2' value={imageurl2} onChange={(e) => {
                    setImageurl2(e.target.value)
                }} /><br />
                <input type="text" className="form-control" placeholder='Image URL 3' value={imageurl3} onChange={(e) => {
                    setImageurl3(e.target.value)
                }} /><br />

                <div className="text-right">
                    <button className='btn btn-primary mt-2' onClick={addrooms}>
                        Add Room
                    </button>
                </div>

            </div>


        </div>
    )

}





