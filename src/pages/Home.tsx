import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Home Page</h1>
      <Link to="/" className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-lg font-semibold">
        Logout
      </Link>
    </div>
  );
};

export default Home;
