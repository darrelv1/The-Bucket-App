import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Button, Cascader, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, TreeSelect, Checkbox, Modal
} from 'antd';


const ModalForm = ({
                       type,
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

    // const [adjData , setAdjData] = useState({})
    const [form] = Form.useForm();
    const [completed, setcomplete] = useState(false);

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

    const onFinish = (values) => {
        let nameOfKeys = Object.keys(values)
        console.log("pk "+ pk)
        let body = {};
        nameOfKeys.forEach((key) => {

            if (key === "users") {
                body["user"] = values["users"]
            }
            else {
                try {
                    body[key] = values[key]
                } catch (e) {
                    console.log(e)
                }
            }
        })



        // delete  body["id"]
        console.log(Object.entries(values))
        console.log(Object.entries(body))
        if (type === "Mortgage")
            {
                axios.put(`http://localhost:8000/account/modifyEntry_userLedgers/${pk}`, body)
                    .then(response => setcomplete(true))
            }
        else/* if(type === "Expense")*/
            {
                axios.put(`http://localhost:8000/account/getExpenses/${pk}`, body)
                    .then((response)=> console.log(response))
            }

        // restartValues();
        setcomplete(true)
        //form.resetFields();

    };

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo)
        return (errorInfo)
    };


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

            if (formItem === null && dataItemLow !== "id") {

                formItem = (
                    <Form.Item
                        name={dataItemLow}
                        label={capDataItem}
                        rules={dataItemLow !== "amount" && [{
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
            </div>
        </Form>

    }
    const nameOption={
            "Expense": prevData.Expense,
            "Mortgage": pk
        }


    return (<Modal
        title={completed ?  `Transaction  "${nameOption[type]}", has been edited ${recordtime()}` : `Edit Tranaction "${nameOption[type]}"`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
    >

        {produceFormItems()}
    </Modal>)
}

export default ModalForm