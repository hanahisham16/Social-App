import { Outlet } from "react-router"
import AuthIntro from "../components/AuthIntro/AuthIntro"

function AuthLayout() {
  return (
    <>
    <div className="min-h-screen bg-sec px-4 py-8 sm:py-12 lg:flex lg:items-center">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
   
            <div className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left"><AuthIntro/></div>
            <div className="order-1 w-full max-w-[430px] lg:order-2">
                <Outlet/>
            </div>
        </div>
        </div>
    
    </>
  )
}

export default AuthLayout



