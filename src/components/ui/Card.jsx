const Card = ({ children, className = '' }) => {
  return (
    <div className={`glass ${className}`} style={{ borderRadius: '16px', padding: '1.5rem' }}>
      {children}
    </div>
  );
};

export default Card;
