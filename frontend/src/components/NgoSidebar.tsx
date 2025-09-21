import { Link } from "react-router-dom";

const NgoSidebar = () => {
  return (
    <div className="w-64 bg-green-50 p-4 h-screen shadow-md" dir="rtl">
      <h2 className="text-xl font-bold mb-6">תפריט</h2>
      <ul className="flex flex-col gap-4 text-lg">
        <li>
          <Link to="/ngo/new-campaign" className="hover:text-green-600">קמפיין חדש</Link>
        </li>
        <li>
          <Link to="/ngo/my-campaigns" className="hover:text-green-600">הקמפיינים שלי</Link>
        </li>
        <li>
          <Link to="/ngo/profile" className="hover:text-green-600">פרטים אישיים</Link>
        </li>
        <li>
          <Link to="/ngo/donors" className="hover:text-green-600">תורמי העמותה</Link>
        </li>
      </ul>
    </div>
  );
};

export default NgoSidebar;
