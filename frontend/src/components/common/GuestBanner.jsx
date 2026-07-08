import { Link } from 'react-router-dom';
import { UserX, ArrowRight } from 'lucide-react';

const GuestBanner = () => {
  return (
    <div className="guest-banner" role="alert">
      <div className="guest-banner-content">
        <UserX size={16} />
        <span>
          You're browsing as a <strong>guest</strong> — your data resets every 24 hours.
        </span>
      </div>
      <Link to="/register" className="guest-banner-cta">
        Sign up to keep your data
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default GuestBanner;
