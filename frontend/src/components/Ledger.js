import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Space, Table, Tag, Button, Modal} from 'antd';
import { Keyframes } from '@ant-design/cssinjs';
import Typography from 'antd/es/typography/Typography';
import ModalForm from './ModalForm'

const { Column, ColumnGroup } = Table;

const Ledger = ({activeUser, users}) => {
  const [data, setData] = useState([
    {
      
    }
   
  ]);

  const [columns , setcolumns ] = React.useState('');
  const [isModalOpen, setIsModalOpen ] = React.useState(false)
  const [id, setid ] = React.useState()
  const [selected, setSelected ] = React.useState({});
  const refreshButton = useRef();

const urls={
  "All Users": "/getLedgerAll", 
  "Darrel" : "/getUserLedgerByName/Darrel",
  "Claudia" : "/getUserLedgerByName/Claudia",
  "Anthony" : "/getUserLedgerByName/Anthony",
}

  const userMapper =()=> {

  }

 const getLedgerData =() =>{    
  let endpoint = urls[activeUser] 
  console.log(endpoint)
    axios.get(`http://localhost:8000/account${endpoint}`)
    .then(response => setData(response.data))             
              
 }

 const handleDelete =(itemID)=>{
  const id = itemID.id; 
  const userID =  itemID.user_id ? itemID.user_id : 1000

  console.log(`userID = ${itemID.user_id}`)
     axios.get(`http://localhost:8000/account/deleteDynamic/${id}/${userID}`)
     .then(response => {console.log(`deleted ${response}`)}) 
  
 }

 const updateColumns =() => {
    const dataArray =[...data]
    try{
    const keys = Object.keys(dataArray[0]);
    const columnList = keys.map((key) => {
    
       const magicKeys = ['id', 'debit', 'credit']
       console.log(`DATA ${data}`)

       if (magicKeys.includes(key)){
        console.log(`key = ${magicKeys.includes(key)}`)
        
        return <Column title={key} dataIndex={key} key={key} />
       } else {
        return <Column title={key} dataIndex={key} key={key} />
       }
      
    
    })
    setcolumns(columnList)
  } catch(err){
    setcolumns(()=>{
      return <h1>No Data to present</h1>
      })
  }
 }

  useEffect(()=> {
    
    getLedgerData();
    updateColumns()
  
  },[,data])

  const showModal = () => {
    setIsModalOpen(true);
  }

const handleValueUpdate = async (item) =>{
  setid(item.id)
  const a = {
    "date" : item.date, 
    "amount" : item.debit - item.credit,
    "description" : item.description,
  }
  await setSelectedPromise(a)
  console.log(`Date: ${a.date}`)
  console.log(`amount: ${a.amount}`)
  console.log(`description: ${a.description}`)
  
  console.log(`selected date: ${selected.date}`)
  console.log(`selected amount: ${selected.amount}`)
  console.log(`selected description: ${selected.description}`)
  console.log(Object.keys(selected))

}

const setSelectedPromise = (value) => {
  return new Promise((resolve)=>{
    setSelected(value)
    resolve()
  })
}

const handleModal = (item)=> {
  console.log('the pk is ${item.id}')
  handleValueUpdate(item)

  showModal();
}

//refreshButton
const handleChange = (sorter) =>{
   console.log(sorter)
}
  return (
<div>
    <Space wrap>
        <Button type="primary" onClick={getLedgerData}  ref={refreshButton}>Refresh</Button>
    </Space>
    <ModalForm
    pk={id}
    activeUser = {activeUser}
    isModalOpen= {isModalOpen}
    setIsModalOpen = {setIsModalOpen}
    users ={users}
    prevData = {selected}
    setPrevData = {setSelected}
    />
    <Table 
    dataSource={data}
    scroll={{
     // x: 'calc(700px + 50%)',
      y: 400,
    }}
    onChange={handleChange}
    >
     
     {columns}
      {/* <Column
        title="Tags"
        dataIndex="credit"
        key="tags"
        render={(tags) => (
          <>
            {tags.map((tag) => (
              <Tag color="blue" key={tag}>
                {tag}
              </Tag>l;k
            ))}
          </>
        )}
      /> */}
      <Column
        title="Action"
        key="action"
        render={(_, record) => (
          
          <Space size="middle">
         
            <Typography onClick={()=> handleModal(record)}> Edit</Typography>
            <Typography onClick={()=> handleDelete(record)}>Delete</Typography>
          </Space>
        )}
      />                          
    </Table>
    </div>
  );
};

export default Ledger
