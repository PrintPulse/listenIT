import { useEffect, useState } from 'react';
import './OrientationCheck.scss';

export const OrientationCheck = ({ children }: { children: React.ReactNode }) => {
   const [isPortrait, setIsPortrait] = useState(false);

   useEffect(() => {
      const checkOrientation = () => {
         setIsPortrait(window.matchMedia('(orientation: portrait)').matches);
      };

      checkOrientation();

      window.addEventListener('resize', checkOrientation);

      return () => {
         window.removeEventListener('resize', checkOrientation);
      };
   }, []);

   if (isPortrait && window.innerWidth < 768) {
      return (
         <div className="orientation-warning">
            <div className="orientation-warning-content">
               <h2>Пожалуйста, поверните устройство</h2>
               <p>Для лучшего опыта использования приложения, поверните телефон на 90 градусов</p>
               <div className="phone-rotation-icon">↻</div>
            </div>
         </div>
      );
   }

   return <>{children}</>;
};