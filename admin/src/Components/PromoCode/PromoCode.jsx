import React, { useState } from 'react'
import './PromoCode.css'

const PromoCode = () => {

  const [promocodeDetails, setPromocodeDetails] = useState({
    code: "",
    discount: "",
    expirationDate: new Date().toISOString().slice(0, 16),
  })

  const changeHandler = (e) => {
    setPromocodeDetails({ ...promocodeDetails, [e.target.name]: e.target.value })
  }

  const add_promocode = async () => {
    console.log(promocodeDetails)
    let promo = promocodeDetails

    let formData = new FormData()
    formData.append('promocode', promo.code)

    await fetch('http://localhost:4000/createpromocode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promo),
    }).then((resp) => resp.json()).then((data) => {
      data.success ? alert("Promo Code Added") : alert("Failed")
    })
  }

  return (
    <div className='promo-code'>
      <button onClick={() => { add_promocode() }} className='promocode-btn-mobile'>ADD</button>
      <h1>Promo Code</h1>
      <div className="promo-code-input">
        <p>Input New Promo Code</p>
        <input value={promocodeDetails.code} onChange={changeHandler} name='code' type="text" placeholder='Type Here' />
      </div>
      <div className="promo-code-field">
        <div className="promo-code-input">
          <p>Input New Promo Code</p>
          <input value={promocodeDetails.discount} onChange={changeHandler} name='discount' type="number" />
        </div>
        <div className="promo-code-input">
          <p>Input New Promo Code</p>
          <input value={promocodeDetails.expirationDate} onChange={changeHandler} name='expirationDate' type="datetime-local" />
        </div>
      </div>
      <button onClick={() => { add_promocode() }} className='promocode-btn'>ADD</button>
    </div>
  )
}

export default PromoCode