const PriorityTable = ({ actions = [] }) => {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="card-title mb-3">Top Priority Actions</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Action</th>
                <th>Expected Recovery</th>
                <th>Resource</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action.actionName}>
                  <td>{action.actionName}</td>
                  <td><span className="badge text-bg-warning">+{action.expectedRecovery}%</span></td>
                  <td>{action.relatedResourceType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriorityTable;
