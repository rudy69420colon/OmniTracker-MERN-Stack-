import LoginForm from '../components/auth/LoginForm';
import { CheckSquare } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <CheckSquare size={40} />
        <h2>TaskTracker</h2>
        <p>Organize your work, one task at a time</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
