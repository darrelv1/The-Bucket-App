import {Table, Radio, Divider, Space} from 'antd'
import React, {useState, useEffect} from 'react'
import axios from "axios"
import Typography from "antd/es/typography/Typography";
import ModalForm from "../components/ModalForm";


const {Column} = Table

const TablePage = ({selectOps}) =>{
    const [selectionType, setSelectionType] = useState("radio")
    const [allExpenses, setExpenses ] = useState([])
    const [dyCols, setDyCols] = useState([]);
    const [id, setId] = useState(null)
    const [selectExpense, setSelectExp] = useState("");
    const [isModalOpen, setModalOpen] = useState(false)
    const [rows, setRows] = useState([])
    const [rowKeys, setRowKeys] = useState([])

    useEffect(()=>{
        getData()
        console.log("selectExpense "+ selectExpense)
        console.log( selectExpense)
        console.log("rowKeys" + rowKeys)
    },[id,selectionType,isModalOpen,rowKeys])


    const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
      setRows(selectedRows)
      setRowKeys(selectedRowKeys)

    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
      name: record.name,
  }),
        onSelectMultiple: (selectedRowKeys, selectedRows) => {
            setRowKeys(selectedRowKeys)
        },
        onSelectAll:(selectRowKeys, selectedRows)=>{
            setRowKeys(selectRowKeys)
        }
    };

    const getTableData = async (endpoint, method) =>{
        const urlPattern = {
            'delete': axios.delete(`http://localhost8000/account/${endpoint}`),
            'get': axios.get(`http://localhost8000/account/${endpoint}`),

        }
        console.log(`this is  the urlPattern ${urlPattern[method]} `)
        const response = await urlPattern[method]
        console.log('response ')
        console.log(response )

        return response
    }
    // const {columns} = Table

    const handleDelete = async (record) =>{
        setId(record.key)
        console.log(record.key)
        const endPoint = "getExpenses/"+ record.key
        // const response = await getTableData(endPoint,'delete')
        console.log(`endPoint ${endPoint}`)

        let response;
        if(rowKeys.length >= 2){
            try {
             response = await axios.delete(`http://localhost:8000/account/${endPoint}`, {data: rowKeys})

        } catch (e){
            console.log(`error:${e}`)
        }}
        else{
        try {
             response = await axios.delete(`http://localhost:8000/account/${endPoint}`, {data: record.key})

        } catch (e){
            console.log(`error:${e}`)
        }}


        console.log("rows" + rows)
        console.log(rows)
        console.log(response)

    }

    const handleModal = async (record) =>{


        console.log("selectExpense" + selectExpense)
        console.log(selectExpense)
        console.log(Object.keys(record))
        const targetID = record.key
        //Updating the selected Edit item
        setModalOpen(true)
        setSelectExp({
            'id':record.id,
            'Expense': record.expense,
            'Date': record.date,
            'Amount': record.amount,
            'Frequency': record.frequency,
            'Bucket': record.bucket,
            'Action': record.action
        })
        let endpoint = "getExpenses" + targetID


    }

    const delOrmod = (record)=>{
    return (  <Space size="middle">
        {selectionType === "radio" && (
        <Typography onClick={() => handleModal(record)}> Edit</Typography>
        )   }

        <Typography onClick={() => handleDelete(record)}>Delete</Typography>
    </Space>)
}

    const getData = async ()=> {
        try {
            const response = await axios.get('http://localhost:8000/account/getExpenses')
            console.log(response)
            let tempCols = Object.keys(response.data[0])
            tempCols = tempCols.map((each)=> {
                return( <Column
                    title= {each}
                    dataIndex={each}
                        />

            )
            })
            tempCols = [... tempCols,<Column
                title="Action"
                key="action"
                render={(_, record) => (

                   delOrmod(record))}
            /> ]

            setDyCols(tempCols)
            console.log("response from the request: ")
            console.log(response)
            setExpenses(()=> {

                const result = response.data.map((each,index) => {

                    let modObject = {...each, 'key': each['id'] }
                    // delete modObject.id
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

    return(
       <div>
            <div>
            <h1>Expense Table</h1>
            <button onClick={getData}>click me</button>
            </div>
           <Divider />
                <ModalForm
                    type={"Expense"}
            pk={selectExpense.id}
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

      <Divider />

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        scroll={{
            "y":500
        }}
        // columns={dyCols}
        dataSource={allExpenses}
      >
          {dyCols}


      </Table>
    </div>

    )

}



export default TablePage;
