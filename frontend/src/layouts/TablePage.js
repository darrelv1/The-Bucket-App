import {Table, Radio, Divider, Space} from 'antd'
import React, {useState, useEffect} from 'react'
import axios from "axios"
import Typography from "antd/es/typography/Typography";
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

const TablePage = () =>{
    const [selectionType, setSelectionType] = useState(null)
    const [allExpenses, setExpenses ] = useState([])
    const [dyCols, setDyCols] = useState([]);
    const [id, setId] = useState(null)


    const [rows, setRows] = useState([])

    useEffect(()=>{
getData()
    },[id,selectionType])



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

        axios.delete(`http://localhost:8000/account/${endPoint}`)

        let response;
        try {
             response = await axios.delete(`http://localhost:8000/account/${endPoint}`, {data: record.key})

        } catch (e){
            console.log(`error:${e}`)
        }//

        console.log("The response will be here")
        console.log(response)

    }

    const handleModal = (record) =>{
        console.log("Edit works ")
        console.log(Object.keys(record))
        const targetID = record.key
        let endpoint = "getExpenses" + targetID


    }

    const delOrmod = ()=>{
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

                   delOrmod())}
            /> ]

            setDyCols(tempCols)
            setExpenses(()=> {

                const result = response.data.map((each,index) => {
                    let modObject = {...each, 'key': each['id'] }
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

    return(
       <div>
            <div>
            <h1>Expense Table</h1>
            <button onClick={getData}>click me</button>
            </div>
           <Divider />
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
        // columns={dyCols}
        dataSource={allExpenses}
      >
          {dyCols}


      </Table>
    </div>

    )

}



export default TablePage;
