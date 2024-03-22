import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Category from '../components/shopping/Category';
import Products from '../components/shopping/products';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import Loading from './Loading';

interface Item {
  id: number;
  price: number;
  name: string;
  img: string;
  category: string;
  type: string;
}
const fetchData = async () => {
  const firebaseCollection = collection(db, 'shopping');
  const paginationQuery = query(firebaseCollection);
  const firebaseSnapshot = await getDocs(paginationQuery);
  const firebaseData = firebaseSnapshot.docs.map(doc => ({
    id: doc.data().id,
    price: doc.data().price,
    name: doc.data().name,
    img: doc.data().img,
    category: doc.data().category,
    type: doc.data().type,
  }));

  return firebaseData as any;
};

function Shopping() {
  //선택한 카테고리 정보
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  //선택한 타입 정보
  const [selectedType, setSelectedType] = useState<string>('');
  //DB데이터 정보 저장
  const [itemsData, setItemsData] = useState<Item[]>([]);
  //페이지네이션 정보
  const [page, setPage] = useState<number>(1);
  //가격순,최신순을 위한 정보(최신순,가격순을 필터릴을통해 나온 데이터를 다시 UI에 보여주기위해서 필요한 state)
  const [renderData, setRenderData] = useState<Item[]>([]);
  //스켈레톤UI를 위한 정보
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const skeletonUi = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  useEffect(() => {
    skeletonUi();
  }, []);

  useEffect(() => {
    fetchData().then(setItemsData);
  }, [selectedCategory, selectedType]);

  useEffect(() => {
    const filteredItmes = itemsData
      .filter(item => {
        if (selectedCategory === '') return true;
        return item.category === selectedCategory;
      })
      .filter(item => {
        if (selectedType === '') return true;
        return item.type === selectedType;
      });
    setRenderData(filteredItmes);
  }, [selectedCategory, selectedType, itemsData]);

  useEffect(() => {
    skeletonUi();
  }, []);

  //스켈레톤UI 컴포넌트 갖고오기
  if (isLoading) {
    return (
      <>
        <Loading></Loading>
      </>
    );
  }
  return (
    <>
      <SComponentsContainer>
        <Category
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <Products
          setSelectedCategory={setSelectedCategory}
          itemsData={itemsData}
          renderData={renderData}
          setRenderData={setRenderData}
          page={page}
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </SComponentsContainer>
    </>
  );
}

const SComponentsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default Shopping;
