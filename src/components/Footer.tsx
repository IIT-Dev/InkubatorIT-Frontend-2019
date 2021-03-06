import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faLine, faFacebookF } from '@fortawesome/free-brands-svg-icons';

import './scss/Footer.scss';

import { twitter, instagram, line, facebook } from '../data/url';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="text">
        <p>
          <span>
            <FontAwesomeIcon icon={faCopyright} color="white" size="1x" /> &nbsp;Inkubator IT HMIF 2021.
          </span>
          <span> All rights reserved.</span>
        </p>
      </div>
      <div className="icons">
        <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="twitter">
          <FontAwesomeIcon icon={faTwitter} className="icon" />
        </a>
        <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="instagram">
          <FontAwesomeIcon icon={faInstagram} className="icon" />
        </a>
        <a href={line} target="_blank" rel="noopener noreferrer" aria-label="line">
          <FontAwesomeIcon icon={faLine} className="icon" />
        </a>
        <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="facebook">
          <FontAwesomeIcon icon={faFacebookF} className="icon" />
        </a>
      </div>
    </footer>
  );
};
