import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Category from '../components/shopping/Category';
import OrderButton from '../components/shopping/OrderButton';
import Products from '../components/shopping/products';
import { collection, query, getDocs, where } from '@firebase/firestore';
import { db } from '../Firebase';

interface Item {
  id: number;
  price: number;
  name: string;
  img: string;
  category: string;
  type: string;
}

const CATEGORIES: string[] = ['강아지', '고양이', '그외'];
const TYPES: Record<string, string[]> = {
  강아지: ['사료', '간식', '놀이용품'],
  고양이: ['사료', '간식', '놀이용품'],
  그외: ['사료', '간식', '놀이용품'],
};
// filter
// const FirebseQuery = query(FirebaseCollection, where('category', '==', category));
// const FirebseQuery = query(FirebaseCollection, where('type', '==', type));
// const FirebseQuery = query(FirebaseCollection, where('type', '==', type), where('category', '==', category));

// paging
// const nextQuery = query(myCollection, orderBy("id"), startAfter(11), limit(5));
// let nextSnapshot = await getDocs(nextQuery);

const fetchData = async () => {
  const FirebaseCollection = collection(db, 'shopping');
  const FirebseQuery = query(FirebaseCollection);
  const FirebaseSnapshot = await getDocs(FirebseQuery);
  const FirebaseData = FirebaseSnapshot.docs.map(doc => ({
    id: doc.data().id,
    price: doc.data().price,
    name: doc.data().name,
    img: doc.data().img,
    category: doc.data().category,
    type: doc.data().type,
  }));

  return FirebaseData as any;
};

function Shopping() {
  //선택한 카테고리 정보
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  //선택한 타입 정보
  const [selectedType, setSelectedType] = useState<string>('');
  //DB데이터 정보 저장
  const [itemsData, setItemsData] = useState<Item[]>([]);

  useEffect(() => {
    fetchData().then(setItemsData);
  }, [selectedCategory, selectedType]);

  //데이터 카테고리 및 타입별 필터링
  const filteredItmes = itemsData
    .filter(item => item.category === selectedCategory)
    .filter(item => {
      if (selectedType === '') return true;
      return item.type === selectedType;
    });

  console.log({ itemsData });
  console.log({ filteredItmes });

  return (
    <>
      <SComponentsContainer>
        <Category
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        <OrderButton />
      </SComponentsContainer>
      <Products
        selectedCategory={selectedCategory}
        selectedType={selectedType}
        itemsData={itemsData}
        filteredItmes={filteredItmes}
      />
    </>
  );
}

const SComponentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 3vw;
`;

export default Shopping;
