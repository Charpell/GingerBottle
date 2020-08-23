const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

function accountNumber() {
  const today = new Date()
  const date1 = today.getDate()
  const year1 = today.getFullYear()
  const hour1 = today.getHours()
  const minute1 = today.getMinutes()
  const month1 = today.getMonth()
  const seconds1 = today.getSeconds()

  const year1_str = year1.toString()
  const sliced_res = parseInt(year1_str.slice(2))
  const randomNumber = Math.floor(Math.random() * 9999) + 1
  const result = `${randomNumber}${sliced_res}${month1}${date1}${hour1}${minute1}`
  
  return result
}

function charges(amount) {
  let fee
  if (amount <= 1000) {
    fee = 10
  } else if (amount > 1000 && amount <= 5000) {
    fee = 25
  } else if(amount > 5000 && amount <= 10000) {
    fee = 35
  } else if(amount > 10000) {
    fee = 1000
  }
  return fee
}

function refCharge(amount) {
  let fee = amount/100
  let newCharge
  if (fee < 2500) {
    newCharge = fee - (fee * 0.015 + 100)
  } else {
    newCharge = fee - (fee * 0.015)
  }
  return Math.ceil(newCharge)
}


module.exports = {
  APP_SECRET,
  getUserId,
  accountNumber,
  charges,
  refCharge
}
