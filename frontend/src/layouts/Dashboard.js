import React from 'react';
import CardHolder from '../components/Cardholder'
import Card from '../components/Card'


const Dashboard = ({body, header, footer})=>{

    const listofCard = [        
        'Bucket Total',
        'Remaining Expense Amount',
        'Current Floating Balance',
        'Floating Balance',
        'Number of Contributions',
        'Total Contrubutions',
    ]

return (
<div>
    <CardHolder cardProp={listofCard}/>

</div>
);
}

export default Dashboard; 