import styled from 'styled-components';
import OrderButton from './OrderButton';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: number;
  price: number;
  name: string;
  img: string;
  category: string;
  type: string;
}
interface ProductsProps {
  itemsData: Item[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
  renderData: Item[];
  setRenderData: React.Dispatch<React.SetStateAction<Item[]>>;
  page: number;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function Products({
  itemsData,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  renderData,
  setRenderData,
  page,
  isLoading,
  setIsLoading,
}: ProductsProps): JSX.Element {
  const navigate = useNavigate();
  const moveToDeatailPageHandler = (item: any) => {
    if (renderData) navigate(`/ShoppingDetail/${item.name}`, { state: { item } });
  };
  return (
    <>
      <SItemBoxContainer>
        {/* UI에 제품이 보이게 해주는 코드 */}
        <OrderButtonBox>
          <OrderButton
            itemsData={itemsData}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            renderData={renderData}
            setRenderData={setRenderData}
          />
        </OrderButtonBox>
        <SItemContainer>
          {renderData.map(Product => (
            <SItemBox key={Product.id} onClick={() => moveToDeatailPageHandler(Product)}>
              <SImgBox>
                <img src={Product.img} alt="Product Image" />
              </SImgBox>
              <STextBox>
                <SProductName>{Product.name}</SProductName>
                <SProductPrice>{`가격: ${Product.price.toLocaleString()}원`}</SProductPrice>
              </STextBox>
            </SItemBox>
          ))}
        </SItemContainer>
      </SItemBoxContainer>
    </>
  );
}

export default Products;

const SItemBoxContainer = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  margin-left: 3vw;
  gap: 2vw; /* 간격 조절 */
`;

const SItemContainer = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  margin: 0px 0.9vw;
  gap: 2vw; /* 간격 조절 */
`;

const SItemBox = styled.div`
  flex: 0 0 calc(25% - 2vw);
  height: auto;
  margin-bottom: 2vh;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    display: block;
    width: 100%;
    height: 80%; /* 이미지의 높이를 조정 */
    object-fit: cover;
    margin: 0;
  }

  width: 20vw; /* SItemBox의 가로 길이를 조정 */
  height: 50vh;
  box-sizing: content-box; /* 패딩이 크기에 영향을 미치지 않도록 변경 */
  border: 1px solid gray;
  border-radius: 10px;
  word-wrap: break-word;
`;

const SImgBox = styled.div`
  width: 100%;
  height: 67%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    display: block;
    width: 100%;
    height: 80%; /* 이미지의 높이를 조정 */
    object-fit: contain;
    margin: 0;
  }
`;

const STextBox = styled.div`
  word-wrap: break-word;
  width: 18vw; /* SItemBox와 동일한 가로 길이로 조정 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  white-space: pre-line;
  font-size: 16px;
  font-weight: bold; /* 글자를 찐하게 만듭니다 */
  color: #333; /* 글자 색상을 지정합니다 */
`;

const OrderButtonBox = styled.div`
  width: 100%;
`;

const SProductName = styled.div`
  height: 5vh;
  word-wrap: break-word;
  padding-left: 0.3vw;
  justify-content: center;
  font-size: 16px;
  font-weight: bold; /* 글자를 찐하게 만듭니다 */
  color: #333; /* 글자 색상을 지정합니다 */
  margin-bottom: 1.5vh;
`;

const SProductPrice = styled.div`
  margin-right: 0.5vw;
  text-align: right;
  font-size: 16px;
  font-weight: bold; /* 글자를 찐하게 만듭니다 */
  color: #5b5b5b; /* 글자 색상을 지정합니다 */

  ::before {
    content: '가격: ';
  }
  ::after {
    content: '원';
  }
`;
