import { useNavigate } from "react-router-dom";

const navigationArray = [
  { path: "/quiz/dance", text: "Dance Quiz" },
  { path: "/quiz/music", text: "Music Quiz" },
  { path: "/test", text: "Test Series" },
  { path: "/add", text: "Add New Question" },
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <div>
        <h1 style={{ margin: "1rem 0", color: "#666" }}>
          Welcome to quiz website!!
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {navigationArray.map((ele, index) => (
          <button
            key={index}
            onClick={() => navigate(ele.path)}
            style={{
              backgroundColor: "rgba(0, 120, 255, 0.2)",
              border: "none",
              padding: "10px 1rem",
            }}
          >
            {ele.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
