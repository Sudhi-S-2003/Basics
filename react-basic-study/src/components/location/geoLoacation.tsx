import React, { useEffect, useState } from 'react'

function GeoLoacation() {

  const [position,setPosition]=useState({latitude:0,longitude:0})
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos)
      setPosition({
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude
      })

    }, (error) => {
      console.log(error)
    })
  },[])


  const fetchLoacation=async()=>{
    await fetch(`http://localhost:3000/city/me?longitude=${position.longitude}&latitude=${position.latitude}`)
  }
  return (
    <div>geoLoacation <button onClick={fetchLoacation}>Fetch My Location</button></div>
  )
}

export default GeoLoacation