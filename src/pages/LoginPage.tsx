import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Form, message, Typography } from 'antd';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { loginUser } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await loginUser(values);
      login(res.data.user, res.data.token);
      message.success('Welcome back!');
      navigate('/libraries');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📚</div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--foreground))' }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Sign in to book your study seat</p>
        </div>

        <div
          className="rounded-2xl p-6 sm:p-8 border"
          style={{
            background: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
          }}
        >
          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="email"
              label={<span style={{ color: 'hsl(var(--foreground))' }}>Email</span>}
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input
                prefix={<MdEmail style={{ color: 'hsl(var(--muted-foreground))' }} />}
                placeholder="you@example.com"
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ color: 'hsl(var(--foreground))' }}>Password</span>}
              rules={[{ required: true, message: 'Enter your password' }]}
            >
              <Input.Password
                prefix={<MdLock style={{ color: 'hsl(var(--muted-foreground))' }} />}
                placeholder="••••••••"
                className="rounded-xl"
                iconRender={(visible) => visible ? <MdVisibility /> : <MdVisibilityOff />}
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 rounded-xl text-base font-semibold"
                style={{
                  background: 'hsl(var(--primary))',
                  borderColor: 'hsl(var(--primary))',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
