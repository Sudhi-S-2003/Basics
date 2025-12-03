import { RemoveFormatting } from 'lucide-react'
import React from 'react'
import { Button } from "../ui/button"
import { useNavigate } from 'react-router-dom'
const Header = ({ isLogin = false }) => {
    const navigate = useNavigate("")
    const handleMoveToDashBoard = () => {
        navigate("/dashboard")
    }
    return (
        <>
            <div className='flex justify-around  items-center py-2 bg-amber-100'>
                <RemoveFormatting />
                <div className='flex gap-3'>
                    {isLogin ? <>
                        <Button className='bg-amber-400 hover:bg-amber-500' onClick={handleMoveToDashBoard}>Go to Dashboard</Button>
                        <Button >Logout</Button>
                    </> : <Button >Login</Button>
                    }

                </div>

            </div>

        </>
    )
}

export default Header