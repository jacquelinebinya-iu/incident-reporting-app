import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { currentUserThunk } from '../../features/users/user-thunks';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isWorking, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(currentUserThunk());
    }
  }, [user, dispatch]);

  if (isWorking) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/restricted-access" replace />;
  }

  return children;
};
