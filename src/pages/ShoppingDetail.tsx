import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Review from '../components/shoppingDetail/Review';
import QuantityInput from '../components/shoppingDetail/QuantityInput';
import ShoppingBasket from '../components/shoppingDetail/ShoppingBasket';
import styled from 'styled-components';
import { auth } from '../Firebase';
import QuestionAndAnswer from '../components/shoppingDetail/QuestionAndAnswer';
import { collection, setDoc, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { FaHeart } from 'react-icons/fa';
import Loading from './Loading';

function ShoppingDetail() {
  //받아온 renderData
  const location = useLocation();
  const { item } = location.state || {};
  //수량체크
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<any>(item.price);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const skeletonUi = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  useEffect(() => {
    skeletonUi();
  }, []);
  //수량 +,-기능
  const onclickQuantityHandler = (num: number) => {
    if (quantity + num >= 1) {
      setQuantity((prev: number) => prev + num);
      setTotalPrice((prev: number) => prev + item.price * num);
    }
  };

  //유저이메일 담기
  const [data, setData] = useState<{ userEmail: string; itemName?: string }>({
    userEmail: '',
    itemName: item?.name || undefined,
  });

  //리뷰 & QnA tab기능
  const [tab, setTab] = useState<string | null>(null);

  const swithTab = (selectedTab: string | null) => {
    setTab(selectedTab);
  };

  useEffect(() => {
    const userData = auth.onAuthStateChanged((currentUser: any) => {
      if (currentUser) {
        const userEmail = currentUser.email;
        setData(prev => ({ ...prev, userEmail }));
      } else {
        setData({ userEmail: '' });
      }
    });
    return () => userData();
  }, []);
  console.log('item');
  console.log(item);

  //게시글 데이터베이스에 추가기능
  const [like, setLike] = useState<boolean>(false);
  const fetchHeart = async () => {
    const userEmail = data.userEmail;
    if (!userEmail) return; // userEmail이 없다면 종료

    const likeQuery = query(collection(db, 'like'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(likeQuery);

    if (querySnapshot.empty) {
      setLike(false); // 처음에는 문서가 없으므로 기본값으로 false 설정
    } else {
      const firstDoc = querySnapshot.docs[0];
      const likedValue = firstDoc.data().liked;
      setLike(likedValue);
      setHeartColor(likedValue ? 'black' : 'red');
    }
  };

  //좋아요기능
  const [heartColor, setHeartColor] = useState<string>('black');
  const [liked, setLiked] = useState<boolean>(false);
  useEffect(() => {
    fetchHeart();
  }, [data]); // data가 변경될 때마다 fetchHeart를 호출

  //페이지가 리렌더링될때 좋아요 정보를 갖고온다
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchHeart();
        // 데이터를 가져온 후에 liked 상태를 설정
        const likeQuery = query(collection(db, 'like'), where('email', '==', data.userEmail));
        const querySnapshot = await getDocs(likeQuery);

        if (querySnapshot.empty) {
          setLiked(false); // 좋아요 문서가 없으면 false로 설정
          setHeartColor('black');
        } else {
          const firstDoc = querySnapshot.docs[0];
          const likedValue = firstDoc.data().liked;
          setLiked(likedValue);
          setHeartColor(likedValue ? 'red' : 'black');
        }
      } catch (error) {
        console.error('Error fetching like information:', error);
      }
    };
    fetchData();
  }, []);

  //좋아요 기능(수정해야합니다)
  const handleButtonClick = async () => {
    if (data.userEmail === '') {
      alert('로그인을 해야 사용가능한 기능입니다');
      navigate('/signin');
    } else {
      const likeCollectionRef = collection(db, 'like');
      const querySnapshot = await getDocs(likeCollectionRef);

      // 이미 좋아요를 눌렀는지 확인
      const existingDoc = querySnapshot.docs.find(
        doc => doc.data().userEmail === data.userEmail && doc.data().itemName === data.itemName
      );

      if (existingDoc) {
        // 이미 좋아요를 누른 경우 문서 삭제
        await deleteDoc(existingDoc.ref);
        setLiked(false);
        setHeartColor('black');
      } else {
        // 좋아요를 누른 경우 새로운 문서 생성
        const randomDocId = generateRandomDocId();
        const docRef = doc(likeCollectionRef, randomDocId);
        await setDoc(docRef, { userEmail: data.userEmail, itemName: data.itemName, liked: true });
        setLiked(true);
        setHeartColor('red');
      }
    }
  };

  // 예시로 사용할 랜덤 ID 생성 함수
  function generateRandomDocId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 20;
    let randomId = '';
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
  }

  const handleHeartIconClick = () => {
    handleButtonClick();
  };

  //데이터가 안받아와졌을경우 다시 돌아가기위한 navigate
  const navigate = useNavigate();
  const backToPageHandler = () => {
    navigate('/shopping');
  };
  if (!location) {
    return (
      <>
        <div>오류가발생했습니다</div>
        <button onClick={backToPageHandler}>뒤로가기</button>
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <Loading></Loading>
      </>
    );
  }
  return (
    <>
      <SProductContainer>
        <SImgBox>
          <img src={item.img} />
        </SImgBox>
        <STextContainer>
          <SCategoryName>
            {item.category}-{item.type}
            <FaHeart
              size={15}
              onClick={handleHeartIconClick}
              style={{ color: liked ? 'red' : 'black', cursor: 'pointer' }}
            />
          </SCategoryName>
          <SItemNameBox>
            <SItemName>{item.name}</SItemName>
          </SItemNameBox>
          <SItemPriceBox>
            <span>{parseInt(item.price).toLocaleString()} </span>
          </SItemPriceBox>
          <SItemTotalPriceBox>
            <QuantityInput quantity={quantity} onclickQuantityHandler={onclickQuantityHandler} />
            <SItemTotalPrice>{`총 가격 : ${totalPrice.toLocaleString()}원`}</SItemTotalPrice>
          </SItemTotalPriceBox>
          <SOrderButtonBox>
            {/* 장바구니기능 */}
            <ShoppingBasket data={data} item={item} />
            <SOrderButton
              onClick={() => {
                if (data.userEmail !== '') {
                  navigate('/CheckoutPage');
                } else {
                  alert('로그인을 해야 사용가능한 페이지입니다');
                  navigate('/signin');
                }
              }}>
              Buy Now
            </SOrderButton>
          </SOrderButtonBox>
          <div>
            <CummunityButton
              isActive={tab === 'REVIEW'}
              onClick={() => {
                swithTab('REVIEW');
              }}>
              REVIEW
            </CummunityButton>
            <CummunityButton
              isActive={tab === 'Q&A'}
              onClick={() => {
                swithTab('Q&A');
              }}>
              Q&A
            </CummunityButton>
            {tab === 'REVIEW' && <Review data={data} />}
            {tab === 'Q&A' && <QuestionAndAnswer data={data} />}
            {/* {tab === null && (
              <div>
                <Logo src={logo} alt="logo" />
              </div>
            )} */}
          </div>
        </STextContainer>
      </SProductContainer>
    </>
  );
}
export default ShoppingDetail;
// const Logo = styled.img`
//   background-image: url(${logo});
// `;

