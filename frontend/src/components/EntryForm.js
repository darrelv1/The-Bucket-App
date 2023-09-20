import React ,{useEffect, useState} from 'react';
import axios from 'axios';
import {
   Button,
   Cascader,
   DatePicker,
   Form,
   Input,
   InputNumber,
   Radio,
   Select,
   Switch,
   TreeSelect,
   Checkbox,
 } from 'antd';
 

 
 const EntryForm= ({ users }) => {

   const [entryData , setEntryData] = useState({})
   const [format , setFormat] = useState("Ledger")
   const [emptyLedgers, setEmptyLedgers] = useState([])
  // const [empty, setEmpty] = useState =(false)
 
   const handleEmptyLeg = () => {

    axios.get("http://localhost:8000/account/getAllappledger")
          .then((response) => {
           setEmptyLedgers(response.data)
           return response.data
          })
          .then(response => console.log(response))
   }

   const emptyLedgerList = emptyLedgers.map(ledger => {
    return <Select.Option  key={ledger} value={ledger}>{ledger}</Select.Option>
  })

   const onFinish = (values) => {
      console.log('Success:', values);
      setEntryData(()=>{
         
         return {
            "date": values.date,
            "amount" : values.amount,
            "description" : values.description,
            ...format === "User" && {"user" : values.users},  
            ...emptyLedgers.length > 0 && {"MDL" : values.ledger}
        }
   
      })
      console.log(Object.keys(entryData))
    };


   const endPoint = {
      "Ledger" : "entry_Ledger/",
       "Split" : "split/", 
       "User" : "createEntry_userLedgers/"
    }

    useEffect(()=>{
      console.log(entryData)
      console.log("useEffect for the post is ON")
      handleEmptyLeg()
      console.log("in the useEffect")

      axios.post(`http://localhost:8000/account/${endPoint[format]}`,
                  entryData)
                  .then((data) =>console.log(data))


    //   const requestOptions = {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body : JSON.stringify({
    //             'date' : '2020-08-29',
    //             'amount': 300, 
    //             'description': "This is a test for PUT",
    //             'user': 'Darrel'
    //             })
        
    // }
    // fetch("http://localhost:8000/account/modifyEntry_userLedgers/69",requestOptions)
    // .then(data => console.log(data))
      
      },[,entryData]);
     
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    }; 

   
   const userList = users.map(user => {
     return <Select.Option  key={user} value={user}>{user}</Select.Option>
   })



   const onChange = (e) => {
      console.log(`radio checked:${e.target.value}`);
      setFormat(e.target.value)
      console.log(`format ${format}`)
    };

   return(
      <div>
      <Radio.Group onChange={onChange} 
         style={{
         marginBottom:25,
         }} 
         defaultValue="a">
        <Radio.Button value="Ledger">Ledger Entry </Radio.Button>
        <Radio.Button value="User">User Entry </Radio.Button>
        <Radio.Button value="Split">Split Entry</Radio.Button>
      </Radio.Group>
    <></>


   <Form
     name="basic"
     labelCol={{
       span: 8,
     }}
     wrapperCol={{
       span: 16,
     }}
     style={{
       maxWidth: 600,
     }}
     initialValues={{
       remember: true,
     }}
     onFinish={onFinish}
     onFinishFailed={onFinishFailed}
     autoComplete="off"
   >
    <Form.Item 
            name="date"
            label="Date"
            rules={[
               {
               required: true,
               messages: "Date is required"
               }
            ]}
            >
          <Input type="date"/>
    </Form.Item>
    <Form.Item 
       name="amount"
       label="Amount"
       rules ={[
         {
            required: true, 
            messages: "Amount is required"
         }
       ]}
       
       >
         <Input />
       </Form.Item>
       <Form.Item 
       name="description"
       label="Description"
       rules ={[
         {
            required: true, 
            messages: "Description is required"
         }
       ]}
       >
         <Input />
       </Form.Item>
       { format === "User" ? <Form.Item ads
       name="users"
       label="Users"
       >
         <Select>
            {userList}
           {/* <Select.Option value="demo">Demo</Select.Option> */}
         </Select>
       </Form.Item>: null }
       { format === "User" ? <Form.Item 
       name="ledger"
       label="Ledger"
       >
         <Select>
            {emptyLedgerList}
           {/* <Select.Option value="demo">Demo</Select.Option> */}
         </Select>
       </Form.Item>: null }
     <Form.Item
       wrapperCol={{
         offset: 8,
         span: 16,
       }}
     >
       <Button type="primary" htmlType="submit">
         Submit
       </Button>
     </Form.Item>
   </Form>
   </div>
 );
      }

