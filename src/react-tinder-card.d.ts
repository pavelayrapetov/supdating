declare module 'react-tinder-card' {
  import { ReactNode } from 'react';

  interface TinderCardProps {
    children: ReactNode;
    onSwipe?: (dir: string) => void;
    preventSwipe?: string[];
    flickOnSwipe?: boolean;
    className?: string;
  }

  const TinderCard: React.FC<TinderCardProps>;

  export default TinderCard;
}