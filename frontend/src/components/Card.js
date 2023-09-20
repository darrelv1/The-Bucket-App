import React from 'react';
import {ReadOutlined} from 'antd'


<ReadOutlined />

const Card = ({ label, icon, statistic })  => {


        
        const cardStyles = {
          width: '300px',
          height: '400px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          fontFamily: 'system-ui',
          overflow: 'hidden',
          
         
        };

     
    
        const labelSectionStyles = {
          height: '50%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#f5f5f5',
        };
      
        const iconStyles = {
          width: '24px',
          height: '24px',
        };
      
        const statSectionStyles = {
          height: '75%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '60px',
          fontWeight: 'bold',
        };
    return (
        <div style={cardStyles}>
          <div style={labelSectionStyles}>
            <span>{label}</span>
            <span>
              <img src={icon} alt="icon" style={iconStyles} />
            </span>
          </div>
          <div style={statSectionStyles}>
            {statistic}
          </div>
        </div>
      );
    




}

export default Card;