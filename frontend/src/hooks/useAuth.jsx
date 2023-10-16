import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "User"
    let isLoggedIn = false

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo
        isLoggedIn = true
        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"

        return { username, roles, status, isManager, isAdmin, isLoggedIn }
    }

    return { username: '', roles: [], isManager, isAdmin, status, isLoggedIn }
}
export default useAuth