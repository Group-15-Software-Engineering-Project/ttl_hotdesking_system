import React from 'react'

function User({user, key}) {
  let em = user.email;
  let eml = Object.keys(em).length;
  let emSpacing = Array(70-eml).fill('\xa0').join('');

  let te = user.team;
  let tel = Object.keys(te).length;

  return (
    <div>
      <h2>
        {em}{emSpacing}{te}
      </h2>
    </div>
  )
}

export default User