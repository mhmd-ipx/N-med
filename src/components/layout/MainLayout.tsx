import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="">
      <div className="">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
