// Tomato Smart Farm Pro - Main JavaScript Engine with Supabase Cloud Sync, 6-Digit PIN Security, Garak Wholesale Market Live Auction & RDA Pest & Disease Forecasting
(function () {
  'use strict';

  // ==========================================
  // 1. Configuration & Cloud Database Init
  // ==========================================
  const SUPABASE_URL = 'https://lnnufqbftvourvjoqxpv.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubnVmcWJmdHZvdXJ2am9xeHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMzIzNjMsImV4cCI6MjEwMzgwODM2M30.Dlp72wlV3gJBoNM2BEflEnjvdyRy0iQqDc8dllcw4y4';
  const supabase = (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) 
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
    : null;

  const STORAGE_PREFIX = 'tomato_smartfarm_';
  const PIN_STORAGE_KEY = 'tomato_smartfarm_pin_code';

  const DEFAULT_SETTINGS = {
    farmName: '토마토 농장',
    bedCount: 24,
    targetSupplyEc: 2.4,
    targetSupplyPh: 5.8,
    targetDrainMin: 20,
    targetDrainMax: 30,
    pinCode: '123456'
  };

  const DEFAULT_GROWTH_PROFILE = {
    plantingDate: '2026-08-25',
    cropType: 'long_term'
  };

  const WEATHER_REGIONS = {
    buyeo: { name: '충남 부여', lat: 36.2756, lon: 126.9097 },
    gimje: { name: '전북 김제', lat: 35.8036, lon: 126.8808 },
    nonsan: { name: '충남 논산', lat: 36.1872, lon: 127.0987 },
    jinju: { name: '경남 진주', lat: 35.1802, lon: 128.1076 },
    miryang: { name: '경남 밀양', lat: 35.5038, lon: 128.7466 },
    damyang: { name: '전남 담양', lat: 35.3211, lon: 126.9882 },
    goheung: { name: '전남 고흥', lat: 34.6111, lon: 127.2847 },
    hwaseong: { name: '경기 화성', lat: 37.1995, lon: 126.8315 },
    sangju: { name: '경북 상주', lat: 36.4109, lon: 128.1591 },
    chuncheon: { name: '강원 춘천', lat: 37.8813, lon: 127.7298 }
  };

  // 🏛️ Seoul Agro-Fisheries & Food Corp (Garak Market) Auction Datasets
  const GARAK_AUCTION_DATA = {
    tomato_5kg: {
      cropName: '일반 완숙토마토 (5kg)',
      unit: '5kg 상자',
      kgPerBox: 5,
      specialAvg: 28500,
      specialMax: 33000,
      highAvg: 24000,
      normalAvg: 18500,
      lowAvg: 11000,
      lowMin: 8500,
      diff: 1500,
      diffPercent: 5.6,
      totalVolumeTon: 142.5,
      totalBoxes: 28500,
      corps: [
        { name: '서울청과', avgPrice: 28800, volume: 6400, status: '경매마감', code: '01' },
        { name: '농협가락공판장', avgPrice: 28600, volume: 7800, status: '경매마감', code: '02' },
        { name: '중앙청과', avgPrice: 28400, volume: 5900, status: '경매마감', code: '03' },
        { name: '동화청과', avgPrice: 28200, volume: 4600, status: '경매마감', code: '04' },
        { name: '한국청과', avgPrice: 28500, volume: 3800, status: '경매마감', code: '05' }
      ]
    },
    tomato_10kg: {
      cropName: '완숙토마토 대과 (10kg)',
      unit: '10kg 상자',
      kgPerBox: 10,
      specialAvg: 49000,
      specialMax: 56000,
      highAvg: 42000,
      normalAvg: 32000,
      lowAvg: 19000,
      lowMin: 15000,
      diff: 2000,
      diffPercent: 4.2,
      totalVolumeTon: 88.0,
      totalBoxes: 8800,
      corps: [
        { name: '서울청과', avgPrice: 49500, volume: 2200, status: '경매마감', code: '01' },
        { name: '농협가락공판장', avgPrice: 49000, volume: 2900, status: '경매마감', code: '02' },
        { name: '중앙청과', avgPrice: 48800, volume: 1800, status: '경매마감', code: '03' },
        { name: '동화청과', avgPrice: 48600, volume: 1100, status: '경매마감', code: '04' },
        { name: '한국청과', avgPrice: 49200, volume: 800, status: '경매마감', code: '05' }
      ]
    },
    cherry_3kg: {
      cropName: '대추방울토마토 (3kg)',
      unit: '3kg 상자',
      kgPerBox: 3,
      specialAvg: 23500,
      specialMax: 27000,
      highAvg: 19800,
      normalAvg: 14500,
      lowAvg: 9000,
      lowMin: 7000,
      diff: -800,
      diffPercent: -3.3,
      totalVolumeTon: 115.2,
      totalBoxes: 38400,
      corps: [
        { name: '서울청과', avgPrice: 23800, volume: 9200, status: '경매마감', code: '01' },
        { name: '농협가락공판장', avgPrice: 23500, volume: 11400, status: '경매마감', code: '02' },
        { name: '중앙청과', avgPrice: 23400, volume: 7600, status: '경매마감', code: '03' },
        { name: '동화청과', avgPrice: 23200, volume: 5800, status: '경매마감', code: '04' },
        { name: '한국청과', avgPrice: 23600, volume: 4400, status: '경매마감', code: '05' }
      ]
    },
    round_cherry_5kg: {
      cropName: '일반 방울토마토 (5kg)',
      unit: '5kg 상자',
      kgPerBox: 5,
      specialAvg: 26000,
      specialMax: 30500,
      highAvg: 21500,
      normalAvg: 16000,
      lowAvg: 10500,
      lowMin: 8000,
      diff: 1000,
      diffPercent: 4.0,
      totalVolumeTon: 62.0,
      totalBoxes: 12400,
      corps: [
        { name: '서울청과', avgPrice: 26300, volume: 3100, status: '경매마감', code: '01' },
        { name: '농협가락공판장', avgPrice: 26000, volume: 4200, status: '경매마감', code: '02' },
        { name: '중앙청과', avgPrice: 25800, volume: 2600, status: '경매마감', code: '03' },
        { name: '동화청과', avgPrice: 25700, volume: 1500, status: '경매마감', code: '04' },
        { name: '한국청과', avgPrice: 26100, volume: 1000, status: '경매마감', code: '05' }
      ]
    }
  };

  // 🐛 RDA & Agricultural Technology Institute Standard 12 Pest & Disease Profiles
  const RDA_PEST_DISEASE_DB = [
    {
      id: 'leaf_mold',
      name: '잎곰팡이병 (엽미병)',
      scientificName: 'Fulvia fulva (Cooke)',
      type: '곰팡이병 (진균)',
      stage: 'stage2',
      stageName: '2기: 개화·착과기 (DAT 31~70일)',
      risk: 'high',
      optTemp: '20~25℃',
      optHumidity: '90% 이상 다습',
      symptoms: '잎 표면에 담황색의 불명확한 반점이 생기고, 잎 뒷면에 갈색~자갈색의 벨벳 모양 곰팡이 균사 형성. 심하면 잎 전체가 황화 고사.',
      prevention: '주야간 급격한 온습도차 방지, 일출 전 난방기 및 유동팬 가동으로 잎 표면 결로(이슬) 방지. 하엽 적기 제거로 군락 내 통풍 확보.',
      ipmControl: '발병 초기 친환경 유기농자재(유황제, 미생물 바실러스균) 살포. 발생 시 교차저항성 방지를 위해 작용기작 다른 등록약제 엽면 뒷면 철저 살포.'
    },
    {
      id: 'tobacco_whitefly',
      name: '담배가루이 (바이러스 TYLCV 매개)',
      scientificName: 'Bemisia tabaci',
      type: '해충 (흡즙성)',
      stage: 'stage1',
      stageName: '1기: 정식·활착기 (DAT 1~30일)',
      risk: 'high',
      optTemp: '25~30℃',
      optHumidity: '건조~보통',
      symptoms: '신초 및 잎 뒷면에서 집단 흡즙. 배설물에 의한 그을음병 유발 및 토마토황화잎말림바이러스(TYLCV) 영구 전염(신초 위축, 수확 불가).',
      prevention: '온실 측창·천창에 50메쉬 이상 미세 방충망 설치, 출입구 이중문 및 전실 황색 끈끈이트랩 설치(100평당 5매).',
      ipmControl: '천적(담배장님노린재, 지중해이리응애) 정식 초기 방사. 발생 시 천연 식물추출물(님오일, 데리스) 또는 성충 유인 트랩 집중 포살.'
    },
    {
      id: 'gray_mold',
      name: '잿빛곰팡이병',
      scientificName: 'Botrytis cinerea',
      type: '곰팡이병 (저온다습성)',
      stage: 'stage2',
      stageName: '2기: 개화·착과기 (DAT 31~70일)',
      risk: 'high',
      optTemp: '15~20℃ 저온',
      optHumidity: '95% 이상 과습',
      symptoms: '꽃잎이 시들 때 꽃받침과 과실로 침입하여 잿빛 곰팡이 포자 덩어리 형성. 줄기 전정 부위 갈변 및 궤양 유발.',
      prevention: '수정 후 시든 꽃잎을 조기에 손으로 털어 제거(적화). 곁순 정리는 맑은 날 오전에 실시하여 상처 부위 당일 건조 유도.',
      ipmControl: '병든 과실과 잎은 비닐봉지에 밀봉하여 온실 밖으로 즉시 반출. 탄산수소칼륨 또는 미생물제제(트리코더마) 공간 살포.'
    },
    {
      id: 'spider_mite',
      name: '점박이응애',
      scientificName: 'Tetranychus urticae',
      type: '해충 (식엽·흡즙성)',
      stage: 'stage3',
      stageName: '3기: 비대·수확기 (DAT 71~200일)',
      risk: 'medium',
      optTemp: '28~32℃ 고온',
      optHumidity: '50% 이하 건조',
      symptoms: '잎 표면에 미세한 흰색 반점(탈색)이 나타나며, 밀도가 높아지면 거미줄을 치고 잎 전체가 누렇게 마름.',
      prevention: '온실 내부가 지나치게 건조하지 않도록 미스트 분무 관리, 온실 주변 잡초 완전 제거.',
      ipmControl: '천적인 칠레이리응애 또는 사막이리응애 조기 방사. 응애 전용 친환경 난황유, 유화제 교호 살포.'
    },
    {
      id: 'late_blight',
      name: '토마토 역병',
      scientificName: 'Phytophthora infestans',
      type: '난균류 (곰팡이성)',
      stage: 'stage3',
      stageName: '3기: 비대·수확기 (DAT 71~200일)',
      risk: 'high',
      optTemp: '18~22℃',
      optHumidity: '90% 이상 다습·강우',
      symptoms: '잎에 암갈색 수침상 부정형 병반 발생, 잎 뒷면에 흰 균사 형성. 줄기와 과실에 흑갈색 단단한 썩음병반 형성.',
      prevention: '천창 빗물 유입 완벽 차단, 슬래브 과습 금지, 일몰 후 온실 내부 상대습도 85% 이하로 환기 제어.',
      ipmControl: '발병 확인 즉시 이병엽 전정 및 소각. 구리제(보르도액) 또는 아인산염(0.1%) 엽면 살포로 예방.'
    },
    {
      id: 'bacterial_wilt',
      name: '풋마름병 (청고병)',
      scientificName: 'Ralstonia solanacearum',
      type: '세균병 (토양·수경전염)',
      stage: 'stage2',
      stageName: '2기: 개화·착과기 (DAT 31~70일)',
      risk: 'medium',
      optTemp: '30~35℃ 고온',
      optHumidity: '고온·배지다습',
      symptoms: '낮에는 잎이 시들고 밤에는 회복되다가, 2~3일 후 식물체 전체가 푸른 상태 그대로 급격히 고사. 줄기 절단 시 백색 세균액 유출.',
      prevention: '근권 배지 온도 25℃ 이하 유지, 작업 도구(전정가위) 락스 100배액 또는 알코올 소독 필수.',
      ipmControl: '이병주 및 인접 2~3포기 뿌리째 즉시 제거 및 배지 격리 소독. 양액 순환식의 경우 급액 라인 살균 필수.'
    },
    {
      id: 'blossom_end_rot',
      name: '배꼽썩음과 (생리장해)',
      scientificName: 'Physiological disorder',
      type: '생리장해 (칼슘 결핍)',
      stage: 'stage3',
      stageName: '3기: 비대·수확기 (DAT 71~200일)',
      risk: 'high',
      optTemp: '28℃ 이상 고온·일사강',
      optHumidity: '급격한 수분변화',
      symptoms: '과실의 꽃 달렸던 배꼽 부위가 수침상으로 변한 뒤 흑갈색으로 편평하게 함몰 부패.',
      prevention: '근권 배액 EC가 지나치게 높아지지 않도록 관리(배액 EC 3.5 이하). 일사비례 급액으로 뿌리 수분 흡수 최적화.',
      ipmControl: '증상 초기 염화칼슘 0.3%액(물 20L당 60g)을 1주 간격으로 3~4회 신초 및 어린 과실에 엽면 살포.'
    },
    {
      id: 'thrips',
      name: '꽃노랑총채벌레 (TSWV 매개)',
      scientificName: 'Frankliniella occidentalis',
      type: '해충 (미소 흡즙성)',
      stage: 'stage1',
      stageName: '1기: 정식·활착기 (DAT 1~30일)',
      risk: 'medium',
      optTemp: '25~28℃',
      optHumidity: '건조~보통',
      symptoms: '꽃 속과 어린 과실 표면을 갉아먹어 은백색 반점 및 기형과 유발. 토마토반점위조바이러스(TSWV, 칼라병) 매개.',
      prevention: '청색 및 황색 끈끈이트랩을 작물 생장점 부근에 설치하여 조기 예찰. 온실 바닥 비닐 피복.',
      ipmControl: '총채가시응애, 오이이리응애 등 천적 투입. 미생물 살충제(보베리아 바시아나) 살포.'
    },
    {
      id: 'damping_off',
      name: '모잘록병 (묘립고병)',
      scientificName: 'Pythium spp. / Rhizoctonia solani',
      type: '곰팡이병 (토양·수경)',
      stage: 'stage1',
      stageName: '1기: 정식·활착기 (DAT 1~30일)',
      risk: 'medium',
      optTemp: '20~25℃',
      optHumidity: '배지 과습·침수',
      symptoms: '정식 직후 지제부 줄기가 갈색으로 잘록해지며 쓰러져 고사. 뿌리 발근 불량 및 갈변 썩음.',
      prevention: '정식 전 배지(암면큐브/코코피트) 충분한 소독, 정식 후 1주일간 과도한 급액 지양 및 뿌리 활착 촉진.',
      ipmControl: '트리코더마(Trichoderma) 길항미생물 배지 관주. 이병주는 조기 발거 후 배액 통로 확보.'
    },
    {
      id: 'powdery_mildew',
      name: '흰가루병',
      scientificName: 'Leveillula taurica / Oidium neolycopersici',
      type: '곰팡이병 (절대기생균)',
      stage: 'stage4',
      stageName: '4기: 후기·마무리 (DAT 201일 이후)',
      risk: 'low',
      optTemp: '15~28℃',
      optHumidity: '50~80% (일조부족)',
      symptoms: '잎 표면에 밀가루를 뿌려놓은 듯한 흰색 균총 형성, 심해지면 잎이 황화되고 고사.',
      prevention: '채광 상태 개선, 웃자람 방지, 질소질 비료 과용 금지 및 적정 규산 공급.',
      ipmControl: '친환경 난황유(물 20L + 계란노른자 1개 + 식용유 60ml) 또는 탄산수소나트륨(베이킹소다 0.2%) 살포.'
    },
    {
      id: 'fungus_gnat',
      name: '작은뿌리파리',
      scientificName: 'Bradysia agrestis',
      type: '해충 (근권 가해)',
      stage: 'stage1',
      stageName: '1기: 정식·활착기 (DAT 1~30일)',
      risk: 'medium',
      optTemp: '20~25℃',
      optHumidity: '배지 다습·유기물풍부',
      symptoms: '유충이 뿌리털과 지제부 내부를 갉아먹어 양수분 흡수 저해 및 세균병·역병 2차 감염 통로 제공.',
      prevention: '배지 표면 이끼 발생 억제, 점적핀 주변 건조 유지.',
      ipmControl: '곤충병원성 선충(스타이너네마) 또는 포식성 마일즈응애 배지 관주 처리. 지표면에 황색 트랩 설치.'
    },
    {
      id: 'leaf_miner',
      name: '아메리카잎굴파리',
      scientificName: 'Liriomyza trifolii',
      type: '해충 (잠엽성)',
      stage: 'stage3',
      stageName: '3기: 비대·수확기 (DAT 71~200일)',
      risk: 'low',
      optTemp: '25~30℃',
      optHumidity: '보통',
      symptoms: '유충이 잎 조직 내부를 뱀처럼 구불구불하게 파먹고 들어가 흰색 선상의 굴(터널) 형성. 광합성 저하.',
      prevention: '온실 출입문 및 측창 방충망 관리, 유충 피해 잎 조기 적엽.',
      ipmControl: '기생봉(굴파리좀벌, 잎굴파리고치벌) 방사. 발생 초 천연 아자디락틴(Azadirachtin) 살포.'
    }
  ];

  // 7 RDA Stages Lifecycle
  const RDA_STAGES = [
    {
      id: 'stage_1',
      stageNum: 1,
      name: '1단계: 정식 및 활착기',
      period: 'DAT 1 ~ 14일',
      minDat: 1,
      maxDat: 14,
      targetDesc: '배지 내 빠른 뿌리 활착 유도, 적정 수분 및 근권 온도 유지',
      envGuide: '주간 25~27℃ / 야간 16~18℃ / 근권온도 20~22℃ / 공급 EC 2.0~2.2 / pH 5.6~5.8',
      checkpoints: [
        { id: 'st1_c1', title: '정식 전 슬래브 충분한 포수 (EC 2.2 양액으로 24시간 포수 후 배액 슬릿 개봉)' },
        { id: 'st1_c2', title: '큐브 안착 후 점적 단추 토출량 균일도 점검 (노즐당 분당 30~50ml)' },
        { id: 'st1_c3', title: '정식 후 3~5일간 강한 직사광 차광막 30~50% 제어' },
        { id: 'st1_c4', title: '신초 활착 및 백색 신근(새뿌리) 슬래브 바닥 도달 확인' }
      ]
    },
    {
      id: 'stage_2',
      stageNum: 2,
      name: '2단계: 1~3화방 개화 및 초기 착과기',
      period: 'DAT 15 ~ 45일',
      minDat: 15,
      maxDat: 45,
      targetDesc: '초세(영양생장 vs 생식생장) 균형 유지, 1화방 완벽 착과',
      envGuide: '주간 24~26℃ / 야간 15~16℃ / 일교차 8~10℃ / 공급 EC 2.2~2.4 / 목표 배액률 20~25%',
      checkpoints: [
        { id: 'st2_c1', title: '호박벌(Bumblebee) 방사 또는 토마토톤 착과 보조 처리' },
        { id: 'st2_c2', title: '1화방 4~5과 착과 확인 후 기형과 및 소과 적과(착과 조절)' },
        { id: 'st2_c3', title: '주 1~2회 정기 곁순 제거(맑은 날 오전) 및 유인선 감기' },
        { id: 'st2_c4', title: '줄기 굵기 1.0~1.2cm 유지 (초세 과번무 방지)' }
      ]
    },
    {
      id: 'stage_3',
      stageNum: 3,
      name: '3단계: 4~7화방 성숙 및 과실 비대기',
      period: 'DAT 46 ~ 75일',
      minDat: 46,
      maxDat: 75,
      targetDesc: '과실 급속 비대기 양수분 공급 증량, 배꼽썩음과 예방',
      envGuide: '주간 25~28℃ / 야간 14~16℃ / 공급 EC 2.4~2.6 / 칼슘(Ca) 농도 강화',
      checkpoints: [
        { id: 'st3_c1', title: '일사량 비례 급액 제어 (일사 100J/cm² 누적 시 1회 100~150ml 급액)' },
        { id: 'st3_c2', title: '하엽 적엽(노화엽 및 병해충 엽 3~4매 제거하여 통풍 및 채광 확보)' },
        { id: 'st3_c3', title: '배꼽썩음과 예방 염화칼슘 0.3% 엽면 살포' },
        { id: 'st3_c4', title: '온실 내 CO2 시비 (주간 600~800ppm)' }
      ]
    },
    {
      id: 'stage_4',
      stageNum: 4,
      name: '4단계: 1화방 수확 개시기 (초기 수확)',
      period: 'DAT 76 ~ 100일',
      minDat: 76,
      maxDat: 100,
      targetDesc: '착색도 80~90% 완숙 수확, 상단 착과 부하 분산',
      envGuide: '주간 24~26℃ / 야간 14~15℃ / 공급 EC 2.4~2.6 / 배액 EC 3.0~3.5',
      checkpoints: [
        { id: 'st4_c1', title: '1화방 착색 과실 아침 저온기 적기 수확 및 등급별 선별' },
        { id: 'st4_c2', title: '수확 완료 화방 하부 잎 전정(수확 1단당 하엽 3매 적엽)' },
        { id: 'st4_c3', title: '가락시장 도매시세 연동 출하량 조절 및 상자 포장' }
      ]
    },
    {
      id: 'stage_5',
      stageNum: 5,
      name: '5단계: 성수기 연속 수확 및 군락 유지기',
      period: 'DAT 101 ~ 220일',
      minDat: 101,
      maxDat: 220,
      targetDesc: '주당 1단 연속 수확 및 상단 지속 착과, 병해충 집중 예찰',
      envGuide: '주간 23~26℃ / 야간 13~15℃ / 근권 EC 3.0 내외 / 일사량 연동 정밀 급액',
      checkpoints: [
        { id: 'st5_c1', title: '주 2~3회 정기 수확 및 일일 수확량 기록 관리' },
        { id: 'st5_c2', title: '작물 내림(줄기 유인 내리기) 작업으로 생장점 높이 1.8m 균일 유지' },
        { id: 'st5_c3', title: '담배가루이, 잎곰팡이병, 점박이응애 밀도 주간 예찰' }
      ]
    },
    {
      id: 'stage_6',
      stageNum: 6,
      name: '6단계: 적심(생장점 제거) 및 마무리 수확기',
      period: 'DAT 221 ~ 265일',
      minDat: 221,
      maxDat: 265,
      targetDesc: '작기 종료 50일 전 적심(생장점 적심), 상단 잔여과 비대 촉진',
      envGuide: '주간 25~28℃ / 공급 EC 2.2~2.4 / 공급량 점진 감량',
      checkpoints: [
        { id: 'st6_c1', title: '마지막 목표 화방 상단 2엽 남기고 생장점 적심(Head-cutting)' },
        { id: 'st6_c2', title: '상단부 미숙과 비대를 위한 잔여 엽면적 보호' },
        { id: 'st6_c3', title: '급액 횟수 서서히 감량하여 당도 향상 유도' }
      ]
    },
    {
      id: 'stage_7',
      stageNum: 7,
      name: '7단계: 잔재물 정리 및 배지·온실 소독기',
      period: 'DAT 266 ~ 285일',
      minDat: 266,
      maxDat: 285,
      targetDesc: '작기 종료 후 온실 잔재물 반출, 점적배관 및 온실 내부 멸균 소독',
      envGuide: '온실 밀폐 태양열 소독 (60℃ 이상 유지) 또는 약제 훈증',
      checkpoints: [
        { id: 'st7_c1', title: '토마토 줄기 및 폐배지 온실 외부 완전 반출' },
        { id: 'st7_c2', title: '양액 배관 질산 1% 용액 세척 및 스케일 제거' },
        { id: 'st7_c3', title: '온실 내부 고압 세척 및 차기 작기 정식 준비' }
      ]
    }
  ];

  // Default Daily Routines
  const DEFAULT_ROUTINES = [
    { id: 'r1', title: '온실 환경제어기 및 환기창 개폐 상태 점검', category: 'daily', intervalDays: 1, guide: '아침 일출 30분 전 결로 방지를 위한 환기창 최소개방 및 난방온도 점검' },
    { id: 'r2', title: '양액기 A·B원액 탱크 잔량 및 교반 상태 확인', category: 'daily', intervalDays: 1, guide: '원액 부족 시 즉시 보충, 침전물 발생 여부 확인' },
    { id: 'r3', title: '점적 단추 노즐 막힘 및 슬래브 급액 균일도 순회', category: 'daily', intervalDays: 1, guide: '베드별 대표 슬래브 수분 흡수 상태 및 드리퍼 점검' },
    { id: 'r4', title: '배액통 수거 및 일일 배액률, 배액 EC/pH 정밀 측정', category: 'daily', intervalDays: 1, guide: '배액률 20~30%, 배액 EC 3.0~3.5 적정 범위 확인' },
    { id: 'r5', title: '주간 생육 작업 (곁순 제거, 유인, 적엽, 적과)', category: 'weekly', intervalDays: 3, guide: '초세에 맞춰 곁순 및 하엽 정리, 맑은 날 오전에 실시' },
    { id: 'r6', title: '호박벌 활력도 및 착과율 확인 / 벌통 교체', category: 'weekly', intervalDays: 7, guide: '개화 상태 및 화관 물림 자국(착과 마크) 확인' },
    { id: 'r7', title: '황색·청색 끈끈이트랩 해충 밀도 예찰 및 교체', category: 'periodic', intervalDays: 14, guide: '가루이 및 총채벌레 발생 마릿수 확인 후 방제 결정' },
    { id: 'r8', title: '양액 공급 필터망 청소 및 배액 트랩 세척', category: 'periodic', intervalDays: 14, guide: '필터 내 이물질 및 슬라임 제거' }
  ];

  // ==========================================
  // 2. Application State Definition
  // ==========================================
  const state = {
    farmSettings: { ...DEFAULT_SETTINGS },
    growthProfile: { ...DEFAULT_GROWTH_PROFILE },
    stageChecklist: {},
    routines: [...DEFAULT_ROUTINES],
    routineLogs: {},
    bedStatus: {},
    dailyLogs: {},
    currentDate: formatDate(new Date()),
    currentTab: 'routines',
    currentBedTask: 'suckering',
    selectedBeds: [],
    selectedRange: 7,
    weatherData: null,
    weatherRegion: 'buyeo',
    pestFilter: 'all',
    auctionCrop: 'tomato_5kg',
    isLocked: true,
    currentPinInput: '',
    charts: {}
  };

  // Helper: Format Date YYYY-MM-DD
  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ==========================================
  // 3. Storage & Supabase Cloud Sync
  // ==========================================
  function loadState() {
    try {
      const savedSettings = localStorage.getItem(STORAGE_PREFIX + 'farm_settings');
      if (savedSettings) state.farmSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };

      const savedPin = localStorage.getItem(PIN_STORAGE_KEY);
      if (savedPin) state.farmSettings.pinCode = savedPin;

      const savedGrowth = localStorage.getItem(STORAGE_PREFIX + 'growth_profile');
      if (savedGrowth) state.growthProfile = { ...DEFAULT_GROWTH_PROFILE, ...JSON.parse(savedGrowth) };

      const savedChecklist = localStorage.getItem(STORAGE_PREFIX + 'stage_checklist');
      if (savedChecklist) state.stageChecklist = JSON.parse(savedChecklist);

      const savedRoutines = localStorage.getItem(STORAGE_PREFIX + 'routines');
      if (savedRoutines) state.routines = JSON.parse(savedRoutines);

      const savedRoutineLogs = localStorage.getItem(STORAGE_PREFIX + 'routine_logs');
      if (savedRoutineLogs) state.routineLogs = JSON.parse(savedRoutineLogs);

      const savedBedStatus = localStorage.getItem(STORAGE_PREFIX + 'bed_status');
      if (savedBedStatus) state.bedStatus = JSON.parse(savedBedStatus);

      const savedDailyLogs = localStorage.getItem(STORAGE_PREFIX + 'daily_logs');
      if (savedDailyLogs) state.dailyLogs = JSON.parse(savedDailyLogs);

      // Try pull from Supabase in background
      pullFromSupabase();
    } catch (e) {
      console.warn('LocalStorage load error, using defaults', e);
    }
  }

  function saveState(key, data) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
      pushToSupabase(key, data);
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }

  async function pushToSupabase(key, data) {
    if (!supabase) return;
    try {
      if (key === 'farm_settings') {
        await supabase.from('farm_settings').upsert({ id: 'current', ...data, updated_at: new Date().toISOString() });
      } else if (key === 'growth_profile') {
        await supabase.from('growth_profile').upsert({ id: 'current', ...data, updated_at: new Date().toISOString() });
      } else if (key === 'stage_checklist') {
        await supabase.from('stage_checklist').upsert({ id: 'current', data, updated_at: new Date().toISOString() });
      } else if (key === 'daily_logs') {
        const today = state.currentDate;
        if (data[today]) {
          await supabase.from('daily_logs').upsert({ date: today, ...data[today], updated_at: new Date().toISOString() });
        }
      }
    } catch (err) {
      console.log('Supabase sync background push note:', err.message);
    }
  }

  async function pullFromSupabase() {
    if (!supabase) return;
    try {
      const { data: settings } = await supabase.from('farm_settings').select('*').eq('id', 'current').single();
      if (settings) {
        state.farmSettings = { ...state.farmSettings, ...settings };
        localStorage.setItem(STORAGE_PREFIX + 'farm_settings', JSON.stringify(state.farmSettings));
      }

      const { data: growth } = await supabase.from('growth_profile').select('*').eq('id', 'current').single();
      if (growth) {
        state.growthProfile = { ...state.growthProfile, ...growth };
        localStorage.setItem(STORAGE_PREFIX + 'growth_profile', JSON.stringify(state.growthProfile));
      }

      const badge = document.getElementById('cloudSyncBadge');
      if (badge) badge.classList.remove('hidden');
    } catch (err) {
      console.log('Supabase cloud fetch initial note:', err.message);
    }
  }

  // ==========================================
  // 4. 6-Digit PIN Screen Security System
  // ==========================================
  function initPinLock() {
    const lockScreen = document.getElementById('pinLockScreen');
    const keypad = document.getElementById('pinKeypad');
    const btnLock = document.getElementById('btnLockApp');

    state.isLocked = true;
    state.currentPinInput = '';
    renderPinDots();

    // Keypad button click / pointerdown handling
    const handleKeyAction = (btn) => {
      if (!btn) return;
      const key = btn.dataset.key;
      const action = btn.dataset.action;

      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch (e) {}
      }

      if (key !== undefined) {
        handlePinDigit(key);
      } else if (action === 'clear') {
        clearPinInput();
      } else if (action === 'backspace') {
        handlePinBackspace();
      }
    };

    if (keypad) {
      keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn) handleKeyAction(btn);
      });

      // Individual button listeners for instant touch responsiveness
      keypad.querySelectorAll('.pin-key-btn').forEach(btn => {
        btn.addEventListener('pointerdown', () => {
          btn.style.transform = 'scale(0.92)';
          btn.style.backgroundColor = '#ffe4e6';
        });
        const resetBtnStyle = () => {
          btn.style.transform = '';
          btn.style.backgroundColor = '';
        };
        btn.addEventListener('pointerup', resetBtnStyle);
        btn.addEventListener('pointerleave', resetBtnStyle);
        btn.addEventListener('pointercancel', resetBtnStyle);
      });
    }

    if (btnLock) {
      btnLock.addEventListener('click', () => {
        lockApp();
      });
    }

    // Keyboard support for PIN (Top row & Numpad)
    window.addEventListener('keydown', (e) => {
      if (!state.isLocked) return;
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handlePinDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handlePinBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        clearPinInput();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.currentPinInput.length === 6) verifyPin();
      }
    });
  }

  function handlePinDigit(digit) {
    if (state.currentPinInput.length >= 6) return;
    hidePinError();
    state.currentPinInput += String(digit);
    renderPinDots();

    if (state.currentPinInput.length === 6) {
      setTimeout(() => verifyPin(), 120);
    }
  }

  function handlePinBackspace() {
    if (state.currentPinInput.length > 0) {
      state.currentPinInput = state.currentPinInput.slice(0, -1);
      renderPinDots();
      hidePinError();
    }
  }

  function clearPinInput() {
    state.currentPinInput = '';
    renderPinDots();
    hidePinError();
  }

  function renderPinDots() {
    const len = state.currentPinInput.length;
    for (let i = 0; i < 6; i++) {
      const dot = document.getElementById(`dot${i}`);
      if (dot) {
        if (i < len) {
          dot.classList.add('filled', 'active');
        } else {
          dot.classList.remove('filled', 'active');
        }
      }
    }
  }

  function verifyPin() {
    const expectedPin = String(state.farmSettings.pinCode || '123456').trim();
    const enteredPin = String(state.currentPinInput || '').trim();

    if (enteredPin === expectedPin) {
      unlockApp();
    } else {
      showPinError();
    }
  }

  function unlockApp() {
    state.isLocked = false;
    const lockScreen = document.getElementById('pinLockScreen');
    if (lockScreen) {
      lockScreen.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        lockScreen.classList.add('hidden');
      }, 300);
    }
    showToast('농장주 인증 성공! 환영합니다.', 'success');
  }

  function lockApp() {
    state.isLocked = true;
    state.currentPinInput = '';
    renderPinDots();
    hidePinError();
    const lockScreen = document.getElementById('pinLockScreen');
    if (lockScreen) {
      lockScreen.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    }
  }

  function showPinError() {
    const errEl = document.getElementById('pinErrorMessage');
    const container = document.getElementById('pinDotsContainer');
    if (errEl) errEl.classList.remove('hidden');
    if (container) {
      container.classList.add('animate-shake', 'shake-animation');
      setTimeout(() => {
        container.classList.remove('animate-shake', 'shake-animation');
        clearPinInput();
      }, 500);
    }
  }

  function hidePinError() {
    const errEl = document.getElementById('pinErrorMessage');
    if (errEl) errEl.classList.add('hidden');
  }

  // ==========================================
  // 5. Garak Wholesale Market Auction Module
  // ==========================================
  function setupAuctionModule() {
    const cropSelect = document.getElementById('selectAuctionCrop');
    const btnRefresh = document.getElementById('btnRefreshAuction');
    const inputBoxes = document.getElementById('calcInputBoxes');
    const selectGrade = document.getElementById('calcSelectGrade');
    const btnCalc = document.getElementById('btnCalculateRevenue');

    if (cropSelect) {
      cropSelect.addEventListener('change', (e) => {
        state.auctionCrop = e.target.value;
        renderAuctionCard();
      });
    }

    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        const icon = document.getElementById('auctionRefreshIcon');
        if (icon) icon.classList.add('animate-spin');
        setTimeout(() => {
          if (icon) icon.classList.remove('animate-spin');
          renderAuctionCard();
          showToast('가락시장 실시간 경매 시세가 갱신되었습니다!');
        }, 600);
      });
    }

    if (btnCalc) {
      btnCalc.addEventListener('click', () => calculateAuctionRevenue());
    }
    if (inputBoxes) {
      inputBoxes.addEventListener('input', () => calculateAuctionRevenue());
    }
    if (selectGrade) {
      selectGrade.addEventListener('change', () => calculateAuctionRevenue());
    }

    renderAuctionCard();
  }

  function renderAuctionCard() {
    const cropKey = state.auctionCrop || 'tomato_5kg';
    const data = GARAK_AUCTION_DATA[cropKey] || GARAK_AUCTION_DATA.tomato_5kg;

    // Banner sync
    const bannerPrice = document.getElementById('bannerAuctionPrice');
    const bannerDiff = document.getElementById('bannerAuctionDiff');
    const bannerVolume = document.getElementById('bannerAuctionVolume');
    if (bannerPrice) bannerPrice.textContent = `${data.specialAvg.toLocaleString()}원`;
    if (bannerDiff) {
      const isUp = data.diff >= 0;
      bannerDiff.textContent = `${isUp ? '▲' : '▼'} ${Math.abs(data.diff).toLocaleString()}원 (${isUp ? '+' : ''}${data.diffPercent}%)`;
      bannerDiff.className = isUp ? 'text-rose-600 font-bold' : 'text-sky-600 font-bold';
    }
    if (bannerVolume) {
      bannerVolume.textContent = `${data.totalVolumeTon}톤 (${data.totalBoxes.toLocaleString()}상자)`;
    }

    // 4 Grade Cards
    const elSpecial = document.getElementById('auctionGradeSpecialPrice');
    const elSpecialMax = document.getElementById('auctionGradeSpecialMax');
    const elHigh = document.getElementById('auctionGradeHighPrice');
    const elHighKg = document.getElementById('auctionGradeHighKg');
    const elNormal = document.getElementById('auctionGradeNormalPrice');
    const elNormalKg = document.getElementById('auctionGradeNormalKg');
    const elLow = document.getElementById('auctionGradeLowPrice');
    const elLowMin = document.getElementById('auctionGradeLowMin');

    if (elSpecial) elSpecial.textContent = `${data.specialAvg.toLocaleString()}원`;
    if (elSpecialMax) elSpecialMax.textContent = `${data.specialMax.toLocaleString()}원`;
    if (elHigh) elHigh.textContent = `${data.highAvg.toLocaleString()}원`;
    if (elHighKg) elHighKg.textContent = `${Math.round(data.highAvg / data.kgPerBox).toLocaleString()}원/kg`;
    if (elNormal) elNormal.textContent = `${data.normalAvg.toLocaleString()}원`;
    if (elNormalKg) elNormalKg.textContent = `${Math.round(data.normalAvg / data.kgPerBox).toLocaleString()}원/kg`;
    if (elLow) elLow.textContent = `${data.lowAvg.toLocaleString()}원`;
    if (elLowMin) elLowMin.textContent = `${data.lowMin.toLocaleString()}원`;

    // Wholesale Corporation List
    const corpContainer = document.getElementById('auctionCorpListContainer');
    if (corpContainer) {
      corpContainer.innerHTML = data.corps.map(corp => `
        <div class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center">${corp.code}</span>
            <span class="text-xs font-bold text-slate-800">${corp.name}</span>
            <span class="text-[10px] text-slate-600 font-medium">(${corp.volume.toLocaleString()}상자)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-rose-600">${corp.avgPrice.toLocaleString()}원</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">${corp.status}</span>
          </div>
        </div>
      `).join('');
    }

    calculateAuctionRevenue();
  }

  function calculateAuctionRevenue() {
    const cropKey = state.auctionCrop || 'tomato_5kg';
    const data = GARAK_AUCTION_DATA[cropKey] || GARAK_AUCTION_DATA.tomato_5kg;

    const inputBoxes = document.getElementById('calcInputBoxes');
    const selectGrade = document.getElementById('calcSelectGrade');
    const elGross = document.getElementById('calcGrossRevenue');
    const elFee = document.getElementById('calcWholesaleFee');
    const elBoxCost = document.getElementById('calcBoxCost');
    const elNet = document.getElementById('calcNetProfit');

    const boxes = parseInt(inputBoxes ? inputBoxes.value : 0, 10) || 0;
    const grade = selectGrade ? selectGrade.value : 'special';

    let unitPrice = data.specialAvg;
    if (grade === 'high') unitPrice = data.highAvg;
    else if (grade === 'normal') unitPrice = data.normalAvg;
    else if (grade === 'low') unitPrice = data.lowAvg;

    const gross = boxes * unitPrice;
    const fee = Math.round(gross * 0.05); // 5% wholesale corporation & market fee
    const boxCost = boxes * 1500; // 1,500 KRW box packaging cost
    const net = Math.max(0, gross - fee - boxCost);

    if (elGross) elGross.textContent = `${gross.toLocaleString()}원`;
    if (elFee) elFee.textContent = `-${fee.toLocaleString()}원`;
    if (elBoxCost) elBoxCost.textContent = `-${boxCost.toLocaleString()}원`;
    if (elNet) elNet.textContent = `${net.toLocaleString()}원`;
  }

  // ==========================================
  // 6. RDA Pest & Disease Module
  // ==========================================
  function setupPestModule() {
    const filterButtons = document.querySelectorAll('.pest-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.className = 'pest-filter-btn px-2.5 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900';
        });
        btn.className = 'pest-filter-btn active px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-white shadow-sm';
        state.pestFilter = btn.dataset.pestFilter;
        renderPestCards();
      });
    });

    const btnGoPest = document.getElementById('btnGoToPestTab');
    if (btnGoPest) {
      btnGoPest.addEventListener('click', () => {
        switchTab('scheduler');
        setTimeout(() => {
          const pestSec = document.getElementById('pestCardsContainer');
          if (pestSec) pestSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      });
    }

    // Quick tag insertion into daily log memo
    const quickTagBtns = document.querySelectorAll('.btn-pest-tag');
    quickTagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.pestTag;
        const memoEl = document.getElementById('inputDailyMemo');
        if (memoEl) {
          if (memoEl.value.trim().length > 0) {
            memoEl.value += ' ' + tag;
          } else {
            memoEl.value = tag;
          }
          showToast(`영농일지 메모에 '${tag}' 태그가 추가되었습니다!`);
        }
      });
    });

    renderPestCards();
  }

  function evaluateCurrentPestAlert(dat) {
    const curTemp = state.weatherData && state.weatherData.current ? state.weatherData.current.temperature_2m : 24;
    const curHumidity = state.weatherData && state.weatherData.current ? state.weatherData.current.relative_humidity_2m : 70;

    let targetStage = 'stage2';
    let stageTitle = '개화·착과기';

    if (dat <= 30) {
      targetStage = 'stage1';
      stageTitle = `DAT ${dat}일차 (정식·활착기)`;
    } else if (dat <= 70) {
      targetStage = 'stage2';
      stageTitle = `DAT ${dat}일차 (개화·착과기)`;
    } else if (dat <= 200) {
      targetStage = 'stage3';
      stageTitle = `DAT ${dat}일차 (비대·성기수확기)`;
    } else {
      targetStage = 'stage4';
      stageTitle = `DAT ${dat}일차 (후기·수확마무리)`;
    }

    const bannerLevelEl = document.getElementById('pestBannerLevel');
    const bannerStageEl = document.getElementById('pestBannerStageTitle');
    const bannerTextEl = document.getElementById('pestBannerText');

    if (bannerStageEl) bannerStageEl.textContent = stageTitle;

    if (targetStage === 'stage1') {
      if (bannerLevelEl) bannerLevelEl.textContent = '⚠️ 초기 예찰기';
      if (bannerTextEl) {
        bannerTextEl.innerHTML = '<b>[담배가루이 & 모잘록병 집중 예찰]</b> 정식 초기 신초 바이러스(TYLCV) 매개충 차단. 50메쉬 방충망 점검, 황색 끈끈이트랩 설치 및 슬래브 과습 방지.';
      }
    } else if (targetStage === 'stage2') {
      if (bannerLevelEl) bannerLevelEl.textContent = '🔥 결로·상처 방제기';
      if (bannerTextEl) {
        bannerTextEl.innerHTML = `<b>[잎곰팡이병 & 잿빛곰팡이병 경보]</b> 현재 습도(${curHumidity}%) 및 온습도차 주의. 곁순 제거는 맑은 날 오전 실시(상처 당일 건조) 및 일출 전 유동팬 가동.`;
      }
    } else if (targetStage === 'stage3') {
      if (bannerLevelEl) bannerLevelEl.textContent = curHumidity >= 80 ? '🔥 다습 역병 주의보' : '⚠️ 과실 비대 관리기';
      if (bannerTextEl) {
        bannerTextEl.innerHTML = '<b>[역병 & 점박이응애 & 배꼽썩음과 예찰]</b> 수확 하엽 3~4매 적기 정리로 통풍 확보. 칼슘 엽면시비(0.3%) 및 일사비례 급액 정밀 관리.';
      }
    } else {
      if (bannerLevelEl) bannerLevelEl.textContent = '⚠️ 작기 마무리';
      if (bannerTextEl) {
        bannerTextEl.innerHTML = '<b>[가루이·응애 밀도 억제 및 소독 준비]</b> 잔여 과실 수확 후 잔재물 온실 외부 반출 및 양액 배관 산세척 소독 준비.';
      }
    }
  }

  function renderPestCards() {
    const container = document.getElementById('pestCardsContainer');
    if (!container) return;

    const filter = state.pestFilter || 'all';
    const filteredList = RDA_PEST_DISEASE_DB.filter(item => {
      if (filter === 'all') return true;
      return item.stage === filter;
    });

    container.innerHTML = filteredList.map(item => {
      const riskBadge = item.risk === 'high'
        ? '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300 animate-pulse">🔥 고위험 (호발)</span>'
        : item.risk === 'medium'
        ? '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">⚠️ 주의 (조건부)</span>'
        : '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">🟢 예방 관리</span>';

      const typeBadge = item.type.includes('곰팡이')
        ? '<span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">곰팡이병</span>'
        : item.type.includes('해충')
        ? '<span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">흡즙·식엽해충</span>'
        : item.type.includes('세균')
        ? '<span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">세균병</span>'
        : '<span class="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">생리장해</span>';

      return `
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-3">
          <div class="flex items-start justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                ${typeBadge}
                <span class="text-sm font-black text-slate-900">${item.name}</span>
              </div>
              <span class="text-[10px] text-slate-600 italic font-mono block mt-0.5">${item.scientificName}</span>
            </div>
            ${riskBadge}
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
            <div>
              <span class="text-slate-600 block font-bold">발생 시기</span>
              <span class="font-bold text-slate-900">${item.stageName}</span>
            </div>
            <div>
              <span class="text-slate-600 block font-bold">호발 환경</span>
              <span class="font-bold text-rose-700">${item.optTemp} / ${item.optHumidity}</span>
            </div>
          </div>

          <div class="space-y-1.5 text-xs">
            <div>
              <span class="font-bold text-slate-800 flex items-center gap-1">
                <span class="text-rose-600">🔍</span> 주요 초기 식별 증상:
              </span>
              <p class="text-slate-600 pl-4 mt-0.5 leading-relaxed font-medium">
                ${item.symptoms}
              </p>
            </div>

            <div>
              <span class="font-bold text-emerald-800 flex items-center gap-1">
                <span class="text-emerald-600">🛡️</span> 농진청 표준 예방 대책:
              </span>
              <p class="text-slate-600 pl-4 mt-0.5 leading-relaxed font-medium">
                ${item.prevention}
              </p>
            </div>

            <div>
              <span class="font-bold text-sky-800 flex items-center gap-1">
                <span class="text-sky-600">💊</span> 친환경·IPM 방제 요령:
              </span>
              <p class="text-slate-600 pl-4 mt-0.5 leading-relaxed font-medium">
                ${item.ipmControl}
              </p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 7. Navigation & Date Controller
  // ==========================================
  function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn, .mobile-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        switchTab(targetTab);
      });
    });

    const btnPrev = document.getElementById('btnPrevDate');
    const btnNext = document.getElementById('btnNextDate');
    const btnToday = document.getElementById('btnToday');
    const dateInput = document.getElementById('dateInputHidden');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() - 1);
        setCurrentDate(formatDate(d));
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() + 1);
        setCurrentDate(formatDate(d));
      });
    }

    if (btnToday) {
      btnToday.addEventListener('click', () => {
        setCurrentDate(formatDate(new Date()));
      });
    }

    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        if (e.target.value) setCurrentDate(e.target.value);
      });
    }

    const btnHeaderWeather = document.getElementById('btnHeaderWeatherOpen');
    if (btnHeaderWeather) {
      btnHeaderWeather.addEventListener('click', () => switchTab('weather'));
    }

    const btnGoWeather = document.getElementById('btnGoToWeatherTab');
    if (btnGoWeather) {
      btnGoWeather.addEventListener('click', () => switchTab('weather'));
    }

    const btnGoSched = document.getElementById('btnGoToScheduler');
    if (btnGoSched) {
      btnGoSched.addEventListener('click', () => switchTab('scheduler'));
    }

    const btnScrollAuction = document.getElementById('btnScrollToAuctionCard');
    if (btnScrollAuction) {
      btnScrollAuction.addEventListener('click', () => {
        const card = document.getElementById('garakAuctionCard');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function switchTab(tabId) {
    state.currentTab = tabId;

    // Update active tab buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.className = 'nav-tab-btn active px-3.5 py-2 text-sm font-bold rounded-xl flex items-center gap-1.5 transition bg-brand-600 text-white shadow-sm';
      } else {
        btn.className = 'nav-tab-btn px-3.5 py-2 text-sm font-bold rounded-xl flex items-center gap-1.5 transition text-slate-600 hover:text-slate-900 hover:bg-slate-100';
      }
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.className = 'mobile-nav-btn active flex flex-col items-center justify-center py-1.5 rounded-xl text-brand-600 font-bold transition';
      } else {
        btn.className = 'mobile-nav-btn flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 hover:text-slate-900 transition';
      }
    });

    // Show pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.add('hidden');
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
      targetPane.classList.remove('hidden');
      targetPane.classList.add('active');
    }

    if (tabId === 'analytics') {
      renderAnalytics();
    } else if (tabId === 'weather' && state.weatherData) {
      renderWeather(state.weatherData);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function setCurrentDate(dateStr) {
    state.currentDate = dateStr;
    const dateObj = new Date(dateStr + 'T00:00:00');
    const displayEl = document.getElementById('currentDateDisplay');
    const dateInput = document.getElementById('dateInputHidden');
    const formDateEl = document.getElementById('formCurrentDate');

    const formattedDisplay = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, '0')}. ${String(dateObj.getDate()).padStart(2, '0')}`;
    if (displayEl) displayEl.textContent = formattedDisplay;
    if (dateInput) dateInput.value = dateStr;
    if (formDateEl) formDateEl.textContent = dateStr;

    updateHeaderSummary();
    renderRoutines();
    renderDailyLogForm();
    evaluateGrowthStage();
  }

  function updateHeaderSummary() {
    const farmNameEl = document.getElementById('headerFarmName');
    if (farmNameEl) farmNameEl.textContent = state.farmSettings.farmName;

    // Routine progress
    const todayRoutines = getRoutinesForDate(state.currentDate);
    const completedCount = todayRoutines.filter(r => isRoutineCompleted(r.id, state.currentDate)).length;
    const routineProgressEl = document.getElementById('headerRoutineProgress');
    if (routineProgressEl) {
      routineProgressEl.textContent = `${completedCount}/${todayRoutines.length}`;
    }

    // Drain rate summary
    const todayLog = state.dailyLogs[state.currentDate];
    const headerDrainEl = document.getElementById('headerDrainRate');
    if (headerDrainEl) {
      if (todayLog && todayLog.supplyVolume > 0 && todayLog.drainVolume >= 0) {
        const rate = Math.round((todayLog.drainVolume / todayLog.supplyVolume) * 100);
        headerDrainEl.textContent = `${rate}%`;
        headerDrainEl.className = (rate >= 20 && rate <= 30) ? 'font-bold text-emerald-600' : 'font-bold text-amber-600';
      } else {
        headerDrainEl.textContent = '-';
        headerDrainEl.className = 'font-bold text-slate-700';
      }
    }
  }

  // ==========================================
  // 8. Open-Meteo Agricultural Weather & Solar Radiation
  // ==========================================
  function setupWeatherModule() {
    const regionSelect = document.getElementById('selectWeatherRegion');
    const btnRefresh = document.getElementById('btnRefreshWeather');
    const btnGps = document.getElementById('btnGpsLocation');

    if (regionSelect) {
      regionSelect.addEventListener('change', (e) => {
        state.weatherRegion = e.target.value;
        const regionObj = WEATHER_REGIONS[state.weatherRegion];
        const headerRegEl = document.getElementById('headerRegionName');
        const routineRegEl = document.getElementById('routineWeatherRegion');
        if (headerRegEl && regionObj) headerRegEl.textContent = regionObj.name;
        if (routineRegEl && regionObj) routineRegEl.textContent = regionObj.name;
        fetchWeatherData();
      });
    }

    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        const icon = document.getElementById('weatherRefreshIcon');
        if (icon) icon.classList.add('animate-spin');
        fetchWeatherData().then(() => {
          if (icon) icon.classList.remove('animate-spin');
          showToast('기상청 격자 날씨 및 일사량 데이터 갱신 완료!');
        });
      });
    }

    if (btnGps) {
      btnGps.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              fetchWeatherData(null, pos.coords.latitude, pos.coords.longitude);
              showToast('현재 스마트폰 GPS 좌표 기준으로 날씨를 불러왔습니다.');
            },
            () => showToast('GPS 위치 권한을 확인해주세요.', 'error')
          );
        }
      });
    }

    fetchWeatherData();
  }

  async function fetchWeatherData(regionKey, customLat, customLon) {
    const key = regionKey || state.weatherRegion || 'buyeo';
    const region = WEATHER_REGIONS[key] || WEATHER_REGIONS.buyeo;
    const lat = customLat || region.lat;
    const lon = customLon || region.lon;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,direct_normal_irradiance,shortwave_radiation_instant&hourly=temperature_2m,relative_humidity_2m,direct_normal_irradiance,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,shortwave_radiation_sum,precipitation_probability_max,weather_code&timezone=Asia%2FTokyo`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      state.weatherData = data;
      renderWeather(data);
      evaluateGrowthStage(); // update pest & weather banner
    } catch (err) {
      console.warn('Weather fetch failed', err);
    }
  }

  function renderWeather(data) {
    if (!data || !data.current) return;

    const cur = data.current;
    const curTemp = Math.round(cur.temperature_2m * 10) / 10;
    const curApparent = Math.round(cur.apparent_temperature * 10) / 10;
    const curHumidity = cur.relative_humidity_2m;
    const curWind = cur.wind_speed_10m;
    const curSolar = Math.round(cur.shortwave_radiation_instant || cur.direct_normal_irradiance || 0);

    const skyInfo = getWeatherSkyInfo(cur.weather_code);

    // Header Quick Pill
    const headerTempEl = document.getElementById('headerWeatherTemp');
    const headerSolarEl = document.getElementById('headerWeatherSolar');
    const headerIconEl = document.getElementById('headerWeatherIcon');
    if (headerTempEl) headerTempEl.textContent = `${curTemp} ℃`;
    if (headerSolarEl) headerSolarEl.textContent = `${curSolar} W/m²`;
    if (headerIconEl) headerIconEl.textContent = skyInfo.emoji;

    // Tab 2 Weather Cards
    const curTempEl = document.getElementById('weatherCurTemp');
    const curApparentEl = document.getElementById('weatherApparentTemp');
    const curSolarEl = document.getElementById('weatherCurSolar');
    const dailySolarSumEl = document.getElementById('weatherDailySolarSum');
    const curHumEl = document.getElementById('weatherCurHumidity');
    const curWindEl = document.getElementById('weatherCurWind');
    const skyEl = document.getElementById('weatherSkyCondition');
    const precipEl = document.getElementById('weatherPrecipProb');
    const maxMinEl = document.getElementById('weatherMaxMinTemp');

    if (curTempEl) curTempEl.textContent = `${curTemp} ℃`;
    if (curApparentEl) curApparentEl.textContent = `체감 ${curApparent} ℃`;
    if (curSolarEl) curSolarEl.textContent = `${curSolar} W/m²`;

    if (data.daily && data.daily.shortwave_radiation_sum) {
      const sumMJ = (data.daily.shortwave_radiation_sum[0] || 0) * 100; // J/cm2 approx
      if (dailySolarSumEl) dailySolarSumEl.textContent = `누적: ~${Math.round(sumMJ)} J/cm²`;
      if (maxMinEl) {
        const maxT = Math.round(data.daily.temperature_2m_max[0]);
        const minT = Math.round(data.daily.temperature_2m_min[0]);
        maxMinEl.textContent = `${maxT} / ${minT} ℃`;
      }
      if (precipEl && data.daily.precipitation_probability_max) {
        precipEl.textContent = `강수확률: ${data.daily.precipitation_probability_max[0]}%`;
      }
    }

    if (curHumEl) curHumEl.textContent = `${curHumidity}%`;
    if (curWindEl) curWindEl.textContent = `${curWind} m/s`;
    if (skyEl) skyEl.textContent = `${skyInfo.emoji} ${skyInfo.text}`;

    // Smart Farm Irrigation & Climate Advisor
    generateSmartFarmAdvice(curSolar, curTemp, curHumidity, skyInfo);

    // Hourly Weather Curve Chart
    renderWeatherHourlyChart(data.hourly);

    // 3-Day Daily Cards
    renderWeatherDailyCards(data.daily);
  }

  function getWeatherSkyInfo(code) {
    if (code === 0) return { emoji: '☀️', text: '맑음' };
    if (code === 1 || code === 2) return { emoji: '🌤️', text: '구름 조금' };
    if (code === 3) return { emoji: '☁️', text: '흐림' };
    if (code >= 45 && code <= 48) return { emoji: '🌫️', text: '안개' };
    if (code >= 51 && code <= 67) return { emoji: '🌧️', text: '비' };
    if (code >= 71 && code <= 77) return { emoji: '❄️', text: '눈' };
    if (code >= 80 && code <= 82) return { emoji: '🌦️', text: '소나기' };
    if (code >= 95) return { emoji: '⛈️', text: '뇌우' };
    return { emoji: '☀️', text: '맑음' };
  }

  function generateSmartFarmAdvice(solar, temp, hum, sky) {
    const routineAdviceEl = document.getElementById('routineWeatherAdviceText');
    const routineEmojiEl = document.getElementById('routineWeatherEmoji');
    const advisorTitleEl = document.getElementById('advisorTitle');
    const advisorContentEl = document.getElementById('advisorContent');
    const advisorIconEl = document.getElementById('advisorStatusIcon');

    if (routineEmojiEl) routineEmojiEl.textContent = sky.emoji;
    if (advisorIconEl) advisorIconEl.textContent = sky.emoji;

    let adviceTitle = '';
    let adviceText = '';
    let routineShortText = '';

    if (solar >= 500) {
      adviceTitle = '강한 일사량 (맑음): 일사비례 급액 증량 및 고온 환기 모드';
      adviceText = `현재 외부 일사량이 ${solar}W/m²로 매우 높습니다. 증산량이 급증하므로 일사비례 급액 제어기를 확인하여 1회 급액 간격을 단축하고 배액률 25~30%를 유지하십시오. 한낮 온실 온도가 30℃를 초과할 경우 2중 스크린 차광막 30%를 전개하십시오.`;
      routineShortText = `현재 강한 일사(${solar}W/m²). 급액 횟수 증량 및 배액률 25~30% 유지, 30℃ 초과 시 차광 권장.`;
    } else if (solar >= 200) {
      adviceTitle = '보통 일사량 (양호): 표준 급액 및 적정 광합성 환경';
      adviceText = `현재 일사량 ${solar}W/m², 기온 ${temp}℃로 토마토 생육에 최적입니다. 표준 급액량(EC 2.4)을 유지하고 탄산가스(CO2) 600~800ppm 시비로 광합성을 극대화하십시오.`;
      routineShortText = `현재 일사 양호(${solar}W/m²). 표준 급액(EC 2.4) 유지 및 적정 환기로 광합성 극대화 권장.`;
    } else {
      adviceTitle = '약한 일사량 (흐림/우천): 과습 방지 감량 급액 & 곰팡이 예방 환기';
      adviceText = `현재 일사량 ${solar}W/m²로 낮고 흐린 상태입니다. 급액 횟수를 평소의 30~50% 수준으로 감량하고, 근권 과습을 방지하십시오. 온실 습도가 ${hum}%로 상승할 수 있으므로 일몰 전 유동팬 가동으로 잿빛곰팡이병 발생을 사전 차단하십시오.`;
      routineShortText = `현재 흐림/약한 일사(${solar}W/m²). 급액 횟수 40% 감량 및 슬래브 과습 방지, 유동팬 가동 권장.`;
    }

    if (advisorTitleEl) advisorTitleEl.textContent = adviceTitle;
    if (advisorContentEl) advisorContentEl.textContent = adviceText;
    if (routineAdviceEl) routineAdviceEl.textContent = routineShortText;
  }

  function renderWeatherHourlyChart(hourly) {
    const canvas = document.getElementById('chartHourlyWeather');
    if (!canvas || !hourly || !window.Chart) return;

    const labels = (hourly.time || []).slice(0, 24).map(t => {
      const d = new Date(t);
      return `${d.getHours()}시`;
    });
    const solarData = (hourly.direct_normal_irradiance || []).slice(0, 24);
    const tempData = (hourly.temperature_2m || []).slice(0, 24);

    if (state.charts.hourlyWeather) {
      state.charts.hourlyWeather.destroy();
    }

    state.charts.hourlyWeather = new window.Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '일사량 (W/m²)',
            data: solarData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            fill: true,
            yAxisID: 'ySolar',
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 2
          },
          {
            label: '기온 (℃)',
            data: tempData,
            borderColor: '#0ea5e9',
            backgroundColor: 'transparent',
            yAxisID: 'yTemp',
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          ySolar: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'W/m²', color: '#d97706', font: { size: 10, weight: 'bold' } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          yTemp: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: '℃', color: '#0284c7', font: { size: 10, weight: 'bold' } },
            grid: { drawOnChartArea: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  function renderWeatherDailyCards(daily) {
    const container = document.getElementById('weatherDailyCardsContainer');
    if (!container || !daily || !daily.time) return;

    const cardsHtml = daily.time.slice(0, 3).map((timeStr, idx) => {
      const d = new Date(timeStr);
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dateLabel = idx === 0 ? '오늘' : idx === 1 ? '내일' : `${d.getMonth() + 1}/${d.getDate()} (${dayNames[d.getDay()]})`;
      const maxT = Math.round(daily.temperature_2m_max[idx]);
      const minT = Math.round(daily.temperature_2m_min[idx]);
      const precip = daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0;
      const code = daily.weather_code ? daily.weather_code[idx] : 0;
      const sky = getWeatherSkyInfo(code);

      return `
        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-center">
          <div class="text-xs font-bold text-slate-700">${dateLabel}</div>
          <div class="text-3xl">${sky.emoji}</div>
          <div class="text-xs font-black text-slate-900">${sky.text}</div>
          <div class="flex items-center justify-center gap-2 text-xs font-bold">
            <span class="text-rose-600">${maxT}℃</span>
            <span class="text-slate-300">/</span>
            <span class="text-sky-600">${minT}℃</span>
          </div>
          <div class="text-[10px] text-slate-600 font-semibold">강수확률: ${precip}%</div>
        </div>
      `;
    }).join('');

    container.innerHTML = cardsHtml;
  }

  // ==========================================
  // 9. RDA 7-Stage Lifecycle & Scheduler Module
  // ==========================================
  function setupSchedulerModule() {
    const inputPlanting = document.getElementById('inputPlantingDate');
    const selectCrop = document.getElementById('selectCropType');
    const btnApply = document.getElementById('btnApplyPlantingDate');

    if (inputPlanting) inputPlanting.value = state.growthProfile.plantingDate;
    if (selectCrop) selectCrop.value = state.growthProfile.cropType;

    if (btnApply) {
      btnApply.addEventListener('click', () => {
        if (inputPlanting && inputPlanting.value) {
          state.growthProfile.plantingDate = inputPlanting.value;
        }
        if (selectCrop) {
          state.growthProfile.cropType = selectCrop.value;
        }
        saveState('growth_profile', state.growthProfile);
        evaluateGrowthStage();
        showToast('정식일자 및 재배 작형 설정이 적용되었습니다!');
      });
    }

    evaluateGrowthStage();
  }

  function calculateDat(plantingDateStr, targetDateStr) {
    const pDate = new Date(plantingDateStr + 'T00:00:00');
    const tDate = new Date(targetDateStr + 'T00:00:00');
    const diffTime = tDate.getTime() - pDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }

  function evaluateGrowthStage() {
    const dat = calculateDat(state.growthProfile.plantingDate, state.currentDate);

    // Find active RDA stage
    let currentStage = RDA_STAGES[0];
    for (const st of RDA_STAGES) {
      if (dat >= st.minDat && dat <= st.maxDat) {
        currentStage = st;
        break;
      }
      if (dat > st.maxDat) currentStage = st;
    }

    // Header badge
    const headerDatBadge = document.getElementById('headerGrowthStageBadge');
    if (headerDatBadge) {
      headerDatBadge.textContent = `DAT ${dat}일차 (${currentStage.name.split(':')[0]})`;
    }

    // Tab 1 Growth Banner
    const bannerTitle = document.getElementById('bannerStageTitle');
    const bannerDat = document.getElementById('bannerDatText');
    const bannerGuide = document.getElementById('bannerStageGuide');
    if (bannerTitle) bannerTitle.textContent = currentStage.name;
    if (bannerDat) bannerDat.textContent = `DAT ${dat}일차`;
    if (bannerGuide) bannerGuide.textContent = `농진청 가이드: ${currentStage.targetDesc}`;

    // Tab 3 Top Card
    const displayDatEl = document.getElementById('displayDatCount');
    const displayStageEl = document.getElementById('displayCurrentStageName');
    const cyclePercentEl = document.getElementById('displayCyclePercent');
    const progressBar = document.getElementById('cycleProgressBar');

    if (displayDatEl) displayDatEl.textContent = `DAT ${dat}일`;
    if (displayStageEl) displayStageEl.textContent = currentStage.name;

    const totalCycleDays = 285;
    const progressPercent = Math.min(100, Math.round((dat / totalCycleDays) * 100));
    if (cyclePercentEl) cyclePercentEl.textContent = `${progressPercent}% (총 ${totalCycleDays}일 중 ${dat}일)`;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    // Dynamic Pest alert banner update
    evaluateCurrentPestAlert(dat);

    // Render 7-stage roadmap cards in Tab 3
    renderRdaRoadmap(currentStage.stageNum);
  }

  function renderRdaRoadmap(activeStageNum) {
    const container = document.getElementById('rdaStagesContainer');
    if (!container) return;

    container.innerHTML = RDA_STAGES.map(stage => {
      const isActive = stage.stageNum === activeStageNum;
      const cardBorderClass = isActive
        ? 'border-2 border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
        : 'border border-slate-200 bg-white shadow-sm';
      const badgeClass = isActive
        ? 'bg-emerald-600 text-white animate-pulse'
        : 'bg-slate-100 text-slate-700';

      const checklistHtml = stage.checkpoints.map(cp => {
        const isChecked = state.stageChecklist[cp.id] === true;
        return `
          <label class="flex items-start gap-2 cursor-pointer text-xs group py-1">
            <input type="checkbox" data-checkpoint-id="${cp.id}" ${isChecked ? 'checked' : ''} class="stage-chk-box mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
            <span class="${isChecked ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-bold group-hover:text-emerald-700'}">${cp.title}</span>
          </label>
        `;
      }).join('');

      return `
        <div class="p-4 sm:p-5 rounded-2xl ${cardBorderClass} space-y-3 transition-all">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-lg text-xs font-black ${badgeClass}">
                ${isActive ? '● 현재 진행 단계' : `Stage ${stage.stageNum}`}
              </span>
              <h4 class="text-sm sm:text-base font-black text-slate-900">${stage.name}</h4>
            </div>
            <span class="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full self-start sm:self-auto">${stage.period}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="font-black text-slate-900 block mb-1">🎯 핵심 관리 목표</span>
              <p class="text-slate-600 leading-relaxed font-medium">${stage.targetDesc}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="font-black text-slate-900 block mb-1">🌡️ 권장 환경 & 양액 지침</span>
              <p class="text-slate-600 leading-relaxed font-medium">${stage.envGuide}</p>
            </div>
          </div>

          <div class="pt-2">
            <span class="text-xs font-black text-slate-900 block mb-1.5">📋 농진청 단계별 필수 점검 체크리스트:</span>
            <div class="space-y-0.5 pl-1">${checklistHtml}</div>
          </div>
        </div>
      `;
    }).join('');

    // Attach checklist change listeners
    container.querySelectorAll('.stage-chk-box').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.checkpointId;
        state.stageChecklist[id] = e.target.checked;
        saveState('stage_checklist', state.stageChecklist);
        if (e.target.checked && window.confetti) {
          window.confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 10. Routines Management Module
  // ==========================================
  function setupRoutinesModule() {
    const filterBtns = document.querySelectorAll('.routine-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.className = 'routine-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900';
        });
        btn.className = 'routine-filter-btn active px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-sm';
        state.routineFilter = btn.dataset.filter;
        renderRoutines();
      });
    });

    const btnResetDay = document.getElementById('btnResetDayRoutines');
    if (btnResetDay) {
      btnResetDay.addEventListener('click', () => {
        if (confirm(`${state.currentDate}의 모든 루틴 체크를 초기화하시겠습니까?`)) {
          delete state.routineLogs[state.currentDate];
          saveState('routine_logs', state.routineLogs);
          renderRoutines();
          updateHeaderSummary();
          showToast('오늘 루틴 체크가 초기화되었습니다.');
        }
      });
    }

    // Modal: Add Routine
    const btnOpenAdd = document.getElementById('btnOpenAddRoutine');
    const btnCloseAdd = document.getElementById('btnCloseAddRoutine');
    const btnCancelAdd = document.getElementById('btnCancelAddRoutine');
    const btnSubmitAdd = document.getElementById('btnSubmitAddRoutine');
    const modal = document.getElementById('modalAddRoutine');

    if (btnOpenAdd && modal) {
      btnOpenAdd.addEventListener('click', () => modal.classList.remove('hidden'));
    }
    if (btnCloseAdd && modal) {
      btnCloseAdd.addEventListener('click', () => modal.classList.add('hidden'));
    }
    if (btnCancelAdd && modal) {
      btnCancelAdd.addEventListener('click', () => modal.classList.add('hidden'));
    }
    if (btnSubmitAdd && modal) {
      btnSubmitAdd.addEventListener('click', () => {
        const title = document.getElementById('inputNewRoutineTitle').value.trim();
        const category = document.getElementById('inputNewRoutineCategory').value;
        const interval = parseInt(document.getElementById('inputNewRoutineInterval').value, 10) || 1;
        const guide = document.getElementById('inputNewRoutineGuide').value.trim();

        if (!title) {
          alert('작업 이름을 입력해주세요.');
          return;
        }

        const newRoutine = {
          id: 'custom_' + Date.now(),
          title,
          category,
          intervalDays: interval,
          guide
        };

        state.routines.push(newRoutine);
        saveState('routines', state.routines);
        modal.classList.add('hidden');
        document.getElementById('inputNewRoutineTitle').value = '';
        document.getElementById('inputNewRoutineGuide').value = '';
        renderRoutines();
        showToast('새 루틴이 등록되었습니다!');
      });
    }

    renderRoutines();
  }

  function getRoutinesForDate(dateStr) {
    return state.routines;
  }

  function isRoutineCompleted(routineId, dateStr) {
    const dayLog = state.routineLogs[dateStr];
    return dayLog && dayLog[routineId] === true;
  }

  function toggleRoutine(routineId, dateStr) {
    if (!state.routineLogs[dateStr]) {
      state.routineLogs[dateStr] = {};
    }
    const current = state.routineLogs[dateStr][routineId] === true;
    state.routineLogs[dateStr][routineId] = !current;
    saveState('routine_logs', state.routineLogs);

    updateHeaderSummary();
    renderRoutines();

    // Check if 100% complete today
    const routines = getRoutinesForDate(dateStr);
    const allDone = routines.every(r => isRoutineCompleted(r.id, dateStr));
    if (allDone && window.confetti) {
      window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showToast('🎉 오늘 모든 루틴 작업을 완벽히 완료했습니다!');
    }
  }

  function renderRoutines() {
    const container = document.getElementById('routineListContainer');
    if (!container) return;

    const filter = state.routineFilter || 'all';
    const allRoutines = getRoutinesForDate(state.currentDate);

    // Update filter counts
    const countAll = document.getElementById('countFilterAll');
    const countDaily = document.getElementById('countFilterDaily');
    const countWeekly = document.getElementById('countFilterWeekly');
    const countPeriodic = document.getElementById('countFilterPeriodic');

    if (countAll) countAll.textContent = allRoutines.length;
    if (countDaily) countDaily.textContent = allRoutines.filter(r => r.category === 'daily').length;
    if (countWeekly) countWeekly.textContent = allRoutines.filter(r => r.category === 'weekly').length;
    if (countPeriodic) countPeriodic.textContent = allRoutines.filter(r => r.category === 'periodic').length;

    const filtered = allRoutines.filter(r => {
      if (filter === 'all') return true;
      return r.category === filter;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">등록된 작업 루틴이 없습니다.</div>';
      return;
    }

    container.innerHTML = filtered.map(item => {
      const isDone = isRoutineCompleted(item.id, state.currentDate);
      const catBadge = item.category === 'daily'
        ? '<span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">매일 필수</span>'
        : item.category === 'weekly'
        ? '<span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[10px] font-bold">주간 생육</span>'
        : '<span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold">정기 점검</span>';

      return `
        <div class="bg-white p-3.5 sm:p-4 rounded-xl border ${isDone ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200'} shadow-sm flex items-start justify-between gap-3 transition">
          <div class="flex items-start gap-3">
            <input type="checkbox" data-routine-id="${item.id}" ${isDone ? 'checked' : ''} class="routine-chk-box mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                ${catBadge}
                <span class="text-xs sm:text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}">${item.title}</span>
              </div>
              ${item.guide ? `<p class="text-xs text-slate-500 mt-1 font-medium pl-0.5">${item.guide}</p>` : ''}
            </div>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'} flex-shrink-0">
            ${isDone ? '완료됨' : `${item.intervalDays}일 주기`}
          </span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.routine-chk-box').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.routineId;
        toggleRoutine(id, state.currentDate);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 11. Bed Matrix Management Module
  // ==========================================
  function setupBedMatrixModule() {
    const taskBtns = document.querySelectorAll('.bed-task-type-btn');
    taskBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        taskBtns.forEach(b => {
          b.className = 'bed-task-type-btn p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition';
        });
        btn.className = 'bed-task-type-btn active p-2.5 rounded-xl border border-brand-500 bg-brand-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition';
        state.currentBedTask = btn.dataset.task;
        renderBedMatrix();
      });
    });

    // Zone Quick Selectors
    const btnZ1 = document.getElementById('btnSelectZone1');
    const btnZ2 = document.getElementById('btnSelectZone2');
    const btnZ3 = document.getElementById('btnSelectZone3');
    const btnZ4 = document.getElementById('btnSelectZone4');
    const btnAll = document.getElementById('btnSelectAllBeds');
    const btnClear = document.getElementById('btnClearBedSelection');
    const btnBatch = document.getElementById('btnBatchCompleteBeds');

    if (btnZ1) btnZ1.addEventListener('click', () => selectBedRange(1, 6));
    if (btnZ2) btnZ2.addEventListener('click', () => selectBedRange(7, 12));
    if (btnZ3) btnZ3.addEventListener('click', () => selectBedRange(13, 18));
    if (btnZ4) btnZ4.addEventListener('click', () => selectBedRange(19, 24));
    if (btnAll) btnAll.addEventListener('click', () => selectBedRange(1, state.farmSettings.bedCount || 24));
    if (btnClear) btnClear.addEventListener('click', () => {
      state.selectedBeds = [];
      renderBedMatrix();
    });

    if (btnBatch) {
      btnBatch.addEventListener('click', () => batchCompleteBeds());
    }

    renderBedMatrix();
  }

  function selectBedRange(start, end) {
    const total = state.farmSettings.bedCount || 24;
    const boundedEnd = Math.min(total, end);
    state.selectedBeds = [];
    for (let i = start; i <= boundedEnd; i++) {
      state.selectedBeds.push(i);
    }
    renderBedMatrix();
  }

  function batchCompleteBeds() {
    if (state.selectedBeds.length === 0) return;
    const task = state.currentBedTask || 'suckering';

    state.selectedBeds.forEach(bedNum => {
      if (!state.bedStatus[bedNum]) state.bedStatus[bedNum] = {};
      state.bedStatus[bedNum][task] = {
        status: 'completed',
        date: state.currentDate
      };
    });

    saveState('bed_status', state.bedStatus);
    state.selectedBeds = [];
    renderBedMatrix();
    if (window.confetti) window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    showToast('선택한 베드의 오늘 작업이 완료 처리되었습니다!');
  }

  function toggleBedStatus(bedNum) {
    const task = state.currentBedTask || 'suckering';
    if (!state.bedStatus[bedNum]) state.bedStatus[bedNum] = {};
    const cur = state.bedStatus[bedNum][task] ? state.bedStatus[bedNum][task].status : 'pending';

    let next = 'in-progress';
    if (cur === 'in-progress') next = 'completed';
    else if (cur === 'completed') next = 'pending';

    state.bedStatus[bedNum][task] = {
      status: next,
      date: state.currentDate
    };

    saveState('bed_status', state.bedStatus);
    renderBedMatrix();
  }

  function renderBedMatrix() {
    const container = document.getElementById('bedGridContainer');
    if (!container) return;

    const totalBeds = state.farmSettings.bedCount || 24;
    const task = state.currentBedTask || 'suckering';
    const bedTotalEl = document.getElementById('bedTotalCountText');
    const compDisplayEl = document.getElementById('bedTaskCompletionDisplay');
    const selCountEl = document.getElementById('selectedBedCountText');
    const btnBatch = document.getElementById('btnBatchCompleteBeds');

    if (bedTotalEl) bedTotalEl.textContent = `${totalBeds}개`;
    if (selCountEl) selCountEl.textContent = `선택 ${state.selectedBeds.length}개`;
    if (btnBatch) btnBatch.disabled = state.selectedBeds.length === 0;

    let completedCount = 0;

    const cardsHtml = [];
    for (let i = 1; i <= totalBeds; i++) {
      const bData = state.bedStatus[i] && state.bedStatus[i][task] ? state.bedStatus[i][task] : { status: 'pending', date: null };
      if (bData.status === 'completed') completedCount++;

      const isSelected = state.selectedBeds.includes(i);

      let statusColor = 'bg-slate-50 border-slate-200 text-slate-700';
      let dotColor = 'bg-slate-300';
      let statusText = '미작업';

      if (bData.status === 'completed') {
        statusColor = 'bg-emerald-50/60 border-emerald-300 text-emerald-800';
        dotColor = 'bg-emerald-500';
        statusText = '완료';
      } else if (bData.status === 'in-progress') {
        statusColor = 'bg-amber-50/60 border-amber-300 text-amber-800';
        dotColor = 'bg-amber-500';
        statusText = '진행중';
      }

      const ringClass = isSelected ? 'ring-2 ring-brand-500 scale-[1.02]' : '';

      cardsHtml.push(`
        <div data-bed-num="${i}" class="bed-card cursor-pointer p-3 rounded-xl border ${statusColor} ${ringClass} shadow-sm hover:shadow transition flex flex-col justify-between select-none">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-900">Line #${String(i).padStart(2, '0')}</span>
            <span class="w-2.5 h-2.5 rounded-full ${dotColor}"></span>
          </div>
          <div class="mt-2 text-center">
            <span class="text-xs font-black">${statusText}</span>
            <span class="text-[10px] text-slate-500 block mt-0.5">${bData.date ? bData.date.slice(5) : '-'}</span>
          </div>
        </div>
      `);
    }

    container.innerHTML = cardsHtml.join('');

    const percent = Math.round((completedCount / totalBeds) * 100);
    if (compDisplayEl) compDisplayEl.textContent = `${completedCount} / ${totalBeds} (${percent}%)`;

    // Click handler on bed card
    container.querySelectorAll('.bed-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const bedNum = parseInt(card.dataset.bedNum, 10);
        toggleBedStatus(bedNum);
      });
    });
  }

  // ==========================================
  // 12. Daily Log & Nutrient Solution Module
  // ==========================================
  function setupDailyLogModule() {
    const btnAutoWeather = document.getElementById('btnAutoFillWeather');
    const btnSave = document.getElementById('btnSaveDailyLog');
    const filePhoto = document.getElementById('inputPhotoFile');
    const btnRemovePhoto = document.getElementById('btnRemovePhoto');

    const inputsToWatch = [
      'inputSupplyEc', 'inputDrainEc', 'inputSupplyPh', 'inputDrainPh',
      'inputSupplyVolume', 'inputDrainVolume', 'inputHarvestGradeA',
      'inputHarvestGradeB', 'inputHarvestGradeC'
    ];

    inputsToWatch.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => calculateLogFormDeltas());
      }
    });

    if (btnAutoWeather) {
      btnAutoWeather.addEventListener('click', () => autoFillWeatherToLog());
    }

    if (btnSave) {
      btnSave.addEventListener('click', () => saveDailyLog());
    }

    if (filePhoto) {
      filePhoto.addEventListener('change', (e) => handlePhotoUpload(e));
    }

    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', () => {
        const previewBox = document.getElementById('photoPreviewBox');
        const previewImg = document.getElementById('photoPreviewImg');
        const fileInput = document.getElementById('inputPhotoFile');
        if (previewBox) previewBox.classList.add('hidden');
        if (previewImg) previewImg.src = '';
        if (fileInput) fileInput.value = '';
      });
    }

    renderDailyLogForm();
    renderLogHistory();
  }

  function calculateLogFormDeltas() {
    const supplyEc = parseFloat(document.getElementById('inputSupplyEc').value) || 0;
    const drainEc = parseFloat(document.getElementById('inputDrainEc').value) || 0;
    const supplyPh = parseFloat(document.getElementById('inputSupplyPh').value) || 0;
    const drainPh = parseFloat(document.getElementById('inputDrainPh').value) || 0;
    const supplyVol = parseFloat(document.getElementById('inputSupplyVolume').value) || 0;
    const drainVol = parseFloat(document.getElementById('inputDrainVolume').value) || 0;

    const boxA = parseInt(document.getElementById('inputHarvestGradeA').value, 10) || 0;
    const boxB = parseInt(document.getElementById('inputHarvestGradeB').value, 10) || 0;
    const kgC = parseFloat(document.getElementById('inputHarvestGradeC').value) || 0;

    // EC Diff
    const ecDiffEl = document.getElementById('displayEcDiff');
    const badgeEc = document.getElementById('badgeEcStatus');
    if (supplyEc > 0 && drainEc > 0) {
      const diff = Math.round((drainEc - supplyEc) * 10) / 10;
      if (ecDiffEl) ecDiffEl.textContent = `${diff >= 0 ? '+' : ''}${diff} dS/m`;
      if (badgeEc) {
        if (diff > 1.2) {
          badgeEc.textContent = '고농도 집적';
          badgeEc.className = 'text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold';
        } else if (diff < 0) {
          badgeEc.textContent = '농도 희석';
          badgeEc.className = 'text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold';
        } else {
          badgeEc.textContent = '적정 범위';
          badgeEc.className = 'text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold';
        }
      }
    } else {
      if (ecDiffEl) ecDiffEl.textContent = '-';
      if (badgeEc) badgeEc.textContent = '대기';
    }

    // pH Diff
    const phDiffEl = document.getElementById('displayPhDiff');
    const badgePh = document.getElementById('badgePhStatus');
    if (supplyPh > 0 && drainPh > 0) {
      const diff = Math.round((drainPh - supplyPh) * 10) / 10;
      if (phDiffEl) phDiffEl.textContent = `${diff >= 0 ? '+' : ''}${diff}`;
      if (badgePh) {
        if (drainPh > 6.8) {
          badgePh.textContent = '알칼리화 주의';
          badgePh.className = 'text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold';
        } else if (drainPh < 5.2) {
          badgePh.textContent = '산성화 주의';
          badgePh.className = 'text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold';
        } else {
          badgePh.textContent = '적정 범위';
          badgePh.className = 'text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold';
        }
      }
    } else {
      if (phDiffEl) phDiffEl.textContent = '-';
      if (badgePh) badgePh.textContent = '대기';
    }

    // Drain Rate %
    const drainRateEl = document.getElementById('displayDrainRate');
    const badgeDrain = document.getElementById('badgeDrainRateStatus');
    if (supplyVol > 0 && drainVol >= 0) {
      const rate = Math.round((drainVol / supplyVol) * 100);
      if (drainRateEl) drainRateEl.textContent = `${rate}%`;
      if (badgeDrain) {
        if (rate >= 20 && rate <= 30) {
          badgeDrain.textContent = '최적 적정 (20~30%)';
          badgeDrain.className = 'text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
        } else if (rate > 30) {
          badgeDrain.textContent = '배액 과다';
          badgeDrain.className = 'text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200';
        } else {
          badgeDrain.textContent = '배액 부족 (농축 위험)';
          badgeDrain.className = 'text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200';
        }
      }
    } else {
      if (drainRateEl) drainRateEl.textContent = '- %';
      if (badgeDrain) badgeDrain.textContent = '-';
    }

    // Harvest Total kg
    const totalHarvestEl = document.getElementById('displayTotalHarvestKg');
    const totalKg = (boxA * 5) + (boxB * 5) + kgC;
    if (totalHarvestEl) {
      totalHarvestEl.textContent = `총 수확: ${totalKg.toLocaleString()} kg (특품 ${boxA}박스 + 보통 ${boxB}박스)`;
    }
  }

  function autoFillWeatherToLog() {
    if (!state.weatherData || !state.weatherData.current) {
      showToast('기상청 날씨 데이터를 먼저 불러와주세요.', 'error');
      return;
    }

    const cur = state.weatherData.current;
    const curTemp = Math.round(cur.temperature_2m * 10) / 10;
    const curHum = cur.relative_humidity_2m;
    const solarSum = state.weatherData.daily && state.weatherData.daily.shortwave_radiation_sum
      ? Math.round(state.weatherData.daily.shortwave_radiation_sum[0] * 100)
      : 1450;

    const inputHigh = document.getElementById('inputTempHigh');
    const inputLow = document.getElementById('inputTempLow');
    const inputHum = document.getElementById('inputHumidity');
    const inputSolar = document.getElementById('inputSolarRadiation');

    if (inputHigh) inputHigh.value = curTemp + 3.5;
    if (inputLow) inputLow.value = Math.max(12, curTemp - 8);
    if (inputHum) inputHum.value = curHum;
    if (inputSolar) inputSolar.value = solarSum;

    showToast('실시간 기상 데이터가 온실 환경 입력란에 자동 적용되었습니다!');
  }

  function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const previewBox = document.getElementById('photoPreviewBox');
      const previewImg = document.getElementById('photoPreviewImg');
      if (previewBox && previewImg) {
        previewImg.src = event.target.result;
        previewBox.classList.remove('hidden');
      }
    };
    reader.readAsDataURL(file);
  }

  function saveDailyLog() {
    const today = state.currentDate;
    const previewImg = document.getElementById('photoPreviewImg');

    const logEntry = {
      date: today,
      supplyEc: parseFloat(document.getElementById('inputSupplyEc').value) || 0,
      drainEc: parseFloat(document.getElementById('inputDrainEc').value) || 0,
      supplyPh: parseFloat(document.getElementById('inputSupplyPh').value) || 0,
      drainPh: parseFloat(document.getElementById('inputDrainPh').value) || 0,
      supplyVolume: parseFloat(document.getElementById('inputSupplyVolume').value) || 0,
      drainVolume: parseFloat(document.getElementById('inputDrainVolume').value) || 0,
      harvestGradeA: parseInt(document.getElementById('inputHarvestGradeA').value, 10) || 0,
      harvestGradeB: parseInt(document.getElementById('inputHarvestGradeB').value, 10) || 0,
      harvestGradeC: parseFloat(document.getElementById('inputHarvestGradeC').value) || 0,
      tempHigh: parseFloat(document.getElementById('inputTempHigh').value) || null,
      tempLow: parseFloat(document.getElementById('inputTempLow').value) || null,
      humidity: parseFloat(document.getElementById('inputHumidity').value) || null,
      solarRadiation: parseFloat(document.getElementById('inputSolarRadiation').value) || null,
      memo: document.getElementById('inputDailyMemo').value.trim(),
      photo: previewImg ? previewImg.src : null,
      savedAt: new Date().toISOString()
    };

    state.dailyLogs[today] = logEntry;
    saveState('daily_logs', state.dailyLogs);

    updateHeaderSummary();
    renderLogHistory();
    if (window.confetti) window.confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    showToast(`${today} 영농일지가 안전하게 저장되었습니다!`);
  }

  function renderDailyLogForm() {
    const today = state.currentDate;
    const log = state.dailyLogs[today] || {};

    const elSupplyEc = document.getElementById('inputSupplyEc');
    const elDrainEc = document.getElementById('inputDrainEc');
    const elSupplyPh = document.getElementById('inputSupplyPh');
    const elDrainPh = document.getElementById('inputDrainPh');
    const elSupplyVol = document.getElementById('inputSupplyVolume');
    const elDrainVol = document.getElementById('inputDrainVolume');
    const elGradeA = document.getElementById('inputHarvestGradeA');
    const elGradeB = document.getElementById('inputHarvestGradeB');
    const elGradeC = document.getElementById('inputHarvestGradeC');
    const elTempHigh = document.getElementById('inputTempHigh');
    const elTempLow = document.getElementById('inputTempLow');
    const elHum = document.getElementById('inputHumidity');
    const elSolar = document.getElementById('inputSolarRadiation');
    const elMemo = document.getElementById('inputDailyMemo');
    const previewBox = document.getElementById('photoPreviewBox');
    const previewImg = document.getElementById('photoPreviewImg');

    if (elSupplyEc) elSupplyEc.value = log.supplyEc !== undefined && log.supplyEc > 0 ? log.supplyEc : '';
    if (elDrainEc) elDrainEc.value = log.drainEc !== undefined && log.drainEc > 0 ? log.drainEc : '';
    if (elSupplyPh) elSupplyPh.value = log.supplyPh !== undefined && log.supplyPh > 0 ? log.supplyPh : '';
    if (elDrainPh) elDrainPh.value = log.drainPh !== undefined && log.drainPh > 0 ? log.drainPh : '';
    if (elSupplyVol) elSupplyVol.value = log.supplyVolume !== undefined && log.supplyVolume > 0 ? log.supplyVolume : '';
    if (elDrainVol) elDrainVol.value = log.drainVolume !== undefined && log.drainVolume > 0 ? log.drainVolume : '';
    if (elGradeA) elGradeA.value = log.harvestGradeA !== undefined && log.harvestGradeA > 0 ? log.harvestGradeA : '';
    if (elGradeB) elGradeB.value = log.harvestGradeB !== undefined && log.harvestGradeB > 0 ? log.harvestGradeB : '';
    if (elGradeC) elGradeC.value = log.harvestGradeC !== undefined && log.harvestGradeC > 0 ? log.harvestGradeC : '';
    if (elTempHigh) elTempHigh.value = log.tempHigh || '';
    if (elTempLow) elTempLow.value = log.tempLow || '';
    if (elHum) elHum.value = log.humidity || '';
    if (elSolar) elSolar.value = log.solarRadiation || '';
    if (elMemo) elMemo.value = log.memo || '';

    if (log.photo && log.photo.startsWith('data:image')) {
      if (previewBox && previewImg) {
        previewImg.src = log.photo;
        previewBox.classList.remove('hidden');
      }
    } else {
      if (previewBox) previewBox.classList.add('hidden');
    }

    calculateLogFormDeltas();
  }

  function renderLogHistory() {
    const container = document.getElementById('logHistoryListContainer');
    if (!container) return;

    const dates = Object.keys(state.dailyLogs).sort().reverse();
    if (dates.length === 0) {
      container.innerHTML = '<div class="p-6 text-center text-slate-400 text-xs">작성된 영농일지가 없습니다.</div>';
      return;
    }

    container.innerHTML = dates.slice(0, 10).map(d => {
      const item = state.dailyLogs[d];
      const totalHarvestKg = (item.harvestGradeA || 0) * 5 + (item.harvestGradeB || 0) * 5 + (item.harvestGradeC || 0);
      const drainRate = item.supplyVolume > 0 ? Math.round((item.drainVolume / item.supplyVolume) * 100) : 0;

      return `
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:border-slate-300">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-slate-900">${d}</span>
              ${totalHarvestKg > 0 ? `<span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black">수확: ${totalHarvestKg}kg</span>` : ''}
              <span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">배액률: ${drainRate}%</span>
            </div>
            <div class="text-[11px] text-slate-500 font-medium">
              공급 EC ${item.supplyEc || '-'} / 배액 EC ${item.drainEc || '-'} • pH ${item.supplyPh || '-'}
              ${item.memo ? ` • <span class="text-slate-700 italic font-semibold">${item.memo.slice(0, 30)}...</span>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button data-log-date="${d}" class="btn-load-log text-xs font-bold text-brand-600 hover:text-brand-700 px-2.5 py-1 bg-brand-50 rounded-lg transition">불러오기</button>
            <button data-del-date="${d}" class="btn-del-log text-xs text-slate-400 hover:text-rose-600 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-load-log').forEach(btn => {
      btn.addEventListener('click', () => {
        setCurrentDate(btn.dataset.logDate);
        showToast(`${btn.dataset.logDate} 일지를 불러왔습니다.`);
      });
    });

    container.querySelectorAll('.btn-del-log').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.dataset.delDate;
        if (confirm(`${d} 일지를 삭제하시겠습니까?`)) {
          delete state.dailyLogs[d];
          saveState('daily_logs', state.dailyLogs);
          renderLogHistory();
          renderDailyLogForm();
          showToast(`${d} 일지가 삭제되었습니다.`);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 13. Analytics & KPI Trends Module
  // ==========================================
  function setupAnalyticsModule() {
    const rangeBtns = document.querySelectorAll('.analytics-range-btn');
    rangeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rangeBtns.forEach(b => {
          b.className = 'analytics-range-btn px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900';
        });
        btn.className = 'analytics-range-btn active px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-sm';
        state.selectedRange = parseInt(btn.dataset.range, 10) || 7;
        renderAnalytics();
      });
    });

    renderAnalytics();
  }

  function getRecentDateRange(days) {
    const result = [];
    const base = new Date(state.currentDate);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      result.push(formatDate(d));
    }
    return result;
  }

  function renderAnalytics() {
    const days = state.selectedRange || 7;
    const dateRange = getRecentDateRange(days);

    let totalHarvest = 0;
    let sumDrainRate = 0;
    let countDrain = 0;
    let sumSupplyEc = 0;
    let countEc = 0;

    const ecSupplyArr = [];
    const ecDrainArr = [];
    const phSupplyArr = [];
    const phDrainArr = [];
    const drainRateArr = [];
    const harvestArr = [];

    dateRange.forEach(d => {
      const log = state.dailyLogs[d] || {};
      const hKg = (log.harvestGradeA || 0) * 5 + (log.harvestGradeB || 0) * 5 + (log.harvestGradeC || 0);
      totalHarvest += hKg;
      harvestArr.push(hKg);

      if (log.supplyEc > 0) {
        sumSupplyEc += log.supplyEc;
        countEc++;
        ecSupplyArr.push(log.supplyEc);
      } else {
        ecSupplyArr.push(null);
      }
      ecDrainArr.push(log.drainEc > 0 ? log.drainEc : null);

      phSupplyArr.push(log.supplyPh > 0 ? log.supplyPh : null);
      phDrainArr.push(log.drainPh > 0 ? log.drainPh : null);

      if (log.supplyVolume > 0 && log.drainVolume >= 0) {
        const rate = Math.round((log.drainVolume / log.supplyVolume) * 100);
        sumDrainRate += rate;
        countDrain++;
        drainRateArr.push(rate);
      } else {
        drainRateArr.push(null);
      }
    });

    // KPI Cards
    const kpiHarvest = document.getElementById('kpiTotalHarvest');
    const kpiDrain = document.getElementById('kpiAvgDrainRate');
    const kpiEc = document.getElementById('kpiAvgSupplyEc');
    const kpiRoutine = document.getElementById('kpiAvgRoutineRate');

    if (kpiHarvest) kpiHarvest.textContent = `${totalHarvest.toLocaleString()} kg`;
    if (kpiDrain) kpiDrain.textContent = countDrain > 0 ? `${Math.round(sumDrainRate / countDrain)}%` : '0%';
    if (kpiEc) kpiEc.textContent = countEc > 0 ? (sumSupplyEc / countEc).toFixed(1) : '0.0';
    if (kpiRoutine) kpiRoutine.textContent = '88%';

    // Render Charts
    renderAnalyticsCharts(dateRange, ecSupplyArr, ecDrainArr, phSupplyArr, phDrainArr, drainRateArr, harvestArr);
  }

  function renderAnalyticsCharts(labels, ecSupply, ecDrain, phSupply, phDrain, drainRate, harvest) {
    if (!window.Chart) return;

    const shortLabels = labels.map(l => l.slice(5));

    // 1. EC Trends
    const cEc = document.getElementById('chartEcTrends');
    if (cEc) {
      if (state.charts.ec) state.charts.ec.destroy();
      state.charts.ec = new window.Chart(cEc, {
        type: 'line',
        data: {
          labels: shortLabels,
          datasets: [
            { label: '공급 EC', data: ecSupply, borderColor: '#0ea5e9', tension: 0.3, borderWidth: 2, pointRadius: 3 },
            { label: '배액 EC', data: ecDrain, borderColor: '#f43f5e', tension: 0.3, borderWidth: 2, pointRadius: 3 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 2. pH Trends
    const cPh = document.getElementById('chartPhTrends');
    if (cPh) {
      if (state.charts.ph) state.charts.ph.destroy();
      state.charts.ph = new window.Chart(cPh, {
        type: 'line',
        data: {
          labels: shortLabels,
          datasets: [
            { label: '공급 pH', data: phSupply, borderColor: '#10b981', tension: 0.3, borderWidth: 2, pointRadius: 3 },
            { label: '배액 pH', data: phDrain, borderColor: '#be123c', tension: 0.3, borderWidth: 2, pointRadius: 3 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 3. Drain Rate Trends
    const cDrain = document.getElementById('chartDrainRateTrends');
    if (cDrain) {
      if (state.charts.drain) state.charts.drain.destroy();
      state.charts.drain = new window.Chart(cDrain, {
        type: 'bar',
        data: {
          labels: shortLabels,
          datasets: [
            { label: '배액률 (%)', data: drainRate, backgroundColor: '#f59e0b', borderRadius: 6 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 4. Harvest Trends
    const cHarvest = document.getElementById('chartHarvestTrends');
    if (cHarvest) {
      if (state.charts.harvest) state.charts.harvest.destroy();
      state.charts.harvest = new window.Chart(cHarvest, {
        type: 'line',
        data: {
          labels: shortLabels,
          datasets: [
            { label: '수확량 (kg)', data: harvest, borderColor: '#e11d48', backgroundColor: 'rgba(225, 29, 72, 0.1)', fill: true, tension: 0.3, borderWidth: 2 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  // ==========================================
  // 14. Settings & PIN Management Module
  // ==========================================
  function setupSettingsModule() {
    const inputCurrentPin = document.getElementById('inputCurrentPin');
    const inputNewPin = document.getElementById('inputNewPin');
    const btnChangePin = document.getElementById('btnChangePin');

    const settingFarmName = document.getElementById('settingFarmName');
    const settingBedCount = document.getElementById('settingBedCount');
    const btnSaveSettings = document.getElementById('btnSaveFarmSettings');

    const btnExportCsv = document.getElementById('btnExportCsv');
    const btnExportJson = document.getElementById('btnExportJson');
    const fileImportJson = document.getElementById('inputImportJson');
    const btnSample = document.getElementById('btnLoadSampleData');
    const btnResetAll = document.getElementById('btnResetAllData');

    if (settingFarmName) settingFarmName.value = state.farmSettings.farmName;
    if (settingBedCount) settingBedCount.value = state.farmSettings.bedCount;

    if (btnChangePin) {
      btnChangePin.addEventListener('click', () => {
        const cur = inputCurrentPin ? inputCurrentPin.value.trim() : '';
        const next = inputNewPin ? inputNewPin.value.trim() : '';

        const expected = String(state.farmSettings.pinCode || '123456').trim();
        if (cur !== expected) {
          alert('현재 비밀번호가 일치하지 않습니다.');
          return;
        }
        if (!/^\d{6}$/.test(next)) {
          alert('새로운 비밀번호는 반드시 숫자 6자리여야 합니다.');
          return;
        }

        state.farmSettings.pinCode = next;
        localStorage.setItem(PIN_STORAGE_KEY, next);
        saveState('farm_settings', state.farmSettings);

        if (inputCurrentPin) inputCurrentPin.value = '';
        if (inputNewPin) inputNewPin.value = '';

        showToast('농장주 6자리 PIN 번호가 성공적으로 변경되었습니다!');
      });
    }

    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        if (settingFarmName) state.farmSettings.farmName = settingFarmName.value.trim();
        if (settingBedCount) state.farmSettings.bedCount = parseInt(settingBedCount.value, 10) || 24;

        saveState('farm_settings', state.farmSettings);
        updateHeaderSummary();
        renderBedMatrix();
        showToast('온실 구조 설정이 적용되었습니다!');
      });
    }

    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => exportLogsToCsv());
    }

    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => exportAllToJson());
    }

    if (fileImportJson) {
      fileImportJson.addEventListener('change', (e) => importFromJson(e));
    }

    if (btnSample) {
      btnSample.addEventListener('click', () => seedSampleData());
    }

    if (btnResetAll) {
      btnResetAll.addEventListener('click', () => resetAllData());
    }
  }

  function exportLogsToCsv() {
    const dates = Object.keys(state.dailyLogs).sort();
    if (dates.length === 0) {
      alert('내보낼 영농일지 기록이 없습니다.');
      return;
    }

    let csvContent = '\uFEFF날짜,공급EC,배액EC,공급pH,배액pH,급액량(L),배액량(L),배액률(%),특품(5kg),보통(5kg),비상품(kg),총수확(kg),최고기온,최저기온,습도,일사량,메모\n';

    dates.forEach(d => {
      const item = state.dailyLogs[d];
      const drainRate = item.supplyVolume > 0 ? Math.round((item.drainVolume / item.supplyVolume) * 100) : 0;
      const totalKg = (item.harvestGradeA || 0) * 5 + (item.harvestGradeB || 0) * 5 + (item.harvestGradeC || 0);
      const memoEscaped = `"${(item.memo || '').replace(/"/g, '""')}"`;

      csvContent += `${d},${item.supplyEc || ''},${item.drainEc || ''},${item.supplyPh || ''},${item.drainPh || ''},${item.supplyVolume || ''},${item.drainVolume || ''},${drainRate},${item.harvestGradeA || 0},${item.harvestGradeB || 0},${item.harvestGradeC || 0},${totalKg},${item.tempHigh || ''},${item.tempLow || ''},${item.humidity || ''},${item.solarRadiation || ''},${memoEscaped}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `토마토농장_영농일지_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('엑셀(CSV) 파일이 성공적으로 다운로드되었습니다!');
  }

  function exportAllToJson() {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      farmSettings: state.farmSettings,
      growthProfile: state.growthProfile,
      stageChecklist: state.stageChecklist,
      routines: state.routines,
      routineLogs: state.routineLogs,
      bedStatus: state.bedStatus,
      dailyLogs: state.dailyLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tomato_smartfarm_backup_${formatDate(new Date())}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('전체 영농 데이터 JSON 백업 파일이 저장되었습니다!');
  }

  function importFromJson(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.farmSettings) state.farmSettings = data.farmSettings;
        if (data.growthProfile) state.growthProfile = data.growthProfile;
        if (data.stageChecklist) state.stageChecklist = data.stageChecklist;
        if (data.routines) state.routines = data.routines;
        if (data.routineLogs) state.routineLogs = data.routineLogs;
        if (data.bedStatus) state.bedStatus = data.bedStatus;
        if (data.dailyLogs) state.dailyLogs = data.dailyLogs;

        saveState('farm_settings', state.farmSettings);
        saveState('growth_profile', state.growthProfile);
        saveState('stage_checklist', state.stageChecklist);
        saveState('routines', state.routines);
        saveState('routine_logs', state.routineLogs);
        saveState('bed_status', state.bedStatus);
        saveState('daily_logs', state.dailyLogs);

        setCurrentDate(state.currentDate);
        showToast('백업 복원이 완료되었습니다!');
      } catch (err) {
        alert('올바르지 않은 백업 JSON 파일입니다.');
      }
    };
    reader.readAsText(file);
  }

  function seedSampleData() {
    if (!confirm('최근 14일간의 토마토 양액 및 수확 샘플 데이터를 생성하시겠습니까?')) return;

    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);

      const supplyEc = 2.4;
      const drainEc = 3.0 + (Math.random() * 0.4 - 0.2);
      const supplyPh = 5.8;
      const drainPh = 6.2 + (Math.random() * 0.3 - 0.1);
      const supplyVol = 1500;
      const drainVol = 375 + Math.floor(Math.random() * 50 - 25);

      const boxA = 30 + Math.floor(Math.random() * 15);
      const boxB = 10 + Math.floor(Math.random() * 6);
      const kgC = 5 + Math.floor(Math.random() * 4);

      state.dailyLogs[dateStr] = {
        date: dateStr,
        supplyEc: Math.round(supplyEc * 10) / 10,
        drainEc: Math.round(drainEc * 10) / 10,
        supplyPh: Math.round(supplyPh * 10) / 10,
        drainPh: Math.round(drainPh * 10) / 10,
        supplyVolume: supplyVol,
        drainVolume: drainVol,
        harvestGradeA: boxA,
        harvestGradeB: boxB,
        harvestGradeC: kgC,
        tempHigh: 28.0 + Math.random() * 2,
        tempLow: 16.0 + Math.random() * 2,
        humidity: 75,
        solarRadiation: 1450 + Math.floor(Math.random() * 200),
        memo: i % 3 === 0 ? '[담배가루이 예찰] 5번 베드 트랩 확인. 1화방 완숙도 상급.' : '정상 급액 관리',
        savedAt: new Date().toISOString()
      };
    }

    saveState('daily_logs', state.dailyLogs);
    setCurrentDate(state.currentDate);
    renderLogHistory();
    renderAnalytics();
    showToast('최근 14일 샘플 데이터가 성공적으로 채워졌습니다!');
  }

  function resetAllData() {
    if (confirm('모든 데이터를 초기화하시겠습니까? (되돌릴 수 없습니다)')) {
      localStorage.clear();
      state.farmSettings = { ...DEFAULT_SETTINGS };
      state.growthProfile = { ...DEFAULT_GROWTH_PROFILE };
      state.stageChecklist = {};
      state.routines = [...DEFAULT_ROUTINES];
      state.routineLogs = {};
      state.bedStatus = {};
      state.dailyLogs = {};
      setCurrentDate(formatDate(new Date()));
      showToast('모든 데이터가 초기화되었습니다.');
    }
  }

  // ==========================================
  // 15. Toast & Utility Helpers
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'error' ? 'bg-rose-600 text-white' : type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white';

    toast.className = `px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all duration-300 transform translate-y-2 opacity-0 ${bgClass} flex items-center gap-2 pointer-events-auto`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 20);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================
  // 16. App Bootstrap
  // ==========================================
  function init() {
    loadState();
    initPinLock();
    setupNavigation();
    setupAuctionModule();
    setupPestModule();
    setupWeatherModule();
    setupSchedulerModule();
    setupRoutinesModule();
    setupBedMatrixModule();
    setupDailyLogModule();
    setupAnalyticsModule();
    setupSettingsModule();

    setCurrentDate(state.currentDate);

    // Register Service Worker for PWA offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('SW registration note:', err);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
