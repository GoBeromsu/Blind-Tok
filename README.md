# Blind-Tok

## 프로젝트 추진 배경
1. 소규모/무명  음악가들의 한계
본인의 음악을 표현하고 창작하는데 경제적인 어려움을 겪으며 본인의 음악을 알릴 기회도 매우 적다.
2. 실력 중심의 플랫폼의 부재
3. COVID-19 팬데믹으로 인한 온라인 산업 활성화
## UI
### Login Page
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/eb844af3-8b7e-43a8-93c1-e25f3c45a99d)

### HOME Page
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/be56c3dc-12a3-4374-891c-e50dda6253c4)

- 동적 오디오 로딩: 사용자가 로그인하면 해당 사용자의 오디오 파일 메타데이터를 불러와서 오디오 목록을 생성합니다.
- 무한 스크롤 구현: 스크롤을 내릴 때마다 새로운 오디오 컴포넌트를 동적으로 불러와 성능을 최적화합니다.
- 검색 기능: 검색어에 따라 오디오 파일을 필터링하여 결과를 업데이트합니다.
- 친구 목록 통합: 사용자의 친구 목록을 불러와 오디오 파일 공유 기능에 활용할 수 있습니다.

### 친구 Page
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/28adcc7f-fef8-47f1-98e8-f4d9c6e9d081)
컴포넌트 기반의 설계로 재사용성이 높은 FriendPage와 FriendList를 구현했습니다

Material UI를 사용해 모던하고 일관된 디자인을 적용했습니다. 

상태 관리를 위해 Recoil을 사용, 글로벌 상태를 관리하고 컴포넌트 간 상태를 효율적으로 공유합니다. 
반응형 디자인에 중점을 두고, 화면 크기 변화에 따라 동적으로 레이아웃을 조정하는 로직을 구현하여 다양한 디바이스에서의 사용자 경험을 보장합니다.

### 유저 Page

![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/a9c51d26-45e5-44fb-99e8-a8772a1d6897)

#### 기능 소개 - **오디오 & 이미지 업로드**: 사용자는 오디오 파일 뿐만 아니라 해당 오디오의 이미지도 선택적으로 업로드할 수 있습니다.
- **코멘트 추가**: 업로드 시 오디오 파일에 대한 코멘트를 추가할 수 있습니다.

#### 기술 스택 
- **Material-UI/Grid**: `Grid` 시스템을 사용하여 업로드 페이지 레이아웃을 구성합니다.

#### 구현 상세 
- **파일 선택**: `input` 태그를 통해 사용자가 오디오 파일 및 이미지를 선택할 수 있게 합니다.
- **Base64 인코딩**: 선택된 이미지 파일을 Base64 형식으로 인코딩합니다.
- **폼 데이터 제출**: 오디오, 이미지, 코멘트를 포함하는 폼 데이터를 생성하고 서버에 업로드 요청을 보냅니다.
- **비동기 파일 업로드 처리**: `postAudioFile` 함수를 통해 비동기적으로 파일 업로드 요청을 처리합니다.

### Audio Upload Page: 오디오 업로드 페이지
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/4c45b33e-495f-4c87-b135-cd77da2f9c5d)

#### 기능 소개
- **오디오 파일 선택 및 업로드**: 사용자는 자신의 오디오 파일을 선택하고 업로드할 수 있습니다.
- **이미지 파일 선택 및 업로드**: 선택적으로 오디오 파일과 함께 이미지를 업로드할 수 있습니다.
- **코멘트 작성**: 오디오 파일에 대한 설명을 위한 코멘트를 입력할 수 있습니다.

#### 구현 상세
- **useState를 사용한 상태 관리**: 오디오 파일, 이미지, 코멘트 상태를 관리합니다.
- **이벤트 핸들러**: 오디오, 이미지 파일 선택 및 코멘트 입력을 위한 핸들러를 구현합니다.
- **Base64 인코딩 함수**: 선택된 이미지를 Base64 문자열로 변환하는 함수를 제공합니다.
- **폼 제출 핸들러**: 업로드 버튼 클릭 시 `handleFileUpload` 함수를 호출하여 폼 데이터를 서버에 전송합니다.
### 채팅 Page
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/0b17fc39-79a4-422d-8038-3f2e7df59d8a)


## 테이블 설계
<img width="428" alt="image" src="https://github.com/GoBeromsu/Blind-Tok/assets/37897508/638b3696-50e4-4c66-a04e-504fd4fb641e">

## 아키텍처
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/e87d11f9-d0b5-437c-8264-da267eea2ff6)
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/de72e634-fc89-4d91-9859-163abdb47986)
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/da640673-e0db-496e-8d8e-e108f3a36762)
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/7b3b6319-f448-40af-b3f0-ba66dbc8a92c)

## 개선 사항
![image](https://github.com/GoBeromsu/Blind-Tok/assets/37897508/19c07e13-29dc-423f-9566-40a358e6f203)

현대 사회에서는 많은 기기들이 NAT 뒷 단에 있는 경우가 많아 직접적인 P2P 연결이 불가능합니다.
이를 해결하기 위해 STUN 서버를 거쳐서, 유저들의 Public IP를 찾기도 하지만, 이 또한, 방화벽이나 엄격한 NAT 정책이 있는 경우 무용 지물이 되었습니다

즉 WebRTC 서비스를 위해서는 외부에 데이터를 릴레이하여 유저에게 전달하는 TURN 서버와 기본적으로 STUN 서버가 필요하게 됩니다

