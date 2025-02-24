import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VerifyOTPResponse {
  message?: string;
  error?: string;
}

const OTP_EXPIRY_TIME = 300; // 5 minutes
const STORAGE_KEY = "otp_expiry_timestamp";
const EMAIL_STORAGE_KEY = "otp_verification_email"; // New key for storing email

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRY_TIME);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve email from state or localStorage
  const storedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
  const email = (location.state as { email: string })?.email || storedEmail;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    // Store email in localStorage if not already stored
    if (!storedEmail) {
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
    }

    const preventBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBackNavigation);

    const storedExpiry = localStorage.getItem(STORAGE_KEY);
    const currentTime = Math.floor(Date.now() / 1000);

    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const remainingTime = expiryTime - currentTime;
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    } else {
      const expiryTime = currentTime + OTP_EXPIRY_TIME;
      localStorage.setItem(STORAGE_KEY, expiryTime.toString());
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem(STORAGE_KEY);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("popstate", preventBackNavigation);
    };
  }, [email, navigate]);

  const handleVerify = async (): Promise<void> => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data: VerifyOTPResponse = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully! Redirecting to login...');
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EMAIL_STORAGE_KEY); // Clear email on success
        setIsVerified(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

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
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-400 mt-2">
            Time remaining: {timeLeft}s
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={timeLeft === 0 || otp.length !== 6}
          className={`w-full py-3 rounded-lg text-lg font-semibold mb-4 ${
            timeLeft === 0 || otp.length !== 6
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Verify OTP
        </button>

        {timeLeft === 0 && (
          <div className="text-center">
            <p className="text-red-400">OTP has expired.</p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default VerifyOTP;
