import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between">
      <Link href={"/"}>
        <h1 className="text-4xl font-medium">notebook</h1>
      </Link>
    </div>
  );
};

export default Navbar;
