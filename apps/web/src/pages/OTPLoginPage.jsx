import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const OTPLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestOTP, authWithOTP, isAuthenticated } = useAuth();
  
  // Initialize state from location.state if redirected from LoginPage
  const [step, setStep] = useState(location.state?.otpId ? 2 : 1);
  const [email, setEmail] = useState(location.state?.email || '');
  const [otpId, setOtpId] = useState(location.state?.otpId || '');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(location.state?.otpId ? 300 : 0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const isValidEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await requestOTP(email);
      setOtpId(result.otpId);
      toast.success('OTP sent to your email successfully');
      setStep(2);
      setTimeLeft(300);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 8) {
      toast.error('Please enter a valid 8-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await authWithOTP(otpId, otp);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Helmet>
        <title>Passwordless Login - Toolisiya</title>
      </Helmet>
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border-border bg-card">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Link to="/signup" className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              {step === 1 ? 'Welcome back' : 'Verify email'}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 1 
                ? 'Enter your email to receive a passwordless login code.' 
                : `We've sent an 8-digit code to ${email}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="pl-10 bg-background text-foreground h-11"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium shadow-sm transition-all" 
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'Sending Code...' : 'Send Magic Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="font-semibold text-foreground">One-Time Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="otp" 
                      type="text" 
                      placeholder="12345678" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      required 
                      maxLength={8}
                      className="pl-10 bg-background text-foreground text-center text-2xl tracking-[0.3em] font-mono h-14"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm py-2">
                  <span className="text-muted-foreground">
                    {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code expired'}
                  </span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-auto p-0 text-primary hover:text-primary/80 hover:bg-transparent"
                    onClick={handleSendOTP}
                    disabled={timeLeft > 0 || isLoading}
                  >
                    Resend Code
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium shadow-sm transition-all" 
                  disabled={isLoading || otp.length !== 8}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4 text-sm text-muted-foreground">
            Prefer a password?{' '}
            <Link to="/signup" className="text-primary hover:underline ml-1 font-medium">
              Sign in with password
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default OTPLoginPage;