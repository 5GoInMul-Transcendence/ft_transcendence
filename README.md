# ft_transcendence

## [Project 진행 상황에 따른 이슈 관리 \_\_Click Here\_\_ ](https://github.com/orgs/5GoInMul-Transcendence/projects/2/views/1)

## Mandatory Part

### Overview

1. backend는 NestJS를 사용
2. frontend는 typescript를 사용
3. 모든 library / framework는 latest stable version
4. DB는 PostgreSQL 사용
5. SPA로 만들어야하고 뒤로가기 앞으로가기 사용가능해야함
6. 최신버전의 크롬과 추가적으로 한 개 더 브라우저에서 호환가능해야함.
7. `docker-compose up --build` 명령어 하나로 시작가능해야함.

### Security Concerns

1. 모든 password는 해쉬되어야함.
2. SQL injection을 막아야함.
3. 사용자 입력에 대해 서버에서 유효성 검사를 해야함.

! 강렬한 해쉬 암호 알고리즘을 사용할 것

! credential, API keys, env 등등 .env 파일에 저장하고 깃에서 제외할 것

### User Account

1. 42 OAUTH 사용할 것
2. 유저는 unique name을 골라야한다.
3. 유저는 avatar를 업로드해야함. 안한다면 default avatar가 존재해야함.
4. two-factor 인증을 해야함 예를 들어 Google Authenticator나 핸드폰 메시지를 보내기.
5. 유저는 다른 유저를 친구로 추가할 수 있어야함. 그리고 그들의 상태를 알 수 있어야함.(online, offline, in-game 등)
6. user profile에는 Stats가 있어야함. (wins, loses, ladder level, achievements 등)
7. 각 유저는 Match History가 있어야함. 1대1 games, ladder, 등 쓸만한 것… 로그인 한 사용자는 누구든 볼 수 있어야함!

### Chat

1. 채널(채팅룸)을 만들 수 있어야함. public, private, 비밀번호에 의해 protected 될 수 있음
2. 다른 유저에게 dm을 보낼 수 있어야함.
3. 유저는 다른 유저를 block할 수 있어야 한다. block한 유저의 메시지가 더이상 보이지 않는다.
4. 채널을 만든 사람이 방을 떠날 때까지 채널주인이 됨.
    1. 채널주인은 비밀번호를 설정/제거/변경 가능
    2. 채널주인은 채널 관리자임. 다른 유저를 채널 관리자로 설정 가능
    3. 채널 관리자는 채널주인을 제외하고 kick, ban, mute(limited time) 할 수 있다.
5. 채팅 인터페이스를 통해 다른 유저의 프로필에 접근 가능해야함.
    1. 채팅 인터페이스를 통해 다른 유저를 퐁 게임에 초대 가능해야 함.

### Game

1. 다른 유저와 실시간 Pong 게임 가능해야함
2. matchmaking system이어야 함 : 유저가 다른 사람과 매치될 때까지 큐에 조인할 수 있어야 함.
3. 캔버스 게임일 수도 있고, 3d로 할 수도 있는데 original Pong을 만들어야함.
4. custom options를 제공해야함. 맵, 파워 업 등. 유저는 디폴트 버전도 택할 수 있어야함.
5. 게임은 responsive해야함.
    
    ! 네트워크 장애 문제를 생각하라 좋은 유저 경험을 주어야 함.
