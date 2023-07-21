# ft_transcendence <Version: 12.1>
## : Soon, you will realize that you already know things that you thought you didn’t

## [Project 진행 상황에 따른 이슈 관리 \_\_Click Here\_\_ ](https://github.com/orgs/5GoInMul-Transcendence/projects/2/views/1)

### Summary:
- No more C! No more C++!
- 더 이상 C는 없습니다! C++ 은 이제 그만!

- This project is about doing something you’ve never done before.
- 이 프로젝트는 여러분이 한 번도 해보지 않은 일을 해보는 것입니다.

- Remind yourself the beginning of your journey in computer science.
- 컴퓨터 공학 여정의 시작을 떠올려보세요.

- Look at you now. Time to shine!
- 지금 여러분을 보세요. 빛을 발할 시간입니다!

# Contents
1. Preamble
2. Mandatory part
    2.1 Overview
    2.2 Security concerns
    2.3 User Account
    2.4 Chat
    2.5 Game
3. Submission and peer-evaluation

# Chapter I
# Preamble
![Alt text](readme_contents/image.png)

# Chapter II
# Mandatory part
- This project is about creating a website for the mighty Pong contest!
- 이 프로젝트는 강력한 퐁 대회를 위한 웹사이트를 만드는 것입니다!

## II.1 Overview
- Thanks to your website, users will play Pong with others. You will provide a nice user interface, a chat, and real-time multiplayer online games!
- 여러분의 웹사이트를 통해, 사용자들은 다른 사람들과 Pong 게임을 플레이 할 겁니다. 멋진 사용자 인터페이스, 채팅, 실시간 멀티플레이어 온라인 게임을 제공할 겁니다.

- Your work has to comply with the following rules:
- 작업은 다음 따라오는 규칙들을 준수해야 합니다.

    - Your website backend must be written in NestJS.
    - 웹사이트 백엔드는 NestJS 로 작성되어야 합니다.

    - The frontend must be written with a TypeScript framework of your choice.
    - 프론트 엔드는 당신이 선택한 Typescript framework로 작성되어야 합니다.

    - You are free to use any library you want to in this context. However, you must use the latest stable version of every library or framework used in your project.
    - 이 맥락에서 당신이 원하는 어떤 라이브러리를 사용해도 됩니다. 그러나, 프로젝트에서 사용되는 모든 라이브러리와 프레임워크의 최신 안정 버전을 사용해야 합니다.

    - You must use a PostgreSQL database. That’s it, no other database.
    - 당신은 반드시 PostgreSQL 데이터베이스를 사용해야 합니다. 다른 것은 안 됩니다.

    - Your website must be a single-page application. The user should be able to use the Back and Forward buttons of the browser.
    - 웹사이트는 single-page application 이어야 합니다. 사용자는 브라우저의 뒤로가기 및 앞으로가기 버튼을 사용할 수 있어야 합니다.

    - Your website must be compatible with the latest stable up-to-date version of Google Chrome and one additional web browser of your choice.
    - 웹사이트는 안정적인 최신 버전과 호환 되어야 합니다. 구글의 크롬과 추가적으로 선택한 브라우저 1종과 호환 되어야 합니다.

    - The user should encounter no unhandled errors and no warnings when browsing the website.
    - 사용자가 웹사이트를 탐색할 때 처리되지 않은 오류나 경고가 발생하지 않아야 합니다.

    - Everything has to be launch by a single call to: docker-compose up --build
    - 모든 것이 한 번의 호출로 시작되어야 합니다: docker-compose up --build

    - When your computers in clusters run under Linux, you will use Docker in rootless mode for security reasons. 
    - 클러스터의 컴퓨터가 Linux에서 실행되는 경우 보안상의 이유로 루트 없는 모드에서 Docker를 사용하게 됩니다. 

