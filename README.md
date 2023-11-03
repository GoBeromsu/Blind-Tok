# Blind-Tok

## 프로젝트 추진 배경
1. 소규모/무명  음악가들의 한계
본인의 음악을 표현하고 창작하는데 경제적인 어려움을 겪으며 본인의 음악을 알릴 기회도 매우 적다.
2. 실력 중심의 플랫폼의 부재
3. COVID-19 팬데믹으로 인한 온라인 산업 활성화
## UI
### HOME

### 친구 페이지

### 유저 페이지



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

