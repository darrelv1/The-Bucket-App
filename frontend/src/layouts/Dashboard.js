import React from 'react';
import CardHolder from '../components/Cardholder'
import Card from '../components/Card'


const Dashboard = ({body, header, footer})=>{

    const listofCard = [        
                    "Bucket Total",
                    "All Expenses",
                    "Current Floating Balance",
                    "Floating Balance",
                    "# of Contributions",
                    "Current Floating Balances"
    ]

return (
<div>
    <CardHolder cardProp={listofCard}/>

</div>
);

}

export default Dashboard; 