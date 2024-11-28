import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between container mx-auto">
      <Link href={"/"}>
        <h1 className="text-2xl font-medium">notebook</h1>
      </Link>
    </div>
  );
};

export default Navbar;
