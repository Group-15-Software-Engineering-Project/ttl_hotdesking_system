import React from 'react'

function User({user, key}) {
  return (
    <div>
      <h2>
        {user.firstName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.lastName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.email}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.team}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.time}
      </h2>
    </div>
  )
}

export default User