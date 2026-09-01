// Tomato Smart Farm Pro - Main JavaScript Engine (White Light Theme Edition)
(function () {
  'use strict';

  // 1. Initial State & Data Models
  const DEFAULT_SETTINGS = {
    farmName: '토마토 스마트팜',
    bedCount: 24,
    targetSupplyEc: 2.4,
    targetSupplyPh: 5.8,
    targetDrainMin: 20,
    targetDrainMax: 30
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

  const RDA_GROWTH_STAGES = [
    {
      stage: 0,
      title: '정식 전 준비기 (D-30 ~ D-1)',
      shortTitle: '정식 전 준비',
      dayStart: -30,
      dayEnd: -1,
      desc: '배지 포수 및 온실 소독, 양액기 및 환경제어 시스템 점검',
      tempDay: '온실 밀폐 소독 (태양열/훈증)',
      tempNight: '설비 점검',
      humidity: '배지 포수(함수율 100%)',
      targetEc: '포수 EC 2.0~2.2 dS/m',
      targetPh: '5.5~5.8',
      targetDrain: '포수 후 슬래브 배수구 개공',
      keyTasks: [
        '코이어/암면 슬래브 양액 포수 (정식 3~5일 전)',
        '슬래브 하단 배수 슬릿(구멍) 개공 (정식 1일 전)',
        '양액기 유량계, 솔레노이드 밸브, 센서(EC/pH) 교정',
        '유동팬, 스크린, 개폐기 시운전 및 온실 소독'
      ],
      checklist: [
        '슬래브 완전 포수 완료',
        '배수 슬릿 개공 확인',
        '양액기 센서 보정 완료',
        '환경제어기 모터 점검'
      ]
    },
    {
      stage: 1,
      title: '1단계: 정식 및 뿌리 활착기 (DAT 0 ~ 14일)',
      shortTitle: '정식 및 활착기',
      dayStart: 0,
      dayEnd: 14,
      desc: '묘목 정식 후 근권 활착 촉진, 과습 방지 및 미세 급액 관리',
      tempDay: '25~27℃ (환기 26℃)',
      tempNight: '16~18℃ (최저 15℃ 유지)',
      humidity: '70~80% (HD 3~5 g/m³)',
      targetEc: '1.8~2.0 dS/m (초기 저농도)',
      targetPh: '5.5~5.8',
      targetDrain: '10~15% (소량 다회 급액)',
      keyTasks: [
        '본엽 7~8매, 제1화방 꽃봉오리 보일 때 정식',
        '정식 직후 주당 200~300ml 정식수 관수',
        '뿌리가 슬래브로 활착될 때까지 과도한 배액 지양',
        '강한 직사광 차광 스크린 30~50% 일시 가동'
      ],
      checklist: [
        '정식 완료 및 정식수 공급',
        '뿌리 활착 상태 육안 점검',
        '야간 보온/차광 설정 확인'
      ]
    },
    {
      stage: 2,
      title: '2단계: 1~3화방 개화 및 초기 착과기 (DAT 15 ~ 45일)',
      shortTitle: '개화 및 초기 착과기',
      dayStart: 15,
      dayEnd: 45,
      desc: '1~3화방 개화 및 수정, 영양생장과 생식생장의 균형 유지',
      tempDay: '24~26℃',
      tempNight: '15~16℃',
      humidity: '65~75% (HD 4~7 g/m³)',
      targetEc: '2.0~2.2 dS/m',
      targetPh: '5.6~6.0',
      targetDrain: '20~25%',
      keyTasks: [
        '1화방 3~4꽃 개화 시 호박벌(수정벌) 방사',
        '곁순(측아) 5cm 이내 조기 제거 및 첫 줄 유인',
        '1화방 착과 확인 후 3~4개로 적과 (초세 조절)',
        '영양생장 과다(줄기 굵어짐) 시 급액량 조절'
      ],
      checklist: [
        '호박벌 방사 및 수정 확인',
        '1화방 적과 (3~4과 유지)',
        '곁순 제거 및 1차 줄 유인 완료'
      ]
    },
    {
      stage: 3,
      title: '3단계: 과실 비대 및 첫 수확 개시기 (DAT 46 ~ 90일)',
      shortTitle: '과실 비대 및 첫 수확기',
      dayStart: 46,
      dayEnd: 90,
      desc: '1화방 완숙 수확 개시, 급액량 본격 증량 및 하엽 정리',
      tempDay: '25~28℃',
      tempNight: '15~17℃',
      humidity: '65~75%',
      targetEc: '2.2~2.4 dS/m',
      targetPh: '5.8~6.2',
      targetDrain: '25~30%',
      keyTasks: [
        '착색도 80~90% 완숙과 수확 시작',
        '수확 화방 하부 노화엽 3~4장 적엽(하엽 정리)',
        '작물 생장점에 맞추어 정기 줄내림 시작 (주 1회)',
        '4~7화방 착과 관리 (화방당 4~5개 적과)'
      ],
      checklist: [
        '1화방 첫 완숙 수확 기록',
        '하엽 3~4장 1차 적엽 완료',
        '정기 줄내림 루틴 시작'
      ]
    },
    {
      stage: 4,
      title: '4단계: 성기 수확 및 장기 생육 유지기 (DAT 91 ~ 240일)',
      shortTitle: '성기 수확 및 장기생육기',
      dayStart: 91,
      dayEnd: 240,
      desc: '연중 최고 수확기, 초세 유지, 칼슘 결핍(배꼽썩음) 및 병해충 방제',
      tempDay: '24~28℃ (환기/차광 제어)',
      tempNight: '14~16℃',
      humidity: '60~75%',
      targetEc: '2.4~2.6 dS/m (일사량 연동)',
      targetPh: '5.8~6.2',
      targetDrain: '25~35%',
      keyTasks: [
        '주당 1화방 수확 및 1회 줄내림(눕히기) 유지',
        '주당 잎 수 15~18매 일정하게 유지',
        '칼슘(Ca) 결핍 방지: 엽면시비 및 일사비례 급액',
        '수정벌 주기적 교체 (4~6주 주기 새 벌통 교체)',
        '온실가루이, 응애, 잎곰팡이병 집중 예찰 및 방제'
      ],
      checklist: [
        '주간 정기 줄내림/적엽 완료',
        '배꼽썩음병 예찰 및 칼슘 관리',
        '수정벌 벌통 교체 주기 점검'
      ]
    },
    {
      stage: 5,
      title: '5단계: 적심(생장점 제거) 및 후기 비대기 (DAT 241 ~ 255일)',
      shortTitle: '적심 및 후기 비대기',
      dayStart: 241,
      dayEnd: 255,
      desc: '마지막 목표 화방 착과 후 생장점 적심, 상부 과실 완숙 촉진',
      tempDay: '25~28℃',
      tempNight: '15~17℃',
      humidity: '60~70%',
      targetEc: '2.4~2.6 dS/m',
      targetPh: '5.8~6.2',
      targetDrain: '20~25%',
      keyTasks: [
        '최종 수확 예정 화방 위 2~3엽 남기고 생장점 절단(적심)',
        '적심 후 발생하는 상부 곁순 지속 제거',
        '상부 과실 비대 및 착색 촉진을 위한 일조 확보'
      ],
      checklist: [
        '생장점 적심(Top pinch) 완료',
        '적심 후 곁순 제거 확인',
        '상부 화방 비대 상태 점검'
      ]
    },
    {
      stage: 6,
      title: '6단계: 최종 수확 및 온실 철거/소독기 (DAT 256 ~ 285일)',
      shortTitle: '최종 수확 및 소독',
      dayStart: 256,
      dayEnd: 285,
      desc: '남은 과실 전량 수확, 관수 감량 및 작물체 반출, 온실 밀폐 소독',
      tempDay: '자연 환기',
      tempNight: '자연 환기',
      humidity: '건조 관리',
      targetEc: '급액 점진적 중단',
      targetPh: '-',
      targetDrain: '-',
      keyTasks: [
        '잔여 완숙과 전량 수확 및 출하',
        '작기 종료 3~5일 전 관수 완전 중단',
        '작물체 절단, 잔재물 온실 외부 반출 및 소각/폐기',
        '점적배관 세척(질산/산세척) 및 온실 태양열 소독'
      ],
      checklist: [
        '최종 수확 완료',
        '작물 잔재물 반출 및 청소',
        '관수 배관 산세척 및 소독'
      ]
    }
  ];

  const DEFAULT_ROUTINES = [
    { id: 'r1', title: 'A/B 원액통 잔량 및 급액 밸브 점검', category: 'daily', interval: 1, guide: 'A/B 원액탱크 잔량 수위 확인 및 원액 공급 밸브 막힘 여부 점검' },
    { id: 'r2', title: '공급 & 배액 EC / pH 측정 및 배액률 산출', category: 'daily', interval: 1, guide: '공급 EC(2.2~2.6), pH(5.5~6.2) 및 배액률(20~30%) 정상 범위 확인' },
    { id: 'r3', title: '온실 환경 모니터링 (주야간 온·습도, 일사량)', category: 'daily', interval: 1, guide: '주간 최고 25~28℃, 야간 15~17℃, 습도 65~75% 관리 (수분부족능 HD 확인)' },
    { id: 'r4', title: '환기창(천창/측창) & 스크린 & 유동팬 동작 점검', category: 'daily', interval: 1, guide: '모터 구동 이상, 차광/보온 스크린 찢김 및 유동팬 회전 상태 점검' },
    { id: 'r5', title: '병해충 조기 예찰 (온실가루이, 응애, 잎곰팡이)', category: 'daily', interval: 1, guide: '하엽 뒷면 및 온실 출입구 근처 병해충 발생 여부 밀착 관찰' },
    { id: 'r6', title: '완숙토마토 적기 수확 및 선별 계량', category: 'daily', interval: 1, guide: '착색도 80~90% 완숙과 수확 및 등급별 박스 포장' },
    { id: 'r7', title: '곁순(측아) 제거 & 생장점 줄 유인 및 내림', category: 'weekly', interval: 7, guide: '곁순은 5cm 이내 조기 제거, 생장점이 꺾이지 않도록 줄 유인 및 내림' },
    { id: 'r8', title: '적엽 (하엽 정리 - 수확 화방 하부 잎 3~4장)', category: 'weekly', interval: 7, guide: '수확 화방 아래 노화엽 정리로 통풍 확보 및 잿빛곰팡이병 예방' },
    { id: 'r9', title: '적과 및 착과수 조절 (화방당 4~5과)', category: 'weekly', interval: 7, guide: '기형과/소과 조기 제거 및 화방당 4~5개로 과실 비대 유도' },
    { id: 'r10', title: '수정벌(호박벌) 활동성 및 벌통 수명 점검', category: 'weekly', interval: 7, guide: '벌통 출입구 비행 활동 확인 (벌통 교체 주기: 약 4~6주)' },
    { id: 'r11', title: '양액기 디스크/메쉬 필터 세척', category: 'periodic', interval: 14, guide: '원수 및 양액 필터 역세척 또는 분해 세척하여 점적단추 막힘 방지' },
    { id: 'r12', title: 'EC / pH 센서 전극 표준액 교정 (Calibration)', category: 'periodic', interval: 14, guide: 'pH 4.0 / 7.0 및 EC 표준액(1.413 mS/cm)으로 센서 오차 보정' },
    { id: 'r13', title: '점적 드리퍼/단추 토출량 및 수압 균일도 점검', category: 'periodic', interval: 14, guide: '베드 앞/중간/끝 드리퍼 배액량 균일도 측정' },
    { id: 'r14', title: '예방적 친환경 / 작물보호제 방제 살포', category: 'periodic', interval: 10, guide: '안전사용기준 준수, 농약/미생물제 살포 및 방제일지 기록' }
  ];

  // Application State
  const state = {
    activeTab: 'routines',
    activeDate: getTodayString(),
    routineFilter: 'all',
    activeBedTask: 'suckering',
    selectedBeds: new Set(),
    analyticsRange: 7,
    selectedRegionKey: loadFromStorage('tomato_weather_region', 'buyeo'),
    weatherData: loadFromStorage('tomato_weather_cache', null),
    growthProfile: loadFromStorage('tomato_growth_profile', DEFAULT_GROWTH_PROFILE),
    stageChecklist: loadFromStorage('tomato_stage_checklist', {}),
    settings: loadFromStorage('tomato_settings', DEFAULT_SETTINGS),
    routines: loadFromStorage('tomato_routines', DEFAULT_ROUTINES),
    routineLogs: loadFromStorage('tomato_routine_logs', {}),
    bedStatus: loadFromStorage('tomato_bed_status', {}),
    dailyLogs: loadFromStorage('tomato_daily_logs', {})
  };

  // Helper Functions
  function getTodayString() {
    return formatLocalDate(new Date());
  }
  function formatLocalDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  function formatKoreanDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(y, m - 1, d);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return `${y}. ${m}. ${d} (${dayNames[dateObj.getDay()]})`;
  }
  function addDaysToDate(dateStr, days) {
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    return formatLocalDate(dateObj);
  }
  function getDat(dateStr, plantingDateStr) {
    const [y1, m1, d1] = dateStr.split('-');
    const [y2, m2, d2] = plantingDateStr.split('-');
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);
    return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
  }

  function loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';
    toast.className = `${bg} text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span> <span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));
    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }  // DOM Init
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    setupNavigation();
    setupDateNavigator();
    setupRoutinesModule();
    setupWeatherModule();
    setupSchedulerModule();
    setupBedMatrixModule();
    setupDailyLogModule();
    setupAnalyticsModule();
    setupSettingsModule();
    
    fetchWeatherData(state.selectedRegionKey);
    updateHeaderStats();
    renderActiveTab();
    if (window.lucide) window.lucide.createIcons();
  }

  // 2. Navigation Handling
  function setupNavigation() {
    const desktopTabs = document.querySelectorAll('.nav-tab-btn');
    const mobileTabs = document.querySelectorAll('.mobile-nav-btn');

    function switchTab(tabId) {
      state.activeTab = tabId;
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      const activePane = document.getElementById(`tab-${tabId}`);
      if (activePane) activePane.classList.remove('hidden');

      desktopTabs.forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.className = `nav-tab-btn px-3.5 py-2 text-sm font-bold rounded-xl flex items-center gap-1.5 transition ${
          isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`;
      });

      mobileTabs.forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.className = `mobile-nav-btn flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
          isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`;
      });

      renderActiveTab();
      if (window.lucide) window.lucide.createIcons();
    }

    desktopTabs.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
    mobileTabs.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

    const btnGoScheduler = document.getElementById('btnGoToScheduler');
    if (btnGoScheduler) btnGoScheduler.addEventListener('click', () => switchTab('scheduler'));

    const btnGoWeather = document.getElementById('btnGoToWeatherTab');
    if (btnGoWeather) btnGoWeather.addEventListener('click', () => switchTab('weather'));

    const btnHeaderWeather = document.getElementById('btnHeaderWeatherOpen');
    if (btnHeaderWeather) btnHeaderWeather.addEventListener('click', () => switchTab('weather'));
  }

  function renderActiveTab() {
    if (state.activeTab === 'routines') renderRoutines();
    else if (state.activeTab === 'weather') renderWeather();
    else if (state.activeTab === 'scheduler') renderScheduler();
    else if (state.activeTab === 'beds') renderBedMatrix();
    else if (state.activeTab === 'logs') renderDailyLogForm();
    else if (state.activeTab === 'analytics') renderAnalytics();
    else if (state.activeTab === 'settings') renderSettings();
  }

  // 3. Date Navigator
  function setupDateNavigator() {
    const dateDisplay = document.getElementById('currentDateDisplay');
    const dateInput = document.getElementById('dateInputHidden');
    const btnPrev = document.getElementById('btnPrevDate');
    const btnNext = document.getElementById('btnNextDate');
    const btnToday = document.getElementById('btnToday');

    function setDate(dateStr) {
      state.activeDate = dateStr;
      if (dateDisplay) dateDisplay.textContent = formatKoreanDate(dateStr);
      if (dateInput) dateInput.value = dateStr;
      
      const formDate = document.getElementById('formCurrentDate');
      if (formDate) formDate.textContent = dateStr;

      updateHeaderStats();
      renderActiveTab();
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        const [y, m, d] = state.activeDate.split('-');
        const dateObj = new Date(y, m - 1, d);
        dateObj.setDate(dateObj.getDate() - 1);
        setDate(formatLocalDate(dateObj));
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const [y, m, d] = state.activeDate.split('-');
        const dateObj = new Date(y, m - 1, d);
        dateObj.setDate(dateObj.getDate() + 1);
        setDate(formatLocalDate(dateObj));
      });
    }

    if (btnToday) {
      btnToday.addEventListener('click', () => setDate(getTodayString()));
    }

    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        if (e.target.value) setDate(e.target.value);
      });
    }

    setDate(state.activeDate);
  }

  // 4. Header & Stage Stats
  function updateHeaderStats() {
    const farmNameEl = document.getElementById('headerFarmName');
    if (farmNameEl) farmNameEl.textContent = state.settings.farmName || '토마토 스마트팜';

    const pDate = state.growthProfile.plantingDate || '2026-08-25';
    const dat = getDat(state.activeDate, pDate);
    const datBadge = document.getElementById('headerGrowthStageBadge');
    if (datBadge) {
      if (dat < 0) datBadge.textContent = `정식 D${dat}일`;
      else if (dat === 0) datBadge.textContent = '🌱 정식 당일';
      else datBadge.textContent = `DAT ${dat}일차`;
    }

    const todayLog = state.routineLogs[state.activeDate] || {};
    const totalRoutines = state.routines.length;
    const completedCount = state.routines.filter(r => todayLog[r.id]).length;
    
    const routineProgressEl = document.getElementById('headerRoutineProgress');
    if (routineProgressEl) {
      routineProgressEl.textContent = `${completedCount}/${totalRoutines}`;
    }

    const dailyLog = state.dailyLogs[state.activeDate];
    const drainRateEl = document.getElementById('headerDrainRate');
    if (drainRateEl) {
      if (dailyLog && dailyLog.supplyVolume > 0 && dailyLog.drainVolume >= 0) {
        const rate = ((dailyLog.drainVolume / dailyLog.supplyVolume) * 100).toFixed(1);
        drainRateEl.textContent = `${rate}%`;
        drainRateEl.className = 'font-bold ' + (rate >= 20 && rate <= 30 ? 'text-emerald-600' : 'text-amber-600');
      } else {
        drainRateEl.textContent = '미기록';
        drainRateEl.className = 'font-bold text-slate-400';
      }
    }

    // Stage Banner
    const currentStage = getCurrentStage(dat);
    const bannerTitle = document.getElementById('bannerStageTitle');
    const bannerDat = document.getElementById('bannerDatText');
    const bannerGuide = document.getElementById('bannerStageGuide');
    if (bannerTitle) bannerTitle.textContent = currentStage.title;
    if (bannerDat) bannerDat.textContent = dat < 0 ? `D${dat}일` : `DAT ${dat}일차`;
    if (bannerGuide) bannerGuide.textContent = `농진청 권장: ${currentStage.keyTasks[0] || currentStage.desc}`;

    // Weather Banner in Header
    const reg = WEATHER_REGIONS[state.selectedRegionKey] || WEATHER_REGIONS.buyeo;
    const regNameEl = document.getElementById('headerRegionName');
    const weatherRegEl = document.getElementById('routineWeatherRegion');
    if (regNameEl) regNameEl.textContent = reg.name;
    if (weatherRegEl) weatherRegEl.textContent = reg.name;

    if (state.weatherData && state.weatherData.current) {
      const cur = state.weatherData.current;
      const wInfo = getWeatherDesc(cur.weather_code);
      
      const hIcon = document.getElementById('headerWeatherIcon');
      const hTemp = document.getElementById('headerWeatherTemp');
      const hSolar = document.getElementById('headerWeatherSolar');
      if (hIcon) hIcon.textContent = wInfo.icon;
      if (hTemp) hTemp.textContent = `${Math.round(cur.temperature_2m)}℃`;
      if (hSolar) hSolar.textContent = `${Math.round(cur.shortwave_radiation || 0)} W/m²`;

      const rwEmoji = document.getElementById('routineWeatherEmoji');
      if (rwEmoji) rwEmoji.textContent = wInfo.icon;

      const rwText = document.getElementById('routineWeatherAdviceText');
      if (rwText) {
        const advice = generateSmartFarmAdvice(state.weatherData);
        rwText.textContent = advice.short;
      }
    }
  }

  function getCurrentStage(dat) {
    for (const s of RDA_GROWTH_STAGES) {
      if (dat >= s.dayStart && dat <= s.dayEnd) return s;
    }
    if (dat < -30) return RDA_GROWTH_STAGES[0];
    return RDA_GROWTH_STAGES[RDA_GROWTH_STAGES.length - 1];
  }

  function getWeatherDesc(code) {
    if (code === 0) return { text: '맑음', icon: '☀️' };
    if (code === 1 || code === 2) return { text: '대체로 맑음/구름조금', icon: '🌤️' };
    if (code === 3) return { text: '흐림', icon: '☁️' };
    if (code === 45 || code === 48) return { text: '안개', icon: '🌫️' };
    if (code >= 51 && code <= 67) return { text: '비/강수', icon: '🌧️' };
    if (code >= 71 && code <= 77) return { text: '눈', icon: '❄️' };
    if (code >= 80 && code <= 82) return { text: '소나기', icon: '🌦️' };
    if (code >= 95) return { text: '뇌우', icon: '⛈️' };
    return { text: '맑음', icon: '☀️' };
  }  // 5. Weather Module Implementation (White Theme)
  let chartHourlyWeatherInstance = null;

  function setupWeatherModule() {
    const selectReg = document.getElementById('selectWeatherRegion');
    const btnGps = document.getElementById('btnGpsLocation');
    const btnRefresh = document.getElementById('btnRefreshWeather');

    if (selectReg) {
      selectReg.value = state.selectedRegionKey || 'buyeo';
      selectReg.addEventListener('change', (e) => {
        state.selectedRegionKey = e.target.value;
        saveToStorage('tomato_weather_region', state.selectedRegionKey);
        fetchWeatherData(state.selectedRegionKey);
      });
    }

    if (btnGps) {
      btnGps.addEventListener('click', () => {
        if (!navigator.geolocation) {
          alert('브라우저에서 위치 정보를 지원하지 않습니다.');
          return;
        }
        showToast('📍 GPS 위치를 탐색 중입니다...', 'info');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            WEATHER_REGIONS.custom_gps = { name: '📍 현재 내 농장 위치', lat, lon };
            state.selectedRegionKey = 'custom_gps';
            saveToStorage('tomato_weather_region', 'custom_gps');
            fetchWeatherData('custom_gps');
            showToast('GPS 위치 기반 날씨를 성공적으로 불러왔습니다!');
          },
          (err) => {
            alert('위치 정보를 가져올 수 없습니다. 기본 지역을 선택해 주세요.');
          }
        );
      });
    }

    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        const icon = document.getElementById('weatherRefreshIcon');
        if (icon) icon.classList.add('animate-spin');
        fetchWeatherData(state.selectedRegionKey, () => {
          if (icon) icon.classList.remove('animate-spin');
          showToast('기상청 실시간 날씨 데이터가 갱신되었습니다.');
        });
      });
    }
  }

  function fetchWeatherData(regionKey, callback) {
    const reg = WEATHER_REGIONS[regionKey] || WEATHER_REGIONS.buyeo;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${reg.lat}&longitude=${reg.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,shortwave_radiation&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,shortwave_radiation&daily=weather_code,temperature_2m_max,temperature_2m_min,shortwave_radiation_sum,precipitation_probability_max&timezone=Asia%2FSeoul`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        state.weatherData = data;
        saveToStorage('tomato_weather_cache', data);
        updateHeaderStats();
        if (state.activeTab === 'weather') renderWeather();
        if (callback) callback();
      })
      .catch(err => {
        console.warn('Weather fetch error:', err);
        if (callback) callback();
      });
  }

  function generateSmartFarmAdvice(wData) {
    if (!wData || !wData.current) {
      return {
        icon: '☀️',
        title: '정상 생육 기상',
        short: '기상 데이터 기반 양액 및 환기 정상 가동 권장.',
        full: '현재 기온과 일사량이 안정적입니다. 표준 급액량 및 배액률(20~30%)을 유지하세요.'
      };
    }

    const cur = wData.current;
    const daily = wData.daily || {};
    const solarW = cur.shortwave_radiation || 0;
    const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
    const tempMax = (daily.temperature_2m_max && daily.temperature_2m_max[0]) || 28;
    const tempMin = (daily.temperature_2m_min && daily.temperature_2m_min[0]) || 16;

    if (rainProb >= 60 || cur.weather_code >= 51) {
      return {
        icon: '🌧️',
        title: '흐림/비 예보: 저일사 대비 급액 및 곰팡이병 방제 권고',
        short: `비/흐림 예보 (강수확률 ${rainProb}%). 공급 EC +0.2 상향 및 과습/도장 방지.`,
        full: `오늘 강수 및 저일사가 예상됩니다. 작물 증산량 감소로 인한 배액 과다 및 줄기 도장을 막기 위해 공급 EC를 0.2 dS/m 상향(2.6 dS/m)하고 급액 횟수를 1~2회 줄이세요. 온실 내 다습으로 인한 잿빛곰팡이병 예방을 위해 유동팬을 상시 가동하고 측창을 약간 열어 환기를 확보하세요.`
      };
    }

    if (solarW >= 500 || tempMax >= 30) {
      return {
        icon: '☀️',
        title: '고일사/고온 예보: 일사비례 급액 증량 및 차광 가동',
        short: `강한 일사량(${Math.round(solarW)} W/m²). 급액 횟수 증량 및 주간 28℃ 이상 차광 가동.`,
        full: `강한 햇빛과 높은 온도가 예상됩니다. 작물 증산량이 급증하므로 1회 급액량은 유지하되 오전 10시~오후 2시 사이 급액 간격을 좁혀 1~2회 추가 급액하세요. 온실 온도가 28℃를 초과할 경우 차광 스크린 30~50%를 가동하여 엽온 상승과 과실 일소과(햇빛 데임)를 방지하세요.`
      };
    }

    if (tempMin <= 12) {
      return {
        icon: '❄️',
        title: '야간 저온 주의: 보온 커튼 및 난방 설정 확인',
        short: `야간 최저 ${Math.round(tempMin)}℃ 예보. 일몰 전 다겹보온커튼 닫힘 및 15℃ 유지.`,
        full: `야간 온도가 낮아져 토마토 야간 호흡 및 당류 전이가 지연될 수 있습니다. 일몰 1시간 전 다겹보온커튼을 닫아 온실 잔열을 보존하고 온수보일러 최저 난방 온도를 15~16℃로 설정해 저온 스트레스 및 착과 불량을 예방하세요.`
      };
    }

    return {
      icon: '🌤️',
      title: '적정 재배 기상: 표준 일사비례 급액 유지',
      short: `적정 기상(기온 ${Math.round(cur.temperature_2m)}℃, 일사 ${Math.round(solarW)} W/m²). 표준 급액 관리.`,
      full: `현재 온실 내외 기상 조건이 완숙토마토 생육에 최적입니다. 목표 공급 EC(2.4 dS/m), 공급 pH(5.8) 및 목표 배액률(20~30%)을 유지하며 정기적인 곁순제거 및 하엽 정리를 진행하세요.`
    };
  }

  function renderWeather() {
    if (!state.weatherData || !state.weatherData.current) return;
    const cur = state.weatherData.current;
    const daily = state.weatherData.daily || {};
    const wInfo = getWeatherDesc(cur.weather_code);

    document.getElementById('weatherCurTemp').textContent = `${Math.round(cur.temperature_2m)} ℃`;
    document.getElementById('weatherApparentTemp').textContent = `체감 ${Math.round(cur.apparent_temperature)} ℃`;
    document.getElementById('weatherCurSolar').textContent = `${Math.round(cur.shortwave_radiation || 0)} W/m²`;

    const solarSumMJ = (daily.shortwave_radiation_sum && daily.shortwave_radiation_sum[0]) || 0;
    const solarSumJ = Math.round(solarSumMJ * 100);
    document.getElementById('weatherDailySolarSum').textContent = `누적 예상: ${solarSumJ} J/cm²`;

    document.getElementById('weatherCurHumidity').textContent = `${cur.relative_humidity_2m}%`;
    document.getElementById('weatherCurWind').textContent = `${cur.wind_speed_10m} m/s`;
    document.getElementById('weatherSkyCondition').textContent = `${wInfo.icon} ${wInfo.text}`;

    const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
    document.getElementById('weatherPrecipProb').textContent = `강수확률: ${rainProb}%`;

    const tMax = Math.round((daily.temperature_2m_max && daily.temperature_2m_max[0]) || 0);
    const tMin = Math.round((daily.temperature_2m_min && daily.temperature_2m_min[0]) || 0);
    document.getElementById('weatherMaxMinTemp').textContent = `${tMax} / ${tMin} ℃`;

    const advice = generateSmartFarmAdvice(state.weatherData);
    document.getElementById('advisorStatusIcon').textContent = advice.icon;
    document.getElementById('advisorTitle').textContent = advice.title;
    document.getElementById('advisorContent').textContent = advice.full;

    const cardsContainer = document.getElementById('weatherDailyCardsContainer');
    if (cardsContainer && daily.time) {
      let cardsHtml = '';
      const dayNames = ['오늘', '내일', '모레'];
      for (let i = 0; i < Math.min(3, daily.time.length); i++) {
        const dayCode = daily.weather_code[i];
        const dayInfo = getWeatherDesc(dayCode);
        const dayMax = Math.round(daily.temperature_2m_max[i]);
        const dayMin = Math.round(daily.temperature_2m_min[i]);
        const daySolarMJ = daily.shortwave_radiation_sum[i] || 0;

        cardsHtml += `
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${dayInfo.icon}</span>
              <div>
                <span class="text-xs font-bold text-slate-900">${dayNames[i]} (${daily.time[i].slice(5)})</span>
                <span class="text-[11px] text-slate-500 block font-medium">${dayInfo.text}</span>
              </div>
            </div>
            <div class="text-right text-xs">
              <div class="font-bold text-slate-800"><span class="text-rose-600">${dayMax}℃</span> / <span class="text-sky-600">${dayMin}℃</span></div>
              <span class="text-[10px] text-amber-700 font-bold">일사: ${Math.round(daySolarMJ * 100)} J/cm²</span>
            </div>
          </div>
        `;
      }
      cardsContainer.innerHTML = cardsHtml;
    }

    renderWeatherHourlyChart();
    if (window.lucide) window.lucide.createIcons();
  }

  function renderWeatherHourlyChart() {
    const ctx = document.getElementById('chartHourlyWeather');
    if (!ctx || !state.weatherData || !state.weatherData.hourly || !window.Chart) return;

    const hourly = state.weatherData.hourly;
    const labels = [];
    const solarData = [];
    const tempData = [];

    const now = new Date();
    const curHour = now.getHours();

    for (let i = curHour; i < curHour + 18 && i < hourly.time.length; i++) {
      const timeStr = hourly.time[i].slice(11, 16);
      labels.push(timeStr);
      solarData.push(Math.round(hourly.shortwave_radiation[i] || 0));
      tempData.push(Math.round(hourly.temperature_2m[i]));
    }

    if (chartHourlyWeatherInstance) chartHourlyWeatherInstance.destroy();

    chartHourlyWeatherInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '일사량 (W/m²)',
            data: solarData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            yAxisID: 'ySolar',
            tension: 0.3,
            fill: true
          },
          {
            label: '기온 (℃)',
            data: tempData,
            borderColor: '#0284c7',
            backgroundColor: 'transparent',
            yAxisID: 'yTemp',
            borderDash: [4, 4],
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#334155', font: { family: 'Pretendard', size: 11, weight: 'bold' } } }
        },
        scales: {
          x: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#64748b', font: { size: 10, weight: '600' } } },
          ySolar: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: '#d97706', font: { size: 10, weight: '600' }, callback: (val) => `${val}W` }
          },
          yTemp: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#0284c7', font: { size: 10, weight: '600' }, callback: (val) => `${val}℃` }
          }
        }
      }
    });
  }  // 6. Routines Module (White Theme)
  function setupRoutinesModule() {
    const filterButtons = document.querySelectorAll('.routine-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active', 'bg-slate-800', 'text-white', 'shadow-sm');
          b.classList.add('text-slate-600');
        });
        btn.classList.add('active', 'bg-slate-800', 'text-white', 'shadow-sm');
        btn.classList.remove('text-slate-600');
        state.routineFilter = btn.dataset.filter;
        renderRoutines();
      });
    });

    const btnReset = document.getElementById('btnResetDayRoutines');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm(`${state.activeDate} 일자의 모든 루틴 체크를 초기화하시겠습니까?`)) {
          delete state.routineLogs[state.activeDate];
          saveToStorage('tomato_routine_logs', state.routineLogs);
          updateHeaderStats();
          renderRoutines();
          showToast('해당 일자의 체크리스트가 초기화되었습니다.', 'info');
        }
      });
    }

    const btnOpenAdd = document.getElementById('btnOpenAddRoutine');
    const modalAdd = document.getElementById('modalAddRoutine');
    const btnCloseAdd = document.getElementById('btnCloseAddRoutine');
    const btnCancelAdd = document.getElementById('btnCancelAddRoutine');
    const btnSubmitAdd = document.getElementById('btnSubmitAddRoutine');

    if (btnOpenAdd && modalAdd) {
      btnOpenAdd.addEventListener('click', () => modalAdd.classList.remove('hidden'));
    }
    const closeModal = () => modalAdd && modalAdd.classList.add('hidden');
    if (btnCloseAdd) btnCloseAdd.addEventListener('click', closeModal);
    if (btnCancelAdd) btnCancelAdd.addEventListener('click', closeModal);

    if (btnSubmitAdd) {
      btnSubmitAdd.addEventListener('click', () => {
        const title = document.getElementById('inputNewRoutineTitle').value.trim();
        const category = document.getElementById('inputNewRoutineCategory').value;
        const interval = parseInt(document.getElementById('inputNewRoutineInterval').value, 10) || 1;
        const guide = document.getElementById('inputNewRoutineGuide').value.trim();

        if (!title) {
          alert('작업 이름을 입력해 주세요.');
          return;
        }

        const newRoutine = {
          id: 'custom_' + Date.now(),
          title,
          category,
          interval,
          guide
        };

        state.routines.push(newRoutine);
        saveToStorage('tomato_routines', state.routines);
        closeModal();

        document.getElementById('inputNewRoutineTitle').value = '';
        document.getElementById('inputNewRoutineGuide').value = '';
        
        renderRoutines();
        updateHeaderStats();
        showToast('새 루틴이 성공적으로 추가되었습니다!');
      });
    }
  }

  function renderRoutines() {
    const container = document.getElementById('routineListContainer');
    if (!container) return;

    const todayLog = state.routineLogs[state.activeDate] || {};
    const total = state.routines.length;
    const completed = state.routines.filter(r => todayLog[r.id]).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const percentDisplay = document.getElementById('routinePercentDisplay');
    const progressBar = document.getElementById('routineProgressBar');
    const progressText = document.getElementById('routineProgressText');
    if (percentDisplay) percentDisplay.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) {
      progressText.textContent = `총 ${total}개 작업 중 ${completed}개 완료됨 (${percent}%)`;
    }

    const countAll = total;
    const countDaily = state.routines.filter(r => r.category === 'daily').length;
    const countWeekly = state.routines.filter(r => r.category === 'weekly').length;
    const countPeriodic = state.routines.filter(r => r.category === 'periodic').length;
    
    document.getElementById('countFilterAll').textContent = countAll;
    document.getElementById('countFilterDaily').textContent = countDaily;
    document.getElementById('countFilterWeekly').textContent = countWeekly;
    document.getElementById('countFilterPeriodic').textContent = countPeriodic;

    const filteredRoutines = state.routines.filter(r => {
      if (state.routineFilter === 'all') return true;
      return r.category === state.routineFilter;
    });

    if (filteredRoutines.length === 0) {
      container.innerHTML = `
        <div class="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-400 shadow-sm">
          <p class="text-sm font-medium">해당 카테고리의 루틴이 없습니다.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredRoutines.map(routine => {
      const isChecked = !!todayLog[routine.id];
      const categoryBadge = routine.category === 'daily'
        ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">☀️ 매일</span>'
        : routine.category === 'weekly'
        ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">📅 주간</span>'
        : '<span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">🔧 정기</span>';

      return `
        <div class="routine-card p-3.5 sm:p-4 rounded-xl border transition-all ${
          isChecked 
            ? 'bg-slate-50 border-emerald-300 opacity-90' 
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
        }">
          <div class="flex items-start justify-between gap-3">
            <label class="flex items-start gap-3 cursor-pointer flex-1 select-none">
              <input type="checkbox" data-id="${routine.id}" class="routine-checkbox mt-1 w-5 h-5 rounded-md border-slate-300 bg-white text-brand-600 focus:ring-0 focus:ring-offset-0 transition cursor-pointer" ${isChecked ? 'checked' : ''}>
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  ${categoryBadge}
                  <span class="text-sm sm:text-base font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}">
                    ${routine.title}
                  </span>
                </div>
                ${routine.guide ? `
                  <p class="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed font-medium">
                    💡 ${routine.guide}
                  </p>
                ` : ''}
              </div>
            </label>
            ${routine.id.startsWith('custom_') ? `
              <button data-delete-id="${routine.id}" class="btn-delete-routine text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition" title="루틴 삭제">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.routine-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (!state.routineLogs[state.activeDate]) {
          state.routineLogs[state.activeDate] = {};
        }
        state.routineLogs[state.activeDate][id] = e.target.checked;
        saveToStorage('tomato_routine_logs', state.routineLogs);
        
        updateHeaderStats();
        renderRoutines();

        const updatedTotal = state.routines.length;
        const updatedCompleted = state.routines.filter(r => state.routineLogs[state.activeDate][r.id]).length;
        if (updatedCompleted === updatedTotal && window.confetti) {
          window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          showToast('🎉 축하합니다! 오늘의 모든 루틴을 완수하셨습니다!');
        }
      });
    });

    container.querySelectorAll('.btn-delete-routine').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.deleteId;
        if (confirm('이 커스텀 루틴을 삭제하시겠습니까?')) {
          state.routines = state.routines.filter(r => r.id !== id);
          saveToStorage('tomato_routines', state.routines);
          renderRoutines();
          updateHeaderStats();
          showToast('루틴이 삭제되었습니다.');
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // 7. RDA Annual Scheduler Module (White Theme)
  function setupSchedulerModule() {
    const inputPlanting = document.getElementById('inputPlantingDate');
    const selectCrop = document.getElementById('selectCropType');
    const btnApply = document.getElementById('btnApplyPlantingDate');

    if (inputPlanting) {
      inputPlanting.value = state.growthProfile.plantingDate || '2026-08-25';
    }
    if (selectCrop) {
      selectCrop.value = state.growthProfile.cropType || 'long_term';
    }

    if (btnApply) {
      btnApply.addEventListener('click', () => {
        const pDate = inputPlanting.value;
        const cType = selectCrop.value;
        if (!pDate) {
          alert('정식 일자를 선택해 주세요.');
          return;
        }

        state.growthProfile.plantingDate = pDate;
        state.growthProfile.cropType = cType;
        saveToStorage('tomato_growth_profile', state.growthProfile);

        updateHeaderStats();
        renderScheduler();
        showToast('정식일 및 작형 스케줄이 성공적으로 갱신되었습니다!');
      });
    }
  }

  function renderScheduler() {
    const pDate = state.growthProfile.plantingDate || '2026-08-25';
    const dat = getDat(state.activeDate, pDate);
    const totalDays = 285;

    const displayDatCount = document.getElementById('displayDatCount');
    const displayCurrentStageName = document.getElementById('displayCurrentStageName');
    const displayCyclePercent = document.getElementById('displayCyclePercent');
    const cycleProgressBar = document.getElementById('cycleProgressBar');

    const currentStage = getCurrentStage(dat);

    if (displayDatCount) {
      if (dat < 0) displayDatCount.textContent = `D${dat}일 (정식 전)`;
      else if (dat === 0) displayDatCount.textContent = '🌱 정식 당일';
      else displayDatCount.textContent = `DAT ${dat}일차`;
    }
    if (displayCurrentStageName) {
      displayCurrentStageName.textContent = currentStage.title;
    }

    const cyclePercent = Math.max(0, Math.min(100, Math.round((Math.max(0, dat) / totalDays) * 100)));
    if (displayCyclePercent) {
      displayCyclePercent.textContent = `${cyclePercent}% (총 ${totalDays}일 중 ${Math.max(0, dat)}일 경과)`;
    }
    if (cycleProgressBar) {
      cycleProgressBar.style.width = `${Math.max(2, cyclePercent)}%`;
    }

    const container = document.getElementById('rdaStagesContainer');
    if (!container) return;

    let html = '';
    RDA_GROWTH_STAGES.forEach((stage, idx) => {
      const isCurrent = dat >= stage.dayStart && dat <= stage.dayEnd;
      const isCompleted = dat > stage.dayEnd;

      const startDateStr = addDaysToDate(pDate, stage.dayStart);
      const endDateStr = addDaysToDate(pDate, stage.dayEnd);

      let cardStyle = 'border-slate-200 bg-white shadow-sm';
      let statusBadge = '<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold border border-slate-200">예정</span>';

      if (isCurrent) {
        cardStyle = 'border-emerald-500 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/60 ring-2 ring-emerald-400 shadow-md';
        statusBadge = '<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-300 animate-pulse">🔥 현재 진행 중</span>';
      } else if (isCompleted) {
        cardStyle = 'border-slate-200 bg-slate-50 opacity-80';
        statusBadge = '<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold">✅ 완료됨</span>';
      }

      html += `
        <div class="rounded-2xl border p-4 sm:p-5 transition-all ${cardStyle}">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="w-7 h-7 rounded-lg ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'} font-black text-xs flex items-center justify-center">${idx}</span>
              <h4 class="text-base sm:text-lg font-black text-slate-900">${stage.title}</h4>
              ${statusBadge}
            </div>
            <div class="text-xs text-slate-500 font-semibold flex items-center gap-2">
              <i data-lucide="calendar" class="w-3.5 h-3.5 text-brand-600"></i>
              <span>${startDateStr} ~ ${endDateStr}</span>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-700 my-3 leading-relaxed font-medium">
            📝 ${stage.desc}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span class="text-slate-500 text-[10px] block font-bold">🌡️ 권장 주·야간 기온</span>
              <span class="font-bold text-slate-900">${stage.tempDay} / ${stage.tempNight}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] block font-bold">💧 목표 습도 / HD</span>
              <span class="font-bold text-slate-900">${stage.humidity}</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] block font-bold">🧪 공급 EC / pH</span>
              <span class="font-bold text-sky-700">${stage.targetEc} (pH ${stage.targetPh})</span>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] block font-bold">🎯 목표 배액률</span>
              <span class="font-bold text-emerald-700">${stage.targetDrain}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
            <div>
              <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <i data-lucide="list-checks" class="w-3.5 h-3.5 text-emerald-600"></i> 농진청 표준 핵심 관리 요령
              </span>
              <ul class="space-y-1 text-xs text-slate-600 pl-1 font-medium">
                ${stage.keyTasks.map(t => `<li class="flex items-start gap-1.5"><span class="text-emerald-600 font-bold">•</span> <span>${t}</span></li>`).join('')}
              </ul>
            </div>

            <div>
              <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-sky-600"></i> 단계별 체크리스트
              </span>
              <div class="space-y-1.5">
                ${stage.checklist.map((item, itemIdx) => {
                  const key = `${idx}_${itemIdx}`;
                  const isChecked = !!state.stageChecklist[key];
                  return `
                    <label class="flex items-center gap-2 text-xs text-slate-800 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 hover:border-slate-300 select-none shadow-sm">
                      <input type="checkbox" data-stage-check="${key}" class="stage-check-input w-4 h-4 rounded border-slate-300 bg-white text-emerald-600 focus:ring-0 cursor-pointer" ${isChecked ? 'checked' : ''}>
                      <span class="${isChecked ? 'line-through text-slate-400' : 'font-medium'}">${item}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.stage-check-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const key = e.target.dataset.stageCheck;
        state.stageChecklist[key] = e.target.checked;
        saveToStorage('tomato_stage_checklist', state.stageChecklist);
        renderScheduler();
        showToast('생육 단계 체크리스트가 저장되었습니다.');
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }  // 8. Bed Matrix Module (White Theme)
  function setupBedMatrixModule() {
    const taskButtons = document.querySelectorAll('.bed-task-type-btn');
    taskButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        taskButtons.forEach(b => {
          b.classList.remove('active', 'border-brand-500', 'bg-brand-600', 'text-white', 'shadow-sm');
          b.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-700');
        });
        btn.classList.add('active', 'border-brand-500', 'bg-brand-600', 'text-white', 'shadow-sm');
        btn.classList.remove('border-slate-200', 'bg-slate-50', 'text-slate-700');
        state.activeBedTask = btn.dataset.task;
        state.selectedBeds.clear();
        renderBedMatrix();
      });
    });

    const totalBeds = state.settings.bedCount || 24;
    function selectBedRange(start, end) {
      state.selectedBeds.clear();
      for (let i = start; i <= Math.min(end, totalBeds); i++) {
        state.selectedBeds.add(i);
      }
      renderBedMatrix();
    }

    const btnZ1 = document.getElementById('btnSelectZone1');
    const btnZ2 = document.getElementById('btnSelectZone2');
    const btnZ3 = document.getElementById('btnSelectZone3');
    const btnZ4 = document.getElementById('btnSelectZone4');
    const btnAll = document.getElementById('btnSelectAllBeds');
    const btnClear = document.getElementById('btnClearBedSelection');
    const btnBatchComplete = document.getElementById('btnBatchCompleteBeds');

    if (btnZ1) btnZ1.addEventListener('click', () => selectBedRange(1, 6));
    if (btnZ2) btnZ2.addEventListener('click', () => selectBedRange(7, 12));
    if (btnZ3) btnZ3.addEventListener('click', () => selectBedRange(13, 18));
    if (btnZ4) btnZ4.addEventListener('click', () => selectBedRange(19, 24));
    if (btnAll) btnAll.addEventListener('click', () => selectBedRange(1, totalBeds));
    if (btnClear) btnClear.addEventListener('click', () => {
      state.selectedBeds.clear();
      renderBedMatrix();
    });

    if (btnBatchComplete) {
      btnBatchComplete.addEventListener('click', () => {
        if (state.selectedBeds.size === 0) return;
        if (!state.bedStatus[state.activeBedTask]) {
          state.bedStatus[state.activeBedTask] = {};
        }

        state.selectedBeds.forEach(bedNum => {
          state.bedStatus[state.activeBedTask][bedNum] = {
            status: 'done',
            date: state.activeDate
          };
        });

        saveToStorage('tomato_bed_status', state.bedStatus);
        const count = state.selectedBeds.size;
        state.selectedBeds.clear();
        renderBedMatrix();
        showToast(`${count}개 베드의 작업이 오늘 완료로 기록되었습니다!`);
      });
    }
  }

  function renderBedMatrix() {
    const container = document.getElementById('bedGridContainer');
    if (!container) return;

    const totalBeds = state.settings.bedCount || 24;
    const task = state.activeBedTask || 'suckering';
    const taskStatusMap = state.bedStatus[task] || {};

    const bedTotalCountText = document.getElementById('bedTotalCountText');
    if (bedTotalCountText) bedTotalCountText.textContent = `${totalBeds}개`;

    let completedCount = 0;
    for (let i = 1; i <= totalBeds; i++) {
      if (taskStatusMap[i] && taskStatusMap[i].status === 'done') {
        completedCount++;
      }
    }
    const taskPercent = totalBeds > 0 ? Math.round((completedCount / totalBeds) * 100) : 0;
    const completionDisplay = document.getElementById('bedTaskCompletionDisplay');
    if (completionDisplay) {
      completionDisplay.textContent = `${completedCount} / ${totalBeds} (${taskPercent}%)`;
    }

    const selectedCountText = document.getElementById('selectedBedCountText');
    const btnBatchComplete = document.getElementById('btnBatchCompleteBeds');
    if (selectedCountText) selectedCountText.textContent = `선택 ${state.selectedBeds.size}개`;
    if (btnBatchComplete) {
      btnBatchComplete.disabled = state.selectedBeds.size === 0;
    }

    let html = '';
    const today = new Date();

    for (let bedNum = 1; bedNum <= totalBeds; bedNum++) {
      const data = taskStatusMap[bedNum] || { status: 'pending', date: null };
      const isSelected = state.selectedBeds.has(bedNum);

      let daysElapsed = null;
      let isOverdue = false;
      let dateLabel = '기록 없음';

      if (data.date) {
        const [y, m, d] = data.date.split('-');
        const itemDate = new Date(y, m - 1, d);
        const diffTime = today.getTime() - itemDate.getTime();
        daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (daysElapsed === 0) dateLabel = '오늘 완료';
        else if (daysElapsed === 1) dateLabel = '어제 완료';
        else dateLabel = `${daysElapsed}일 전 완료`;

        if (daysElapsed >= 7) isOverdue = true;
      }

      let statusBadge = '';
      let borderClass = 'border-slate-200 bg-white shadow-sm';

      if (data.status === 'done') {
        borderClass = 'border-emerald-300 bg-emerald-50/80 shadow-sm';
        statusBadge = '<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">완료</span>';
      } else if (data.status === 'in_progress') {
        borderClass = 'border-amber-300 bg-amber-50/80 shadow-sm';
        statusBadge = '<span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200">진행중</span>';
      } else {
        statusBadge = '<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px] border border-slate-200">미작업</span>';
      }

      if (isSelected) {
        borderClass = 'ring-2 ring-brand-500 bg-rose-50/50 shadow-md';
      }

      html += `
        <div data-bed="${bedNum}" class="bed-card relative p-3 sm:p-4 rounded-xl border ${borderClass} cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between select-none">
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="text-xs sm:text-sm font-black text-slate-900">Bed ${String(bedNum).padStart(2, '0')}</span>
            ${statusBadge}
          </div>
          <div class="space-y-1 my-1">
            <div class="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
              <i data-lucide="clock" class="w-3 h-3 text-slate-400"></i>
              <span class="${isOverdue ? 'text-rose-600 font-bold' : ''}">${dateLabel}</span>
            </div>
            ${isOverdue ? `<div class="text-[10px] text-rose-600 font-bold flex items-center gap-1 animate-pulse"><span>⚠️ ${daysElapsed}일 경과 (지연)</span></div>` : ''}
          </div>
          <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>클릭: 상태변경</span>
            <button data-select-bed="${bedNum}" class="btn-select-single text-xs ${isSelected ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'}">
              ${isSelected ? '선택됨' : '선택'}
            </button>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    container.querySelectorAll('.bed-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-select-single')) {
          e.stopPropagation();
          const bedNum = parseInt(card.dataset.bed, 10);
          if (state.selectedBeds.has(bedNum)) state.selectedBeds.delete(bedNum);
          else state.selectedBeds.add(bedNum);
          renderBedMatrix();
          return;
        }

        const bedNum = parseInt(card.dataset.bed, 10);
        if (!state.bedStatus[task]) state.bedStatus[task] = {};
        const currentStatus = (state.bedStatus[task][bedNum] && state.bedStatus[task][bedNum].status) || 'pending';

        let nextStatus = 'done';
        if (currentStatus === 'pending') nextStatus = 'in_progress';
        else if (currentStatus === 'in_progress') nextStatus = 'done';
        else if (currentStatus === 'done') nextStatus = 'pending';

        state.bedStatus[task][bedNum] = {
          status: nextStatus,
          date: nextStatus !== 'pending' ? state.activeDate : null
        };

        saveToStorage('tomato_bed_status', state.bedStatus);
        renderBedMatrix();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // 9. Daily Log Module with Weather Auto-Fill (White Theme)
  let currentUploadedPhotoBase64 = null;

  function setupDailyLogModule() {
    const inSupplyEc = document.getElementById('inputSupplyEc');
    const inDrainEc = document.getElementById('inputDrainEc');
    const inSupplyPh = document.getElementById('inputSupplyPh');
    const inDrainPh = document.getElementById('inputDrainPh');
    const inSupplyVol = document.getElementById('inputSupplyVolume');
    const inDrainVol = document.getElementById('inputDrainVolume');

    const inGradeA = document.getElementById('inputHarvestGradeA');
    const inGradeB = document.getElementById('inputHarvestGradeB');
    const inGradeC = document.getElementById('inputHarvestGradeC');

    function updateCalculations() {
      const sEc = parseFloat(inSupplyEc.value);
      const dEc = parseFloat(inDrainEc.value);
      const ecDiffEl = document.getElementById('displayEcDiff');
      const badgeEc = document.getElementById('badgeEcStatus');
      if (!isNaN(sEc) && !isNaN(dEc)) {
        const diff = (dEc - sEc).toFixed(2);
        ecDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff} dS/m`;
        if (dEc >= sEc + 0.3 && dEc <= sEc + 0.8) {
          badgeEc.textContent = '적정';
          badgeEc.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
        } else if (dEc > sEc + 0.8) {
          badgeEc.textContent = '배액EC 높음';
          badgeEc.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200';
        } else {
          badgeEc.textContent = '배액EC 낮음';
          badgeEc.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-sky-100 text-sky-800 border border-sky-200';
        }
      } else {
        ecDiffEl.textContent = '-';
        badgeEc.textContent = '대기';
        badgeEc.className = 'text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold';
      }

      const sPh = parseFloat(inSupplyPh.value);
      const dPh = parseFloat(inDrainPh.value);
      const phDiffEl = document.getElementById('displayPhDiff');
      const badgePh = document.getElementById('badgePhStatus');
      if (!isNaN(sPh) && !isNaN(dPh)) {
        const diff = (dPh - sPh).toFixed(2);
        phDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff}`;
        if (dPh >= 5.8 && dPh <= 6.8) {
          badgePh.textContent = '적정';
          badgePh.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
        } else {
          badgePh.textContent = '주의';
          badgePh.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200';
        }
      } else {
        phDiffEl.textContent = '-';
        badgePh.textContent = '대기';
        badgePh.className = 'text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold';
      }

      const sVol = parseFloat(inSupplyVol.value);
      const dVol = parseFloat(inDrainVol.value);
      const drainRateEl = document.getElementById('displayDrainRate');
      const badgeDrain = document.getElementById('badgeDrainRateStatus');
      if (!isNaN(sVol) && sVol > 0 && !isNaN(dVol) && dVol >= 0) {
        const rate = ((dVol / sVol) * 100).toFixed(1);
        drainRateEl.textContent = `${rate}%`;
        const minTarget = state.settings.targetDrainMin || 20;
        const maxTarget = state.settings.targetDrainMax || 30;

        if (rate >= minTarget && rate <= maxTarget) {
          drainRateEl.className = 'text-base font-black text-emerald-600';
          badgeDrain.textContent = '적정 (20~30%)';
          badgeDrain.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
        } else if (rate < minTarget) {
          drainRateEl.className = 'text-base font-black text-amber-600';
          badgeDrain.textContent = '부족 (염류집적 주의)';
          badgeDrain.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200';
        } else {
          drainRateEl.className = 'text-base font-black text-rose-600';
          badgeDrain.textContent = '과다 (급액 조절 필요)';
          badgeDrain.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200';
        }
      } else {
        drainRateEl.textContent = '- %';
        drainRateEl.className = 'text-base font-black text-slate-400';
        badgeDrain.textContent = '-';
        badgeDrain.className = 'text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold';
      }

      const gA = parseFloat(inGradeA.value) || 0;
      const gB = parseFloat(inGradeB.value) || 0;
      const gC = parseFloat(inGradeC.value) || 0;
      const totalKg = (gA * 5) + (gB * 5) + gC;
      const totalHarvestEl = document.getElementById('displayTotalHarvestKg');
      if (totalHarvestEl) {
        totalHarvestEl.textContent = `총 수확: ${totalKg.toFixed(1)} kg (${gA + gB}박스 + ${gC}kg)`;
      }
    }

    [inSupplyEc, inDrainEc, inSupplyPh, inDrainPh, inSupplyVol, inDrainVol, inGradeA, inGradeB, inGradeC].forEach(input => {
      if (input) input.addEventListener('input', updateCalculations);
    });

    // 1-Click Weather Auto Fill
    const btnAutoFill = document.getElementById('btnAutoFillWeather');
    if (btnAutoFill) {
      btnAutoFill.addEventListener('click', () => {
        if (!state.weatherData || !state.weatherData.current) {
          alert('기상 데이터를 먼저 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
          return;
        }

        const cur = state.weatherData.current;
        const daily = state.weatherData.daily || {};
        const reg = WEATHER_REGIONS[state.selectedRegionKey] || WEATHER_REGIONS.buyeo;

        const tMax = Math.round((daily.temperature_2m_max && daily.temperature_2m_max[0]) || cur.temperature_2m + 2);
        const tMin = Math.round((daily.temperature_2m_min && daily.temperature_2m_min[0]) || cur.temperature_2m - 5);
        const humidity = cur.relative_humidity_2m || 70;
        const solarSumMJ = (daily.shortwave_radiation_sum && daily.shortwave_radiation_sum[0]) || 14.5;
        const solarJ = Math.round(solarSumMJ * 100);

        document.getElementById('inputTempHigh').value = tMax;
        document.getElementById('inputTempLow').value = tMin;
        document.getElementById('inputHumidity').value = humidity;
        document.getElementById('inputSolarRadiation').value = solarJ;

        const wInfo = getWeatherDesc(cur.weather_code);
        const memoEl = document.getElementById('inputDailyMemo');
        if (!memoEl.value.trim()) {
          memoEl.value = `[기상정보] ${reg.name} ${wInfo.text} (최고 ${tMax}℃ / 최저 ${tMin}℃, 일사량 ${solarJ} J/cm²). 일사비례 급액 정상 진행.`;
        }

        showToast('⛅ 오늘 기상청 날씨 데이터가 일지에 자동 입력되었습니다!');
      });
    }

    const photoFileInput = document.getElementById('inputPhotoFile');
    const photoPreviewBox = document.getElementById('photoPreviewBox');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const btnRemovePhoto = document.getElementById('btnRemovePhoto');

    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            currentUploadedPhotoBase64 = event.target.result;
            if (photoPreviewImg) photoPreviewImg.src = currentUploadedPhotoBase64;
            if (photoPreviewBox) photoPreviewBox.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', () => {
        currentUploadedPhotoBase64 = null;
        if (photoFileInput) photoFileInput.value = '';
        if (photoPreviewImg) photoPreviewImg.src = '';
        if (photoPreviewBox) photoPreviewBox.classList.add('hidden');
      });
    }

    const btnSaveLog = document.getElementById('btnSaveDailyLog');
    if (btnSaveLog) {
      btnSaveLog.addEventListener('click', () => {
        const logData = {
          date: state.activeDate,
          supplyEc: parseFloat(inSupplyEc.value) || null,
          drainEc: parseFloat(inDrainEc.value) || null,
          supplyPh: parseFloat(inSupplyPh.value) || null,
          drainPh: parseFloat(inDrainPh.value) || null,
          supplyVolume: parseFloat(inSupplyVol.value) || null,
          drainVolume: parseFloat(inDrainVol.value) || null,
          harvestGradeA: parseFloat(inGradeA.value) || 0,
          harvestGradeB: parseFloat(inGradeB.value) || 0,
          harvestGradeC: parseFloat(inGradeC.value) || 0,
          tempHigh: parseFloat(document.getElementById('inputTempHigh').value) || null,
          tempLow: parseFloat(document.getElementById('inputTempLow').value) || null,
          humidity: parseFloat(document.getElementById('inputHumidity').value) || null,
          solarRadiation: parseFloat(document.getElementById('inputSolarRadiation').value) || null,
          memo: document.getElementById('inputDailyMemo').value.trim(),
          photo: currentUploadedPhotoBase64 || null,
          updatedAt: new Date().toISOString()
        };

        state.dailyLogs[state.activeDate] = logData;
        saveToStorage('tomato_daily_logs', state.dailyLogs);

        updateHeaderStats();
        renderLogHistory();
        if (window.confetti) {
          window.confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
        }
        showToast(`${state.activeDate} 영농일지가 저장되었습니다!`);
      });
    }
  }

  function renderDailyLogForm() {
    const existing = state.dailyLogs[state.activeDate];
    const formDate = document.getElementById('formCurrentDate');
    if (formDate) formDate.textContent = state.activeDate;

    document.getElementById('inputSupplyEc').value = existing && existing.supplyEc !== null ? existing.supplyEc : '';
    document.getElementById('inputDrainEc').value = existing && existing.drainEc !== null ? existing.drainEc : '';
    document.getElementById('inputSupplyPh').value = existing && existing.supplyPh !== null ? existing.supplyPh : '';
    document.getElementById('inputDrainPh').value = existing && existing.drainPh !== null ? existing.drainPh : '';
    document.getElementById('inputSupplyVolume').value = existing && existing.supplyVolume !== null ? existing.supplyVolume : '';
    document.getElementById('inputDrainVolume').value = existing && existing.drainVolume !== null ? existing.drainVolume : '';

    document.getElementById('inputHarvestGradeA').value = existing && existing.harvestGradeA !== null ? existing.harvestGradeA : '';
    document.getElementById('inputHarvestGradeB').value = existing && existing.harvestGradeB !== null ? existing.harvestGradeB : '';
    document.getElementById('inputHarvestGradeC').value = existing && existing.harvestGradeC !== null ? existing.harvestGradeC : '';

    document.getElementById('inputTempHigh').value = existing && existing.tempHigh !== null ? existing.tempHigh : '';
    document.getElementById('inputTempLow').value = existing && existing.tempLow !== null ? existing.tempLow : '';
    document.getElementById('inputHumidity').value = existing && existing.humidity !== null ? existing.humidity : '';
    document.getElementById('inputSolarRadiation').value = existing && existing.solarRadiation !== null ? existing.solarRadiation : '';
    document.getElementById('inputDailyMemo').value = existing && existing.memo ? existing.memo : '';

    currentUploadedPhotoBase64 = (existing && existing.photo) || null;
    const photoPreviewBox = document.getElementById('photoPreviewBox');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    if (currentUploadedPhotoBase64 && photoPreviewBox && photoPreviewImg) {
      photoPreviewImg.src = currentUploadedPhotoBase64;
      photoPreviewBox.classList.remove('hidden');
    } else if (photoPreviewBox) {
      photoPreviewBox.classList.add('hidden');
    }

    const inSupplyEc = document.getElementById('inputSupplyEc');
    if (inSupplyEc) inSupplyEc.dispatchEvent(new Event('input'));

    renderLogHistory();
  }

  function renderLogHistory() {
    const container = document.getElementById('logHistoryListContainer');
    if (!container) return;

    const dates = Object.keys(state.dailyLogs).sort((a, b) => b.localeCompare(a));
    if (dates.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium">
          아직 저장된 일일 영농일지가 없습니다. 위에서 데이터를 입력하고 저장해 보세요!
        </div>
      `;
      return;
    }

    container.innerHTML = dates.slice(0, 10).map(d => {
      const item = state.dailyLogs[d];
      const isSelected = d === state.activeDate;
      const drainRate = (item.supplyVolume > 0 && item.drainVolume >= 0)
        ? ((item.drainVolume / item.supplyVolume) * 100).toFixed(1) + '%'
        : '-';
      const harvestKg = ((item.harvestGradeA || 0) * 5) + ((item.harvestGradeB || 0) * 5) + (item.harvestGradeC || 0);

      return `
        <div class="p-3.5 sm:p-4 rounded-xl border transition ${
          isSelected ? 'border-brand-300 bg-rose-50/50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 shadow-sm'
        }">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-slate-900">${formatKoreanDate(d)}</span>
              ${isSelected ? '<span class="text-[10px] px-2 py-0.5 rounded bg-brand-100 text-brand-700 font-bold border border-brand-200">선택중</span>' : ''}
            </div>
            
            <div class="flex items-center gap-3 text-xs text-slate-600 font-medium flex-wrap">
              <span>EC: <b class="text-slate-900">${item.supplyEc || '-'} / ${item.drainEc || '-'}</b></span>
              <span>배액률: <b class="text-emerald-700 font-bold">${drainRate}</b></span>
              <span>수확: <b class="text-brand-700 font-bold">${harvestKg.toFixed(1)} kg</b></span>
              <button data-load-date="${d}" class="btn-history-load text-xs text-sky-700 hover:text-sky-900 font-bold px-2 py-1 bg-slate-100 rounded-lg">불러오기</button>
              <button data-del-date="${d}" class="btn-history-del text-slate-400 hover:text-rose-600 p-1"><i data-lucide="trash" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
          ${item.memo ? `
            <p class="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200 font-medium">
              📝 ${item.memo}
            </p>
          ` : ''}
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-history-load').forEach(btn => {
      btn.addEventListener('click', () => {
        const dateStr = btn.dataset.loadDate;
        const dateInput = document.getElementById('dateInputHidden');
        if (dateInput) {
          dateInput.value = dateStr;
          dateInput.dispatchEvent(new Event('change'));
        }
      });
    });

    container.querySelectorAll('.btn-history-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const dateStr = btn.dataset.delDate;
        if (confirm(`${dateStr} 일지의 데이터를 삭제하시겠습니까?`)) {
          delete state.dailyLogs[dateStr];
          saveToStorage('tomato_daily_logs', state.dailyLogs);
          updateHeaderStats();
          renderDailyLogForm();
          showToast('해당 일지가 삭제되었습니다.');
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }  // 10. Analytics Module (Chart.js - White Theme)
  let chartEcInstance = null;
  let chartPhInstance = null;
  let chartDrainInstance = null;
  let chartHarvestInstance = null;

  function setupAnalyticsModule() {
    const rangeButtons = document.querySelectorAll('.analytics-range-btn');
    rangeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        rangeButtons.forEach(b => {
          b.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm');
          b.classList.add('text-slate-600');
        });
        btn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm');
        btn.classList.remove('text-slate-600');
        state.analyticsRange = parseInt(btn.dataset.range, 10) || 7;
        renderAnalytics();
      });
    });
  }

  function renderAnalytics() {
    const daysCount = state.analyticsRange || 7;
    const labels = [];
    const dateKeys = [];

    const todayObj = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(todayObj.getDate() - i);
      const str = formatLocalDate(d);
      dateKeys.push(str);
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }

    const supplyEcData = [];
    const drainEcData = [];
    const supplyPhData = [];
    const drainPhData = [];
    const drainRateData = [];
    const harvestData = [];

    let totalHarvestSum = 0;
    let drainRateSum = 0;
    let drainRateCount = 0;
    let supplyEcSum = 0;
    let supplyEcCount = 0;

    dateKeys.forEach(dateStr => {
      const item = state.dailyLogs[dateStr] || {};
      
      supplyEcData.push(item.supplyEc !== undefined ? item.supplyEc : null);
      drainEcData.push(item.drainEc !== undefined ? item.drainEc : null);
      if (item.supplyEc) {
        supplyEcSum += item.supplyEc;
        supplyEcCount++;
      }

      supplyPhData.push(item.supplyPh !== undefined ? item.supplyPh : null);
      drainPhData.push(item.drainPh !== undefined ? item.drainPh : null);

      if (item.supplyVolume > 0 && item.drainVolume >= 0) {
        const rate = (item.drainVolume / item.supplyVolume) * 100;
        drainRateData.push(parseFloat(rate.toFixed(1)));
        drainRateSum += rate;
        drainRateCount++;
      } else {
        drainRateData.push(null);
      }

      const hKg = ((item.harvestGradeA || 0) * 5) + ((item.harvestGradeB || 0) * 5) + (item.harvestGradeC || 0);
      harvestData.push(hKg);
      totalHarvestSum += hKg;
    });

    document.getElementById('kpiTotalHarvest').textContent = `${totalHarvestSum.toFixed(1)} kg`;
    document.getElementById('kpiAvgDrainRate').textContent = drainRateCount > 0 ? `${(drainRateSum / drainRateCount).toFixed(1)}%` : '0%';
    document.getElementById('kpiAvgSupplyEc').textContent = supplyEcCount > 0 ? (supplyEcSum / supplyEcCount).toFixed(2) : '0.0';

    let routineSum = 0;
    let routineCount = 0;
    const totalRoutines = state.routines.length || 1;
    dateKeys.forEach(dateStr => {
      if (state.routineLogs[dateStr]) {
        const completed = state.routines.filter(r => state.routineLogs[dateStr][r.id]).length;
        routineSum += (completed / totalRoutines) * 100;
        routineCount++;
      }
    });
    document.getElementById('kpiAvgRoutineRate').textContent = routineCount > 0 ? `${Math.round(routineSum / routineCount)}%` : '0%';

    if (!window.Chart) return;

    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#334155', font: { family: 'Pretendard', size: 11, weight: 'bold' } } }
      },
      scales: {
        x: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#64748b', font: { size: 10, weight: '600' } } },
        y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#64748b', font: { size: 10, weight: '600' } } }
      }
    };

    const ctxEc = document.getElementById('chartEcTrends');
    if (ctxEc) {
      if (chartEcInstance) chartEcInstance.destroy();
      chartEcInstance = new Chart(ctxEc, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: '공급 EC', data: supplyEcData, borderColor: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.1)', tension: 0.3, spanGaps: true },
            { label: '배액 EC', data: drainEcData, borderColor: '#38bdf8', backgroundColor: 'transparent', borderDash: [5, 5], tension: 0.3, spanGaps: true }
          ]
        },
        options: chartDefaults
      });
    }

    const ctxPh = document.getElementById('chartPhTrends');
    if (ctxPh) {
      if (chartPhInstance) chartPhInstance.destroy();
      chartPhInstance = new Chart(ctxPh, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: '공급 pH', data: supplyPhData, borderColor: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.1)', tension: 0.3, spanGaps: true },
            { label: '배액 pH', data: drainPhData, borderColor: '#34d399', backgroundColor: 'transparent', borderDash: [5, 5], tension: 0.3, spanGaps: true }
          ]
        },
        options: chartDefaults
      });
    }

    const ctxDrain = document.getElementById('chartDrainRateTrends');
    if (ctxDrain) {
      if (chartDrainInstance) chartDrainInstance.destroy();
      chartDrainInstance = new Chart(ctxDrain, {
        type: 'line',
        data: {
          labels,
          datasets: [{ label: '일일 배액률 (%)', data: drainRateData, borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', fill: true, tension: 0.3, spanGaps: true }]
        },
        options: {
          ...chartDefaults,
          scales: {
            ...chartDefaults.scales,
            y: { ...chartDefaults.scales.y, min: 0, max: 50, ticks: { ...chartDefaults.scales.y.ticks, callback: (val) => `${val}%` } }
          }
        }
      });
    }

    const ctxHarvest = document.getElementById('chartHarvestTrends');
    if (ctxHarvest) {
      if (chartHarvestInstance) chartHarvestInstance.destroy();
      chartHarvestInstance = new Chart(ctxHarvest, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: '완숙토마토 수확량 (kg)', data: harvestData, backgroundColor: '#e11d48', borderRadius: 6 }]
        },
        options: chartDefaults
      });
    }
  }

  // 11. Settings & Backup Module (White Theme)
  function setupSettingsModule() {
    const btnSaveSettings = document.getElementById('btnSaveFarmSettings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        state.settings.farmName = document.getElementById('settingFarmName').value.trim() || '토마토 스마트팜';
        state.settings.bedCount = parseInt(document.getElementById('settingBedCount').value, 10) || 24;
        state.settings.targetSupplyEc = parseFloat(document.getElementById('settingTargetSupplyEc').value) || 2.4;
        state.settings.targetSupplyPh = parseFloat(document.getElementById('settingTargetSupplyPh').value) || 5.8;
        state.settings.targetDrainMin = parseFloat(document.getElementById('settingTargetDrainMin').value) || 20;
        state.settings.targetDrainMax = parseFloat(document.getElementById('settingTargetDrainMax').value) || 30;

        saveToStorage('tomato_settings', state.settings);
        updateHeaderStats();
        showToast('농장 및 온실 설정이 저장되었습니다!');
      });
    }

    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        const dates = Object.keys(state.dailyLogs).sort();
        if (dates.length === 0) {
          alert('내보낼 일일 영농 데이터가 없습니다.');
          return;
        }

        let csvContent = '\uFEFF';
        csvContent += '날짜,공급EC,배액EC,공급pH,배액pH,급액량(L),배액량(L),배액률(%),특품(상자),보통(상자),파과(kg),총수확(kg),최고기온(℃),최저기온(℃),습도(%),일사량(J),메모\n';

        dates.forEach(d => {
          const l = state.dailyLogs[d];
          const drainRate = (l.supplyVolume > 0 && l.drainVolume >= 0) ? ((l.drainVolume / l.supplyVolume) * 100).toFixed(1) : '';
          const totalKg = ((l.harvestGradeA || 0) * 5) + ((l.harvestGradeB || 0) * 5) + (l.harvestGradeC || 0);
          const memoClean = (l.memo || '').replace(/"/g, '""');

          csvContent += `"${d}","${l.supplyEc || ''}","${l.drainEc || ''}","${l.supplyPh || ''}","${l.drainPh || ''}","${l.supplyVolume || ''}","${l.drainVolume || ''}","${drainRate}","${l.harvestGradeA || 0}","${l.harvestGradeB || 0}","${l.harvestGradeC || 0}","${totalKg.toFixed(1)}","${l.tempHigh || ''}","${l.tempLow || ''}","${l.humidity || ''}","${l.solarRadiation || ''}","${memoClean}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `토마토스마트팜_영농일지_${getTodayString()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('엑셀(CSV) 파일이 다운로드되었습니다.');
      });
    }

    const btnExportJson = document.getElementById('btnExportJson');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        const fullBackup = {
          version: '1.4',
          exportedAt: new Date().toISOString(),
          settings: state.settings,
          selectedRegionKey: state.selectedRegionKey,
          growthProfile: state.growthProfile,
          stageChecklist: state.stageChecklist,
          routines: state.routines,
          routineLogs: state.routineLogs,
          bedStatus: state.bedStatus,
          dailyLogs: state.dailyLogs
        };

        const jsonStr = JSON.stringify(fullBackup, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `토마토스마트팜_전체백업_${getTodayString()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('전체 데이터 백업 파일(JSON)이 다운로드되었습니다.');
      });
    }

    const inputImportJson = document.getElementById('inputImportJson');
    if (inputImportJson) {
      inputImportJson.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.settings) state.settings = data.settings;
            if (data.selectedRegionKey) state.selectedRegionKey = data.selectedRegionKey;
            if (data.growthProfile) state.growthProfile = data.growthProfile;
            if (data.stageChecklist) state.stageChecklist = data.stageChecklist;
            if (data.routines) state.routines = data.routines;
            if (data.routineLogs) state.routineLogs = data.routineLogs;
            if (data.bedStatus) state.bedStatus = data.bedStatus;
            if (data.dailyLogs) state.dailyLogs = data.dailyLogs;

            saveToStorage('tomato_settings', state.settings);
            saveToStorage('tomato_weather_region', state.selectedRegionKey);
            saveToStorage('tomato_growth_profile', state.growthProfile);
            saveToStorage('tomato_stage_checklist', state.stageChecklist);
            saveToStorage('tomato_routines', state.routines);
            saveToStorage('tomato_routine_logs', state.routineLogs);
            saveToStorage('tomato_bed_status', state.bedStatus);
            saveToStorage('tomato_daily_logs', state.dailyLogs);

            fetchWeatherData(state.selectedRegionKey);
            updateHeaderStats();
            renderActiveTab();
            showToast('백업 데이터가 성공적으로 복원되었습니다!');
          } catch (err) {
            alert('백업 파일 형식이 올바르지 않습니다.');
          }
        };
        reader.readAsText(file);
      });
    }

    const btnLoadSample = document.getElementById('btnLoadSampleData');
    if (btnLoadSample) {
      btnLoadSample.addEventListener('click', () => {
        if (confirm('최근 7일치 완숙토마토 스마트팜 샘플 데이터를 채우시겠습니까?')) {
          seedSampleData();
          updateHeaderStats();
          renderActiveTab();
          showToast('최근 7일치 샘플 데이터가 성공적으로 생성되었습니다!');
        }
      });
    }

    const btnResetAll = document.getElementById('btnResetAllData');
    if (btnResetAll) {
      btnResetAll.addEventListener('click', () => {
        if (confirm('⚠️ 경고: 모든 영농 기록 및 설정이 초기화됩니다. 계속하시겠습니까?')) {
          localStorage.clear();
          state.settings = { ...DEFAULT_SETTINGS };
          state.selectedRegionKey = 'buyeo';
          state.growthProfile = { ...DEFAULT_GROWTH_PROFILE };
          state.stageChecklist = {};
          state.routines = [...DEFAULT_ROUTINES];
          state.routineLogs = {};
          state.bedStatus = {};
          state.dailyLogs = {};
          updateHeaderStats();
          renderActiveTab();
          showToast('모든 데이터가 초기화되었습니다.', 'info');
        }
      });
    }
  }

  function renderSettings() {
    document.getElementById('settingFarmName').value = state.settings.farmName || '토마토 스마트팜';
    document.getElementById('settingBedCount').value = state.settings.bedCount || 24;
    document.getElementById('settingTargetSupplyEc').value = state.settings.targetSupplyEc || 2.4;
    document.getElementById('settingTargetSupplyPh').value = state.settings.targetSupplyPh || 5.8;
    document.getElementById('settingTargetDrainMin').value = state.settings.targetDrainMin || 20;
    document.getElementById('settingTargetDrainMax').value = state.settings.targetDrainMax || 30;
  }

  function seedSampleData() {
    const today = new Date();
    const bedCount = state.settings.bedCount || 24;

    const tasks = ['suckering', 'defoliation', 'thinning', 'harvest', 'dripper'];
    tasks.forEach(task => {
      state.bedStatus[task] = {};
      for (let i = 1; i <= bedCount; i++) {
        const rand = Math.random();
        if (rand > 0.35) {
          const daysAgo = Math.floor(Math.random() * 6);
          const d = new Date();
          d.setDate(today.getDate() - daysAgo);
          state.bedStatus[task][i] = { status: 'done', date: formatLocalDate(d) };
        } else if (rand > 0.15) {
          state.bedStatus[task][i] = { status: 'in_progress', date: formatLocalDate(today) };
        } else {
          const daysAgo = 8 + Math.floor(Math.random() * 4);
          const d = new Date();
          d.setDate(today.getDate() - daysAgo);
          state.bedStatus[task][i] = { status: 'pending', date: formatLocalDate(d) };
        }
      }
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = formatLocalDate(d);

      const supplyVol = 1500 + Math.floor(Math.random() * 200);
      const drainRate = 22 + Math.random() * 8;
      const drainVol = Math.round(supplyVol * (drainRate / 100));

      const supplyEc = parseFloat((2.3 + Math.random() * 0.2).toFixed(2));
      const drainEc = parseFloat((supplyEc + 0.5 + Math.random() * 0.3).toFixed(2));
      const supplyPh = parseFloat((5.7 + Math.random() * 0.2).toFixed(2));
      const drainPh = parseFloat((6.1 + Math.random() * 0.3).toFixed(2));

      const gradeA = 20 + Math.floor(Math.random() * 15);
      const gradeB = 8 + Math.floor(Math.random() * 6);
      const gradeC = parseFloat((3.0 + Math.random() * 4.0).toFixed(1));

      state.dailyLogs[dStr] = {
        date: dStr,
        supplyEc,
        drainEc,
        supplyPh,
        drainPh,
        supplyVolume: supplyVol,
        drainVolume: drainVol,
        harvestGradeA: gradeA,
        harvestGradeB: gradeB,
        harvestGradeC: gradeC,
        tempHigh: parseFloat((27.5 + Math.random() * 2).toFixed(1)),
        tempLow: parseFloat((16.0 + Math.random() * 1.5).toFixed(1)),
        humidity: Math.floor(68 + Math.random() * 10),
        solarRadiation: 1350 + Math.floor(Math.random() * 300),
        memo: i === 0 ? '오늘 1~12번 베드 곁순 제거 완료. 착색도 매우 우수.' : '정상 생육 중. 급액 및 배액률 적정 범위 유지.',
        updatedAt: new Date().toISOString()
      };

      state.routineLogs[dStr] = {};
      state.routines.forEach(r => {
        if (Math.random() > 0.2) {
          state.routineLogs[dStr][r.id] = true;
        }
      });
    }

    saveToStorage('tomato_bed_status', state.bedStatus);
    saveToStorage('tomato_daily_logs', state.dailyLogs);
    saveToStorage('tomato_routine_logs', state.routineLogs);
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();