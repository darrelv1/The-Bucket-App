import { Select, Form, Input, Button, Result  } from 'antd';
import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import Card from './Card'

import Dragbox from "./Dragbox";
const BillEntry = ({setBucketData, bucketDatas, getPostRes}) => {

   const [expense, setExpenses] = React.useState({})
   const [resultON, setResultON] = React.useState(false)

  
    const postEntry = () => {


        axios.post("http://localhost:8000/account/bills",expense)
            .then(response => {
        
            console.log(`The request expenses ${Object.keys(expense)}`)    
            console.log(`reponse back ${response.data}`)
            if( Object.entries(expense).length > 0){ 
                setResultON(true)
            }
            
        })
    }

    const getIT = () => {
        axios.get('http://localhost:8000/account/bills')
            .then(response =>response)
    }

    const FormTitleStyle = {
        color: 'orange', 
        textAlign: 'center',
        fontFamily: 'Rockwell', 
        fontSize: '100px'

    }


   const errorWrapper = (cb)=>{
    return function(values){
    try{
        return cb(values)
    }    
    catch (err){
        console.log(`Error Wrapper cb ${Object.getPrototypeOf(cb)}, constuctorName${cb.constructor.name}  ,err${err} `)
    }
   }}

    const addExpense = (values) => {
        setExpenses(()=>{ 
            return {
               "date": values.date,
               "amount" : values.amount,
               "expense" : values.expense,
                "frequency": values.frequency,
                "bucket" : values.bucket,
                }
           }
         )}

    
    const addExpenseWrapped = errorWrapper(addExpense)
    

    const onFinish = (values) => {
        console.log('Success:', values);
        addExpenseWrapped(values);
        console.log(expense)
        postEntry()
        getIT()
      };


      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      }; 
  
      Object.entries(expense).map(([key, value])=>{
        <li style={{color: 'red',}}>{key} : em{value}</li>
      })

    return (
    <div>
        { resultON ?
            <Result
            status="success"
            title="You've added a new expense"
            subTitle={
                <div>
                    <h1 sytle={{ color: 'black'}}>{`Transaction Review `}</h1>
                    <ul  style={{justifyContent: 'center', }}>
                        {Object.entries(expense).map(([key, value]) => (
                            <li key={key} style={{
                                 color: 'orange', 
                                 fontWeight: 'bold',
                                 fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`  }}>
                                {key.toUpperCase} : {value}
                            </li>
                        ))}
                    </ul>
                </div>
            }
            extra={[
            <Button type="primary" key="console" onClick={()=>{setResultON(false)}}>
                
                 Enter Expense
                
            </Button>,
            <Button key="buy"> 
             <Link to="/" >
                 Go home
                </Link>
            </Button>,
            ]}
        /> :<div><h2 style={FormTitleStyle}>Bill Entry </h2>
        <Form
     name="basic"
     labelCol={{
       span: 50,
     }}
     wrapperCol={{
       span: 20,
     }}
     style={{
        font: "Firas Code",
        color: "red",
       maxWidth: 800,
     }}
     initialValues={{
       remember: true,
     }}
     onFinish={onFinish}
     onFinishFailed={onFinishFailed}
     autoComplete="off"
   >
    <Form.Item 
       name="expense"
       label="Expense"
       rules ={[
         {
            required: true, 
            messages: "Description is required"
         }
       ]}
       >
         <Input />
       </Form.Item>

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
         <Input type="number" />
       </Form.Item>
    <Form.Item 
       name="frequency"
       label="Frequency"
       >
         <Select>
            <Select.Option key="BiWeekly" value="BiWeeekly">BiWeeekly</Select.Option>
            <Select.Option key="Monthly" value="Monthly">Monthly</Select.Option>
            <Select.Option key="Yearly" value="Yearly">Yearly</Select.Option>
           {/* <Select.Option value="demo">Demo</Select.Option> */}
         </Select>
       </Form.Item>
       <Form.Item ads
       name="bucket"
       label="Bucket"
       >
         <Select>
            <Select.Option key="Recurring" value="Recurring">Recurring</Select.Option>
            <Select.Option key="Variable" value="Variable">Variable</Select.Option>
            <Select.Option key="Discretionary" value="Discretionary">Discretionary</Select.Option>
           {/* <Select.Option value="demo">Demo</Select.Option> */}
         </Select>
       </Form.Item>
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

                <button>Get xl Entry Form </button>
                <Dragbox getPostRes={getPostRes}/>
   </div>
}
</div>
    )
}


export default BillEntry;