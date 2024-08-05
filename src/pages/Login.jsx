import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase";
import Logo from '@/components/Logo';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('user_table')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data && data.password === password) {
        const userData = {
          user_id: data.user_id,
          user_type: data.user_type,
          user_org: data.user_org
        };
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success("Login successful!");
        navigate('/');
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent>
          <Logo />
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
