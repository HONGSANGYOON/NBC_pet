import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface CategoryProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CATEGORIES: string[] = ['강아지', '고양이', '그외'];
const TYPES: Record<string, string[]> = {
  강아지: ['사료', '간식', '놀이용품'],
  고양이: ['사료', '간식', '놀이용품'],
  그외: ['사료', '간식', '놀이용품'],
};

function Category({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  isLoading,
  setIsLoading,
}: CategoryProps): JSX.Element {
  const navigate = useNavigate();

  const onClickCategory = (category: string) => {
    setSelectedCategory(prevCategory => (prevCategory === category ? '' : category));
    setSelectedType('');
    // 카테고리로 url경로 구분하기
    if (category !== selectedCategory) {
      navigate(`/shopping/${category}`);
    } else {
      //같은 버튼을 누르면 shopping URL로 가야하는데 작동하지 않는다.
      navigate('/shopping');
    }
    //카테고리는 url경로를 갖고 구분시키고, type은 querystring으로 해결하기.
  };

  const onClickItem = (item: string) => {
    setSelectedType(item);
    if (item !== '') {
      navigate(`/shopping/${selectedCategory}?type=${item}`);
    } else {
      navigate(`/shopping/${selectedCategory}`);
    }
  };

  return (
    <SCategoryContainer>
      <SCategoryBox>
        {CATEGORIES.map(category => (
          <SCategoryButtonContainer key={category}>
            <SButtonContainer>
              <SCatagoryButton onClick={() => onClickCategory(category)} active={category === selectedCategory}>
                {category}
              </SCatagoryButton>
              {category === selectedCategory &&
                TYPES[category].map(item => (
                  <SItemButton key={item} onClick={() => onClickItem(item)} active={item === selectedType}>
                    {item}
                  </SItemButton>
                ))}
            </SButtonContainer>
          </SCategoryButtonContainer>
        ))}
      </SCategoryBox>
    </SCategoryContainer>
  );
}

export default Category;

const SCategoryContainer = styled.div`
  font-size: 20px;
  width: 10vw;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.lightGreen};
`;

const SCatagoryButton = styled.button<{ active?: boolean }>`
  font-family: GmarketSansMedium;
  margin-bottom: 5px;
  font-size: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ active }) => (active ? 'gray' : 'black')};

  &:hover {
    color: gray; /* 마우스 호버 시 텍스트에 밑줄 추가 */
  }
`;
const SCategoryBox = styled.div`
  margin-top: 1.5vw;
`;

const SButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.3vh;
`;

const SItemButton = styled.button<{ active?: boolean }>`
  margin-bottom: 5px;
  font-size: 15px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ active }) => (active ? 'gray' : 'black')};

  &:hover {
    color: gray; /* 마우스 호버 시 텍스트에 밑줄 추가 */
  }
`;

const SCategoryButtonContainer = styled.div`
  margin-bottom: 35%;
`;
