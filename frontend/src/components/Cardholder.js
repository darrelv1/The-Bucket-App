import React from 'react'
import Card from './Card'
import { useState, useEffect } from "react";

import { 
    ReadOutlined,
    CreditCardOutlined,
    MehOutlined,
    ImportOutlined,
    HeartOutlined,
  } from '@ant-design/icons';

 



const statisticStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)', // 2 equal-width columns
  gap: '2px', // adjust for desired space between cards
  gridAutoRows: 'auto'

}

const CardHolder = ({ key, cardProp, bucketData }) => {
  const [figures, setFigures] = useState({
    'Bucket Total': bucketData.balance,
    'Remaining Expense Amount': bucketData.balancePostContrib,
    'Current Floating Balance': bucketData.currentFloatingBalance,
    'Floating Balance': bucketData.floatingBalance,
    'Number of Contributions': 0,
    'Total # of Expenses': bucketData.all_expenses.length,
  })

  const [cardIcons, setcardIcons] = useState({
    'Bucket Total': <CreditCardOutlined/> ,
    'Remaining Expense Amount': <MehOutlined/>,
    'Current Floating Balance': <ImportOutlined/>,
    'Floating Balance': <HeartOutlined/>,
    'Number of Contributions': <ReadOutlined/>,
    'Total # of Expenses': <HeartOutlined/>
  })

  /**
   * Testing the useState updates and Dashboard elements
   */

  //Dummy data obj to update the 'figure' state
  const overrideObj = {
    'Total Contrubutions': 1000,
    'Number of Contributions': 20,
    'Floating Balance': 100
  }

  //Replica of fetchStats where it doesn't fetch any data from an API it rather update state internally
  const fetchStats = () => {
    setFigures(preFigure => {
      return { ...preFigure}
    })
  }

  //Will need to uncomment this for prod***
  /*   const fetchStats = () => {
        axios.get("http://localhost:8000/account/getStats").then((response) => {
          setFigures((prevFigues) => {
            return {
              ...prevFigues,
              ...response.data,
            };
          });
        });
      }; */

  useEffect(() => {
    // fetchStats()

    console.log(figures)
  }, [])

  return (
    <div>
      <div className='statistic' style={statisticStyle} id={key}>
        {cardProp.map(eachCard => {
          return <Card className='card' id={eachCard} label={eachCard} statistic={figures[eachCard]} icon={cardIcons[eachCard]}/>
        })}
      </div>
    </div>
  )
}
export default CardHolder
