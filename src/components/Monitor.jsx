export function MonitorPanel({ createdCount, errorCount }) {
  return (
    <div className="monitor-panel">
      <h3>Monitoring</h3>
      <p>Tasks: created {createdCount}</p>
      <p>Errors: {errorCount}</p>
    </div>
  );
}
