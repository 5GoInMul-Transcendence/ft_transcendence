# 목업 데이터 api 리스트

## /api/friends

        {
            name: string,
            id: string,
            status: string,
            url: string,
        }

<br>
<br>
<br>
<br>

## api 데이터 추가 방식

---

- 원하는 api path를 설정한다.
- app/api/원하는경로/route.ts 파일을 만든다.
- app/api/원하는경로/data.json 파일을 만든다.

route.js

```javascript
import { NextResponse } from 'next/server';
import data from './data.json';

export async function GET(request: any) {
  return NextResponse.json(data, { status: 200 });
}
```

data.json

```json
[
  {
    "name": "John Doe",
    "id": "12345",
    "status": "online",
    "url": ""
  },
  {
    "name": "Jane Smith",
    "id": "67890",
    "status": "offline",
    "url": ""
  },
  {
    "name": "Michael Johnson",
    "id": "54321",
    "status": "online",
    "url": ""
  },
  {
    "name": "Emily Brown",
    "id": "98765",
    "status": "offline",
    "url": ""
  },
  {
    "name": "Alex Turner",
    "id": "13579",
    "status": "online",
    "url": ""
  },
  {
    "name": "Olivia Parker",
    "id": "46820",
    "status": "offline",
    "url": ""
  },
  {
    "name": "William Adams",
    "id": "24680",
    "status": "online",
    "url": ""
  },
  {
    "name": "Sophia Lee",
    "id": "97531",
    "status": "offline",
    "url": ""
  },
  {
    "name": "James Miller",
    "id": "86420",
    "status": "online",
    "url": ""
  },
  {
    "name": "Ava Wilson",
    "id": "75309",
    "status": "offline",
    "url": ""
  }
]
```

get 으로 불러오면 끝!
