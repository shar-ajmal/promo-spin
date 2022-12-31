import {
    Routes,
    Route,
    Link,
    Navigate,
    Outlet,
  } from 'react-router-dom';

const ProtectedRoute = ({user, children}) => {
    // const { user } = UserAuth();
    console.log("In protected route")
    console.log("user")
    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return children ? children : <Outlet />;
} 

export default ProtectedRoute;