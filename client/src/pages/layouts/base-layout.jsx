import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Menu } from '../../components/menu';

export const BaseLayout = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div style={{ display: 'flex' }}>
      {user.role === 'STUDENT' && <Menu />}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};
