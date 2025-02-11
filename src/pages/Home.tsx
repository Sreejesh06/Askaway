// Home.tsx
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md p-4">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex space-x-6">
          <Link 
            to="/" 
            className="text-gray-800 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          <Link 
            to="/posts" 
            className="text-gray-800 hover:text-blue-600 font-medium"
          >
            Posts
          </Link>
          <Link 
            to="/search" 
            className="text-gray-800 hover:text-blue-600 font-medium"
          >
            Search
          </Link>
          <Link 
            to="/profile" 
            className="text-gray-800 hover:text-blue-600 font-medium"
          >
            Profile
          </Link>
          <Link 
            to="/about" 
            className="text-gray-800 hover:text-blue-600 font-medium"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Content = () => {
  return (
    <div className="container mx-auto px-4 mt-20">
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome!</h2>
        <p className="text-gray-600">
          This is your dashboard. Navigate through the different sections using the menu above.
        </p>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navigation />
      <Content />
    </div>
  );
};

export default Home;