import {
    Routes,
    Route,
    Link,
    Navigate,
    Outlet,
  } from 'react-router-dom';

const PublicRoute = ({user, children}) => {
    // const { user } = UserAuth();
    console.log("In protected route")
    console.log("user")
    if (user) {
        return <Navigate to='/' replace />;
    }

    return children ? children : <Outlet />;
} 

export default PublicRoute;