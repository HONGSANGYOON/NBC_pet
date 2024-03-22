import React, { useState } from 'react';
import DailyBoard from '../components/community/DailyBoard';
import Youtubeshorts from '../components/community/Youtubeshorts';
import Loading from './Loading';
import { useEffect } from 'react';

type Tab = 'daily' | 'shorts';

const Community = () => {
  const [activeTab] = useState<Tab>('daily');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const skeletonUi = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  useEffect(() => {
    skeletonUi();
  }, []);

  const renderComponent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyBoard />;
      case 'shorts':
        return <Youtubeshorts />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <>
        <Loading></Loading>
      </>
    );
  }
  return <>{renderComponent()}</>;
};

export default Community;