### Attention!
- This comes with 2 sideways: 
- 여기에는 두 가지 단점이 있습니다: 

    - 1. your Docker runtime files must be located in /goinfre or /sgoinfre. 
    - 1. Docker 런타임 파일은 /goinfre 또는 /sgoinfre에 위치해야 합니다. 

    - 2. you can’t use so called “bind-mount volumes” between the host and the container if non-root UIDs are used in the container. 
    - 2. 컨테이너에서 루트가 아닌 UID를 사용하는 경우 호스트와 컨테이너 간에 소위 "바인드 마운트 볼륨"을 사용할 수 없습니다. 

- Depending on the project, your situation and the context, several fallbacks exist: Docker in a VM, rebuild you container after your changes, craft your own docker image with root as unique UID.
- 프로젝트, 상황 및 컨텍스트에 따라 몇 가지 대체 방법이 존재합니다: 가상 머신의 Docker, 변경 후 컨테이너 재빌드 변경한 후 컨테이너를 다시 빌드하거나, 루트를 고유 UID로 사용하여 자체 도커 이미지를 생성하세요.

## II.2 Security concerns
- In order to create a fully functional website, here are a few security concerns that you have to tackle:
- 완전한 기능을 갖춘 웹사이트를 만들기 위해 해결해야 할 몇 가지 보안 문제가 있습니다:

    - Any password stored in your database must be hashed.
    - 데이터베이스에 저장된 모든 비밀번호는 해시 처리해야 합니다.

    - Your website must be protected against SQL injections.
    - 웹사이트는 SQL 인젝션으로부터 보호되어야 합니다.

    - You must implement some kind of server-side validation for forms and any user input.
    - 양식 및 모든 사용자 입력에 대해 일종의 서버 측 유효성 검사를 구현해야 합니다.

### Attention!
- Please make sure you use a strong password hashing algorithm
- 강력한 비밀번호 해싱 알고리즘을 사용해야 합니다.

- For obvious security reasons, any credentials, API keys, env variables etc... must be saved locally in a .env file and ignored by git. Publicly stored credentials will lead you directly to a failure of the project.
- 명백한 보안상의 이유로 모든 자격 증명, API 키, 환경 변수 등은 .env 파일에 로컬로 저장하고 git에서 무시해야 합니다. 공개적으로 저장된 자격 증명은 프로젝트 실패로 바로 이어질 수 있습니다.

## II.3 User Account
- The user must login using the OAuth system of 42 intranet.
- 사용자는 42 인트라넷의 OAuth 시스템을 사용하여 로그인해야 합니다.

- The user should be able to choose a unique name that will be displayed on the website.
- 사용자는 웹사이트에 표시될 고유한 이름을 선택할 수 있어야 합니다.

- The user should be able to upload an avatar. If the user doesn’t upload an avatar, a default one must be set.
- 사용자가 아바타를 업로드할 수 있어야 합니다. 사용자가 아바타를 업로드하지 않으면 기본 아바타를 설정해야 합니다.

- The user should be able to enable two-factor authentication. For instance, Google Authenticator or sending a text message to their phone.
- 사용자가 2단계 인증을 활성화할 수 있어야 합니다. 예를 들어, Google 인증 또는 휴대폰으로 문자 메시지 보내기 등이 있습니다.

- The user should be able to add other users as friends and see their current status (online, offline, in a game, and so forth).
- 사용자가 다른 사용자를 친구로 추가하고 현재 상태(온라인, 오프라인, 게임 내 등)를 확인할 수 있어야 합니다.

- Stats (such as: wins and losses, ladder level, achievements, and so forth) have to be displayed on the user profile.
- 통계(예: 승패, 래더 레벨, 업적 등)가 사용자 프로필에 표시되어야 합니다.

- Each user should have a Match History including 1v1 games, ladder, and anything else useful. Anyone who is logged in should be able to consult it.
- 각 사용자는 1대1 게임, 래더 및 기타 유용한 정보를 포함한 대전 기록을 보유해야 합니다. 로그인한 모든 사용자가 이 기록을 확인할 수 있어야 합니다.

