import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Form, message } from 'antd';
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { registerUser } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await registerUser(values);
      login(res.data.user, res.data.token);
      message.success('Account created!');
      navigate('/libraries');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Create Account
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Join StudySeat and start booking</p>
        </div>

        <div
          className="rounded-2xl p-6 sm:p-8 border"
          style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
        >
          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="name"
              label={<span style={{ color: 'hsl(var(--foreground))' }}>Full Name</span>}
              rules={[{ required: true, message: 'Enter your name' }]}
            >
              <Input prefix={<MdPerson style={{ color: 'hsl(var(--muted-foreground))' }} />} placeholder="John Doe" className="rounded-xl" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span style={{ color: 'hsl(var(--foreground))' }}>Email</span>}
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input prefix={<MdEmail style={{ color: 'hsl(var(--muted-foreground))' }} />} placeholder="you@example.com" className="rounded-xl" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ color: 'hsl(var(--foreground))' }}>Password</span>}
              rules={[{ required: true, min: 6, message: 'Min 6 characters' }]}
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
                style={{ background: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
