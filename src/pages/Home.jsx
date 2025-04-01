import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
const Home = () => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem('token')
    const [userData, setUserData] = useState(null)
    const [mysqlData, setMySQLData] = useState(null)
    const [redisData, setRedisData] = useState(null)
    const [fiboNumber, setFiboNumber] = useState()
    const [errMessage, setErrMessage] = useState("")
    const [hasFetchedData, setHasFetchedData] = useState(false) // สร้าง state ใหม่เพื่อเช็คว่าเรา fetch ข้อมูลแล้วหรือยัง

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        if (!token) {
            navigate('/login')
        } else {
            try {
                const response = await axios.get(`http://localhost:8000/api/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setUserData(response?.data)
            } catch (error) {
                console.error("Error fetching user data:", error)
            }
        }
    }

    useEffect(() => {
        if (userData && !hasFetchedData) {
            fetchResult()  // เรียก fetchResult เฉพาะครั้งแรกหลังจาก userData ถูกตั้งค่า
        }
    }, [userData, hasFetchedData])

    const fetchResult = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/fibonacci/result/${userData?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMySQLData(response.data.MySQL)
            setRedisData(response.data.RedisData)
            setHasFetchedData(true)  // ตั้งค่า state ว่าเรา fetch ข้อมูลแล้ว
        } catch (error) {
            console.error("Error fetching Fibonacci result:", error)
        }
    }

    const pollResult = () => {
        let isPolling = true; // เพิ่มตัวแปร state
        const interval = setInterval(async () => {
            if (!isPolling) {
                clearInterval(interval);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/api/fibonacci/result/${userData.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMySQLData(response.data.MySQL);
                setRedisData(response.data.RedisData);
    
                if (response.data.RedisData.length > 0) {
                    isPolling = false; // หยุดการ polling
                    clearInterval(interval);
                    setErrMessage("Success Calculate");
    
                    setTimeout(() => {
                        setErrMessage("");
                    }, 3000);
                }
            } catch (error) {
                console.error("Error fetching Fibonacci result:", error);
                isPolling = false; // หยุดการ polling หากเกิดข้อผิดพลาด
                clearInterval(interval);
            }
        }, 2000);
    };

    const handleSubmit = async (index) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/fibonacci/calculate`,
                {
                    index: index,
                    user_id: userData.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(response)
            if (response.data.message === "You have already submitted this index." || response.data.message === "Fibonacci calculation started.") {
                setErrMessage(response.data.message)
            }
            pollResult()
        } catch (error) {
            console.error("Error Sending Fibonacci :", error)
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="bg-gray-700 flex-1 w-full px-64 py-16">
                <div>
                    <p className="text-4xl text-white font-medium">FIBONACCI CALCULATOR</p>
                    <div className="text-white text-xl">Hello {userData?.name} ({userData?.email})</div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                        <div className="pt-5">
                            <div className="grid gap-2">
                                <p className="text-base text-white" htmlFor="fibo">Enter Fibonacci Index</p>
                                <input
                                    id="fibo"
                                    type="number"
                                    className="mt-1 block w-full rounded-lg border border-gray-400 bg-gray-700 px-4 py-2 text-white shadow-md focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                                    required
                                    autoComplete="off"
                                    placeholder="Fibonacci Index"
                                    min="0"
                                    value={fiboNumber}
                                    onChange={(e) => setFiboNumber(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "." || e.key === "-" || e.key === "e") {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <p className={errMessage === "You have already submitted this index." || errMessage === "Calculate Failed" ? "text-red-500" : errMessage === "Fibonacci calculation started." ? "text-green-500" : errMessage === "Success Calculate" ? "text-green-600 font-bold " : "text-white"}>{errMessage ? errMessage : "Submit After Fill Fibonacci Index"}</p>
                                <div className="w-max pt-3">
                                    <button className="text-white bg-green-500 py-3 px-10 rounded-md hover:bg-green-700 cursor-pointer"
                                        onClick={() => {
                                            if (fiboNumber) {
                                                handleSubmit(fiboNumber)
                                            } else {
                                                setErrMessage("Please fill your index")
                                                console.log("Please fill your index")
                                            }
                                        }}
                                    >
                                        Submit
                                    </button>
                                </div>
                                {/* <InputError className="mt-2" message={errors.name} /> */}
                            </div>
                            <div className="grid gap-2 pt-8">
                                <p className="text-base text-white">Index I have seen (Sort in ascending order)</p>
                                <div className="pr-5 pl-5">
                                    <p className="text-white">{mysqlData ? mysqlData.join(", ") : 'None'}</p>
                                </div>
                            </div>
                            <div className="grid gap-2 pt-8">
                                <p className="text-base text-white">Calculate Value (Sort in ascending order)</p>
                                <div className="w-full max-w-screen-lg mx-auto overflow-x-auto pl-5">
                                    {redisData ? (
                                        redisData.map((item, index) => (
                                            <p key={index} className="text-white whitespace-nowrap">
                                                {item}
                                            </p>
                                        ))
                                    ) : (
                                        <p>None</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home
