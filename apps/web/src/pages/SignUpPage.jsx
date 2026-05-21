import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login, signup, googleSignUp, isAuthenticated, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Sign Up State
  const [suUsername, setSuUsername] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suMobile, setSuMobile] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirmPassword, setSuConfirmPassword] = useState('');

  // Sign In State
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    googleSignUp()
      .then(() => {
        toast.success('Logged in with Google successfully!');
        navigate('/');
      })
      .catch((err) => {
        console.error('Google Auth Error:', err);
        toast.error(err.message || 'Google login failed');
        setIsLoading(false);
      });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearError();
    
    if (suPassword !== suConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (suPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup(suUsername, suEmail, suMobile, suPassword);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      await login(siEmail, siPassword);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Helmet>
        <title>Sign In / Sign Up - Toolisiya</title>
      </Helmet>
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border-border/50 bg-card rounded-2xl">
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2 mb-2 p-1 bg-muted">
                <TabsTrigger value="signin" className="rounded-md">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-md">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="mb-5 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium">
                  {error}
                </div>
              )}

              <TabsContent value="signin" className="mt-0">
                <div className="mb-6 space-y-1">
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome back</CardTitle>
                  <CardDescription className="text-base">Enter your credentials to access your account.</CardDescription>
                </div>
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email Address</Label>
                    <Input 
                      id="si-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      required 
                      className="bg-background text-foreground h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="si-password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="si-password" 
                      type="password" 
                      value={siPassword}
                      onChange={(e) => setSiPassword(e.target.value)}
                      required 
                      className="bg-background text-foreground h-11"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 text-base shadow-sm mt-2" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-medium">
                      <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="w-full h-11 bg-background shadow-sm hover:bg-muted/50" 
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      type="button"
                    >
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google
                    </Button>
                    <Link to="/otp-login" className="w-full">
                      <Button variant="outline" className="w-full h-11 bg-background shadow-sm hover:bg-muted/50" type="button">
                        OTP Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <div className="mb-6 space-y-1">
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Create an account</CardTitle>
                  <CardDescription className="text-base">Enter your details to get started.</CardDescription>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-username">Username</Label>
                    <Input 
                      id="su-username" 
                      type="text" 
                      placeholder="johndoe" 
                      value={suUsername}
                      onChange={(e) => setSuUsername(e.target.value)}
                      required 
                      minLength={3}
                      className="bg-background text-foreground h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email Address</Label>
                    <Input 
                      id="su-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      required 
                      className="bg-background text-foreground h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-mobile">Mobile Number</Label>
                    <Input 
                      id="su-mobile" 
                      type="tel" 
                      placeholder="+1234567890" 
                      value={suMobile}
                      onChange={(e) => setSuMobile(e.target.value)}
                      required 
                      className="bg-background text-foreground h-11"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="su-password">Password</Label>
                      <Input 
                        id="su-password" 
                        type="password" 
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        required 
                        minLength={8}
                        className="bg-background text-foreground h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-confirm-password">Confirm Password</Label>
                      <Input 
                        id="su-confirm-password" 
                        type="password" 
                        value={suConfirmPassword}
                        onChange={(e) => setSuConfirmPassword(e.target.value)}
                        required 
                        minLength={8}
                        className="bg-background text-foreground h-11"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 text-base shadow-sm mt-2" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-medium">
                      <span className="bg-card px-3 text-muted-foreground">Or sign up with</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full h-11 bg-background shadow-sm hover:bg-muted/50" 
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      type="button"
                    >
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default SignUpPage;