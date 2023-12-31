import { 
    BrowserRouter as Router,
    Routes,
    Link,
    Route,
    Redirect,
    useSearchParams,
} from 'react-router-dom'



import React from 'react'
import { DesktopOutlined, PieChartOutlined, UserOutlined, TeamOutlined, FileOutlined, TableOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useState, useEffect } from 'react';
import EntryForm from './EntryForm';
import axios from 'axios';
const { Header, Content, Footer, Sider } = Layout;
import Ledger from './Ledger';
import BillEntry from './Bills'
import Dashboard from '../layouts/Dashboard';
import TablePage from "../layouts/TablePage";
import CardHolder from './Cardholder';



const LayoutComponent = ({setUser, activeUser}) => {

    const [selected, setSelected] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [users, updateUsers] = useState([]);
    const  [bucketData, setBucketData] = useState(null)
    console.log("*fixed*Changed function and is currently pass objs for parameters to deconstuct");

    const selectOps = {
        "Frequency": ["BiWeekly", "Monthly", "Yearly"],
        "Bucket": ["Recurring", "Variable", "Discretionary"]
    }
    const getItem =({label, key, icon, children, to}) =>{
      return {
        key,
        icon,
        children,
        label : (<Link to={to} >
            {label}
        </Link>),
      };
    }

    let listing = []
    
    

    const  [items, setItems] = useState([
      getItem({label: 'Dashboard', key: '1', icon: <PieChartOutlined />, to:"/"}),
      getItem({label:'Post an Entry', key: '2', icon: <DesktopOutlined />, to:"/create"}),
      getItem({label:'User Ledgaer', key: 'sub1', icon: <UserOutlined />,children:[], to: "/AllUsers"}),
      getItem({label:'Profiles', key:'sub2', icon: <TeamOutlined />,children: [getItem({label:'Team 1', key: '6'}), getItem({label:'Team 2', key:'8'})], to: "/"}),
      getItem({label:'Modify an Entry', key: '3', icon: <TableOutlined />, to:"/modify"}),
      getItem({label:'Create an Expense', key:'9', icon:<FileOutlined />, to:"/bills"}),
    ]);



    const {
    token: { colorBgContainer },
  } = theme.useToken();

 const getResponse = async(url) => {
     try {
         const response  = await axios(url)
         window.alert(url + " was successfully sent")
     } catch (error){
         throw error
     }
 }

 //Utilize the FromData
 const bodyFileBuilder= (dataInput)=>{

     const formData= new FormData();
     Array.from(dataInput).forEach((each)=>{

         formData.append(`${each.name}`, each)
     })
        return formData
     //assumption that this data has name property
 }


    const getPostRes= async (url, body) => {
     let data = body

     if(typeof(body) === "filelist"){
       data =  bodyFileBuilder(body)
     }
     try {
         const response  = await axios.post(url, data)
         const dataLen = data.length
         window.alert(url + " was successfully sent! The dataload included "+ dataLen + " items to the backend.")

         return response
     } catch (error){
         throw error
     }
 }

  const updateUsersItems = () =>{

    const updatedItem = getItem({label:'User', key:'sub20', icon:<UserOutlined />, children: listing , to: "/create"})
    
    setItems((prevItem)=> {
    const prevState = [...prevItem]
    prevState[2] = updatedItem;
    return prevState;
    })
  }

    useEffect(()=> {

      axios.get("http://localhost:8000/account/getUserNames")
      .then(response => updateUsers(response.data))
    
    listing = users.map(user => getItem({label: user, key:user, to:'AllUsers'}))
    const allUsers = getItem({label:'All Users', key: 'AllUsers', to: "AllUsers"})
    listing.splice(0,0,allUsers)
    updateUsersItems()

    }, [collapsed,])
    
   const handler = (e)=>{
    console.log("Handler")
     console.log(e)
     console.log(`Objects Keys, ${Object.keys(e)}`)
     console.log(e.item.props.children[0][1].props.children.props.children);
     setUser(e.item.props.children[0][1].props.children.props.children); 
     console.log("updated baby")
  
    }

   

    return (
        
        <Layout
        style={{
           minHeight: '100vh',
         
        }}
      >
        <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={value => setCollapsed(value)}>
          <div
            style={{
              height: 32,
              margin: 16,
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          />

          <Menu 
          theme="dark" 
          defaultSelectedKeys={['1']} 
          selectable={true}
          mode="inline" 
          items={items} 
          onSelect={handler}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          />
          <Content
            style={{
              margin: '0 16px',
            }}
          >
            <Breadcrumb
              style={{
                margin: '16px 0',
              }}
            >
              <Breadcrumb.Item>User update 9:02am</Breadcrumb.Item>
              <Breadcrumb.Item>{activeUser}</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 1000,
                background: colorBgContainer,
  
              }}
            >
              
              <Routes> 
                <Route path ='/' element={<Dashboard bucketData={bucketData} setBucketData={setBucketData}/>}/>
                <Route path="/create" element={<EntryForm users={users}/>}/>
                <Route path="/modify" element={<TablePage users={users}  selectOps={selectOps} />}/>
                <Route path='/AllUsers' element={< Ledger activeUser={activeUser} users={users}/>}/>
                <Route path="/bills" element={<BillEntry  bucketData={bucketData} setBucketData={setBucketData} getPostRes={getPostRes}/>}/>
              </Routes>
            </div>
            
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            
          </Footer>
        </Layout>
      </Layout>
    

        
    )
}

export default LayoutComponent