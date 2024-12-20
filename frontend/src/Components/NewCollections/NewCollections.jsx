import React, { useState, useEffect } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const NewCollections = () => {

  const [new_collcetion, setNew_collection] = useState([])
  const link = process.env.REACT_APP_API

  useEffect(() => {
    // fetch('http://localhost:4000/newcollections')
    fetch(`${link}/newcollections`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data))
  }, [])

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collcetion.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} />
        })}
      </div>
    </div>
  )
}

export default NewCollections
