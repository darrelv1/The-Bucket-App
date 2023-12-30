import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Button, Cascader, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, TreeSelect, Checkbox, Modal
} from 'antd';


const ModalForm = ({
                       pk,
                       users,
                       isModalOpen,
                       setIsModalOpen,
                       activeUser,
                       prevData,
                       setPrevData,
                       url,
                       getLedgerData,
                       selectOps
                   }) => {

<<<<<<< HEAD

const LedgerColumns = ["date", "debit"]
const ModalForm = ({pk, users , isModalOpen, setIsModalOpen, activeUser, prevData, setPrevData, getLedgerData }) =>{
=======
    // const [adjData , setAdjData] = useState({})
    const [form] = Form.useForm();
    const [completed, setcomplete] = useState(false);
>>>>>>> dynamicModal

    useEffect(() => {

        produceFormItems()
        form.setFieldsValue((() => {
            const innerDict = {}
            for (let [key, value] of Object.entries(prevData)) {
                let newKey = key.toLowerCase()
                innerDict[newKey] = value
            }
            return innerDict
        })())

    }, [, prevData])

    const recordtime = () => {
        const today = new Date();
        return today.toLocaleDateString()
    }

    const restartValues = () => {
        setPrevData({
            'date': "", 'amount': 0, 'description': ""
        })
    }

    const handleOk = () => {
        setIsModalOpen(false)
        setcomplete(false)
        restartValues();
        form.resetFields();

    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setcomplete(false)
        restartValues();
        form.resetFields();

    }

<<<<<<< HEAD
    const onFinishLedger= (values) => {
=======
    const onFinish = (values) => {
        let nameOfKeys = Object.keys(values)
>>>>>>> dynamicModal

        let body = {};
        nameOfKeys.forEach((key) => {

            if (key === "users") {
                body["user"] = values["users"]
            } else {
                try {
                    body[key] = values[key]
                } catch (e) {
                    console.log(e)
                }
            }
        })


        console.log(Object.entries(values))
        console.log(Object.entries(body))

        axios.put(`http://localhost:8000/account/modifyEntry_userLedgers/${pk}`, body)
            .then(response => setcomplete(true))

        restartValues();

        //form.resetFields();

    };

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo)
        return (errorInfo)
    };

    const produceFormItems = () =>{
          return
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
    }


    const userList = users !== undefined ? users.map(user => {
        return <Select.Option key={user} value={user}>{user}</Select.Option>
    }) : ""


    //helper: selectionOption generator
    const selectionBuild = (name) => {
        console.log("IF NAME IS undefined" + name !== undefined)
        return name !== undefined ? name.map(item => {
            return <Select.Option key={item} value={item}>{item}</Select.Option>
        }) : ""
    }


    const produceFormItems = () => {


        //remove 'Action' name form the array
        const keys = Object.keys(prevData).slice(0, Object.keys(prevData).length - 1)

        const listOfFormItems = keys.map((dataItem) => {

            const arrOfAns = [];
            let capDataItem = dataItem.charAt(0).toUpperCase() + dataItem.slice(1)
            let dataItemLow = dataItem.toLowerCase()
            let formItem = null;


            for (let selectTitle of Object.keys(selectOps)) {


                if (selectTitle === capDataItem) {
                    formItem = (

                        <Form.Item
                            name={dataItemLow}
                            label={capDataItem}
                            rules={[
                                {
                                    required: true,
                                    messages: `${capDataItem} is required`
                                }
                            ]}
                        >
                            <Select>
                                {selectionBuild(selectOps[selectTitle])}
                            </Select>
                        </Form.Item>

                    )

                }
            }

            if (formItem === null) {

                formItem = (
                    <Form.Item
                        name={dataItemLow}
                        label={capDataItem}
                        rules={[{
                            required: true, messages: `${capDataItem} is required`
                        }]}
                    >
                        <Input type={dataItemLow === "date" ? "date" : dataItemLow}/>
                    </Form.Item>
                )
            }

            return formItem
        })
        form.resetFields
        return <Form
            form={form}
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
            // initialValues={{
            //     "expense": prevData.Expense,
            //     "date": prevData.Date,
            //     "amount": prevData.Amount,
            //
            // }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <div>
                {listOfFormItems}
            </div>
        </Form>

    }


    return (<Modal
        title={completed ? `Transaction ${pk}, has been edited ${recordtime()}` : `Edit Tranaction ${pk}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
<<<<<<< HEAD
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
     onFinish={onFinishLedger}
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
         span: 18,
       }}
     >
=======
    >
>>>>>>> dynamicModal

        {produceFormItems()}
    </Modal>)
}

export default ModalForm