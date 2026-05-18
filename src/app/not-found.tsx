import Link from "next/link";

function NotFound() {
  return (
    <div className="h-180 grid place-items-center">
      <div className="text-center space-y-10">
        <div>
          <h1 className="text-6xl sm:text-7xl font-mono font-extrabold">
            <span className="text-indigo-500">In</span>vio
          </h1>
          <p className="text-lg font-semibold mb-4">Page Not Found</p>
        </div>
        <Link href="/dashboard" className="underline">
          Go back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
