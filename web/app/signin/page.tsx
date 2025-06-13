"use client";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import { RegisterPage } from "./_components/register-page";

const Loginpage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const checkAuth = async () => {
    setIsLoading(true);
    if(localStorage.getItem("token")){
      setIsLoading(false);
      router.push("/user");
    }else{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="h-screen flex items-center justify-center px-5">
      {isLoading ? (
        <div className="flex items-center justify-center">
          Loading...
        </div>
      ) : (
        <RegisterPage />
      )}
    </div>
  );
};

export default Loginpage;
