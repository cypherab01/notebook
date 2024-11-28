import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <p className="text-center">
        &copy; {new Date().getFullYear()}{" "}
        <Link
          href={"https://www.abhishekg.com.np"}
          className="text-blue-500 underline"
        >
          Abhishek Ghimire
        </Link>{" "}
        · All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