//  const EntryForm = ({users}) => {
//    const [componentSize, setComponentSize] = useState('default');
//    const [entry, setEntry] = useState({});
//    const [postData, setPostData] = useState({});

//    const userList = users.map(user => {
//      return <Select.Option value={user}>{user}</Select.Option>
//    })

//    const handleFinish = (e)=>{

//          console.log(`This is the finsih ${e}`)
//          console.log(`This is the finsih ${Object.keys(e)}`)
         
//          console.log(`This is the finsih typeof ${typeof(e.size)}`)
 
//          console.log(`This is the finsih size prop ${e.size}`)
//          console.log(`boolean to test e.size vs undefined ${e.size === undefined}`)
//          console.log('updated mar 30 10:52');
//          console.log('item update');
         
//    }
//    const onFinishFailed = (errorInfo) => {
//       console.log('Failed:', errorInfo);
//     };

//    return (
//      <Form
//          onFinish={handleFinish}
//          onFinishFailed={onFinishFailed}
//        labelCol={{
//          span: 4,
//        }}
//        wrapperCol={{
//          span: 14,
//        }}
//        layout="horizontal"
//       //  initialValues={{
//       //    boysChange: true, 
//       //    amount: 90
//       //  }}
//        style={{
//          maxWidth: 600,
//        }}
//      >

//        <Form.Item label="Button">
//        <Button type="primary" htmlType="submit">
//         Submit
//       </Button>
//        </Form.Item>
//      </Form>
//    );
//  };
 

// const EntryForm2 = (props) => {
//     let [date, amount, description] = React.useState(0,0,0);
 
//     const accountURL = "http://localhost:8000/Accounts_POST/l;kj"
//     const altURL = "http://127.0.0.1:8000/Accounts_POST/dfgsdfg"
 
//     const updateDate = (event) => {
//        date = event.target.value
//        console.log(event.target.value)
//     }
    
//     const updateAmount = (event) =>{
 
//        amount = event.target.value
//        console.log(amount)
//     }
    
//     const updateDescription = (event) => {
//        description = event.target.value
//        console.log(event.target.value)
//     }
 
//     const handleSubmit = (event) => {
//        console.log("Submit Triggers")
//        event.preventDefault(); 
 
//     // let entryLine = {
//     //       "date" : date,
//     //       "amount" : amount, 
//     //       "description" : description
//     //    }
       
 
//       fetch(accountURL,{
//           'Method' : 'POST', 
//           'Headers' : {
//             'Content-Type' : 'applicaiton/json'
//           },
//           'Body' : JSON.stringify({date, amount, description})
//        }).then(response => response.json())
//        .then(data => {
//          console.log('Success:', data);
//        })
//        .catch((error) => {
//          console.error('Error:', error);
//        });
       
//     }
 
//     return (
//         <div>
//         <h1> Entry Point</h1>
//         <form onSubmit={handleSubmit}>
//            <label>Date</label>
//            <input type="date" id="date" onChange={updateDate}></input>
//            <label>Amount</label>
//            <input type="number" id="amount" onChange={updateAmount}></input>
//            <label>Description</label>
//            <input type="text" id="description" onChange={updateDescription}></input>
//             <input type="submit" value="Submit" />
//           </form>
//         </div>
//     )
 
//  }

 export default EntryForm; 