
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
   Modal
 } from 'antd';


 
const ModalForm = ({ pk, users , isModalOpen, setIsModalOpen, activeUser, prevData, setPrevData}) =>{

   // const [adjData , setAdjData] = useState({})
   const [ form ] = Form.useForm();
   const [ completed , setcomplete] = useState(false);

 

   const recordtime= ()=> {
    const today = new Date();
       return today.toLocaleDateString()
}

const restartValues = () => {
  setPrevData({
    'date' : "", 
     'amount' : 0,
     'description': ""
  })
}

    const handleOk =()=>{
        setIsModalOpen(false)
        setcomplete(false)
        restartValues();
        form.resetFields();
        
    }

    const handleCancel =()=>{
        setIsModalOpen(false)
        setcomplete(false)
        restartValues();
        form.resetFields();
    }
   

    const onFinish = (values) => {
        console.log('Success:', values);
       
        let body = {
       
              "date": values.date,
              "amount" : values.amount,
              "description" : values.description,
              "user" : activeUser,  
        }

        axios.put(`http://localhost:8000/account/modifyEntry_userLedgers/${pk}`,body)
        .then(response => setcomplete(true))
        
        restartValues();
        console.log("what was it")
        //form.resetFields();
        //console.log(Object.keys(entryData))
      };

      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      }; 

      const userList = users.map(user => {
        return <Select.Option  key={user} value={user}>{user}</Select.Option>
      })


    return(
        <Modal 
        title={ completed ? `Transaction ${pk}, has been edited ${recordtime()}`:`Edit Tranaction ${pk}`}
        open={isModalOpen} 
        onOk={handleOk}
        onCancel={handleCancel}
        >
   <Form
    form = {form}
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
       'date': prevData.date,
       'amount': prevData.amount,
       'description' :prevData.description,
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
       <Form.Item 
       name="users"
       label="Users"
       >
         <Select>
            {userList}
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
 </Modal>
    )
} 

export default ModalForm