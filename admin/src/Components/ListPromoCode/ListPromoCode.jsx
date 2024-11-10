import React, { useEffect, useState } from 'react'
import './ListPromoCode.css'

const ListPromoCode = () => {

  const [allPromoCode, setAllPromoCode] = useState([])

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allpromocodes')
      .then((res) => res.json())
      .then((data) => { setAllPromoCode(data) })
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const remove_promocode = async (id) => {
    await fetch('http://localhost:4000/removecode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    }).then((resp) => resp.json()).then((data) => {
      data.success ? alert("Promo Code Removed") : alert("Failed")
    })
    await fetchInfo()
  }

  return (
    <div className='list-promo-code'>
      <h1>List Promo Code</h1>
      <div className="listpromocode-format-main">
        <p>Promo Code</p>
        <p>Discount</p>
        <p>Expired Date</p>
        <p>Remove</p>
      </div>
      <div className="listpromocode-allcode">
        <hr />
        {allPromoCode.map((promocode, index) => {
          return <>
            <div key={index} className='listpromocode-format-main listpromocode-format'>
              <p>{promocode.code}</p>
              <p>{promocode.discount}</p>
              <p>{promocode.expirationDate}</p>
              <div className="listproduct-remove-icon" onClick={() => { remove_promocode(promocode.id) }}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
          </>
        })}
      </div>
    </div>
  )
}

export default ListPromoCode