import { 
    BrowserRouter as Router,
    Routes,
    Link,
    Route,
    Redirect,
    useSearchParams,
} from 'react-router-dom'



import React from 'react'
import { DesktopOutlined, PieChartOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useState, useEffect } from 'react';
import EntryForm from './EntryForm';
import axios from 'axios';
const { Header, Content, Footer, Sider } = Layout;
import Ledger from './Ledger';
import BillEntry from './Bills'
import Dashboard from '../layouts/Dashboard';
import CardHolder from './Cardholder';

const LayoutComponent = ({setUser, activeUser}) => {

    const [collapsed, setCollapsed] = useState(false);
    const [users, updateUsers] = useState([]);
    const  [bucketData, setBucketData] = useState(null)
    console.log("*fixed*Changed function and is currently pass objs for parameters to deconstuct");


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
      getItem({label:'User Ledger', key: 'sub1', icon: <UserOutlined />,children:[], to: "/AllUsers"}),
      getItem({label:'Profiles', key:'sub2', icon: <TeamOutlined />,children: [getItem({label:'Team 1', key: '6'}), getItem({label:'Team 2', key:'8'})], to: "/"}),
      getItem({label:'Modify an Entry', key: '3', icon: <FileOutlined />, to:"/modify"}),
      getItem({label:'Create an Expense', key:'9', icon:<FileOutlined />, to:"/bills"}),
    ]);



    const {
    token: { colorBgContainer },
  } = theme.useToken();

 

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
                minHeight: 100,
                background: colorBgContainer,
  
              }}
            >
              
              <Routes> 
                <Route path ='/' element={<Dashboard bucketData={bucketData} setBucketData={setBucketData}/>}/>
                <Route path="/create" element={<EntryForm users={users}/>}/>
                <Route path="/modify" element={<EntryForm users={users}  />}/>
                <Route path='/AllUsers' element={< Ledger activeUser={activeUser} users={users}/>}/>
                <Route path="/bills" element={<BillEntry  bucketData={bucketData} setBucketData={setBucketData}/>}/>
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