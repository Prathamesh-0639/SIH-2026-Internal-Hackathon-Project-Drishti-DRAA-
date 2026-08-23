const CapabilityCard = ({ title, value, hint, accent = 'primary' }) => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <div className={`badge text-bg-${accent} px-3 py-2 rounded-pill mb-3`}>{title}</div>
        <h3 className="fw-bold mb-1">{value}</h3>
        <small className="text-muted">{hint}</small>
      </div>
    </div>
  );
};

export default CapabilityCard;
