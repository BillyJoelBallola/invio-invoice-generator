import SignInDialog from "@/components/dialog/SignInDialog";
import SignUpDialog from "@/components/dialog/SignUpDialog";
import ModeToggle from "@/components/ModeToggle";

function Authentication() {
  return (
    <div className="grid place-items-center space-y-8">
      <div className="absolute top-4 right-4 md:right-4">
        <ModeToggle />
      </div>
      <div className="grid gap-4 place-items-center text-center">
        <img src="/logo.png" alt="Wallet Icon" className="mt-10 size-48" />
        <div>
          <h1 className="text-6xl sm:text-7xl font-mono font-extrabold">
            <span className="text-indigo-500">In</span>vio
          </h1>
          <p className="font-semibold">
            Create and manage invoices with ease. <br />
            <small className="font-normal text-neutral-500">
              by Billy Joel
            </small>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SignInDialog />
        <SignUpDialog />
      </div>
    </div>
  );
}

export default Authentication;
