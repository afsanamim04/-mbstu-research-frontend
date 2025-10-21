import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Backend URL constant
const API_URL = "https://mbstu-research-backend.onrender.com";

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/auth/verify/${token}`)
      .then(res => res.text())
      .then(text => {
        if (text.toLowerCase().includes('successful')) {
          navigate('/account');   // তোমার profile page হলে /account, /profile, /AccountPage — যা রয়েছে সেইটা দাও
        } else {
          alert('Verification failed or expired!');
        }
      });
  }, [token, navigate]);

  return (
    <div style={{textAlign:'center', padding:'60px'}}>
      <h2>Verifying Account...</h2>
    </div>
  );
}