const SProductContainer = styled.div`
  display: flex;
  width: 100rem;
  min-height: 38rem;
  max-height: auto;
`;

const SImgBox = styled.div`
  width: 50%; /* 반의 너비를 차지하도록 50%로 설정 */
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 22rem;
  left: 3rem;
  img {
    display: block;
    width: 500px;
    height: auto;
    object-fit: contain;
    position: absolute;
    margin: 0;
  }
`;

const STextContainer = styled.div`
  margin-top: 2%;
  width: 35%; /* 반의 너비를 차지하도록 50%로 설정 */
  height: 70%;
  padding: 2rem;
  position: relative;
  left: 48rem;
`;

const SCategoryName = styled.div`
  font-size: 20px;
  margin-bottom: 0.5rem;
`;

const SItemName = styled.span`
  margin-right: 1vw;
  white-space: normal;
  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const SItemNameBox = styled.div`
  margin-bottom: 2rem;
  font-size: 30px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const SItemPriceBox = styled.div`
  margin-bottom: 1.5rem;
  font-size: 20px;
  ::before {
    content: '가격: ';
  }
  ::after {
    content: '원';
  }
`;

const SItemTotalPriceBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 두 요소를 좌우로 정렬하도록 추가된 부분 */
  margin-bottom: 5vh; /* QuantityInput과의 간격을 주기 위해 추가된 부분 */
`;

const SItemTotalPrice = styled.span`
  font-size: 25px;
  :before {
    content: '가격: ';
  }
  ::after {
    content: '원';
  }
`;

const SOrderButtonBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5vh;
`;

const SOrderButton = styled.button`
  width: 10vw;
  height: 5vh;
  border: 1px solid black;
  border-radius: 40px;
  background: none; /* 배경을 없애는 속성 추가 */
  padding: 0; /* 내부 여백을 없애는 속성 추가 */
  cursor: pointer;
  margin: 0 1vw;
  background-color: ${({ theme }) => theme.color.ButtonColor};
`;

const SAddToCartButton = styled.button`
  width: 10vw;
  height: 5vh;
  border: 1px solid black;
  border-radius: 40px;
  background: none; /* 배경을 없애는 속성 추가 */
  padding: 0; /* 내부 여백을 없애는 속성 추가 */
  cursor: pointer;
  margin: 0 1vw;
  background-color: ${({ theme }) => theme.color.ButtonColor2};
`;

const CummunityButton = styled.button<{ isActive: boolean }>`
  width: 50%;
  height: 5vh;
  border: 1px solid black;
  border-radius: 40px;
  background: none; /* 배경을 없애는 속성 추가 */
  padding: 0; /* 내부 여백을 없애는 속성 추가 */
  cursor: pointer;
  background: ${({ isActive, theme }) => (isActive ? theme.color.ReviewButtonColor : 'none')};
  color: ${({ isActive }) => (isActive ? 'white' : 'black')};
`;
