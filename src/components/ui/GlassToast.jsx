import './GlassToast.css';

const GlassToast = ({ message, type = 'success' }) => {
  return (
    <div className="glass-toast-overlay">
      <div className="glass-toast-container">
        <div className="toast-icon">
          {type === 'success' ? (
            <svg className="toast-svg success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="toast-svg-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="toast-svg-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          ) : (
            <svg className="toast-svg error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="toast-svg-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="toast-svg-cross1" fill="none" d="M16 16 36 36" />
              <path className="toast-svg-cross2" fill="none" d="M36 16 16 36" />
            </svg>
          )}
        </div>
        <div className="toast-message">
          {message}
        </div>
      </div>
    </div>
  );
};

export default GlassToast;
