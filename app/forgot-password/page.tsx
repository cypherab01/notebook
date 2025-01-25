import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <p>
      Oops! Looks like you've forgotten your password.
      <br />
      No worries - just reach out to our{" "}
      <Link className="text-blue-500" href={"https://t.me/cypherab01"}>
        admin
      </Link>{" "}
      and we'll help you reset it.
    </p>
  );
};

export default page;
