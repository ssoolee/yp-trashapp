/**
 * 스마트 양평 클린가이드 - 통합 데이터베이스
 * 양평군 12개 읍·면 쓰레기 배출 정보 & 스마트 분리배출 안내
 */

const YANGPYEONG_DATA = {
  // 12개 읍·면 정보 및 연락처
  towns: [
    {
      id: "yangpyeong",
      name: "양평읍",
      engName: "Yangpyeong-eup",
      zone: "1구역 (동부/중앙)",
      office: "양평읍 행정복지센터",
      tel: "031-770-3021",
      address: "경기도 양평군 양평읍 양근창대길 24",
      description: "양평군 중심지 (양근리, 공흥리, 백안리, 도곡리, 신애리, 덕평리, 오빈리, 양평리, 회현리, 창대리, 원덕리)",
      mapPos: { top: "45%", left: "42%" }
    },
    {
      id: "gangsang",
      name: "강상면",
      engName: "Gangsang-myeon",
      zone: "1구역 (남부)",
      office: "강상면 행정복지센터",
      tel: "031-770-3052",
      address: "경기도 양평군 강상면 강남로 1009",
      description: "남한강 남쪽 위치 (병산리, 송학리, 세월리, 화양리, 신화리, 교평리)",
      mapPos: { top: "58%", left: "38%" }
    },
    {
      id: "gangha",
      name: "강하면",
      engName: "Gangha-myeon",
      zone: "1구역 (남서부)",
      office: "강하면 행정복지센터",
      tel: "031-770-3089",
      address: "경기도 양평군 강하면 왕창국수길 9",
      description: "왕창리, 운심리, 운심천리, 전수리, 성덕리, 동오리",
      mapPos: { top: "56%", left: "26%" }
    },
    {
      id: "yangseo",
      name: "양서면",
      engName: "Yangseo-myeon",
      zone: "1구역 (서부/두물머리)",
      office: "양서면 행정복지센터",
      tel: "031-770-3105",
      address: "경기도 양평군 양서면 용담길 36",
      description: "두물머리 및 국수역 지역 (용담리, 양수리, 부용리, 신원리, 청계리, 목왕리, 복포리, 국수리, 대곡리)",
      mapPos: { top: "42%", left: "18%" }
    },
    {
      id: "okcheon",
      name: "옥천면",
      engName: "Okcheon-myeon",
      zone: "1구역 (중서부)",
      office: "옥천면 행정복지센터",
      tel: "031-770-3158",
      address: "경기도 양평군 옥천면 옥천길 60",
      description: "용문산 서쪽 및 신복리, 옥천리, 아신리, 용천리",
      mapPos: { top: "35%", left: "34%" }
    },
    {
      id: "seojong",
      name: "서종면",
      engName: "Seojong-myeon",
      zone: "1구역 (북서부)",
      office: "서종면 행정복지센터",
      tel: "031-770-3165",
      address: "경기도 양평군 서종면 북한강로 994",
      description: "북한강 변 (문호리, 도장리, 수입리, 명달리, 노문리, 서후리)",
      mapPos: { top: "25%", left: "22%" }
    },
    {
      id: "danwol",
      name: "단월면",
      engName: "Danwol-myeon",
      zone: "2구역 (북동부)",
      office: "단월면 행정복지센터",
      tel: "031-770-3192",
      address: "경기도 양평군 단월면 보룡길 29",
      description: "소리산 및 단월천 지역 (보룡리, 삼가리, 봉상리, 향소리, 덕수리, 부안리, 산음리, 석산리)",
      mapPos: { top: "26%", left: "62%" }
    },
    {
      id: "cheongun",
      name: "청운면",
      engName: "Cheongun-myeon",
      zone: "2구역 (최동북부)",
      office: "청운면 행정복지센터",
      tel: "031-770-3225",
      address: "경기도 양평군 청운면 용두로 43",
      description: "용두리, 여물리, 비룡리, 가현리, 갈운리, 도원리, 신론리, 삼성리",
      mapPos: { top: "30%", left: "80%" }
    },
    {
      id: "yangdong",
      name: "양동면",
      engName: "Yangdong-myeon",
      zone: "2구역 (동남부)",
      office: "양동면 행정복지센터",
      tel: "031-770-3253",
      address: "경기도 양평군 양동면 학포길 21",
      description: "쌍학리, 석곡리, 매월리, 고송리, 금왕리, 삼산리, 계정리, 단석리",
      mapPos: { top: "54%", left: "84%" }
    },
    {
      id: "jipyeong",
      name: "지평면",
      engName: "Jipyeong-myeon",
      zone: "2구역 (중동부)",
      office: "지평면 행정복지센터",
      tel: "031-770-3283",
      address: "경기도 양평군 지평면 지평의병로 58",
      description: "지평리, 송현리, 월산리, 망미리, 무왕리, 일신리, 옥현리, 수곡리, 대평리",
      mapPos: { top: "52%", left: "64%" }
    },
    {
      id: "yongmun",
      name: "용문면",
      engName: "Yongmun-myeon",
      zone: "2구역 (중부 관광권)",
      office: "용문면 행정복지센터",
      tel: "031-770-3335",
      address: "경기도 양평군 용문면 용문로 391",
      description: "용문산 관광지 및 용문역 (다문리, 마룡리, 화전리, 연수리, 신점리, 덕촌리, 오촌리, 조현리, 광탄리, 삼성리, 중원리, 망능리)",
      mapPos: { top: "42%", left: "54%" }
    },
    {
      id: "gaegun",
      name: "개군면",
      engName: "Gaegun-myeon",
      zone: "2구역 (남동부)",
      office: "개군면 행정복지센터",
      tel: "031-770-3342",
      address: "경기도 양평군 개군면 하자포길 29",
      description: "하자포리, 구미리, 자연리, 향리, 공세리, 상자포리, 앙덕리, 석장리, 계전리, 부리, 내리, 주읍리",
      mapPos: { top: "66%", left: "52%" }
    }
  ],

  // 배출 규정 기본 가이드
  dischargeTimeRules: {
    title: "배출 시간 준수 수칙",
    dischargeWindow: "수거 전일 일몰 후(18:00) ~ 수거 당일 일출 전(06:00)",
    notice: "낮 시간대(06:00 ~ 18:00) 쓰레기 배출 금지! 위반 시 과태료 부과",
    collectionDaysMap: {
      0: { canDischarge: true, items: ["general", "food"], note: "일요일 저녁 배출 ➔ 월요일 수거" },
      1: { canDischarge: true, items: ["general", "food"], note: "월요일 저녁 배출 ➔ 화요일 수거" },
      2: { canDischarge: true, items: ["general", "food", "bulky", "noncombustible"], note: "화요일 저녁 배출 ➔ 수요일 수거 (대형폐기물·불연성)" },
      3: { canDischarge: true, items: ["general", "food"], note: "수요일 저녁 배출 ➔ 목요일 수거" },
      4: { canDischarge: true, items: ["general", "food", "recycle"], note: "목요일 저녁 배출 ➔ 금요일 수거 (재활용품 전 품목)" },
      5: { canDischarge: false, items: [], note: "금요일 저녁 배출 금지 (주말 수거 휴무)" },
      6: { canDischarge: false, items: [], note: "토요일 배출 금지 (일요일 저녁부터 배출 가능)" }
    }
  },

  // 쓰레기 카테고리 정보
  categories: [
    {
      id: "general",
      name: "소각용 일반쓰레기",
      icon: "fa-dumpster",
      color: "#10B981",
      bagType: "규격 종량제 봉투 (흰색/투명)",
      dischargeDays: "일, 월, 화, 수, 목 저녁",
      collectionDays: "월, 화, 수, 목, 금 오전",
      dischargeTime: "일몰 후(18시~) ~ 일출 전(06시)",
      summary: "타지 않는 폐기물, 재활용품, 음식물 쓰레기를 제외한 일반 생활 쓰레기",
      howTo: [
        "반드시 양평군 규격 종량제 봉투에 묶어서 지정 장소에 배출",
        "음식물 쓰레기나 재활용품이 섞이지 않도록 철저히 분리",
        "봉투 묶음선 이상 과적 배출 금지 (테이프 부착 금지)"
      ]
    },
    {
      id: "food",
      name: "음식물류 폐기물",
      icon: "fa-apple-whole",
      color: "#F59E0B",
      bagType: "음식물 전용 봉투(노란색) 또는 전용 칩/용기",
      dischargeDays: "일, 월, 화, 수, 목 저녁",
      collectionDays: "월, 화, 수, 목, 금 오전",
      dischargeTime: "일몰 후(18시~) ~ 일출 전(06시)",
      summary: "동물이 먹을 수 있는 유기물 폐기물 (물기 제거 필수)",
      howTo: [
        "물기를 최대한 짜낸 후 음식물 전용 봉투 또는 칩을 부착한 전용 용기에 배출",
        "비닐, 이쑤시개, 조개 껍데기, 뼈다귀 등 이물질은 일반 쓰레기로 분리",
        "단독주택/상가는 전용용기, 공동주택은 전용 수거함 이용"
      ],
      notFoodNotice: "⚠️ 음식물이 아닌 일반쓰레기: 동물의 뼈(치킨/족발/갈비), 조개/전복 껍데기, 달걀 껍질, 씨앗, 양파/마늘 껍질, 차 찌꺼기"
    },
    {
      id: "recycle",
      name: "재활용품",
      icon: "fa-recycle",
      color: "#3B82F6",
      bagType: "투명/반투명 비닐봉투 (품목별 분류)",
      dischargeDays: "목요일 저녁",
      collectionDays: "금요일 오전",
      dischargeTime: "일몰 후(18시~) ~ 일출 전(06시)",
      summary: "투명페트병, 플라스틱, 비닐, 종이/종이팩, 캔/고철, 유리병, 스티로폼",
      howTo: [
        "비운다: 용기 안의 내용물을 깔끔히 비웁니다.",
        "헹군다: 이물질이나 음식물을 물로 깨끗이 헹굽니다.",
        "분리한다: 라벨, 스티커, 다른 재질 부속품을 분리합니다.",
        "섞지 않는다: 재활용품 종류별로 구분하여 투명 봉투에 담아 배출합니다."
      ]
    },
    {
      id: "noncombustible",
      name: "불연성 쓰레기 (매립용)",
      icon: "fa-box-tissue",
      color: "#8B5CF6",
      bagType: "불연성 쓰레기 전용 마대 (마대자루)",
      dischargeDays: "화요일 저녁",
      collectionDays: "수요일 오전",
      dischargeTime: "일몰 후(18시~) ~ 일출 전(06시)",
      summary: "불에 타지 않는 폐기물 (깨진 유리, 도자기, 집수리 깨진 타일, 연탄재 등)",
      howTo: [
        "양평군 종량제 불연성 마대(마대자루)를 구매하여 배출",
        "깨진 유리는 신문지나 박스로 감싼 후 마대에 담아 부상 방지",
        "소량의 깨진 유리는 종량제 봉투 찢어짐 위험이 있으므로 불연성 마대 이용"
      ]
    },
    {
      id: "bulky",
      name: "대형폐기물 & 폐가전",
      icon: "fa-couch",
      color: "#EC4899",
      bagType: "대형폐기물 납부 스티커 / 스마트 양평톡톡 배출신고증",
      dischargeDays: "화요일 저녁 (신고 후 배출)",
      collectionDays: "수요일 오전",
      dischargeTime: "배출예정일 전일 일몰 후",
      summary: "가구, 침구류, 대형 생활용품 및 폐가전제품",
      howTo: [
        "읍·면사무소 방문 스티커 구입 또는 '스마트 양평톡톡' 앱/웹 온라인 배출신고",
        "발급받은 신고필증(접수번호)을 폐기물에 잘 보이게 부착",
        "대형 폐가전(냉장고, 세탁기, TV 등)은 1599-0903(무상방문수거) 이용 시 수수료 무료!"
      ]
    }
  ],

  // 봉투 가격표
  bagPrices: {
    general: [
      { size: "5L", price: "140원" },
      { size: "10L", price: "280원" },
      { size: "20L", price: "560원 (가장 많이 사용)" },
      { size: "30L", price: "840원" },
      { size: "50L", price: "1,400원" },
      { size: "75L", price: "2,100원" }
    ],
    food: [
      { size: "2L", price: "60원" },
      { size: "3L", price: "90원" },
      { size: "5L", price: "140원" },
      { size: "10L", price: "280원" },
      { size: "20L", price: "560원" }
    ],
    noncombustible: [
      { size: "10L", price: "350원" },
      { size: "20L", price: "700원" },
      { size: "50L", price: "1,750원" }
    ]
  },

  // 100+ 품목 스마트 분리배출 검색 데이터
  itemsDatabase: [
    // 음식물/비음식물
    { name: "치킨 뼈", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "동물 뼈는 가축 사료로 쓰일 수 없어 음식물이 아닌 일반 쓰레기입니다." },
    { name: "족발 뼈 / 갈비 뼈", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "단단한 동물 뼈다귀는 소각용 일반 종량제 봉투에 담아 배출합니다." },
    { name: "조개 / 전복 / 굴 껍데기", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "패류 껍데기는 단단하여 분쇄가 불가능하므로 일반 쓰레기로 분리배출합니다." },
    { name: "달걀 껍질 / 메추리알 껍질", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "알 껍질은 석회질 성분으로 음식물이 아닌 일반 쓰레기입니다." },
    { name: "복숭아 / 감 / 씨앗류", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "단단한 과일 씨앗(핵과류 씨)은 분쇄기를 손상시키므로 일반 쓰레기로 배출합니다." },
    { name: "양파 껍질 / 마늘 껍질 / 대파 뿌리", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "수분이 없고 섬유질이 많은 채소 껍질·뿌리는 일반 쓰레기입니다." },
    { name: "차 찌꺼기 / 티백 / 한약재 찌꺼기", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "티백은 종이/비닐과 차 찌꺼기를 분리하거나 전체를 일반 쓰레기로 배출합니다." },
    { name: "수박 껍질", category: "food", bag: "음식물 전용 봉투/용기", day: "일~목 저녁", method: "잘게 썰어서 수분을 최대한 제거한 후 음식물 쓰레기로 배출 가능합니다." },
    { name: "귤 껍질 / 사과 껍질", category: "food", bag: "음식물 전용 봉투/용기", day: "일~목 저녁", method: "부드러운 과일 껍질은 음식물 쓰레기입니다." },
    { name: "남은 음식물 반찬", category: "food", bag: "음식물 전용 봉투/용기", day: "일~목 저녁", method: "국물과 수분을 최대한 꼭 짜낸 뒤 음식물 전용 봉투나 칩 부착 용기에 배출." },

    // 유리 / 도자기 / 깨진 물품
    { name: "깨진 유리 / 거울 조각", category: "noncombustible", bag: "불연성 마대", day: "화요일 저녁", method: "신문지로 여러 번 감싸 수거자 부상을 막고 불연성 전용 마대에 넣어 배출합니다." },
    { name: "도자기 / 화분 / 머그컵", category: "noncombustible", bag: "불연성 마대", day: "화요일 저녁", method: "불에 타지 않는 도자기·유리 제품은 불연성 마대에 배출합니다." },
    { name: "음료수 유리병 / 소주병 / 맥주병", category: "recycle", bag: "투명 비닐 (유리류)", day: "목요일 저녁", method: "내용물을 비우고 헹군 후 배출. 소주/맥주 공병은 마트 반환 시 보증금 환급 가능." },
    { name: "깨진 타일 / 벽돌 / 시멘트 조각", category: "noncombustible", bag: "불연성 마대", day: "화요일 저녁", method: "소량 집수리 후 발생한 건축 폐재는 불연성 마대에 수거." },

    // 재활용품
    { name: "투명 페트병 (생수병, 음료병)", category: "recycle", bag: "투명 페트병 전용 배출", day: "목요일 저녁", method: "내용물 비우기 ➔ 라벨 제거 ➔ 찌그러뜨려 뚜껑 닫고 투명 페트병 전용으로 별도 배출!" },
    { name: "플라스틱 용기 (샴푸, 세제, 락스)", category: "recycle", bag: "투명 비닐 (플라스틱)", day: "목요일 저녁", method: "물로 헹군 후 펌프 등 타 재질 부속은 분리하여 배출합니다." },
    { name: "우유팩 / 두유팩 / 음료팩", category: "recycle", bag: "종이팩 전용 또는 종이류", day: "목요일 저녁", method: "내용물을 비우고 물로 헹군 뒤 펼쳐서 바짝 말려 종이팩으로 따로 묶어서 배출." },
    { name: "택배 박스 / 종이 상자", category: "recycle", bag: "종이류 (끈으로 묶음)", day: "목요일 저녁", method: "테이프, 운송장 스티커, 철심을 깨끗이 제거하고 펼쳐서 차곡차곡 묶어서 배출." },
    { name: "신문지 / 잡지 / 전단지", category: "recycle", bag: "종이류", day: "목요일 저녁", method: "비닐 코팅 표지는 제거하고 묶어서 배출." },
    { name: "스티로폼 상자 (신선식품)", category: "recycle", bag: "스티로폼 묶음", day: "목요일 저녁", method: "테이프, 운송장 스티커를 떼어내고 깨끗한 흰색 스티로폼만 배출." },
    { name: "컵라면 스티로폼 용기 (국물 물든 것)", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "착색되거나 이물질이 제거되지 않는 스티로폼은 재활용 불가 ➔ 일반 쓰레기." },
    { name: "비닐봉지 / 빵봉지 / 과자봉지", category: "recycle", bag: "투명 비닐 (비닐류)", day: "목요일 저녁", method: "이물질이 묻지 않은 깨끗한 비닐을 한곳에 모아 배출. 음식물 묻은 건 일반쓰레기." },
    { name: "에어캡 (뽁뽁이)", category: "recycle", bag: "투명 비닐 (비닐류)", day: "목요일 저녁", method: "바람을 빼지 않고 비닐류로 분리배출 가능합니다." },
    { name: "부탄가스통 / 스프레이캔", category: "recycle", bag: "투명 비닐 (캔류)", day: "목요일 저녁", method: "통풍이 잘되는 야외에서 구멍을 뚫어 가스를 완전히 빼낸 후 캔류로 배출." },
    { name: "통조림 캔 / 음료수 캔", category: "recycle", bag: "투명 비닐 (캔류)", day: "목요일 저녁", method: "내용물을 비우고 헹군 뒤 눌러서 배출. 플라스틱 뚜껑은 따로 분리." },

    // 특수 폐기물 (형광등, 건전지, 약 등)
    { name: "폐형광등 (직관형, 고리형)", category: "recycle", bag: "전용 수거함", day: "상시 배출", method: "깨지지 않도록 읍·면사무소 또는 아파트 단지 내 폐형광등 전용 수거함에 배출." },
    { name: "폐건전지 / 보조배터리", category: "recycle", bag: "전용 수거함", day: "상시 배출", method: "중금속 오염 방지를 위해 읍·면사무소 또는 아파트 폐건전지 전용 수거함에 배출." },
    { name: "폐의약품 (알약, 가루약, 물약)", category: "general", bag: "보건소 / 약국 전용 수거함", day: "상시 배출", method: "하수구나 종량제 봉투에 버리면 수질 오염! 약국, 보건소, 읍면사무소 폐의약품함에 제출." },
    { name: "아이스팩 (고분자수지 겔)", category: "general", bag: "일반 종량제 봉투", day: "일~목 저녁", method: "겔 타입 아이스팩은 뜯지 말고 일반 종량제 봉투에 배출 (물 아이스팩은 물 자르고 비닐 재활용)." },
    { name: "헌옷 / 신발 / 가방", category: "recycle", bag: "의류 수거함 또는 대형", day: "상시 배출", method: "재사용 가능한 의류는 동네 의류수거함에 배출, 훼손된 의류는 종량제 봉투 배출." },
    { name: "이불 / 솜베개", category: "bulky", bag: "대형 스티커 또는 마대", day: "화요일 저녁", method: "의류수거함 배출 불가! 얇은 이불은 종량제/불연성마대, 두꺼운 솜이불은 대형폐기물 신고." },

    // 대형 폐기물 & 가전
    { name: "냉장고 / 세탁기 / 에어컨 / TV", category: "bulky", bag: "폐가전 무상수거 (1599-0903)", day: "예약 지정일", method: "수수료 전액 무료! 1599-0903 또는 www.15990903.or.kr 예약 시 방문 수거." },
    { name: "전자레인지 / 밥솥 / 청소기 / 드라이기", category: "bulky", bag: "소형가전 전용함 또는 대형", day: "화요일 저녁", method: "소형가전 5개 이상은 무상방문수거 가능, 1개는 읍면사무소 전용 수거함 배출 시 무료." },
    { name: "매트리스 (싱글/퀸)", category: "bulky", bag: "대형 스티커 (6,000~10,000원)", day: "화요일 저녁", method: "스마트 양평톡톡 배출 신고 후 스티커(접수번호)를 부착하여 집 앞에 배출." },
    { name: "장롱 / 옷장", category: "bulky", bag: "대형 스티커 (8,000~15,000원)", day: "화요일 저녁", method: "규격(통 수)에 따라 스티커 수수료가 다릅니다. 사전 신고 후 배출." },
    { name: "소파 / 응접의자", category: "bulky", bag: "대형 스티커 (3,000~10,000원)", day: "화요일 저녁", method: "1인용/2인용/3인용 이상 구분하여 스티커 부착 배출." },
    { name: "책상 / 식탁", category: "bulky", bag: "대형 스티커 (3,000~7,000원)", day: "화요일 저녁", method: "서랍장 포함 여부 및 인원수에 맞는 스티커 구매 부착." },
    { name: "의자 (식탁의자, 회전의자)", category: "bulky", bag: "대형 스티커 (2,000~3,000원)", day: "화요일 저녁", method: "낱개당 스티커 부착 배출." },
    { name: "자전거", category: "bulky", bag: "대형 스티커 (3,000원)", day: "화요일 저녁", method: "아동용 2,000원, 성인용 3,000원 스티커 부착 배출." },
    { name: "유모차 / 카시트", category: "bulky", bag: "대형 스티커 (2,000~3,000원)", day: "화요일 저녁", method: "대형폐기물 신고 후 배출 부착." }
  ],

  // 대형폐기물 수수료 산정 품목 목록
  bulkyFeeItems: [
    // 가구류
    { category: "가구류", name: "장롱 (통당 90cm 이상)", fee: 15000 },
    { category: "가구류", name: "장롱 (통당 90cm 미만)", fee: 10000 },
    { category: "가구류", name: "침대 매트리스 (2인용/퀸 이상)", fee: 10000 },
    { category: "가구류", name: "침대 매트리스 (1인용/싱글)", fee: 6000 },
    { category: "가구류", name: "침대 프레임 (틀)", fee: 5000 },
    { category: "가구류", name: "소파 (3인용 이상)", fee: 10000 },
    { category: "가구류", name: "소파 (1~2인용)", fee: 5000 },
    { category: "가구류", name: "책상 (양복통/대형)", fee: 7000 },
    { category: "가구류", name: "책상 (일반)", fee: 4000 },
    { category: "가구류", name: "식탁 (4인용 이상)", fee: 5000 },
    { category: "가구류", name: "식탁 (2인용)", fee: 3000 },
    { category: "가구류", name: "의자 (회전/바퀴/사장용)", fee: 3000 },
    { category: "가구류", name: "의자 (일반 식탁의자)", fee: 2000 },
    { category: "가구류", name: "책장 / 서가", fee: 5000 },
    { category: "가구류", name: "서랍장 (5단 이상)", fee: 5000 },
    { category: "가구류", name: "서랍장 (4단 이하)", fee: 3000 },
    { category: "가구류", name: "신발장 / 화장대", fee: 4000 },

    // 침구 & 생활류
    { category: "침구/생활", name: "솜이불 (두꺼운 대형)", fee: 4000 },
    { category: "침구/생활", name: "카페트 / 돗자리 (대형)", fee: 4000 },
    { category: "침구/생활", name: "카페트 / 돗자리 (소형)", fee: 2000 },
    { category: "침구/생활", name: "자전거 (성인용)", fee: 3000 },
    { category: "침구/생활", name: "자전거 (아동용)", fee: 2000 },
    { category: "침구/생활", name: "유모차 / 카시트", fee: 3000 },
    { category: "침구/생활", name: "골프가방 (캐디백)", fee: 3000 },
    { category: "침구/생활", name: "거울 (대형 1m 이상)", fee: 4000 },
    { category: "침구/생활", name: "거울 (소형)", fee: 2000 },
    { category: "침구/생활", name: "블라인드 / 커튼봉", fee: 2000 },

    // 가전/기타
    { category: "가전/기타", name: "안마의자 (대형)", fee: 15000 },
    { category: "가전/기타", name: "러닝머신 (운동기구)", fee: 10000 },
    { category: "가전/기타", name: "피아노 (어쿠스틱)", fee: 15000 },
    { category: "가전/기타", name: "디지털 피아노 / 키보드", fee: 5000 },
    { category: "가전/기타", name: "수조 / 수족관 (대형)", fee: 8000 },
    { category: "가전/기타", name: "수조 / 수족관 (소형)", fee: 3000 },
    { category: "가전/기타", name: "개집 (대형)", fee: 5000 }
  ]
};
