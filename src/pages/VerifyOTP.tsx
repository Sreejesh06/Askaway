// VerifyOTP.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LocationState {
  email: string;
}

interface VerifyOTPResponse {
  message?: string;
  error?: string;
}

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as LocationState)?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds: number): string => {
    const mins: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (): Promise<void> => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data: VerifyOTPResponse = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);
  };

  const buttonClassName: string = `w-full py-3 rounded-lg text-lg font-semibold mb-4 ${
    timeLeft === 0
      ? 'bg-gray-500 cursor-not-allowed'
      : 'bg-blue-500 hover:bg-blue-600'
  }`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Verify OTP</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Enter OTP</label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={handleOTPChange}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-400 mt-2">
            Time remaining: {formatTime(timeLeft)}
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={timeLeft === 0}
          className={buttonClassName}
        >
          Verify OTP
        </button>

        {timeLeft === 0 && (
          <p className="text-center text-red-400">
            OTP has expired. Please sign up again.
          </p>
        )}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default VerifyOTP; 