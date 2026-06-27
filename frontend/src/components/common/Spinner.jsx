const Spinner = ({ size = 'md' }) => {
  return (
    <div className={`spinner-wrapper spinner-${size}`}>
      <div className="spinner" />
    </div>
  );
};

export default Spinner;
