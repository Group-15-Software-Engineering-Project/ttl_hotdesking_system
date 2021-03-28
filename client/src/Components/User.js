import React from 'react'

function User({user, key}) {
//  let em = user.email;
//  let eml = Object.keys(em).length;
//  let emSpacing = Array(70-eml).fill('\xa0').join('');

  return (
    <div>
      <h2>
        {user}
      </h2>
    </div>
  )
}

export default User