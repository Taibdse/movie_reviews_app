import React, { useState } from 'react';
import { Form, Icon, Input, Button, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import PageLayout from '../layouts/PageLayout';
import UserService from '../services/user.service';
import AlertUtils from '../utils/alert';
import ValidationUtils from '../utils/validation';
import { userConstants }  from '../common/constants';
import { setAuthHeader, saveTokenToLocal } from '../config/auth';

const LoginPage = (props) => {
    
    const [user, setUser] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        const { email, password } = user;
        if(!ValidationUtils.isValidEmail(email)){
            return AlertUtils.showAlert({ type: 'error', title: userConstants.email_error })
        }

        if(!ValidationUtils.isValidStringLength(password, 4, 100)){
            return AlertUtils.showAlert({ type: 'error', title: userConstants.password_error })
        }

        try {
            const res = await UserService.login(user);
            console.log(res.data);
            const { success, data } = res.data;
            if(success){
                setAuthHeader(data.token);
                saveTokenToLocal(data.token);

                AlertUtils.showAlert({ type: 'success', title: userConstants.login_success });
                setTimeout(() => {
                    props.history.push('/');
                }, 400);
            } else {
                AlertUtils.showAlert({ type: 'error', title: userConstants.login_fail });
            }
        } catch (error) {
            AlertUtils.showAlert({ type: 'error', title: userConstants.login_fail });
        }
    }

    const changeUser = (name, value) => {
        setUser({ ...user, [name]: value });
    }

    return (
        <PageLayout>
            <Row>
                <Col span={12} offset={6}>
                    <Card style={{ width: '100%' }}>
                        <Form onSubmit={handleSubmit} className="login-form">
                            <Form.Item>
                        
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email"
                                    value={ user.email }
                                    onChange={e => changeUser('email', e.target.value)}
                                />,
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={ user.password }
                                    onChange={e => changeUser('password', e.target.value)}
                                />,
                            </Form.Item>
                            <Form.Item>
                        
                            <Button type="primary" htmlType="submit" className="fluid" style={{ width: '100%' }}>
                                Đăng nhập
                            </Button><br/>
                                Hoặc <Link to="/register">đăng kí </Link> ngay nếu bạn chưa có tài khoản
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </PageLayout>
        
    );
};


export default LoginPage;
