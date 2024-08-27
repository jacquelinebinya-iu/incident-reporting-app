import { createBrowserRouter } from 'react-router-dom';

import { AdminLogin } from '../pages/admin/auth/login';
import { Dashboard } from '../pages/admin/dashboard';
import { AdminIncident } from '../pages/admin/incident';
import { AdminIncidents } from '../pages/admin/incidents';
import { ManageAdmins } from '../pages/admin/manage-admins.jsx';
import { AdminProfile } from '../pages/admin/profile.jsx';
import { Users } from '../pages/admin/users';
import { Login } from '../pages/auth/login';
import { ResetPassword } from '../pages/auth/reset-password';
import { Signup } from '../pages/auth/signup';
import { EditIncident } from '../pages/edit-incident';
import { Incidents } from '../pages/incidents';
import { BaseLayout } from '../pages/layouts/base-layout';
import NotFound from '../pages/not-found';
import { Profile } from '../pages/profile';
import { ReportIncident } from '../pages/report-incident';
import RestrictedAccess from '../pages/rescricted-access';
import { ViewIncident } from '../pages/view-incident';
import { ProtectedRoute } from './utilities/protected-routes';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/restricted-access',
    element: <RestrictedAccess />,
  },
  /* USER ROUTES */
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={['STUDENT']}>
        {' '}
        <BaseLayout />{' '}
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Incidents /> },
      { path: 'incident/edit/:id', element: <EditIncident /> },
      { path: 'incident/:id', element: <ViewIncident /> },
      { path: 'report', element: <ReportIncident /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  /* ADMIN ROUTES */
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'SUPPORT']}>
        {' '}
        <BaseLayout />{' '}
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'incidents', element: <AdminIncidents /> },
      { path: 'incidents/:id', element: <AdminIncident /> },
      { path: 'users', element: <Users /> },
      { path: 'manage-admins', element: <ManageAdmins /> },
      { path: 'profile', element: <AdminProfile /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
