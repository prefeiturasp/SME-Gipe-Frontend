import LoginForm from "@/components/login/LoginForm";
import Banner from "@/components/login/Banner";

export default function Login() {
    return (
        <div className="flex w-screen h-screen overflow-hidden">
            <div className="w-1/2 h-full">
                <Banner />
            </div>
            <div className="w-1/2 h-full flex items-center justify-center bg-white">
                <LoginForm />
            </div>
        </div>
    );
}
