import React from 'react'

function User({user, key}) {
  let fn = user.firstName;
  let fnl = Object.keys(fn).length;
  let fnSpacing = Array(50-fnl).fill('\xa0').join('');

  let ln = user.lastName;
  let lnl = Object.keys(ln).length;
  let lnSpacing = Array(50-lnl).fill('\xa0').join('');

  let em = user.email;
  let eml = Object.keys(em).length;
  let emSpacing = Array(90-eml*4).fill('\xa0').join('');

  let te = user.team;
  let tel = Object.keys(te).length;
  let teSpacing = Array(105-tel*2).fill('\xa0').join('');

  let ti = user.time;

  return (
    <div>
      <h2>
        {fn}{fnSpacing}{ln}{lnSpacing}{em}{emSpacing}{te}{teSpacing}{ti}
      </h2>
    </div>
  )
}

export default User