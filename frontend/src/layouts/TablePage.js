import {Table, Radio, Divider, Space} from 'antd'
import React, {useState, useEffect} from 'react'
import axios from "axios"
import Typography from "antd/es/typography/Typography";
<<<<<<< HEAD
import ModelForm from ""
=======
import ModalForm from "../components/ModalForm";
>>>>>>> dynamicModal
// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {


        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
    }),
};


const {Column} = Table

<<<<<<< HEAD

//Remember ALT + ENTER checks regular expressions for you
const REGEX = /(?<=lol)[\w]{3}/
const
    TablePage = () => {
    const [selectionType, setSelectionType] = useState("radio")
    const [allExpenses, setExpenses] = useState([])
    const [dyCols, setDyCols] = useState([]);
    const [id, setId] = useState(null)
    const [rows, setRows] = useState([])

    useEffect(() => {
        getData()
    }, [id,rows, selectionType])
=======
const TablePage = ({selectOps} ) =>{
    const [selectionType, setSelectionType] = useState("radio")
    const [allExpenses, setExpenses ] = useState([])
    const [dyCols, setDyCols] = useState([]);
    const [id, setId] = useState(null)
    const [selectExpense, setSelectExp] = useState("");
    const [isModalOpen, setModalOpen] = useState(false)
    const [rows, setRows] = useState([])

    useEffect(()=>{
        getData()
    },[id,selectionType])

>>>>>>> dynamicModal

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRows(selectedRows)
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const getTableData = async (endpoint, method) => {
        const urlPattern = {
            'delete': axios.delete(`http://localhost8000/account/${endpoint}`),
            'get': axios.get(`http://localhost8000/account/${endpoint}`),

        }
        console.log(`this is  the urlPattern ${urlPattern[method]} `)
        const response = await urlPattern[method]
        console.log('response ')
        console.log(response)

        return response
    }
    // const {columns} = Table


    const handleDelete = async (record) => {

        let batchParams = new URLSearchParams();


        let endPoint = "getExpenses"
        if(rows.length > 1){
            rows.forEach((each, index)=>{
               let key = "key" + index

                batchParams.append(key, each.key)

           })
            console.log("batchparaas")
            console.log(Object.keys(batchParams))


            endPoint = endPoint + "?" + batchParams.toString()
        } else {
            endPoint = endPoint + "/" + record.key
        }

        setId(record.key)
        console.log("updated2")
        console.log(record.key)
        console.log(`rows ${Object.keys(rows[0])}`)

        // const response = await getTableData(endPoint,'delete')
        console.log(`endPoint ${endPoint}`)

        axios.delete(`http://localhost:8000/account/${endPoint}`)

        let response;
        try {
            response = await axios.delete(`http://localhost:8000/account/${endPoint}`, {data: record.key})

        } catch (e) {
            console.log(`error:${e}`)
        }//

        console.log(response)

    }

<<<<<<< HEAD
    const handleModal = (record) => {
        console.log("Edit works ")
=======
    const handleModal = async (record) =>{
>>>>>>> dynamicModal
        console.log(Object.keys(record))
        const targetID = record.key
        //Updating the selected Edit item
        setModalOpen(true)
        setSelectExp({
            'Expense': record.expense,
            'Date': record.date,
            'Amount': record.amount,
            'Frequency': record.frequency,
            'Bucket': record.bucket,
            'Action': record.action
        })
        let endpoint = "getExpenses" + targetID

    }

<<<<<<< HEAD
=======
    const delOrmod = (record)=>{
    return (  <Space size="middle">
        {selectionType === "radio" && (
        <Typography onClick={() => handleModal(record)}> Edit</Typography>
        )   }
>>>>>>> dynamicModal

    const delOrmod = (record) => {



        let show = (selectionType === "checkbox" && rows.length > 1) ?"Delete All Selected"  : "Delete"
        console.log(show)
        return <Space size="middle">

            { (selectionType === 'radio') &&

                <Typography onClick={() => handleModal(record)}>Edit</Typography>}
            <Typography onClick={() => handleDelete(record)}>{show}</Typography>

        </Space>
    }

    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/account/getExpenses')
            let tempCols = Object.keys(response.data[0])
            tempCols = tempCols.map((each) => {
                return (<Column
                        title={each}
                        dataIndex={each}
                        sorter={{
                            compare: (a,b) => a[each] - b[each]
                        }}
                    />

                )
            })
            tempCols = [...tempCols, <Column
                title="Action"
                key="action"
                render={(_, record) => (
<<<<<<< HEAD
                    //conditional function of display of buttons
                    delOrmod(record))}
            />]
=======

                   delOrmod(record))}
            /> ]
>>>>>>> dynamicModal

            setDyCols(tempCols)
            setExpenses(() => {

                const result = response.data.map((each, index) => {
                    let modObject = {...each, 'key': each['id']}
                    delete modObject.id
                    return modObject
                })
                return result
            })
            // console.log(allExpenses )


            console.log(allExpenses)
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div>
            <div>
                <h1>Expense Table</h1>
                <button onClick={getData}>click me</button>
            </div>
<<<<<<< HEAD
            <Divider/>
            <Radio.Group
                onChange={({target: {value}}) => {
                    console.log(value)
                    setSelectionType(value);
                }}
                value={selectionType}
            >
                <Radio value="checkbox">Checkbox</Radio>
                <Radio value="radio">radio</Radio>
            </Radio.Group>
=======
           <Divider />
                <ModalForm
            pk={selectExpense.id && selectExpense.id}
            isModalOpen={isModalOpen}
            setIsModalOpen={setModalOpen}
            prevData={selectExpense}
            setPrevData={setSelectExp}
            selectOps={selectOps}
        />

      <Radio.Group
        onChange={({ target: { value } }) => {
            console.log(value)
          setSelectionType(value);
        }}
        value={selectionType}
      >
        <Radio value="checkbox">Checkbox</Radio>
        <Radio value="radio">radio</Radio>
      </Radio.Group>
>>>>>>> dynamicModal

            <Divider/>

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                // columns={dyCols}
                dataSource={allExpenses}
                scroll={{y: 1000}}
            >
                {dyCols}


            </Table>
        </div>

    )

}


export default TablePage;
