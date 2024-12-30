import ResetPasswordForm from "./form";

const ResetPassword = () => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
