import React from 'react';
import CardHolder from '../components/Cardholder'
import Card from '../components/Card'
import axios from "axios";
import {useEffect} from "react";


const Dashboard = ({bucketData, setBucketData})=>{


      const getIT = async () => {
        const getData = await axios.get('http://localhost:8000/account/bills')
          return getData.data
    }

    // useEffect(() => {
    //
    //     const activate = async () => {s
    //         await getIT()
    //         Object.entries(bucketData).forEach(([key, item]) => {
    //             console.log(`bucket data    ${key}: ${item}`)
    //         })
    //     }
    //     activate();
    // }, [])
    const activate = async () => {
          // const newData =
        const fetchedData = await getIT()
        setBucketData(fetchedData)
               // getIT().then(data => {setBucketData(data)})
            // setBucketData(newData);
        // console.log(`newData ${newData.balance}`);
    }

    useEffect(() =>{
         activate();
        console.log("MONEY")
         console.log(`balance: ${bucketData}`);
        const keyInfo = getIT().then(data => {
        console.log(data)
        })

    }, [])

    const listofCard = [
        'Bucket Total',
        'Remaining Expense Amount',
        'Current Floating Balance',
        'Floating Balance',
        'Number of Contributions',
        'Total # of Expenses',
    ]


return (
<div>

    {bucketData && <CardHolder cardProp={listofCard} bucketData={bucketData}/> }
</div>
);
}

export default Dashboard; 