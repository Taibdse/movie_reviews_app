import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Button } from 'antd';

const { Header, Content, Footer } = Layout;

const PageLayout = (props) => {

    const gotoLoginPage = () => {
        props.history.push('/login');
    }

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" style={{ float: 'left' }}>
                     <h3>
                         <a href="/" style={{ color: '#fff' }}>Movie Reviews</a>
                     </h3>
                </div>
                <Menu
                    style={{ width: '300px', background: 'red' }}
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                >
               
                    <Menu.Item key="1">
                        <Link to="/movies">Phim</Link>
                    </Menu.Item>
                </Menu>
                <Button 
                    onClick={gotoLoginPage}
                    type="primary" 
                    style={{ float: 'right', marginTop: '15px' }}>Đăng nhập</Button>
                
            </Header>
            <Content style={{ padding: '0 50px' }}>
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb> */}
                <div style={{ background: '#fff', padding: 24, minHeight: '100vh' }}>
                    { props.children }
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>This app is sponsored by Bui Duc Tai</Footer>
        </Layout>
    );
};


export default PageLayout;
