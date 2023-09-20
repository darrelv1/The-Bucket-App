import React from 'react';
import Card from './Card'

const statisticStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",  // 2 equal-width columns
    gap: "2px",  // adjust for desired space between cards
    gridAutoRows: "auto", 

};




const CardHolder = ({key, cardProp}) => {
    return (
        <div>
            <div className='statistic' style={statisticStyle} id={key}>
            {cardProp.map((eachCard)=>{
                return <Card className='card' label={eachCard}/>
            })}
            </div>
        </div>
    )
}
export default CardHolder;