## II.4 Chat
- You also have to create a chat for your users:
- 또한 사용자를 위한 채팅을 만들어야 합니다:

    - The user should be able to create channels (chat rooms) that can be either public, or private, or protected by a password.
    - 사용자는 공개 또는 비공개로 설정하거나 비밀번호로 보호할 수 있는 채널(대화방)을 만들 수 있어야 합니다.

    - The user should be able to send direct messages to other users.
    - 사용자는 다른 사용자에게 쪽지를 보낼 수 있어야 합니다.

    - The user should be able to block other users. This way, they will see no more messages from the account they blocked.
    - 사용자는 다른 사용자를 차단할 수 있어야 합니다. 이렇게 하면 차단한 계정의 메시지를 더 이상 볼 수 없게 됩니다.

    - The user who has created a new channel is automatically set as the channel owner until they leave it.
    - 새 채널을 만든 사용자는 채널을 탈퇴할 때까지 자동으로 채널 소유자로 설정됩니다.

        - The channel owner can set a password required to access the channel, change it, and also remove it.
        - 채널 소유자는 채널에 액세스하는 데 필요한 비밀번호를 설정하고, 변경하고, 삭제할 수도 있습니다.

        - The channel owner is a channel administrator. They can set other users as administrators.
        - 채널 소유자는 채널 관리자입니다. 다른 사용자를 관리자로 설정할 수 있습니다.

        - A user who is an administrator of a channel can kick, ban or mute (for a limited time) other users, but not the channel owners.
        - 채널의 관리자인 사용자는 채널 소유자가 아닌 다른 사용자를 쫓아내거나, 금지하거나, 뮤트(제한된 시간 동안)할 수 있습니다.

    - The user should be able to invite other users to play a Pong game through the chat interface.
    - 사용자는 채팅 인터페이스를 통해 다른 사용자를 Pong 게임에 초대할 수 있어야 합니다.

    - The user should be able to access other players profiles through the chat interface.
    - 사용자는 채팅 인터페이스를 통해 다른 플레이어 프로필에 액세스할 수 있어야 합니다.

## II.5 Game
- The main purpose of this website is to play Pong versus other players.
- 이 웹사이트의 주요 목적은 다른 플레이어와 탁구 대결을 하는 것입니다.

    - Therefore, users should be able to play a live Pong game versus another player directly on the website.
    - 따라서 사용자는 웹사이트에서 직접 다른 플레이어와 실시간 탁구 게임을 플레이할 수 있어야 합니다.

    - There must be a matchmaking system: the user can join a queue until they get automatically matched with someone else.
    - 매치메이킹 시스템이 있어야 합니다. 사용자는 다른 사람과 자동으로 매칭될 때까지 대기열에 참여할 수 있습니다.

    - It can be a canvas game, or it can be a game rendered in 3D, it can also be ugly, but in any case, it must be faithful to the original Pong (1972).
    - 캔버스 게임일 수도 있고, 3D로 렌더링된 게임일 수도 있고, 못생긴 게임일 수도 있지만, 어떤 경우든 오리지널 퐁(1972)에 충실해야 합니다.

    - You must offer some customization options (for example, power-ups or different maps). However, the user should be able to select a default version of the game without any extra features if they want to.
    - 몇 가지 커스터마이징 옵션(예: 파워업 또는 다른 맵)을 제공해야 합니다. 그러나 사용자가 원하는 경우 추가 기능 없이 기본 버전의 게임을 선택할 수 있어야 합니다.

    - The game must be responsive!
    - 게임이 반응성이 있어야 합니다!

### Attention!
- Think about network issues, like unexpected disconnection or lag. You have to offer the best user experience possible.
- 예기치 않은 연결 끊김이나 지연과 같은 네트워크 문제에 대해 생각해 보세요. 최상의 사용자 경험을 제공해야 합니다.

## Chapter III
## Submission and peer-evaluation
- Turn in your assignment in your Git repository as usual. Only the work inside your repository will be evaluated during the defense. Don’t hesitate to double check the names of your files to ensure they are correct.
- 과제는 평소처럼 Git 리포지토리에 제출하세요. 방어 기간 동안에는 저장소 내의 작업만 평가됩니다. 주저하지 말고 파일 이름을 다시 한 번 확인하여 정확한지 확인하세요.