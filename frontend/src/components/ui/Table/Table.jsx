import './Table.css';

export default function Table({ headers = [], rows = [], renderRow }) {
  return (
    <div className="tw">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{renderRow(row, i)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
