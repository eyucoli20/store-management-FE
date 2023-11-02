import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoutes() {

   const user = localStorage.getItem('user')

   
   return user !== null  ? (
     <Outlet />
   ) : (
     <Navigate to="/" />
   );
}
export default PrivateRoutes;