import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Space, Table, Tag, Button, Modal} from 'antd';
import {Keyframes} from '@ant-design/cssinjs';
import Typography from 'antd/es/typography/Typography';
import ModalForm from './ModalForm'

const {Column, ColumnGroup} = Table;




const Ledger = ({activeUser, users}) => {
    const [data, setData] = useState([]);
    const [columns, setcolumns] = React.useState([<Column title={'id'} dataIndex={'id'} key={'id'}/>,
        <Column title={'date'} dataIndex={'date'} key={'date'}/>,
        <Column title={'debit'} dataIndex={'debit'} key={'debit'}/>,
        <Column title={'debit'} dataIndex={'debit'} key={'debit'}/>,
        <Column title={'credit'} dataIndex={'credit'} key={'credit'}/>,
        <Column title={'balance'} dataIndex={'balance'} key={'balance'}/>,
        <Column title={'description'} dataIndex={'description'} key={'description'}/>]);
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [id, setid] = React.useState()
    const [selected, setSelected] = React.useState({});
    const refreshButton = useRef();

    const urls = {
        "All Users": "/getLedgerAll",
        "Darrel": "/getUserLedgerByName/Darrel",
        "Claudia": "/getUserLedgerByName/Claudia",
        "Anthony": "/getUserLedgerByName/Anthony",
    }

    // const userMapper =()=> {
    //
    // }

    const getLedgerData = async () => {
        let endpoint = urls[activeUser]
        const getData = await axios.get(`http://localhost:8000/account${endpoint}`);
        setData(getData.data);
        updateColumns(getData);
        return getData;
    }

    const handleDelete = (itemID) => {
        setid((prevState)=>{
            return itemID
        })
        const id = itemID.id;
        const userID = itemID.user_id ? itemID.user_id : 1000

        axios.get(`http://localhost:8000/account/deleteDynamic/${id}/${userID}`)
            .then(response => {
            })

    }

    const updateColumns = async (res) => {
        const dataArray = [...res.data]
        try {
            const keys = Object.keys(dataArray[0]);
            const columnList = keys.map((key) => {

                const magicKeys = ['id', 'debit', 'credit']
                if (magicKeys.includes(key)) {
                    return <Column title={key} dataIndex={key} key={key}/>
                } else {
                    return <Column title={key} dataIndex={key} key={key}/>
                }

            })
            setcolumns(columnList)
        } catch (err) {
            setcolumns(() => {
                return <h1>No Data to present</h1>
            })
        }
    }

    const getActiveUser = async () => {

    }



    useEffect(() => {
        // updateColumns(getData)
        getLedgerData()

        // updateColumns()git
    }, [activeUser, id, isModalOpen])


    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleValueUpdate = async (item) => {
        setid(()=>{
            return item.id
        })
        const a = {
            "date": item.date, "amount": item.debit - item.credit, "description": item.description,
        }
        await setSelectedPromise(a)
    }

    const setSelectedPromise = (value) => {
        return new Promise((resolve) => {
            setSelected(value)
            resolve()
        })
    }

    const handleModal = (item) => {
        handleValueUpdate(item)
        showModal();
    }

//refreshButton
    const handleChange = (sorter) => {
        console.log(sorter)
    }
    return <div>
        <Space wrap>
            <Button type="primary" onClick={getLedgerData} ref={refreshButton}>Refresh</Button>
        </Space>
        <ModalForm
            url="http://localhost:8000/account/modifyEntry_userLedgers/"
            pk={id}
            activeUser={activeUser}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            users={users}
            prevData={selected}
            setPrevData={setSelected}
            getLedgerData={getLedgerData}
        />




        {columns && <Table
            dataSource={data}
            scroll={{
                // x: 'calc(700px + 50%)',
                y: 400,
            }}
            onChange={handleChange}
        >
            {columns && columns}
            <Column
                title="Action"
                key="action"
                render={(_, record) => (

                    <Space size="middle">

                        <Typography onClick={() => handleModal(record)}> Edit</Typography>
                        <Typography onClick={() => handleDelete(record)}>Delete</Typography>
                    </Space>)}
            />
        </Table>}


    </div>;
};

export default Ledger
