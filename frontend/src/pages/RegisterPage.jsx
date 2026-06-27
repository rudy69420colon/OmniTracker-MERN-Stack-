import RegisterForm from '../components/auth/RegisterForm';
import { CheckSquare } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <CheckSquare size={40} />
        <h2>TaskTracker</h2>
        <p>Join thousands of people staying organized</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
