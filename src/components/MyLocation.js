import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as mapActions } from "../redux/modules/map";
import { history } from "../redux/configureStore";
import Testpost from "./Testpost";

const { kakao } = window;

const MyLocation = (props) => {
  const dispatch = useDispatch();

  //모달 영역
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
    // document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    // document.body.style.overflow = "unset";
  };

  //좌표 구하기
  const [lati, setLati] = useState(0); //위도
  const [longi, setLong] = useState(0); //경도
  const [address, setAddress] = useState("");
  console.log(address);

  //위치가 관악구일때만 로그인 창으로 가게하기
  const locationCheck = () => {
    if (address.includes("관악구")) {
      window.alert("안녕하세요! 항해13조님 동물마켓에 오신걸 환영해요");
      history.push("/login");
    } else {
      window.alert("안녕하세요! 동물마켓은 관악구 주민만 이용 가능합니다😢");
      return;
    }
  };

  //내위치 좌표 가져오기
  function getLocation() {
    if (navigator.geolocation) {
      // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log(position.coords.latitude + " " + position.coords.longitude);
          console.log("위도,경도", lati, longi);
          setLati(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        function (error) {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert("GPS를 지원하지 않습니다");
    }
  }
  getLocation();
  useEffect(() => {
    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(lati, longi), // 지도의 중심좌표
        level: 1, // 지도의 확대 레벨
      };

    // 지도를 생성합니다
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);

    // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, "idle", function () {
      searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    });

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.getElementById("centerAddr");
        console.log(result);

        for (var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === "H") {
            infoDiv.innerHTML = result[i].address_name;
            console.log(infoDiv.innerHTML);
            setAddress(result[i].address_name);
            dispatch(mapActions.getAddress(infoDiv.innerHTML));
            break;
          }
        }
      }
    }
  }, [lati, longi]);

  return (
    
    <WrapLoca>
      <WrapTitles>
        <Title>위치 설정하기</Title>
        <SubTitle>현재 거주중인 위치를 확인해주세요</SubTitle>
      </WrapTitles>

        <Container>
          {/* <div className="map_wrap"> */}
          <div id="map" style={{ display: "none" }}></div>
          <div className="hAddr">
            <BoldText>나의 현재 위치는</BoldText>
            <span id="centerAddr"></span> 
            <NormalText>맞나요?</NormalText>
            <WrapBtn>
              <NoBtn onClick={openModal}>아니오</NoBtn>
              <YBtn onClick={locationCheck}>네 맞습니다</YBtn>
            </WrapBtn>
            {/* <EditAddress open={modalOpen} close={closeModal} /> */}
            
            <Testpost open={modalOpen} close={closeModal} />
          </div>
          {/* </div> */}
        </Container>
    </WrapLoca>
    
    
  );
};


const WrapLoca=styled.div`
width: 29rem;
margin:auto;
align-items:center;
`;

const WrapTitles=styled.div`
align-items:center;
width: 208px;
margin:auto;
`;

const Title = styled.div`
padding-top: 200px;
width: 208px;
font-size: 30px;
font-weight: 600;
text-align: center;
`;

const SubTitle=styled.div`
width: 208px;
margin-right: 10px;
font-size: 14px;
color: #5f5f5f;
text-align: center;
`;

const BoldText=styled.div`
flex-grow: 0;
font-size: 30px;
font-weight: bold;
text-align: center;
color: #2f2f2f;
margin: 0 41px 20px;
`;

const NormalText=styled.div`
font-size:14px;
text-align:center;
color: #2f2f2f;
`;

const Container = styled.div`
  margin: 60px auto;
  width: 29rem;
  height: 20rem;
  background: #ffffff;
  border: solid 1px #3fbe81;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  position: relative;

  .hAddr {
    width: 100%;
  }

  #centerAddr {
    font-size: 20px;
    font-weight: bold;
  }
`;
const WrapBtn=styled.div`
display:flex;
margin:50px;
justify-content:center;
`;
const NoBtn = styled.button`
width: 135px;
height: 48px;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
gap: 10px;
padding: 10px 34px;
border-radius: 83px;
background-color: #d6d6d6;
border: 1px solid #d6d6d6;
font-size:20px;
color: #ffffff;
margin-right: 20px;
`;

const YBtn =styled.button`
width: 185px;
height: 48px;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
gap: 10px;
padding: 10px 34px;
border-radius: 83px;
border: 1px solid #3fbe81;
background-color: #3fbe81;
font-size:20px;
color: #ffffff;
`;

export default MyLocation;
