import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
const LoginSuccess = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        if (token) {
            sessionStorage.setItem("token", token)
            navigate("/") 
        } 
    }, [])

    return <p>Something Wrong!!</p>
}
export default LoginSuccess