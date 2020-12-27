import React from 'react'

import burgerLogo from '../../assets/images/burger-logo.png';
import classses from './Logo.css';

const logo = (props) => {
  return (
    <div className={classses.Logo}>
      <img src={burgerLogo} alt="MyBurger" />
    </div>
  )
}

export default logo;
