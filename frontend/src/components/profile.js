import React from 'react'


 const ProfilePage = () =>{

    return (
        <div>
        <h1> Profile Page</h1>
        <p> Will display the each profile's ledger acocunt table</p>

        <table>
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Decription</th>
            </tr>
            <tr>
                <td>Dec 01, 2022</td>
                <td>100.00</td>
                <td>New piece of equipment</td>
            </tr>
            <tr>
                <td>Aug 29, 1990</td>
                <td>235.97</td>
                <td>Birthday Present</td>
            </tr>
            </table>
        </div>    
    )

 }

 export default ProfilePage;