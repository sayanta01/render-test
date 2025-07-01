export default function Card({ children }) {
  const cardStyle = {
    width: "200px",
    height: "200px",
    border: "1px solid lightgray",
    aspectRatio: "1 / 1",
    borderRadius: "2%",
    padding: "4px",
    margin: "4px",
  };

  return (
    <div className="card-style" style={cardStyle}>
      {children}
    </div>
  );
}
