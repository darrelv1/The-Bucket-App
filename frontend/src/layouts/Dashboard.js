import React from 'react';
import CardHolder from '../components/Cardholder'
import Card from '../components/Card'


const Dashboard = ({body, header, footer})=>{

    const listofCard = [        
                    "Total Amount Owed",
                    "# of Bills due",
                    "Next payment",
                    "Floating Balance",
                    "# of Contributions",
                    "Payments"
    ]

return (
<div>
    <CardHolder cardProp={listofCard}/>

</div>
);

}

export default Dashboard; 