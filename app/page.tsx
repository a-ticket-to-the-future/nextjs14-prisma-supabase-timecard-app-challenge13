// "use client"

import Image from "next/image";
import App from "./components/App";
import getCurrentUser from "./actions/getCurrentUser";
import { User } from "./types/types";

// export type homeProps = {
//   currentUser : User ,
//   id:string | null
//     name:string | null
//     email:string | null
//     createdAt:Date | null
//     updatedAt:Date | null
//     hashedPassword:string | null
//     children: React.ReactNode
// }

const Home = async() => {

  const currentUser = await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    {/* // <div className="text-center"> */}

        {currentUser ? <div>
                          <div className=" text-center">認証中</div>
                                <App currentUser={currentUser} />
                          </div> 
                          : <div>未承認</div>}
      
    {/* </div> */}
    </main>
  );
}

export default Home
