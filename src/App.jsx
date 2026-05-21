import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const C = {
  bg: "#F7F4EF",
  card: "#FFFFFF",
  sage: "#6FA882",
  sageSoft: "#EAF3ED",
  sageDeep: "#3D7A56",
  rose: "#D4806A",
  roseSoft: "#FAECEA",
  roseDeep: "#A84F3A",
  gold: "#C9A052",
  goldSoft: "#FBF4E4",
  ink: "#28221E",
  muted: "#8A7E78",
  line: "#EDE7DF",
  warm: "#F2EBE2",
};

// ── 멤버 ──
const ALL_MEMBERS = [
  { id: 1, name: "서희",  role: "원장",   avatar: "👑", canHelp: true  },
  { id: 2, name: "민경",  role: "부원장", avatar: "✂️", canHelp: true  },
  { id: 3, name: "하늘",  role: "디자이너", avatar: "🌿", canHelp: true  },
  { id: 4, name: "지유",  role: "디자이너", avatar: "🎨", canHelp: true  },
  { id: 5, name: "계완",  role: "대표",   avatar: "📋", canHelp: false },
];

// ── 도움 항목 ──
const HELP_TASKS = [
  { id: "h1",  icon: "🚿", text: "샴푸 서브",              area: "시술" },
  { id: "h2",  icon: "🎨", text: "염색·연화 샴푸",         area: "시술" },
  { id: "h3",  icon: "🧪", text: "염색 준비",              area: "시술" },
  { id: "h4",  icon: "💈", text: "염색 같이 바르기",        area: "시술" },
  { id: "h5",  icon: "💨", text: "머리 같이 건조",          area: "시술" },
  { id: "h6",  icon: "🔥", text: "열처리 기계 갖다주기·치우기", area: "시술" },
  { id: "h7",  icon: "💆", text: "펌 시술 서브",            area: "시술" },
  { id: "h8",  icon: "🪑", text: "다음 손님 시술 자리 정리", area: "정리" },
  { id: "h9",  icon: "🧹", text: "대기석 정리",             area: "정리" },
  { id: "h10", icon: "🍽️", text: "싱크대 설거지",           area: "정리" },
  { id: "h11", icon: "☕", text: "음료 다 드신 분 여쭤보기", area: "응대" },
  { id: "h12", icon: "🍵", text: "대기 손님 차 서비스",      area: "응대" },
];

const STATUS = {
  free:   { label: "한가해요",   emoji: "🟢", color: "#6FA882", bg: "#EAF3ED" },
  normal: { label: "보통이에요", emoji: "🟡", color: "#C9A052", bg: "#FBF4E4" },
  busy:   { label: "바빠요",     emoji: "🔴", color: "#D4806A", bg: "#FAECEA" },
};

const RULES = [
  { icon: "🤝", text: "바쁘든 한가하든, 먼저 손 내미는 게 우리예요" },
  { icon: "🙅", text: "\"괜찮아요\" \"안 해도 돼요\"는 하지 않아요" },
  { icon: "👀", text: "말하기 전에 먼저 살피고 먼저 움직여요" },
  { icon: "💛", text: "도움받으면 감사 인사로 마음을 전해요" },
  { icon: "🧹", text: "매장은 우리 모두의 공간, 함께 가꿔요" },
  { icon: "🌿", text: "서로의 컨디션을 살피고 따뜻하게 챙겨요" },
  { icon: "📋", text: "계완 대표님은 매장 관리에 집중해요" },
];

const CHEERS = [
  "오늘도 함께 만들어가요 💛",
  "먼저 다가가는 한 걸음, 그게 우리예요 🌿",
  "작은 챙김이 모여 큰 문화가 돼요 ✨",
  "말하지 않아도 보이는 마음이 진짜예요 🌸",
  "혼자가 아닌 우리, 그래서 든든해요 🤝",
  "매일이 모여 우리만의 색이 돼요 🎨",
  "오늘 하루도, 함께라서 빛나요 💫",
];

// ── 매일 다른 오늘의 메시지 (30개) ──
const DAILY_MESSAGES = [
  { emoji: "🌅", title: "새로운 하루의 시작", body: "오늘 만날 손님들에게\n어떤 빛나는 모습을 선물할까요?" },
  { emoji: "💛", title: "당신의 손길은 특별해요", body: "당신의 손에서 누군가의 자신감이\n다시 피어나고 있어요" },
  { emoji: "🌿", title: "함께라서 더 멀리", body: "혼자라면 빠르지만,\n함께라면 더 멀리 갈 수 있어요" },
  { emoji: "✨", title: "사소한 친절의 힘", body: "오늘 누군가에게 건넨 작은 친절이\n그 사람의 하루를 바꿀 수도 있어요" },
  { emoji: "🌸", title: "오늘도 충분히 잘하고 있어요", body: "어제보다 1mm만 나아져도\n그건 분명한 성장이에요" },
  { emoji: "☕", title: "잠깐 쉬어가도 괜찮아요", body: "쉼표가 있어야 문장이 완성되듯,\n쉼이 있어야 더 잘할 수 있어요" },
  { emoji: "🪞", title: "거울 앞에서", body: "당신이 다듬는 건 머리카락이 아니라\n그 사람의 자신감이에요" },
  { emoji: "🤝", title: "먼저 다가가는 용기", body: "도움이 필요해 보이는 동료에게\n먼저 손 내밀어 보세요" },
  { emoji: "🌱", title: "성장은 매일 일어나요", body: "오늘 배운 작은 것 하나가\n내일의 큰 자신감이 돼요" },
  { emoji: "💫", title: "당신이 있어 든든해요", body: "이 매장이 따뜻한 이유는\n바로 당신이 여기 있기 때문이에요" },
  { emoji: "🍀", title: "행운은 준비된 사람에게", body: "오늘도 정성껏 준비하는 당신,\n이미 충분히 빛나고 있어요" },
  { emoji: "🌟", title: "당신만의 색깔", body: "다른 누구와도 비교하지 마세요\n당신만의 강점이 분명히 있어요" },
  { emoji: "💐", title: "감사의 한 마디", body: "오늘 하루 함께 일하는 동료에게\n고마움을 표현해 보세요" },
  { emoji: "🎈", title: "가벼운 마음으로", body: "완벽하지 않아도 괜찮아요\n오늘은 그저 즐겁게 시작해요" },
  { emoji: "🌊", title: "흐름을 타듯 자연스럽게", body: "급할수록 천천히,\n바쁠수록 한 박자 쉬어가요" },
  { emoji: "🕊️", title: "마음의 평화", body: "어떤 손님이 와도\n당신의 미소는 변하지 않아요" },
  { emoji: "🎨", title: "당신은 예술가예요", body: "머리카락이라는 캔버스에\n작품을 만드는 진짜 아티스트" },
  { emoji: "🌺", title: "피어나는 자신감", body: "당신이 손길이 닿은 모든 사람의\n하루가 한결 환해져요" },
  { emoji: "🤗", title: "따뜻한 한 마디", body: "오늘 동료에게\n\"수고했어요\" 한 마디 건네 보세요" },
  { emoji: "🌙", title: "오늘 하루도 수고했어요", body: "긴 하루 끝, 자신을 칭찬해 주세요\n충분히 잘 해냈어요" },
  { emoji: "💎", title: "당신은 보석 같은 사람", body: "쉽게 빛나는 사람은 없어요\n갈고닦은 시간이 당신을 빛나게 해요" },
  { emoji: "🌷", title: "친절은 돌아와요", body: "오늘 베푼 작은 친절이\n언젠가 당신에게 돌아올 거예요" },
  { emoji: "📖", title: "한 번 더 살펴보기", body: "동료가 바빠 보이지 않나요?\n잠깐 둘러보는 그 시선이 따뜻해요" },
  { emoji: "🎵", title: "리듬 있게 일해요", body: "음악처럼 일에도 리듬이 있어요\n나만의 페이스를 찾아가요" },
  { emoji: "🍃", title: "숨 한번 깊게", body: "잠깐 멈추고 깊게 숨 쉬어요\n다시 시작할 힘이 생길 거예요" },
  { emoji: "🌈", title: "비 온 뒤 무지개처럼", body: "힘든 순간도 지나가요\n분명 더 좋은 날이 와요" },
  { emoji: "💝", title: "받은 만큼 돌려주기", body: "누군가에게 받은 도움을\n다른 동료에게 전해 보세요" },
  { emoji: "🦋", title: "변화는 작은 것에서", body: "오늘의 작은 노력이\n내일의 큰 변화를 만들어요" },
  { emoji: "🌻", title: "햇살 같은 사람", body: "당신이 매장에 들어서는 순간\n분위기가 한결 밝아져요" },
  { emoji: "💌", title: "표현하는 용기", body: "마음에 담아두지만 말고\n오늘은 한 마디 표현해 보세요" },
];

// 오늘의 메시지 (날짜 기반)
const getTodayMessage = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length];
};

// ── 청소 구역 (2주 로테이션) ──
const CLEAN_ZONES = [
  {
    id: "z1",
    name: "샴푸실·스파룸",
    icon: "🚿",
    tasks: [
      "샴푸대 청소 (배수구·목받침대·샴푸 도기)",
      "쓰레기통·바구니 비우기",
      "페이스커버·샴푸·LPP 체크",
      "스파룸 온타올·스티머",
    ],
  },
  {
    id: "z2",
    name: "바닥 청소",
    icon: "🧹",
    tasks: [
      "전체 바닥 쓸기",
      "직원실 바닥 청소",
      "바닥 닦기",
      "대체휴무날: 수건·파마보 빼기",
    ],
  },
  {
    id: "z3",
    name: "음료바·롯드·대기석",
    icon: "☕",
    tasks: [
      "싱크대 배수구",
      "녹차·둥글레차·빨대·커피콩 체크",
      "음료·다과 재고 파악",
      "커피머신·제빙기 물 채우기·닦기",
      "롯드 정리",
      "대기석&쿠션 닦기",
    ],
  },
  {
    id: "z4",
    name: "휴무자 대체 청소",
    icon: "🔄",
    tasks: [
      "수건 빼기·파마보 돌리기",
      "시술 츄레이 닦기",
      "파지·고무줄 채우기",
      "직원실 싱크대·전자레인지 청소",
      "시술 기계 닦기",
    ],
    note: "다 나오는 날에 진행",
  },
];

export default function App() {
  // 🔐 본인 핸드폰에서 자동 로그인 (localStorage 사용)
  const [myId, setMyId] = useState(() => {
    try {
      const saved = localStorage.getItem("together_myId");
      return saved ? Number(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // myId 변경 시 자동 저장
  useEffect(() => {
    if (myId !== null) {
      try { localStorage.setItem("together_myId", String(myId)); } catch (e) {}
    }
  }, [myId]);

  const [members, setMembers]   = useState(
    ALL_MEMBERS.map(m => ({ ...m, status: "normal", helpCount: 0, givenCount: 0 }))
  );
  const [myStatus, setMyStatus] = useState("normal");
  const [tab, setTab]           = useState("now");
  const [log, setLog]           = useState([]);
  const [doneTasks, setDone]    = useState([]);
  const [toast, setToast]       = useState(null);
  const [cheerIdx, setCheer]    = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [pickTask, setPick]     = useState(null);
  const [note, setNote]         = useState("");
  const [helpTarget, setHelpTarget] = useState(null); // 누구를 도왔는지 (id 또는 'salon')

  // 청소 담당자 (zoneId -> memberId)
  const [zoneAssign, setZoneAssign] = useState({
    z1: 1, // 서희
    z2: 2, // 민경
    z3: 3, // 다정
    z4: 4, // 지유
  });
  const [editAssign, setEditAssign] = useState(null); // 편집 중인 zoneId
  const [zoneDone, setZoneDone] = useState({}); // {"2026-05-17": {z1: ['샴푸대 청소', ...]}}
  const [rotationDate, setRotationDate] = useState(
    new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
  );

  // 감사 메시지 (마감 후 작성)
  const [thanks, setThanks] = useState([]);
  // {id, from, to, text, time}
  const [thanksDraft, setThanksDraft] = useState({ to: null, text: "" });

  // 매장 서브메뉴
  const [salonSub, setSalonSub] = useState("events"); // events | birthdays | mvp | orders | suggest | mood

  // 일정 (회식·교육)
  const [events, setEvents] = useState([
    { id: 1, type: "회식", title: "월말 팀 회식", date: "2026-04-30", time: "19:00", location: "근처 한식당", note: "" },
    { id: 2, type: "교육", title: "신상 트리트먼트 교육", date: "2026-05-05", time: "14:00", location: "본사", note: "다정·지유 참석" },
  ]);
  const [eventDraft, setEventDraft] = useState({ type: "회식", title: "", date: "", time: "", location: "", note: "" });
  const [showEventForm, setShowEventForm] = useState(false);

  // 생일·기념일
  const [birthdays, setBirthdays] = useState([
    { id: 1, memberId: 1, type: "생일", date: "2026-06-15" },
  ]);
  const [birthDraft, setBirthDraft] = useState({ memberId: 1, type: "생일", date: "" });

  // 컨디션 체크
  const [moods, setMoods] = useState([]); // {id, memberId, body, mind, note, date}
  const [todayMood, setTodayMood] = useState({ body: 3, mind: 3, note: "" });

  // 발주 요청
  const [orders, setOrders] = useState([
    { id: 1, item: "매트릭스 8N 염색약", qty: "5개", urgency: "보통", from: 3, status: "요청됨", time: "어제 18:30", note: "" },
  ]);
  const [orderDraft, setOrderDraft] = useState({ item: "", qty: "", urgency: "보통", note: "" });

  // 익명 건의함
  const [suggestions, setSuggestions] = useState([]); // {id, text, time, replies: [{text, time}]}
  const [suggestDraft, setSuggestDraft] = useState("");
  const [replyDraft, setReplyDraft] = useState({});

  // 시간 적립 (늦게 일한 시간 + 일찍 간 시간 차감)
  const [timeBank, setTimeBank] = useState([]); // {id, memberId, type: "earn"|"use"|"penalty", minutes, date, note, time}
  const [timeDraft, setTimeDraft] = useState({ type: "earn", minutes: 30, note: "" });

  // 리뷰 답글 일일 체크 (날짜별 - memberId별)
  const [reviewDone, setReviewDone] = useState({}); // {"2026-05-17": [1, 2, 4]}

  // 인스타 업로드 (월별 - memberId별 횟수)
  const [instaUploads, setInstaUploads] = useState([]); // {id, memberId, date, time}

  const me = members.find(m => m.id === myId);
  const isJangnim = myId === 5; // 계완 대표

  // ─────────────────────────────────────
  // 🔥 Firebase 실시간 동기화 (개선 버전)
  // ─────────────────────────────────────
  const [isLoaded, setIsLoaded] = useState(false);
  const isReceivingRef = useRef(false); // 데이터 받는 중인지 표시 (무한루프 방지)
  const saveTimerRef = useRef(null); // 저장 타이머

  // Firebase에서 데이터 읽어오기 (실시간)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "salon", "main"), (snap) => {
      if (snap.exists()) {
        isReceivingRef.current = true; // 받는 중 표시
        const data = snap.data();
        if (data.members)      setMembers(data.members);
        if (data.log)          setLog(data.log);
        if (data.zoneAssign)   setZoneAssign(data.zoneAssign);
        if (data.zoneDone)     setZoneDone(data.zoneDone);
        if (data.rotationDate) setRotationDate(data.rotationDate);
        if (data.thanks)       setThanks(data.thanks);
        if (data.events)       setEvents(data.events);
        if (data.birthdays)    setBirthdays(data.birthdays);
        if (data.moods)        setMoods(data.moods);
        if (data.orders)       setOrders(data.orders);
        if (data.suggestions)  setSuggestions(data.suggestions);
        if (data.timeBank)     setTimeBank(data.timeBank);
        if (data.reviewDone)   setReviewDone(data.reviewDone);
        if (data.instaUploads) setInstaUploads(data.instaUploads);
        // 다음 렌더링 후에 받기 완료 표시
        setTimeout(() => { isReceivingRef.current = false; }, 100);
      }
      setIsLoaded(true);
    }, (err) => {
      console.error("Firebase 읽기 오류:", err);
      setIsLoaded(true);
    });
    return () => unsub();
  }, []);

  // 데이터 변경 시 Firebase에 저장 (debounce 적용 - 1초 대기)
  useEffect(() => {
    // 로드 안 됐거나, 데이터 받는 중이면 저장 안 함
    if (!isLoaded || isReceivingRef.current) return;

    // 기존 타이머 취소
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    // 1초 후 저장 (연속 변경 시 마지막만 저장)
    saveTimerRef.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, "salon", "main"), {
          members, log, zoneAssign, zoneDone, rotationDate,
          thanks, events, birthdays, moods, orders, suggestions, timeBank,
          reviewDone, instaUploads,
          lastUpdate: Date.now(),
        });
      } catch (err) {
        console.error("Firebase 저장 오류:", err);
      }
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [members, log, zoneAssign, zoneDone, rotationDate, thanks, events, birthdays, moods, orders, suggestions, timeBank, reviewDone, instaUploads, isLoaded]);

  useEffect(() => {
    const t = setInterval(() => setCheer(i => (i + 1) % CHEERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMembers(prev => prev.map(m => m.id === myId ? { ...m, status: myStatus } : m));
  }, [myStatus, myId]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const completeHelp = (taskId) => {
    const task = HELP_TASKS.find(t => t.id === taskId);
    const toMember = members.find(m => m.id === helpTarget);
    setLog(p => [...p, {
      id: Date.now(), from: myId, toId: helpTarget, taskId, note,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setMembers(p => p.map(m => m.id === myId ? { ...m, helpCount: m.helpCount + 1 } : m));
    setNote(""); setPick(null); setHelpTarget(null); setShowTasks(false);
    const toText = helpTarget === "salon" ? "매장을 " : toMember ? `${toMember.name}님을 ` : "";
    showToast(`${task?.icon} ${toText}도왔어요! 고마워요 💛`);
  };

  const requestHelp = (taskId, toId) => {
    const task = HELP_TASKS.find(t => t.id === taskId);
    const to = members.find(m => m.id === toId);
    setMembers(p => p.map(m => m.id === toId ? { ...m, givenCount: m.givenCount + 1 } : m));
    showToast(`${to?.name}님께 "${task?.text}" 요청했어요`);
  };

  const busyMembers   = members.filter(m => m.status === "busy"   && m.id !== myId && m.canHelp);
  const freeHelpers   = members.filter(m => m.status === "free"   && m.id !== myId && m.canHelp);
  const availTasks    = HELP_TASKS;

  const areaGroups = ["시술", "정리", "응대"];

  // 🔥 로딩 화면
  if (!isLoaded) {
    return (
      <div style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        background: "linear-gradient(135deg, #3D6B52 0%, #2A4535 100%)",
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        flexDirection: "column", color: "#fff",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "blink 1.5s ease infinite" }}>💛</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>함께, 매일</div>
        <div style={{ fontSize: 12, opacity: .7 }}>데이터 불러오는 중...</div>
        <style>{`
          @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(0.95)} }
        `}</style>
      </div>
    );
  }

  // 🔐 로그인 화면 (myId가 없으면)
  if (myId === null) {
    return (
      <div style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        background: "linear-gradient(135deg, #3D6B52 0%, #2A4535 100%)",
        minHeight: "100vh",
        maxWidth: 480, margin: "0 auto",
        padding: "40px 24px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        color: "#fff",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          button { cursor: pointer; border: none; font-family: inherit; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:none; } }
          .login-card { animation: fadeUp .4s ease both; }
        `}</style>

        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, opacity: .6, letterSpacing: 3, marginBottom: 8 }}>
            TOGETHER, EVERYDAY
          </div>
          <div style={{ fontSize: 38, marginBottom: 8 }}>💛</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>함께, 매일</div>
          <div style={{ fontSize: 13, opacity: .8 }}>어반그라운드헤어 상왕십리역점</div>
        </div>

        {/* 안내 */}
        <div className="login-card" style={{
          background: "rgba(255,255,255,0.12)",
          borderRadius: 18, padding: "18px 20px", marginBottom: 20,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
            👋 안녕하세요!
          </div>
          <div style={{ fontSize: 12, opacity: .9, lineHeight: 1.7 }}>
            본인 이름을 선택하면<br/>
            이 핸드폰에서 자동으로 로그인돼요
          </div>
        </div>

        {/* 멤버 선택 */}
        <div style={{ marginBottom: 20 }}>
          {ALL_MEMBERS.map((m, i) => (
            <button key={m.id}
              onClick={() => setMyId(m.id)}
              className="login-card"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.95)",
                color: "#28221E",
                borderRadius: 16, padding: "16px 20px",
                marginBottom: 10,
                display: "flex", alignItems: "center", gap: 14,
                animationDelay: `${i * 0.06}s`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}>
              <div style={{
                width: 50, height: 50, borderRadius: "50%",
                background: "#EAF3ED",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, flexShrink: 0,
              }}>{m.avatar}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "#8A7E78", marginTop: 2 }}>{m.role}</div>
              </div>
              <span style={{ fontSize: 18, color: "#3D7A56" }}>→</span>
            </button>
          ))}
        </div>

        <div style={{
          fontSize: 11, opacity: .65, textAlign: "center", lineHeight: 1.7,
        }}>
          🔐 한 번 선택하면 다음부터는 자동으로 로그인돼요<br/>
          나중에 변경하려면 상단에서 다시 선택할 수 있어요
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', sans-serif",
      background: C.bg, minHeight: "100vh",
      maxWidth: 480, margin: "0 auto",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; font-family: inherit; }
        input, textarea { font-family: inherit; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes slide  { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:none; } }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.55} }
        .card { animation: fadeUp .3s ease both; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)",
          background: C.sageDeep, color: "#fff", padding: "10px 22px",
          borderRadius: 24, fontSize: 13, fontWeight: 500, zIndex: 999,
          boxShadow: "0 6px 24px rgba(0,0,0,0.18)", animation: "slide .25s ease",
          whiteSpace: "nowrap",
        }}>{toast.msg}</div>
      )}

      {/* 헤더 */}
      <div style={{
        background: "linear-gradient(135deg, #3D6B52 0%, #2A4535 100%)",
        padding: "20px 20px 0", color: "#fff",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, opacity: .65, letterSpacing: 2, marginBottom: 3 }}>TOGETHER, EVERYDAY</div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>💛 함께, 매일<br/><span style={{ fontSize: 12, opacity: .8, fontWeight: 400 }}>어반그라운드헤어 상왕십리역점</span></div>
            <div style={{ fontSize: 12, opacity: .8, marginTop: 3, animation: "blink 4.5s ease infinite", fontStyle: "italic" }}>
              {CHEERS[cheerIdx]}
            </div>
          </div>
          {/* 현재 로그인 사용자 + 변경 버튼 */}
          <button
            onClick={() => {
              if (window.confirm("다른 사람으로 변경하시겠어요?\n(현재 로그인 정보가 초기화됩니다)")) {
                try { localStorage.removeItem("together_myId"); } catch (e) {}
                setMyId(null);
              }
            }}
            style={{
              background: "rgba(255,255,255,0.15)", color: "#fff", border: "none",
              borderRadius: 12, padding: "6px 10px", fontSize: 11,
              display: "flex", alignItems: "center", gap: 4,
            }}>
            <span style={{ fontSize: 13 }}>{me?.avatar}</span>
            <span>{me?.name}</span>
            <span style={{ opacity: .6, fontSize: 10, marginLeft: 2 }}>변경</span>
          </button>
        </div>

        {/* 내 상태 바 */}
        <div style={{
          background: "rgba(255,255,255,0.12)", borderRadius: "14px 14px 0 0",
          padding: "12px 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isJangnim ? 0 : 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>{me?.avatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {me?.name}
                <span style={{ fontSize: 11, opacity: .7, fontWeight: 400, marginLeft: 6 }}>{me?.role}</span>
              </div>
              {isJangnim
                ? <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>📋 매장 관리 담당 · 시술 서브 제외</div>
                : <div style={{ fontSize: 11, opacity: .75, marginTop: 2 }}>내 상태를 알려주세요</div>
              }
            </div>
          </div>

          {!isJangnim && (
            <div style={{ display: "flex", gap: 7 }}>
              {Object.entries(STATUS).map(([key, s]) => (
                <button key={key} onClick={() => setMyStatus(key)} style={{
                  flex: 1, background: myStatus === key ? s.color : "rgba(255,255,255,0.15)",
                  color: "#fff", borderRadius: 20, padding: "5px 0",
                  fontSize: 11, fontWeight: myStatus === key ? 700 : 400,
                  transition: "all .2s",
                }}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div style={{
        display: "flex", background: C.card,
        borderBottom: `1px solid ${C.line}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflowX: "auto",
      }}>
        {[
          { id: "now",     label: "지금 도울일" },
          { id: "team",    label: "팀 현황" },
          { id: "clean",   label: "청소" },
          { id: "thanks",  label: "감사 인사" },
          { id: "salon",   label: "매장" },
          { id: "rules",   label: "약속" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: "1 0 auto", padding: "12px 10px",
            background: "none", fontSize: 12,
            fontWeight: tab === t.id ? 700 : 400,
            color: tab === t.id ? C.sageDeep : C.muted,
            borderBottom: tab === t.id ? `2.5px solid ${C.sageDeep}` : "2.5px solid transparent",
            transition: "all .2s",
            whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div style={{ flex: 1, overflow: "auto", padding: 16, paddingBottom: 32 }}>

        {/* ══ 지금 뭘 도울까 ══ */}
        {tab === "now" && (
          <div>
            {/* 오늘의 긍정 메시지 */}
            {(() => {
              const msg = getTodayMessage();
              const today = new Date();
              const dateStr = today.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
              return (
                <div className="card" style={{
                  background: "linear-gradient(135deg, #FBF4E4 0%, #FAEEE9 50%, #EAF3ED 100%)",
                  borderRadius: 20, padding: "20px 22px", marginBottom: 16,
                  border: `1px solid ${C.line}`,
                  position: "relative", overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(201, 160, 82, 0.12)",
                }}>
                  {/* 장식 */}
                  <div style={{
                    position: "absolute", top: -20, right: -10,
                    fontSize: 90, opacity: 0.08, transform: "rotate(15deg)",
                  }}>{msg.emoji}</div>

                  <div style={{
                    fontSize: 10, color: C.muted, letterSpacing: 1.5,
                    fontWeight: 700, marginBottom: 6,
                  }}>
                    🌅 오늘의 메시지 · {dateStr}
                  </div>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{msg.emoji}</div>
                  <div style={{
                    fontSize: 16, fontWeight: 700, color: C.ink,
                    marginBottom: 8, letterSpacing: -0.3,
                  }}>
                    {msg.title}
                  </div>
                  <div style={{
                    fontSize: 13, color: C.mocha || "#7A5C4A", lineHeight: 1.7,
                    whiteSpace: "pre-line", fontStyle: "italic",
                  }}>
                    {msg.body}
                  </div>
                  <div style={{
                    marginTop: 12, paddingTop: 12,
                    borderTop: `1px dashed ${C.line}`,
                    fontSize: 11, color: C.muted, textAlign: "right",
                  }}>
                    — 어반그라운드헤어 상왕십리역점
                  </div>
                </div>
              );
            })()}

            {/* 대표 뷰 */}
            {isJangnim ? (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #3D6B52, #2A4535)",
                  borderRadius: 18, padding: "20px", color: "#fff", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>📋</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>계완 대표님 모드</div>
                  <div style={{ fontSize: 13, opacity: .9, lineHeight: 1.7, marginBottom: 14 }}>
                    매장 전체 흐름을 봐주시고,<br/>
                    도와주신 일도 자유롭게 체크하세요 💛
                  </div>
                  <button onClick={() => setShowTasks(!showTasks)} style={{
                    background: "rgba(255,255,255,0.22)", color: "#fff",
                    borderRadius: 20, padding: "8px 20px",
                    fontSize: 13, fontWeight: 700,
                  }}>
                    {showTasks ? "접기 ↑" : "내가 도와준 일 체크하기 →"}
                  </button>
                </div>

                {/* 도울 일 목록 (대표도 사용 가능) */}
                {showTasks && (
                  <div className="card" style={{
                    background: C.card, borderRadius: 18,
                    border: `1px solid ${C.line}`, padding: 16, marginBottom: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 14 }}>
                      내가 도와준 일 체크
                    </div>

                    {areaGroups.map(area => {
                      const tasks = availTasks.filter(t => t.area === area);
                      if (tasks.length === 0) return null;
                      return (
                        <div key={area} style={{ marginBottom: 14 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 700, color: C.muted,
                            letterSpacing: 1.5, marginBottom: 8,
                          }}>
                            #{area}
                          </div>
                          {tasks.map(task => (
                            <div key={task.id}
                              onClick={() => setPick(pickTask === task.id ? null : task.id)}
                              style={{
                                background: pickTask === task.id ? C.sageSoft : C.bg,
                                border: `1.5px solid ${pickTask === task.id ? C.sage : C.line}`,
                                borderRadius: 13, padding: "11px 13px", marginBottom: 7,
                                cursor: "pointer", transition: "all .18s",
                              }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                <span style={{ fontSize: 19 }}>{task.icon}</span>
                                <span style={{ fontSize: 13, color: C.ink, flex: 1 }}>{task.text}</span>
                                {pickTask === task.id && <span style={{ color: C.sage, fontWeight: 700 }}>✓</span>}
                              </div>

                              {pickTask === task.id && (
                                <div style={{ marginTop: 10, animation: "fadeUp .2s ease" }}>
                                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
                                    누구를 도왔나요? (선택)
                                  </div>
                                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                                    <button
                                      onClick={e => { e.stopPropagation(); setHelpTarget(helpTarget === "salon" ? null : "salon"); }}
                                      style={{
                                        background: helpTarget === "salon" ? C.gold : C.goldSoft,
                                        color: helpTarget === "salon" ? "#fff" : "#8A6A20",
                                        borderRadius: 20, padding: "4px 12px",
                                        fontSize: 12, fontWeight: helpTarget === "salon" ? 700 : 500,
                                        border: `1px solid ${helpTarget === "salon" ? C.gold : "#E8D5A0"}`,
                                      }}>
                                      🏠 매장
                                    </button>
                                    {ALL_MEMBERS.filter(m => m.id !== myId).map(m => (
                                      <button key={m.id}
                                        onClick={e => { e.stopPropagation(); setHelpTarget(helpTarget === m.id ? null : m.id); }}
                                        style={{
                                          background: helpTarget === m.id ? C.sageDeep : C.sageSoft,
                                          color: helpTarget === m.id ? "#fff" : C.sageDeep,
                                          borderRadius: 20, padding: "4px 12px",
                                          fontSize: 12, fontWeight: helpTarget === m.id ? 700 : 400,
                                          border: `1px solid ${helpTarget === m.id ? C.sageDeep : C.sage}`,
                                        }}>
                                        {m.avatar} {m.name}
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    placeholder="한 마디 남기기 (선택)"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      width: "100%", border: `1px solid ${C.line}`,
                                      borderRadius: 10, padding: "7px 11px", fontSize: 12,
                                      background: "#fff", outline: "none", color: C.ink,
                                      marginBottom: 8,
                                    }}
                                  />
                                  <button onClick={e => { e.stopPropagation(); completeHelp(task.id); }} style={{
                                    width: "100%", background: C.sageDeep, color: "#fff",
                                    borderRadius: 11, padding: "9px", fontSize: 13, fontWeight: 600,
                                  }}>
                                    ✅ 완료했어요!
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {availTasks.length === 0 && (
                      <div style={{ textAlign: "center", padding: 20, color: C.muted, fontSize: 13 }}>
                        🎉 오늘 할 일을 다 했어요!
                      </div>
                    )}
                  </div>
                )}

                {/* 대표님이 한 도움 */}
                {(() => {
                  const myLogs = log.filter(l => l.from === myId);
                  if (myLogs.length === 0) return null;
                  return (
                    <div className="card" style={{
                      background: C.sageSoft, borderRadius: 16,
                      border: `1px solid #B8D9C4`, padding: "14px 16px",
                      marginBottom: 16,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 10 }}>
                        ✨ 오늘 대표님이 도와준 일 {myLogs.length}건
                      </div>
                      {myLogs.map(l => {
                        const t = HELP_TASKS.find(h => h.id === l.taskId);
                        const toMember = members.find(m => m.id === l.toId);
                        const isSalon = l.toId === "salon";
                        return (
                          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 16 }}>{t?.icon}</span>
                            <span style={{ fontSize: 12, color: C.sageDeep, flex: 1 }}>
                              {t?.text}
                              {isSalon && <span style={{ color: C.gold, marginLeft: 6, fontWeight: 600 }}>→ 🏠 매장</span>}
                              {toMember && <span style={{ color: C.rose, marginLeft: 6, fontWeight: 600 }}>→ {toMember.name}님</span>}
                            </span>
                            <span style={{ fontSize: 10, color: C.muted }}>{l.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* 팀 현황 요약 */}
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>지금 팀 상태</div>
                {members.filter(m => m.id !== 5).map(m => {
                  const st = STATUS[m.status];
                  return (
                    <div key={m.id} className="card" style={{
                      background: C.card, borderRadius: 14, padding: "12px 14px",
                      marginBottom: 8, display: "flex", alignItems: "center", gap: 10,
                      border: `1px solid ${C.line}`,
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: st.bg, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 20,
                      }}>{m.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{m.role}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: C.sageDeep }}>
                            줌 <b>{log.filter(l => l.from === m.id).length}</b>
                          </span>
                          <span style={{ fontSize: 10, color: C.roseDeep }}>
                            받음 <b>{log.filter(l => l.toId === m.id).length}</b>
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 10,
                        background: st.bg, color: st.color, fontWeight: 600,
                      }}>{st.emoji} {st.label}</span>
                    </div>
                  );
                })}

                {/* 오늘 기록 요약 */}
                {log.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>오늘 도움 기록</div>
                    {[...log].reverse().slice(0, 5).map(l => {
                      const member = members.find(m => m.id === l.from);
                      const toMember = members.find(m => m.id === l.toId);
                      const isSalon = l.toId === "salon";
                      const task = HELP_TASKS.find(t => t.id === l.taskId);
                      return (
                        <div key={l.id} style={{
                          display: "flex", gap: 8, padding: "8px 0",
                          borderBottom: `1px solid ${C.line}`, alignItems: "center",
                        }}>
                          <span style={{ fontSize: 16 }}>{task?.icon}</span>
                          <div style={{ flex: 1, fontSize: 12, color: C.ink }}>
                            <b>{member?.name}</b>님 {isSalon && <span style={{ color: C.gold }}>→ 🏠 매장 </span>}{toMember && <span style={{ color: C.rose }}>→ {toMember.name}님 </span>}· {task?.text}
                          </div>
                          <span style={{ fontSize: 10, color: C.muted }}>{l.time}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            ) : (
              /* 디자이너 뷰 */
              <div>
                {/* 항상 도움 유도 카드 — 상태 무관 */}
                <div className="card" style={{
                  background: myStatus === "free"
                    ? "linear-gradient(135deg, #4E8A68, #3D6B52)"
                    : myStatus === "normal"
                    ? "linear-gradient(135deg, #B8893A, #9A7230)"
                    : "linear-gradient(135deg, #A84F3A, #8A3A28)",
                  borderRadius: 18, padding: "18px 20px",
                  color: "#fff", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>
                    {myStatus === "free" ? "🙌" : myStatus === "normal" ? "👀" : "💪"}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>
                    {myStatus === "free"
                      ? "한가할 때가 도울 수 있는 최고의 타이밍이에요!"
                      : myStatus === "normal"
                      ? "잠깐 둘러봐요 — 도울 수 있는 일이 있을 거예요"
                      : "바쁘더라도, 틈틈이 함께 하는 게 우리 방식이에요"}
                  </div>
                  <div style={{ fontSize: 12, opacity: .88, lineHeight: 1.7, marginBottom: 14 }}>
                    {myStatus === "free"
                      ? "\"괜찮아요\" 말하지 않아도 돼요.\n그냥 같이 해요 💛"
                      : myStatus === "normal"
                      ? "말하기 전에 먼저 움직이는 게 우리 약속이에요 🌿"
                      : "작은 거 하나씩만 함께 해도 팀이 달라져요 ✨"}
                  </div>
                  <button onClick={() => setShowTasks(!showTasks)} style={{
                    background: "rgba(255,255,255,0.22)", color: "#fff",
                    borderRadius: 20, padding: "8px 20px",
                    fontSize: 13, fontWeight: 700,
                  }}>
                    {showTasks ? "접기 ↑" : "도울 일 보기 →"}
                  </button>
                </div>

                {/* 도울 일 목록 */}
                {showTasks && (
                  <div className="card" style={{
                    background: C.card, borderRadius: 18,
                    border: `1px solid ${C.line}`, padding: 16, marginBottom: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 14 }}>
                      지금 할 수 있는 일
                    </div>

                    {areaGroups.map(area => {
                      const tasks = availTasks.filter(t => t.area === area);
                      if (tasks.length === 0) return null;
                      return (
                        <div key={area} style={{ marginBottom: 14 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 700, color: C.muted,
                            letterSpacing: 1.5, marginBottom: 8,
                          }}>
                            #{area}
                          </div>
                          {tasks.map(task => (
                            <div key={task.id}
                              onClick={() => setPick(pickTask === task.id ? null : task.id)}
                              style={{
                                background: pickTask === task.id ? C.sageSoft : C.bg,
                                border: `1.5px solid ${pickTask === task.id ? C.sage : C.line}`,
                                borderRadius: 13, padding: "11px 13px", marginBottom: 7,
                                cursor: "pointer", transition: "all .18s",
                              }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                <span style={{ fontSize: 19 }}>{task.icon}</span>
                                <span style={{ fontSize: 13, color: C.ink, flex: 1 }}>{task.text}</span>
                                {pickTask === task.id && <span style={{ color: C.sage, fontWeight: 700 }}>✓</span>}
                              </div>

                              {pickTask === task.id && (
                                <div style={{ marginTop: 10, animation: "fadeUp .2s ease" }}>
                                  {/* 누구를 도왔나요 */}
                                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
                                    누구를 도왔나요? (선택)
                                  </div>
                                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                                    {/* 매장 옵션 */}
                                    <button
                                      onClick={e => { e.stopPropagation(); setHelpTarget(helpTarget === "salon" ? null : "salon"); }}
                                      style={{
                                        background: helpTarget === "salon" ? C.gold : C.goldSoft,
                                        color: helpTarget === "salon" ? "#fff" : "#8A6A20",
                                        borderRadius: 20, padding: "4px 12px",
                                        fontSize: 12, fontWeight: helpTarget === "salon" ? 700 : 500,
                                        border: `1px solid ${helpTarget === "salon" ? C.gold : "#E8D5A0"}`,
                                        transition: "all .15s",
                                      }}>
                                      🏠 매장
                                    </button>
                                    {ALL_MEMBERS.filter(m => m.id !== myId && m.canHelp).map(m => (
                                      <button key={m.id}
                                        onClick={e => { e.stopPropagation(); setHelpTarget(helpTarget === m.id ? null : m.id); }}
                                        style={{
                                          background: helpTarget === m.id ? C.sageDeep : C.sageSoft,
                                          color: helpTarget === m.id ? "#fff" : C.sageDeep,
                                          borderRadius: 20, padding: "4px 12px",
                                          fontSize: 12, fontWeight: helpTarget === m.id ? 700 : 400,
                                          border: `1px solid ${helpTarget === m.id ? C.sageDeep : C.sage}`,
                                          transition: "all .15s",
                                        }}>
                                        {m.avatar} {m.name}
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    placeholder="한 마디 남기기 (선택)"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      width: "100%", border: `1px solid ${C.line}`,
                                      borderRadius: 10, padding: "7px 11px", fontSize: 12,
                                      background: "#fff", outline: "none", color: C.ink,
                                      marginBottom: 8,
                                    }}
                                  />
                                  <button onClick={e => { e.stopPropagation(); completeHelp(task.id); }} style={{
                                    width: "100%", background: C.sageDeep, color: "#fff",
                                    borderRadius: 11, padding: "9px", fontSize: 13, fontWeight: 600,
                                  }}>
                                    ✅ 완료했어요!
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {availTasks.length === 0 && (
                      <div style={{ textAlign: "center", padding: 20, color: C.muted, fontSize: 13 }}>
                        🎉 오늘 할 일을 다 했어요!
                      </div>
                    )}
                  </div>
                )}

                {/* 바쁜 동료 */}
                {busyMembers.length > 0 && (
                  <div className="card" style={{
                    background: C.card, borderRadius: 16, padding: "14px 16px",
                    border: `1px solid ${C.line}`, marginBottom: 14,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.roseDeep, marginBottom: 10 }}>
                      🔴 지금 바쁜 동료 — 도움이 필요해요
                    </div>
                    {busyMembers.map(m => (
                      <div key={m.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 0", borderBottom: `1px solid ${C.line}`,
                      }}>
                        <span style={{ fontSize: 22 }}>{m.avatar}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{m.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{m.role}</div>
                        </div>
                        <button onClick={() => setShowTasks(true)} style={{
                          background: C.roseSoft, color: C.roseDeep,
                          borderRadius: 12, padding: "5px 13px",
                          fontSize: 11, fontWeight: 600,
                        }}>
                          도와주기
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 오늘 내가 한 도움 */}
                {(() => {
                  const myLogs = log.filter(l => l.from === myId);
                  if (myLogs.length === 0) return null;
                  return (
                    <div className="card" style={{
                      background: C.sageSoft, borderRadius: 16,
                      border: `1px solid #B8D9C4`, padding: "14px 16px",
                      marginBottom: 10,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 10 }}>
                        ✨ 오늘 내가 한 도움 {myLogs.length}건
                      </div>
                      {myLogs.map(l => {
                        const t = HELP_TASKS.find(h => h.id === l.taskId);
                        const toMember = members.find(m => m.id === l.toId);
                        const isSalon = l.toId === "salon";
                        return (
                          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 16 }}>{t?.icon}</span>
                            <span style={{ fontSize: 12, color: C.sageDeep, flex: 1 }}>
                              {t?.text}
                              {isSalon && <span style={{ color: C.gold, marginLeft: 6, fontWeight: 600 }}>→ 🏠 매장</span>}
                              {toMember && <span style={{ color: C.rose, marginLeft: 6, fontWeight: 600 }}>→ {toMember.name}님</span>}
                            </span>
                            <span style={{ fontSize: 10, color: C.muted }}>{l.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* 오늘 내가 받은 도움 */}
                {(() => {
                  const receivedLogs = log.filter(l => l.toId === myId);
                  if (receivedLogs.length === 0) return null;
                  return (
                    <div className="card" style={{
                      background: C.roseSoft, borderRadius: 16,
                      border: `1px solid #F0C8BE`, padding: "14px 16px",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.roseDeep, marginBottom: 10 }}>
                        💝 오늘 내가 받은 도움 {receivedLogs.length}건
                      </div>
                      {receivedLogs.map(l => {
                        const t = HELP_TASKS.find(h => h.id === l.taskId);
                        const fromMember = members.find(m => m.id === l.from);
                        return (
                          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 16 }}>{t?.icon}</span>
                            <span style={{ fontSize: 12, color: C.roseDeep, flex: 1 }}>
                              <b style={{ color: C.ink }}>{fromMember?.name}님</b>이 {t?.text}
                            </span>
                            <span style={{ fontSize: 10, color: C.muted }}>{l.time}</span>
                          </div>
                        );
                      })}
                      <div style={{
                        marginTop: 10, paddingTop: 10,
                        borderTop: `1px dashed ${C.rose}`,
                        fontSize: 11, color: C.roseDeep, textAlign: "center",
                      }}>
                        💌 마감 후 감사 인사를 남겨보세요
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ══ 팀 현황 탭 ══ */}
        {tab === "team" && (
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, letterSpacing: 1 }}>
              실시간 상태 현황
            </div>
            {members.map((m, i) => {
              const st = STATUS[m.status];
              const isMe = m.id === myId;
              const isJang = m.id === 5;
              return (
                <div key={m.id} className="card" style={{
                  background: C.card, borderRadius: 16, padding: "14px 16px",
                  marginBottom: 10,
                  border: `1.5px solid ${isMe ? C.sage : C.line}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  animationDelay: `${i * 0.06}s`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: isJang ? "#E8E0D4" : st.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, boxShadow: isJang ? "none" : `0 0 0 3px ${st.color}33`,
                    }}>{m.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
                        {m.name}
                        {isMe && <span style={{ fontSize: 10, color: C.sage, marginLeft: 5 }}>(나)</span>}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>{m.role}</div>
                      {isJang ? (
                        <span style={{
                          fontSize: 10, padding: "2px 9px", borderRadius: 10,
                          background: "#EDE7DF", color: C.muted, fontWeight: 600,
                        }}>
                          📋 매장 관리 전담
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 10, padding: "2px 9px", borderRadius: 10,
                          background: st.bg, color: st.color, fontWeight: 600,
                        }}>
                          {st.emoji} {st.label}
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: "right", display: "flex", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 19, fontWeight: 700, color: C.sageDeep }}>
                          {log.filter(l => l.from === m.id).length}
                        </div>
                        <div style={{ fontSize: 9, color: C.muted }}>도움 줌</div>
                      </div>
                      {!isJang && (
                        <div>
                          <div style={{ fontSize: 19, fontWeight: 700, color: C.roseDeep }}>
                            {log.filter(l => l.toId === m.id).length}
                          </div>
                          <div style={{ fontSize: 9, color: C.muted }}>도움 받음</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 내 상태 변경 (대표 제외) */}
                  {isMe && !isJang && (
                    <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                      {Object.entries(STATUS).map(([key, s]) => (
                        <button key={key} onClick={() => setMyStatus(key)} style={{
                          flex: 1, background: myStatus === key ? s.color : C.bg,
                          color: myStatus === key ? "#fff" : C.muted,
                          borderRadius: 10, padding: "6px 0", fontSize: 10, fontWeight: 600,
                          border: `1px solid ${myStatus === key ? s.color : C.line}`,
                          transition: "all .15s",
                        }}>
                          {s.emoji}<br />{s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 오늘 도움 기록 */}
            {log.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                  📋 오늘 도움 기록
                </div>
                {[...log].reverse().map(l => {
                  const member = members.find(m => m.id === l.from);
                  const toMember = members.find(m => m.id === l.toId);
                  const isSalon = l.toId === "salon";
                  const task   = HELP_TASKS.find(t => t.id === l.taskId);
                  return (
                    <div key={l.id} style={{
                      display: "flex", gap: 10, alignItems: "center",
                      padding: "9px 0", borderBottom: `1px solid ${C.line}`,
                    }}>
                      <span style={{ fontSize: 18 }}>{task?.icon}</span>
                      <div style={{ flex: 1, fontSize: 12, color: C.ink }}>
                        <b>{member?.name}</b>님이{" "}
                        {isSalon && <span style={{ color: C.gold }}>→ <b>🏠 매장</b> </span>}
                        {toMember && <span style={{ color: C.rose }}>→ <b>{toMember.name}</b>님 </span>}
                        <span style={{ color: C.sageDeep }}>{task?.text}</span>를 도왔어요
                        {l.note && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>"{l.note}"</div>}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted }}>{l.time}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ 청소 담당 탭 ══ */}
        {tab === "clean" && (() => {
          // 🔄 오늘 날짜 키 (매일 자동 리셋용)
          const cleanToday = new Date().toISOString().slice(0, 10); // "2026-05-17"
          const todayZoneDone = zoneDone[cleanToday] || {};

          return (
          <div>
            {/* 헤더 안내 */}
            <div className="card" style={{
              background: "linear-gradient(135deg, #6FA882, #4E8A68)",
              borderRadius: 18, padding: "18px 20px", color: "#fff", marginBottom: 16,
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🧹</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>담당 구역 청소</div>
              <div style={{ fontSize: 12, opacity: .9, lineHeight: 1.7 }}>
                매일 자정에 자동으로 리셋돼요.<br/>
                담당자는 2주마다 로테이션됩니다.
              </div>
              <div style={{
                marginTop: 12, fontSize: 11, opacity: .85,
                background: "rgba(255,255,255,0.15)", padding: "6px 12px",
                borderRadius: 12, display: "inline-block",
              }}>
                📅 로테이션: {rotationDate} · 오늘: {cleanToday.slice(5).replace("-", "월 ")}일
              </div>
            </div>

            {/* 구역별 카드 */}
            {CLEAN_ZONES.map((zone, i) => {
              const assignee = members.find(m => m.id === zoneAssign[zone.id]);
              const doneList = todayZoneDone[zone.id] || [];
              const allDone = zone.tasks.every(t => doneList.includes(t));
              const isMine = zoneAssign[zone.id] === myId;

              return (
                <div key={zone.id} className="card" style={{
                  background: C.card, borderRadius: 16, padding: "14px 16px",
                  marginBottom: 12, border: `1.5px solid ${isMine ? C.sage : C.line}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  animationDelay: `${i * 0.06}s`,
                }}>
                  {/* 구역 헤더 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: allDone ? C.sageSoft : C.warm,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>{zone.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
                        {zone.name}
                        {isMine && <span style={{ fontSize: 10, color: C.sage, marginLeft: 6 }}>(내 담당)</span>}
                      </div>
                      {zone.note && (
                        <div style={{ fontSize: 10, color: C.gold, marginTop: 2, fontWeight: 600 }}>
                          ⚠️ {zone.note}
                        </div>
                      )}
                    </div>
                    {allDone && (
                      <div style={{
                        background: C.sage, color: "#fff",
                        borderRadius: 12, padding: "3px 10px",
                        fontSize: 11, fontWeight: 700,
                      }}>
                        ✓ 완료
                      </div>
                    )}
                  </div>

                  {/* 담당자 */}
                  <div style={{
                    background: C.bg, borderRadius: 10, padding: "8px 12px",
                    marginBottom: 10, display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 11, color: C.muted }}>담당:</span>
                    {editAssign === zone.id ? (
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
                        {ALL_MEMBERS.filter(m => m.canHelp).map(m => (
                          <button key={m.id} onClick={() => {
                            setZoneAssign(p => ({ ...p, [zone.id]: m.id }));
                            setEditAssign(null);
                            showToast(`${zone.name} 담당이 ${m.name}님으로 변경됐어요`);
                          }}
                            style={{
                              background: zoneAssign[zone.id] === m.id ? C.sageDeep : "#fff",
                              color: zoneAssign[zone.id] === m.id ? "#fff" : C.ink,
                              border: `1px solid ${C.sage}`,
                              borderRadius: 14, padding: "3px 9px",
                              fontSize: 11, fontWeight: 600,
                            }}>
                            {m.avatar} {m.name}
                          </button>
                        ))}
                        <button onClick={() => setEditAssign(null)} style={{
                          background: "none", color: C.muted, fontSize: 11, padding: "3px 6px",
                        }}>취소</button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: 16 }}>{assignee?.avatar}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, flex: 1 }}>
                          {assignee?.name}
                        </span>
                        <button onClick={() => setEditAssign(zone.id)} style={{
                          background: C.sageSoft, color: C.sageDeep,
                          borderRadius: 10, padding: "3px 10px",
                          fontSize: 10, fontWeight: 600,
                        }}>
                          ✏️ 변경
                        </button>
                      </>
                    )}
                  </div>

                  {/* 체크리스트 */}
                  <div>
                    {zone.tasks.map(taskName => {
                      const checked = doneList.includes(taskName);
                      return (
                        <div key={taskName}
                          onClick={() => {
                            const cur = todayZoneDone[zone.id] || [];
                            const next = checked ? cur.filter(t => t !== taskName) : [...cur, taskName];
                            setZoneDone(p => ({
                              ...p,
                              [cleanToday]: {
                                ...(p[cleanToday] || {}),
                                [zone.id]: next,
                              },
                            }));
                            if (!checked) showToast(`✓ ${taskName} 완료!`);
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "8px 4px", cursor: "pointer",
                            borderBottom: `1px solid ${C.line}`,
                          }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: 6,
                            border: `2px solid ${checked ? C.sage : C.line}`,
                            background: checked ? C.sage : "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 12, fontWeight: 700,
                            transition: "all .15s",
                          }}>
                            {checked && "✓"}
                          </div>
                          <span style={{
                            fontSize: 13, flex: 1,
                            color: checked ? C.muted : C.ink,
                            textDecoration: checked ? "line-through" : "none",
                          }}>
                            {taskName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 진행률 */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ height: 5, background: C.line, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(doneList.length / zone.tasks.length) * 100}%`,
                        background: allDone ? C.sage : C.gold,
                        transition: "width .4s ease",
                      }} />
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textAlign: "right" }}>
                      {doneList.length} / {zone.tasks.length}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 로테이션 변경 */}
            <div className="card" style={{
              background: C.warm, borderRadius: 16, padding: "14px 16px",
              border: `1px solid #E0D5C5`, marginTop: 6,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                🔄 로테이션 시작일 변경
              </div>
              <input
                value={rotationDate}
                onChange={e => setRotationDate(e.target.value)}
                placeholder="예: 11월 1일"
                style={{
                  width: "100%", border: `1px solid ${C.line}`,
                  borderRadius: 10, padding: "8px 12px", fontSize: 13,
                  background: "#fff", outline: "none", color: C.ink,
                }}
              />
              <div style={{ fontSize: 10, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
                2주마다 로테이션 시작일을 업데이트하고<br/>
                각 구역의 담당자를 변경해주세요.
              </div>
            </div>
          </div>
          );
        })()}

        {/* ══ 감사 인사 탭 ══ */}
        {tab === "thanks" && (
          <div>
            <div className="card" style={{
              background: "linear-gradient(135deg, #D4806A, #B5614E)",
              borderRadius: 18, padding: "20px", color: "#fff", marginBottom: 16,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>💌</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                오늘 마감 감사 인사
              </div>
              <div style={{ fontSize: 12, opacity: .9, lineHeight: 1.7 }}>
                오늘 도움받은 분께<br/>
                감사 메시지를 남겨주세요 🌸
              </div>
            </div>

            {/* 작성 카드 */}
            <div className="card" style={{
              background: C.card, borderRadius: 16, padding: 16, marginBottom: 16,
              border: `1px solid ${C.line}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                ✍️ 감사 인사 쓰기
              </div>

              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>누구에게?</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {ALL_MEMBERS.filter(m => m.id !== myId).map(m => (
                  <button key={m.id}
                    onClick={() => setThanksDraft(p => ({ ...p, to: thanksDraft.to === m.id ? null : m.id }))}
                    style={{
                      background: thanksDraft.to === m.id ? C.roseDeep : C.roseSoft,
                      color: thanksDraft.to === m.id ? "#fff" : C.roseDeep,
                      border: `1px solid ${C.rose}`,
                      borderRadius: 20, padding: "5px 13px",
                      fontSize: 12, fontWeight: thanksDraft.to === m.id ? 700 : 500,
                    }}>
                    {m.avatar} {m.name}
                  </button>
                ))}
              </div>

              <textarea
                value={thanksDraft.text}
                onChange={e => setThanksDraft(p => ({ ...p, text: e.target.value }))}
                placeholder="오늘 어떤 도움이 고마웠나요?&#10;예) 오늘 손님 많을 때 샴푸 도와주셔서 정말 감사했어요 💛"
                rows={4}
                style={{
                  width: "100%", border: `1px solid ${C.line}`,
                  borderRadius: 12, padding: "10px 12px", fontSize: 13,
                  background: C.bg, outline: "none", color: C.ink,
                  resize: "none", lineHeight: 1.6,
                }}
              />

              {/* 빠른 표현 */}
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
                {["오늘 정말 고마웠어요 💛", "덕분에 한결 수월했어요 🌿", "먼저 챙겨주셔서 감동 ✨", "최고예요! 🌸"].map(quick => (
                  <button key={quick}
                    onClick={() => setThanksDraft(p => ({ ...p, text: p.text + (p.text ? " " : "") + quick }))}
                    style={{
                      background: C.warm, color: C.muted,
                      borderRadius: 14, padding: "3px 10px",
                      fontSize: 10, fontWeight: 500,
                    }}>
                    {quick}
                  </button>
                ))}
              </div>

              <button onClick={() => {
                if (!thanksDraft.to) { showToast("받을 분을 선택해주세요", "err"); return; }
                if (!thanksDraft.text.trim()) { showToast("메시지를 작성해주세요", "err"); return; }
                setThanks(p => [...p, {
                  id: Date.now(), from: myId, to: thanksDraft.to,
                  text: thanksDraft.text,
                  time: new Date().toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                }]);
                setThanksDraft({ to: null, text: "" });
                showToast("감사 인사가 전달됐어요 💌");
              }} style={{
                width: "100%", background: C.roseDeep, color: "#fff",
                borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 700,
                marginTop: 12,
              }}>
                💌 감사 인사 보내기
              </button>
            </div>

            {/* 받은 감사 인사 */}
            {(() => {
              const received = thanks.filter(t => t.to === myId);
              if (received.length === 0) return null;
              return (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                    💝 내가 받은 감사 인사 ({received.length})
                  </div>
                  {[...received].reverse().map(t => {
                    const fromMember = members.find(m => m.id === t.from);
                    return (
                      <div key={t.id} className="card" style={{
                        background: C.roseSoft, borderRadius: 14, padding: "12px 14px",
                        marginBottom: 8, border: `1px solid ${C.rose}`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 18 }}>{fromMember?.avatar}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>
                            {fromMember?.name}님이 보냈어요
                          </span>
                          <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>{t.time}</span>
                        </div>
                        <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
                          "{t.text}"
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* 전체 감사 인사 */}
            {thanks.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                  📜 오늘의 감사 인사 모음
                </div>
                {[...thanks].reverse().map(t => {
                  const fromMember = members.find(m => m.id === t.from);
                  const toMember = members.find(m => m.id === t.to);
                  return (
                    <div key={t.id} style={{
                      background: C.card, borderRadius: 12, padding: "10px 12px",
                      marginBottom: 6, border: `1px solid ${C.line}`,
                    }}>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
                        <b>{fromMember?.name}</b> → <b style={{ color: C.roseDeep }}>{toMember?.name}</b>
                        <span style={{ marginLeft: 6 }}>· {t.time}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
                        {t.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ 매장 탭 ══ */}
        {tab === "salon" && (
          <div>
            {/* 서브메뉴 */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 16,
            }}>
              {[
                { id: "events",    label: "일정",      icon: "📅" },
                { id: "birthdays", label: "생일·기념", icon: "🎂" },
                { id: "mvp",       label: "이달의 별", icon: "🏆" },
                { id: "time",      label: "시간 적립", icon: "⏰" },
                { id: "daily",     label: "일일 체크", icon: "✅" },
                { id: "orders",    label: "발주 요청", icon: "📦" },
                { id: "suggest",   label: "건의함",    icon: "💭" },
                { id: "mood",      label: "컨디션",    icon: "💗" },
              ].map(s => (
                <button key={s.id} onClick={() => setSalonSub(s.id)} style={{
                  background: salonSub === s.id ? C.sageDeep : C.card,
                  color: salonSub === s.id ? "#fff" : C.ink,
                  border: `1px solid ${salonSub === s.id ? C.sageDeep : C.line}`,
                  borderRadius: 12, padding: "10px 4px",
                  fontSize: 11, fontWeight: salonSub === s.id ? 700 : 500,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  transition: "all .15s",
                }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>

            {/* ─── 일정 (회식·교육) ─── */}
            {salonSub === "events" && (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #6FA882, #4E8A68)",
                  borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 14,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>📅 회식·교육 일정</div>
                    <div style={{ fontSize: 11, opacity: .85, marginTop: 2 }}>다 같이 챙기는 우리 매장 일정</div>
                  </div>
                  <button onClick={() => setShowEventForm(!showEventForm)} style={{
                    background: "rgba(255,255,255,0.25)", color: "#fff",
                    borderRadius: 14, padding: "5px 12px", fontSize: 12, fontWeight: 700,
                  }}>
                    {showEventForm ? "닫기" : "+ 추가"}
                  </button>
                </div>

                {showEventForm && (
                  <div className="card" style={{
                    background: C.card, borderRadius: 14, padding: 14, marginBottom: 14,
                    border: `1px solid ${C.line}`,
                  }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      {["회식", "교육", "행사"].map(t => (
                        <button key={t} onClick={() => setEventDraft(p => ({ ...p, type: t }))} style={{
                          flex: 1, background: eventDraft.type === t ? C.sageDeep : C.bg,
                          color: eventDraft.type === t ? "#fff" : C.muted,
                          borderRadius: 10, padding: "5px", fontSize: 12, fontWeight: 600,
                          border: `1px solid ${eventDraft.type === t ? C.sageDeep : C.line}`,
                        }}>{t}</button>
                      ))}
                    </div>
                    <input placeholder="제목" value={eventDraft.title}
                      onChange={e => setEventDraft(p => ({ ...p, title: e.target.value }))}
                      style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, background: C.bg, marginBottom: 6, outline: "none", color: C.ink }} />
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <input type="date" value={eventDraft.date}
                        onChange={e => setEventDraft(p => ({ ...p, date: e.target.value }))}
                        style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, background: C.bg, outline: "none", color: C.ink }} />
                      <input type="time" value={eventDraft.time}
                        onChange={e => setEventDraft(p => ({ ...p, time: e.target.value }))}
                        style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, background: C.bg, outline: "none", color: C.ink }} />
                    </div>
                    <input placeholder="장소" value={eventDraft.location}
                      onChange={e => setEventDraft(p => ({ ...p, location: e.target.value }))}
                      style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, background: C.bg, marginBottom: 6, outline: "none", color: C.ink }} />
                    <input placeholder="메모 (선택)" value={eventDraft.note}
                      onChange={e => setEventDraft(p => ({ ...p, note: e.target.value }))}
                      style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, background: C.bg, marginBottom: 8, outline: "none", color: C.ink }} />
                    <button onClick={() => {
                      if (!eventDraft.title || !eventDraft.date) { showToast("제목과 날짜를 입력해주세요", "err"); return; }
                      setEvents(p => [...p, { ...eventDraft, id: Date.now() }]);
                      setEventDraft({ type: "회식", title: "", date: "", time: "", location: "", note: "" });
                      setShowEventForm(false);
                      showToast("일정이 추가됐어요 📅");
                    }} style={{
                      width: "100%", background: C.sageDeep, color: "#fff",
                      borderRadius: 10, padding: "8px", fontSize: 12, fontWeight: 700,
                    }}>일정 추가</button>
                  </div>
                )}

                {[...events].sort((a, b) => a.date.localeCompare(b.date)).map(ev => {
                  const dDay = Math.ceil((new Date(ev.date) - new Date()) / (1000 * 60 * 60 * 24));
                  const typeColor = ev.type === "회식" ? C.rose : ev.type === "교육" ? C.gold : C.sage;
                  return (
                    <div key={ev.id} className="card" style={{
                      background: C.card, borderRadius: 14, padding: "12px 14px", marginBottom: 8,
                      border: `1px solid ${C.line}`, borderLeft: `4px solid ${typeColor}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{
                              fontSize: 10, padding: "1px 7px", borderRadius: 8,
                              background: typeColor + "22", color: typeColor, fontWeight: 700,
                            }}>{ev.type}</span>
                            {dDay >= 0 && dDay <= 7 && (
                              <span style={{ fontSize: 10, color: C.roseDeep, fontWeight: 700 }}>
                                D-{dDay === 0 ? "DAY" : dDay}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{ev.title}</div>
                          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                            📅 {ev.date} {ev.time && `· ${ev.time}`}<br/>
                            {ev.location && `📍 ${ev.location}`}
                            {ev.note && <><br/>💭 {ev.note}</>}
                          </div>
                        </div>
                        <button onClick={() => setEvents(p => p.filter(x => x.id !== ev.id))}
                          style={{ background: "none", color: C.muted, fontSize: 16, padding: 4 }}>×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── 생일·기념일 ─── */}
            {salonSub === "birthdays" && (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #D4806A, #B5614E)",
                  borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 14,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>🎂 생일·기념일</div>
                  <div style={{ fontSize: 11, opacity: .85, marginTop: 2 }}>특별한 날을 함께 챙겨요</div>
                </div>

                {/* 추가 폼 */}
                <div className="card" style={{
                  background: C.card, borderRadius: 14, padding: 12, marginBottom: 14,
                  border: `1px solid ${C.line}`,
                }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 600 }}>+ 새 기념일 추가</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
                    {ALL_MEMBERS.map(m => (
                      <button key={m.id} onClick={() => setBirthDraft(p => ({ ...p, memberId: m.id }))} style={{
                        background: birthDraft.memberId === m.id ? C.roseDeep : C.bg,
                        color: birthDraft.memberId === m.id ? "#fff" : C.ink,
                        borderRadius: 14, padding: "3px 10px", fontSize: 11,
                        border: `1px solid ${birthDraft.memberId === m.id ? C.roseDeep : C.line}`,
                        fontWeight: birthDraft.memberId === m.id ? 700 : 400,
                      }}>{m.avatar} {m.name}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <select value={birthDraft.type}
                      onChange={e => setBirthDraft(p => ({ ...p, type: e.target.value }))}
                      style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "6px 10px", fontSize: 12, background: C.bg, outline: "none", color: C.ink }}>
                      <option>생일</option>
                      <option>기타</option>
                    </select>
                    <input type="date" value={birthDraft.date}
                      onChange={e => setBirthDraft(p => ({ ...p, date: e.target.value }))}
                      style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "6px 10px", fontSize: 12, background: C.bg, outline: "none", color: C.ink }} />
                    <button onClick={() => {
                      if (!birthDraft.date) { showToast("날짜를 입력해주세요", "err"); return; }
                      setBirthdays(p => [...p, { ...birthDraft, id: Date.now() }]);
                      setBirthDraft({ memberId: 1, type: "생일", date: "" });
                      showToast("기념일이 추가됐어요 🎂");
                    }} style={{
                      background: C.roseDeep, color: "#fff", borderRadius: 10,
                      padding: "6px 14px", fontSize: 12, fontWeight: 700,
                    }}>+</button>
                  </div>
                </div>

                {[...birthdays].sort((a, b) => {
                  const md = (d) => d.slice(5);
                  return md(a.date).localeCompare(md(b.date));
                }).map(b => {
                  const member = ALL_MEMBERS.find(m => m.id === b.memberId);
                  const today = new Date();
                  const thisYear = new Date(today.getFullYear() + "-" + b.date.slice(5));
                  if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
                  const dDay = Math.ceil((thisYear - today) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={b.id} className="card" style={{
                      background: C.card, borderRadius: 14, padding: "12px 14px", marginBottom: 8,
                      border: `1px solid ${C.line}`,
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                      }}>{member?.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>
                          {member?.name}님의 {b.type}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted }}>
                          📅 {b.date.slice(5).replace("-", "월 ")}일
                          {dDay <= 30 && <span style={{ color: C.roseDeep, marginLeft: 8, fontWeight: 700 }}>D-{dDay}</span>}
                        </div>
                      </div>
                      <button onClick={() => setBirthdays(p => p.filter(x => x.id !== b.id))}
                        style={{ background: "none", color: C.muted, fontSize: 16 }}>×</button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── 이달의 별 (칭찬왕·도움왕) ─── */}
            {salonSub === "mvp" && (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #C9A052, #A8843E)",
                  borderRadius: 16, padding: "18px 20px", color: "#fff", marginBottom: 14,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🏆</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>이달의 별</div>
                  <div style={{ fontSize: 11, opacity: .9 }}>도움 횟수와 받은 감사 인사로 산정</div>
                </div>

                {/* 도움왕 */}
                <div className="card" style={{
                  background: C.card, borderRadius: 16, padding: 14, marginBottom: 12,
                  border: `1px solid ${C.line}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 10 }}>
                    🤝 도움왕 (도움 준 횟수)
                  </div>
                  {[...ALL_MEMBERS]
                    .map(m => ({ ...m, count: log.filter(l => l.from === m.id).length }))
                    .sort((a, b) => b.count - a.count)
                    .map((m, i, arr) => (
                      <div key={m.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none",
                      }}>
                        <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                        </span>
                        <span style={{ fontSize: 18 }}>{m.avatar}</span>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.ink }}>{m.name}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.sageDeep }}>{m.count}회</span>
                      </div>
                  ))}
                </div>

                {/* 칭찬왕 */}
                <div className="card" style={{
                  background: C.card, borderRadius: 16, padding: 14, marginBottom: 12,
                  border: `1px solid ${C.line}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.roseDeep, marginBottom: 10 }}>
                    💝 칭찬왕 (받은 감사 인사)
                  </div>
                  {[...ALL_MEMBERS]
                    .map(m => ({ ...m, count: thanks.filter(t => t.to === m.id).length }))
                    .sort((a, b) => b.count - a.count)
                    .map((m, i, arr) => (
                      <div key={m.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none",
                      }}>
                        <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                        </span>
                        <span style={{ fontSize: 18 }}>{m.avatar}</span>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.ink }}>{m.name}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.roseDeep }}>{m.count}회</span>
                      </div>
                  ))}
                </div>

                <div style={{
                  background: C.warm, borderRadius: 12, padding: "12px 14px",
                  fontSize: 11, color: C.muted, lineHeight: 1.7, textAlign: "center",
                }}>
                  💡 매월 말일에 그달의 별을 함께 축하해요!<br/>
                  순위는 경쟁이 아닌 격려를 위한 것이에요 🌿
                </div>

                {/* 🔄 대표 전용 리셋 버튼 */}
                {isJangnim && (
                  <div className="card" style={{
                    background: "#FFF5F0", borderRadius: 16, padding: "16px 18px",
                    marginTop: 16, border: `1.5px solid ${C.rose}`,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.roseDeep, marginBottom: 6 }}>
                      🔄 대표 전용: 이달 기록 리셋
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
                      매달 정산 후 도움 기록과 청소 체크를 초기화할 수 있어요.<br/>
                      <b style={{ color: C.roseDeep }}>대표님(계완)만 사용 가능</b>합니다.<br/><br/>
                      <span style={{ color: C.sageDeep }}>✅ 보관: 감사 인사·건의함·생일·일정·발주·시간 적립</span><br/>
                      <span style={{ color: C.roseDeep }}>🔄 초기화: 도움 기록·청소 체크</span>
                    </div>
                    <button onClick={() => {
                      const confirm1 = window.confirm(
                        "⚠️ 정말 이달의 기록을 리셋하시겠어요?\n\n" +
                        "다음 데이터가 초기화됩니다:\n" +
                        "• 도움 기록 (도움왕 카운트)\n" +
                        "• 청소 체크 항목\n\n" +
                        "감사 인사, 건의함, 생일, 일정 등은 보관됩니다."
                      );
                      if (!confirm1) return;

                      const confirm2 = window.confirm(
                        "한 번 더 확인할게요!\n\n" +
                        "리셋하면 되돌릴 수 없어요.\n" +
                        "정말 진행할까요?"
                      );
                      if (!confirm2) return;

                      // 리셋 실행
                      setLog([]);
                      setZoneDone({});
                      setMembers(prev => prev.map(m => ({ ...m, helpCount: 0, givenCount: 0 })));
                      showToast("이번 달 기록이 리셋됐어요! 새로운 한 달 시작! 🌿");
                    }} style={{
                      width: "100%", background: C.roseDeep, color: "#fff",
                      borderRadius: 12, padding: "10px", fontSize: 13, fontWeight: 700,
                    }}>
                      🔄 이달의 기록 리셋하기
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── 시간 적립 ─── */}
            {salonSub === "time" && (() => {
              // 내 시간 계산 (earn은 +, use/penalty는 -)
              const myBalance = timeBank
                .filter(t => t.memberId === myId)
                .reduce((sum, t) => sum + (t.type === "earn" ? t.minutes : -t.minutes), 0);

              const formatMin = (min) => {
                if (min === 0) return "0분";
                const hours = Math.floor(Math.abs(min) / 60);
                const mins = Math.abs(min) % 60;
                let result = "";
                if (hours > 0) result += `${hours}시간`;
                if (mins > 0) result += `${hours > 0 ? " " : ""}${mins}분`;
                return result;
              };

              return (
                <div>
                  {/* 헤더 */}
                  <div className="card" style={{
                    background: "linear-gradient(135deg, #5A8AAD, #3D6B8A)",
                    borderRadius: 16, padding: "18px 20px", color: "#fff", marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>⏰</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>시간 적립</div>
                    <div style={{ fontSize: 12, opacity: .9, lineHeight: 1.7 }}>
                      늦게까지 일한 시간을 모아두고,<br/>
                      다른 날 일찍 가거나 늦게 출근할 때 써요
                    </div>
                  </div>

                  {/* 내 잔액 */}
                  <div className="card" style={{
                    background: myBalance > 0 ? C.sageSoft : C.card,
                    border: `2px solid ${myBalance > 0 ? C.sage : C.line}`,
                    borderRadius: 18, padding: "20px", marginBottom: 14,
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 6 }}>
                      💼 {me?.name}님의 잔여 시간
                    </div>
                    <div style={{
                      fontSize: 32, fontWeight: 700,
                      color: myBalance > 0 ? C.sageDeep : C.muted,
                    }}>
                      {formatMin(myBalance)}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                      {myBalance > 0 ? "사용 가능한 시간이에요 💛" : "적립된 시간이 없어요"}
                    </div>
                  </div>

                  {/* 입력 폼 */}
                  <div className="card" style={{
                    background: C.card, borderRadius: 14, padding: 14, marginBottom: 14,
                    border: `1px solid ${C.line}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                      ⏱️ 시간 기록하기
                    </div>

                    {/* 적립/사용 선택 */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      <button onClick={() => setTimeDraft(p => ({ ...p, type: "earn" }))} style={{
                        flex: 1, background: timeDraft.type === "earn" ? C.sageDeep : C.bg,
                        color: timeDraft.type === "earn" ? "#fff" : C.muted,
                        borderRadius: 10, padding: "8px", fontSize: 12, fontWeight: 700,
                        border: `1px solid ${timeDraft.type === "earn" ? C.sageDeep : C.line}`,
                      }}>
                        ➕ 늦게 일함 (적립)
                      </button>
                      <button onClick={() => setTimeDraft(p => ({ ...p, type: "use" }))} style={{
                        flex: 1, background: timeDraft.type === "use" ? C.roseDeep : C.bg,
                        color: timeDraft.type === "use" ? "#fff" : C.muted,
                        borderRadius: 10, padding: "8px", fontSize: 12, fontWeight: 700,
                        border: `1px solid ${timeDraft.type === "use" ? C.roseDeep : C.line}`,
                      }}>
                        ➖ 일찍 감/늦게 옴 (사용)
                      </button>
                    </div>

                    {/* 30분 단위 선택 */}
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
                      얼마나? (30분 단위)
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                      {[30, 60, 90, 120, 150, 180].map(min => (
                        <button key={min}
                          onClick={() => setTimeDraft(p => ({ ...p, minutes: min }))}
                          style={{
                            flex: "1 0 auto",
                            background: timeDraft.minutes === min ? C.sageDeep : C.bg,
                            color: timeDraft.minutes === min ? "#fff" : C.ink,
                            borderRadius: 10, padding: "7px 10px", fontSize: 12,
                            border: `1px solid ${timeDraft.minutes === min ? C.sageDeep : C.line}`,
                            fontWeight: timeDraft.minutes === min ? 700 : 500,
                          }}>
                          {formatMin(min)}
                        </button>
                      ))}
                    </div>

                    <input
                      placeholder="메모 (예: 이은비 손님 시술 마무리)"
                      value={timeDraft.note}
                      onChange={e => setTimeDraft(p => ({ ...p, note: e.target.value }))}
                      style={{
                        width: "100%", border: `1px solid ${C.line}`, borderRadius: 10,
                        padding: "8px 12px", fontSize: 12, background: C.bg, outline: "none",
                        color: C.ink, marginBottom: 10,
                      }}
                    />

                    <button onClick={() => {
                      // 사용 시 잔액 체크
                      if (timeDraft.type === "use" && timeDraft.minutes > myBalance) {
                        showToast(`잔액 부족! 현재 ${formatMin(myBalance)} 적립됨`, "err");
                        return;
                      }
                      const today = new Date();
                      setTimeBank(p => [...p, {
                        id: Date.now(),
                        memberId: myId,
                        type: timeDraft.type,
                        minutes: timeDraft.minutes,
                        note: timeDraft.note,
                        date: today.toLocaleDateString("ko-KR"),
                        time: today.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                      }]);
                      setTimeDraft({ type: "earn", minutes: 30, note: "" });
                      showToast(
                        timeDraft.type === "earn"
                          ? `${formatMin(timeDraft.minutes)} 적립됐어요! 💛`
                          : `${formatMin(timeDraft.minutes)} 사용했어요`
                      );
                    }} style={{
                      width: "100%",
                      background: timeDraft.type === "earn" ? C.sageDeep : C.roseDeep,
                      color: "#fff", borderRadius: 12, padding: "10px",
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {timeDraft.type === "earn" ? "➕ 적립하기" : "➖ 사용하기"}
                    </button>
                  </div>

                  {/* 전체 멤버 잔액 현황 */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                    👥 팀 전체 잔액
                  </div>
                  {ALL_MEMBERS.map(m => {
                    const bal = timeBank
                      .filter(t => t.memberId === m.id)
                      .reduce((sum, t) => sum + (t.type === "earn" ? t.minutes : -t.minutes), 0);
                    return (
                      <div key={m.id} className="card" style={{
                        background: C.card, borderRadius: 12, padding: "10px 14px",
                        marginBottom: 6, display: "flex", alignItems: "center", gap: 10,
                        border: `1px solid ${C.line}`,
                      }}>
                        <span style={{ fontSize: 18 }}>{m.avatar}</span>
                        <div style={{ flex: 1, fontSize: 13, color: C.ink, fontWeight: 600 }}>
                          {m.name}
                          {m.id === myId && <span style={{ fontSize: 10, color: C.sage, marginLeft: 5 }}>(나)</span>}
                        </div>
                        <div style={{
                          fontSize: 14, fontWeight: 700,
                          color: bal > 0 ? C.sageDeep : C.muted,
                        }}>
                          {formatMin(bal)}
                        </div>
                      </div>
                    );
                  })}

                  {/* 내 기록 내역 */}
                  {(() => {
                    const myLogs = timeBank.filter(t => t.memberId === myId);
                    if (myLogs.length === 0) return null;
                    return (
                      <div style={{ marginTop: 18 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                          📋 내 기록 내역
                        </div>
                        {[...myLogs].reverse().slice(0, 20).map(t => {
                          const isPenalty = t.type === "penalty";
                          const isEarn = t.type === "earn";
                          return (
                            <div key={t.id} style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "10px 12px", marginBottom: 5,
                              background: isPenalty ? "#FFF5F0" : C.card,
                              borderRadius: 10,
                              border: `1px solid ${C.line}`,
                              borderLeft: `4px solid ${isEarn ? C.sage : C.rose}`,
                            }}>
                              <span style={{
                                fontSize: 12, fontWeight: 700,
                                color: isEarn ? C.sageDeep : C.roseDeep,
                                minWidth: 50,
                              }}>
                                {isEarn ? "+" : "−"}{formatMin(t.minutes)}
                              </span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: C.muted }}>
                                  {t.date} {t.time}
                                  {isPenalty && <span style={{ color: C.roseDeep, marginLeft: 4, fontWeight: 700 }}>· 차감</span>}
                                </div>
                                {t.note && (
                                  <div style={{ fontSize: 12, color: C.ink, marginTop: 2 }}>
                                    {t.note}
                                  </div>
                                )}
                              </div>
                              <button onClick={() => {
                                if (window.confirm("이 기록을 삭제하시겠어요?")) {
                                  setTimeBank(p => p.filter(x => x.id !== t.id));
                                  showToast("삭제됐어요");
                                }
                              }} style={{
                                background: "none", color: C.muted, fontSize: 16, padding: 4,
                              }}>×</button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  <div style={{
                    background: C.warm, borderRadius: 12, padding: "12px 14px",
                    fontSize: 11, color: C.muted, lineHeight: 1.7, textAlign: "center",
                    marginTop: 14,
                  }}>
                    💡 적립한 만큼만 사용 가능해요<br/>
                    미리 당겨쓸 수는 없어요
                  </div>
                </div>
              );
            })()}

            {/* ─── 일일 체크 (리뷰 답글 + 인스타) ─── */}
            {salonSub === "daily" && (() => {
              const today = new Date();
              const todayKey = today.toLocaleDateString("ko-KR");
              const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

              // 내가 오늘 리뷰 답글 했나?
              const myReviewDone = (reviewDone[todayKey] || []).includes(myId);

              // 이번 달 내 인스타 업로드 횟수
              const myInstaCount = instaUploads.filter(u =>
                u.memberId === myId && u.date.startsWith(thisMonth)
              ).length;

              return (
                <div>
                  {/* 헤더 */}
                  <div className="card" style={{
                    background: "linear-gradient(135deg, #9A7AC8, #7A5AA8)",
                    borderRadius: 16, padding: "18px 20px", color: "#fff", marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>✅</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>오늘의 체크</div>
                    <div style={{ fontSize: 12, opacity: .9, lineHeight: 1.7 }}>
                      디자이너분들은 매일 리뷰 답글과<br/>
                      인스타 업로드(월 4회)를 체크해 주세요
                    </div>
                  </div>

                  {/* 대표일 경우 안내 카드만 표시 */}
                  {isJangnim && (
                    <div className="card" style={{
                      background: C.warm, borderRadius: 16, padding: "16px 18px",
                      marginBottom: 14, border: `1px solid #E0D5C5`,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
                        📋 대표님 모드
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                        리뷰 답글과 인스타 업로드는<br/>
                        디자이너분들이 직접 체크합니다.<br/>
                        대표님은 아래에서 팀 현황을 확인하세요 💛
                      </div>
                    </div>
                  )}

                  {/* 📝 리뷰 답글 (매일) - 대표 제외 */}
                  {!isJangnim && <div className="card" style={{
                    background: C.card, borderRadius: 16, padding: "16px 18px",
                    marginBottom: 14, border: `1.5px solid ${myReviewDone ? C.sage : C.line}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: myReviewDone ? C.sageSoft : C.warm,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                      }}>📝</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
                          내 리뷰 답글 (오늘)
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                          본인 리뷰에 매일 답글 달기
                        </div>
                      </div>
                      {myReviewDone && (
                        <span style={{
                          background: C.sage, color: "#fff",
                          borderRadius: 12, padding: "3px 10px",
                          fontSize: 11, fontWeight: 700,
                        }}>✓ 완료</span>
                      )}
                    </div>

                    <button onClick={() => {
                      const cur = reviewDone[todayKey] || [];
                      if (cur.includes(myId)) {
                        // 체크 취소
                        if (window.confirm("리뷰 답글 완료를 취소하시겠어요?")) {
                          setReviewDone(p => ({ ...p, [todayKey]: cur.filter(id => id !== myId) }));
                          showToast("취소됐어요");
                        }
                      } else {
                        // 체크 완료
                        setReviewDone(p => ({ ...p, [todayKey]: [...cur, myId] }));
                        showToast("리뷰 답글 완료! 💛");
                      }
                    }} style={{
                      width: "100%",
                      background: myReviewDone ? C.warm : C.sageDeep,
                      color: myReviewDone ? C.muted : "#fff",
                      borderRadius: 12, padding: "10px",
                      fontSize: 13, fontWeight: 700,
                      border: myReviewDone ? `1px solid ${C.line}` : "none",
                    }}>
                      {myReviewDone ? "↩️ 완료 취소" : "✅ 오늘 리뷰 답글 완료"}
                    </button>

                    <div style={{
                      fontSize: 10, color: C.muted, marginTop: 8, textAlign: "center",
                    }}>
                      💡 매일 잊지 말고 체크해 주세요
                    </div>
                  </div>}

                  {/* 📸 인스타 업로드 (월 4회) - 대표 제외 */}
                  {!isJangnim && <div className="card" style={{
                    background: C.card, borderRadius: 16, padding: "16px 18px",
                    marginBottom: 14, border: `1.5px solid ${myInstaCount >= 4 ? C.sage : C.line}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: myInstaCount >= 4 ? C.sageSoft : C.warm,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                      }}>📸</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
                          내 인스타 업로드 (이번 달)
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                          개인 인스타에 월 4회 이상
                        </div>
                      </div>
                      <div style={{
                        background: myInstaCount >= 4 ? C.sage : C.gold,
                        color: "#fff",
                        borderRadius: 12, padding: "4px 12px",
                        fontSize: 13, fontWeight: 700,
                      }}>
                        {myInstaCount}/4
                      </div>
                    </div>

                    {/* 진행률 바 */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ height: 8, background: C.line, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.min(myInstaCount / 4 * 100, 100)}%`,
                          background: myInstaCount >= 4 ? C.sage : C.gold,
                          transition: "width .4s ease",
                        }} />
                      </div>
                    </div>

                    <button onClick={() => {
                      setInstaUploads(p => [...p, {
                        id: Date.now(),
                        memberId: myId,
                        date: today.toISOString().slice(0, 10), // 2026-05-17
                        time: today.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                      }]);
                      showToast(`📸 ${myInstaCount + 1}번째 업로드 완료!`);
                    }} style={{
                      width: "100%",
                      background: C.sageDeep, color: "#fff",
                      borderRadius: 12, padding: "10px",
                      fontSize: 13, fontWeight: 700,
                    }}>
                      📸 인스타 업로드 완료 추가
                    </button>

                    <div style={{
                      fontSize: 10, color: C.muted, marginTop: 8, textAlign: "center",
                    }}>
                      💡 한 달에 4번씩 꾸준히 올려봐요
                    </div>

                    {/* 이번 달 업로드 내역 */}
                    {myInstaCount > 0 && (
                      <div style={{
                        marginTop: 12, padding: 10,
                        background: C.bg, borderRadius: 10,
                      }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, fontWeight: 600 }}>
                          이번 달 업로드 ({myInstaCount}회)
                        </div>
                        {instaUploads
                          .filter(u => u.memberId === myId && u.date.startsWith(thisMonth))
                          .slice().reverse()
                          .map((u, i) => (
                            <div key={u.id} style={{
                              display: "flex", alignItems: "center", gap: 6,
                              fontSize: 11, color: C.ink, marginBottom: 3,
                            }}>
                              <span style={{ color: C.sageDeep, fontWeight: 700 }}>{myInstaCount - i}회차</span>
                              <span style={{ color: C.muted }}>· {u.date.slice(5).replace("-", "월 ")}일 {u.time}</span>
                              <button onClick={() => {
                                if (window.confirm("이 업로드 기록을 삭제하시겠어요?")) {
                                  setInstaUploads(p => p.filter(x => x.id !== u.id));
                                  showToast("삭제됐어요");
                                }
                              }} style={{
                                marginLeft: "auto", background: "none",
                                color: C.muted, fontSize: 14, padding: 2,
                              }}>×</button>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>}

                  {/* 👥 팀 전체 현황 (대표 제외) */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                    👥 팀 전체 현황
                  </div>
                  {ALL_MEMBERS.filter(m => m.canHelp).map(m => {
                    const memberReviewDone = (reviewDone[todayKey] || []).includes(m.id);
                    const memberInstaCount = instaUploads.filter(u =>
                      u.memberId === m.id && u.date.startsWith(thisMonth)
                    ).length;
                    return (
                      <div key={m.id} className="card" style={{
                        background: C.card, borderRadius: 12, padding: "12px 14px",
                        marginBottom: 6, border: `1px solid ${C.line}`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 18 }}>{m.avatar}</span>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, flex: 1 }}>
                            {m.name}
                            {m.id === myId && <span style={{ fontSize: 10, color: C.sage, marginLeft: 5 }}>(나)</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{
                            flex: 1, padding: "6px 10px", borderRadius: 8,
                            background: memberReviewDone ? C.sageSoft : C.warm,
                            fontSize: 11, color: memberReviewDone ? C.sageDeep : C.muted,
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            <span>📝</span>
                            <span style={{ fontWeight: 600 }}>
                              리뷰: {memberReviewDone ? "✓" : "—"}
                            </span>
                          </div>
                          <div style={{
                            flex: 1, padding: "6px 10px", borderRadius: 8,
                            background: memberInstaCount >= 4 ? C.sageSoft : C.warm,
                            fontSize: 11, color: memberInstaCount >= 4 ? C.sageDeep : C.muted,
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            <span>📸</span>
                            <span style={{ fontWeight: 600 }}>
                              인스타: {memberInstaCount}/4
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 헤더 영역 끝 */}
                </div>
              );
            })()}

            {/* ─── 발주 요청 ─── */}
            {salonSub === "orders" && (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #7AAEC8, #4E8AAD)",
                  borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 14,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>📦 제품 발주 요청</div>
                  <div style={{ fontSize: 11, opacity: .85, marginTop: 2 }}>부족하거나 필요한 제품을 요청하세요</div>
                </div>

                {/* 작성 폼 */}
                <div className="card" style={{
                  background: C.card, borderRadius: 14, padding: 14, marginBottom: 14,
                  border: `1px solid ${C.line}`,
                }}>
                  <input placeholder="제품명 (예: 매트릭스 8N 염색약)"
                    value={orderDraft.item}
                    onChange={e => setOrderDraft(p => ({ ...p, item: e.target.value }))}
                    style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: C.bg, marginBottom: 6, outline: "none", color: C.ink }} />
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <input placeholder="수량 (예: 5개)" value={orderDraft.qty}
                      onChange={e => setOrderDraft(p => ({ ...p, qty: e.target.value }))}
                      style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: C.bg, outline: "none", color: C.ink }} />
                    <select value={orderDraft.urgency}
                      onChange={e => setOrderDraft(p => ({ ...p, urgency: e.target.value }))}
                      style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: C.bg, outline: "none", color: C.ink }}>
                      <option>여유</option>
                      <option>보통</option>
                      <option>급함</option>
                    </select>
                  </div>
                  <input placeholder="메모 (선택)" value={orderDraft.note}
                    onChange={e => setOrderDraft(p => ({ ...p, note: e.target.value }))}
                    style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: C.bg, marginBottom: 8, outline: "none", color: C.ink }} />
                  <button onClick={() => {
                    if (!orderDraft.item) { showToast("제품명을 입력해주세요", "err"); return; }
                    setOrders(p => [...p, {
                      ...orderDraft, id: Date.now(), from: myId, status: "요청됨",
                      time: new Date().toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                    }]);
                    setOrderDraft({ item: "", qty: "", urgency: "보통", note: "" });
                    showToast("발주 요청 완료 📦");
                  }} style={{
                    width: "100%", background: "#4E8AAD", color: "#fff",
                    borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: 700,
                  }}>요청 보내기</button>
                </div>

                {/* 요청 목록 */}
                {[...orders].reverse().map(o => {
                  const fromMember = ALL_MEMBERS.find(m => m.id === o.from);
                  const urgentColor = o.urgency === "급함" ? C.roseDeep : o.urgency === "보통" ? C.gold : C.sage;
                  const statusColor = o.status === "완료" ? C.sage : o.status === "주문중" ? C.gold : C.muted;
                  return (
                    <div key={o.id} className="card" style={{
                      background: C.card, borderRadius: 14, padding: "12px 14px", marginBottom: 8,
                      border: `1px solid ${C.line}`, borderLeft: `4px solid ${urgentColor}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{o.item}</div>
                        <span style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 8,
                          background: urgentColor + "22", color: urgentColor, fontWeight: 700,
                        }}>{o.urgency}</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
                        {o.qty && `📦 ${o.qty} · `}
                        👤 {fromMember?.name} · {o.time}
                        {o.note && <><br/>💭 {o.note}</>}
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        {["요청됨", "주문중", "완료"].map(s => (
                          <button key={s} onClick={() => {
                            setOrders(p => p.map(x => x.id === o.id ? { ...x, status: s } : x));
                            showToast(`${o.item} → ${s}`);
                          }}
                            style={{
                              flex: 1, background: o.status === s ? statusColor : C.bg,
                              color: o.status === s ? "#fff" : C.muted,
                              borderRadius: 8, padding: "4px", fontSize: 10, fontWeight: 600,
                              border: `1px solid ${o.status === s ? statusColor : C.line}`,
                            }}>{s}</button>
                        ))}
                        <button onClick={() => setOrders(p => p.filter(x => x.id !== o.id))}
                          style={{ background: C.bg, color: C.muted, borderRadius: 8, padding: "4px 9px", fontSize: 12, border: `1px solid ${C.line}` }}>×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── 익명 건의함 ─── */}
            {salonSub === "suggest" && (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #B8A9C9, #8A7AA0)",
                  borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 14,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>💭 익명 건의함</div>
                  <div style={{ fontSize: 11, opacity: .85, marginTop: 2, lineHeight: 1.6 }}>
                    하고 싶은 말, 개선하고 싶은 점,<br/>
                    누가 썼는지 모르게 자유롭게 남겨주세요
                  </div>
                </div>

                <div className="card" style={{
                  background: C.card, borderRadius: 14, padding: 14, marginBottom: 14,
                  border: `1px solid ${C.line}`,
                }}>
                  <textarea
                    placeholder="익명으로 의견을 남겨주세요... (다른 사람이 누가 썼는지 알 수 없어요)"
                    value={suggestDraft}
                    onChange={e => setSuggestDraft(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%", border: `1px solid ${C.line}`, borderRadius: 10,
                      padding: "10px 12px", fontSize: 13, background: C.bg, outline: "none",
                      color: C.ink, resize: "none", lineHeight: 1.6, marginBottom: 8,
                    }}
                  />
                  <button onClick={() => {
                    if (!suggestDraft.trim()) { showToast("내용을 입력해주세요", "err"); return; }
                    setSuggestions(p => [...p, {
                      id: Date.now(), text: suggestDraft, replies: [],
                      time: new Date().toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                    }]);
                    setSuggestDraft("");
                    showToast("익명으로 전달됐어요 💭");
                  }} style={{
                    width: "100%", background: "#8A7AA0", color: "#fff",
                    borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: 700,
                  }}>익명으로 보내기</button>
                </div>

                {suggestions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 30, color: C.muted, fontSize: 13 }}>
                    아직 등록된 건의가 없어요
                  </div>
                ) : (
                  [...suggestions].reverse().map(s => (
                    <div key={s.id} className="card" style={{
                      background: C.card, borderRadius: 14, padding: 14, marginBottom: 10,
                      border: `1px solid ${C.line}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 14 }}>🕊️</span>
                        <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>익명</span>
                        <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>{s.time}</span>
                      </div>
                      <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.7, marginBottom: 8, whiteSpace: "pre-wrap" }}>
                        {s.text}
                      </div>

                      {s.replies.length > 0 && (
                        <div style={{ background: C.bg, borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
                          {s.replies.map((r, i) => (
                            <div key={i} style={{
                              fontSize: 12, color: C.ink, lineHeight: 1.5,
                              paddingTop: i > 0 ? 6 : 0,
                              borderTop: i > 0 ? `1px solid ${C.line}` : "none",
                              marginTop: i > 0 ? 6 : 0,
                            }}>
                              <span style={{ color: C.sageDeep, fontWeight: 700 }}>↳ 답변</span>
                              <span style={{ fontSize: 10, color: C.muted, marginLeft: 6 }}>{r.time}</span>
                              <div style={{ marginTop: 3 }}>{r.text}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          placeholder="답변 남기기 (이름 표시 안 됨)"
                          value={replyDraft[s.id] || ""}
                          onChange={e => setReplyDraft(p => ({ ...p, [s.id]: e.target.value }))}
                          style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 10, padding: "6px 10px", fontSize: 12, background: C.bg, outline: "none", color: C.ink }}
                        />
                        <button onClick={() => {
                          const txt = (replyDraft[s.id] || "").trim();
                          if (!txt) return;
                          setSuggestions(p => p.map(x => x.id === s.id ? {
                            ...x, replies: [...x.replies, {
                              text: txt,
                              time: new Date().toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                            }]
                          } : x));
                          setReplyDraft(p => ({ ...p, [s.id]: "" }));
                          showToast("답변이 등록됐어요");
                        }}
                          style={{ background: C.sageDeep, color: "#fff", borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 700 }}>답변</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ─── 컨디션 체크 ─── */}
            {salonSub === "mood" && (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #E8B4A0, #C97B5A)",
                  borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 14,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>💗 오늘 컨디션 체크</div>
                  <div style={{ fontSize: 11, opacity: .9, marginTop: 2 }}>
                    몸과 마음 상태를 알려주세요. 서로 살피기 위함이에요
                  </div>
                </div>

                {/* 입력 카드 */}
                <div className="card" style={{
                  background: C.card, borderRadius: 14, padding: 16, marginBottom: 14,
                  border: `1px solid ${C.line}`,
                }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>🫀 몸 상태</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[
                        { v: 1, e: "😩", l: "지쳐요" },
                        { v: 2, e: "😟", l: "힘들어요" },
                        { v: 3, e: "😐", l: "보통" },
                        { v: 4, e: "🙂", l: "괜찮아요" },
                        { v: 5, e: "💪", l: "쌩쌩" },
                      ].map(o => (
                        <button key={o.v} onClick={() => setTodayMood(p => ({ ...p, body: o.v }))} style={{
                          flex: 1, background: todayMood.body === o.v ? C.roseSoft : C.bg,
                          border: `2px solid ${todayMood.body === o.v ? C.rose : C.line}`,
                          borderRadius: 10, padding: "8px 4px",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                        }}>
                          <span style={{ fontSize: 18 }}>{o.e}</span>
                          <span style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>{o.l}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>🌷 마음 상태</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[
                        { v: 1, e: "😢", l: "우울" },
                        { v: 2, e: "😔", l: "별로" },
                        { v: 3, e: "😌", l: "보통" },
                        { v: 4, e: "😊", l: "좋아요" },
                        { v: 5, e: "🥰", l: "최고" },
                      ].map(o => (
                        <button key={o.v} onClick={() => setTodayMood(p => ({ ...p, mind: o.v }))} style={{
                          flex: 1, background: todayMood.mind === o.v ? C.sageSoft : C.bg,
                          border: `2px solid ${todayMood.mind === o.v ? C.sage : C.line}`,
                          borderRadius: 10, padding: "8px 4px",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                        }}>
                          <span style={{ fontSize: 18 }}>{o.e}</span>
                          <span style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>{o.l}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    placeholder="한 마디 남기기 (선택) — 다른 분들이 살펴줄 거예요"
                    value={todayMood.note}
                    onChange={e => setTodayMood(p => ({ ...p, note: e.target.value }))}
                    style={{
                      width: "100%", border: `1px solid ${C.line}`, borderRadius: 10,
                      padding: "8px 12px", fontSize: 12, background: C.bg, outline: "none",
                      color: C.ink, marginBottom: 10,
                    }}
                  />
                  <button onClick={() => {
                    const today = new Date().toLocaleDateString("ko-KR");
                    setMoods(p => [
                      ...p.filter(x => !(x.memberId === myId && x.date === today)),
                      { ...todayMood, id: Date.now(), memberId: myId, date: today, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) },
                    ]);
                    showToast("컨디션 체크 완료 💗");
                  }} style={{
                    width: "100%", background: C.roseDeep, color: "#fff",
                    borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: 700,
                  }}>오늘 체크 저장</button>
                </div>

                {/* 오늘 팀 컨디션 */}
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                  오늘 팀 컨디션
                </div>
                {ALL_MEMBERS.map(m => {
                  const today = new Date().toLocaleDateString("ko-KR");
                  const mood = moods.find(x => x.memberId === m.id && x.date === today);
                  const bodyEmoji = ["😩", "😟", "😐", "🙂", "💪"][((mood?.body || 0) - 1)] || "·";
                  const mindEmoji = ["😢", "😔", "😌", "😊", "🥰"][((mood?.mind || 0) - 1)] || "·";
                  const isLowMood = mood && (mood.body <= 2 || mood.mind <= 2);
                  return (
                    <div key={m.id} className="card" style={{
                      background: isLowMood ? C.roseSoft : C.card,
                      borderRadius: 14, padding: "12px 14px", marginBottom: 8,
                      border: `1px solid ${isLowMood ? C.rose : C.line}`,
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20,
                      }}>{m.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{m.name}</div>
                        {mood ? (
                          <>
                            <div style={{ fontSize: 14, marginTop: 2 }}>
                              <span title="몸">{bodyEmoji}</span>
                              <span style={{ margin: "0 4px", color: C.line }}>·</span>
                              <span title="마음">{mindEmoji}</span>
                            </div>
                            {mood.note && (
                              <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontStyle: "italic" }}>
                                "{mood.note}"
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>아직 체크 안 함</div>
                        )}
                      </div>
                      {isLowMood && (
                        <span style={{
                          fontSize: 10, color: C.roseDeep, fontWeight: 700,
                          background: "#fff", padding: "3px 8px", borderRadius: 10,
                        }}>
                          살펴주세요
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ 우리 약속 탭 ══ */}
        {tab === "rules" && (
          <div>
            <div className="card" style={{
              background: "linear-gradient(135deg, #3D6B52, #2A4535)",
              borderRadius: 18, padding: "22px 20px", color: "#fff", marginBottom: 16,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>💛</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                함께, 매일 — 우리의 약속
              </div>
              <div style={{ fontSize: 12, opacity: .85, lineHeight: 1.8 }}>
                협력은 우리의 중심,<br/>
                매장의 모든 일을 <b>함께 챙기는 마음</b>이에요 🌿
              </div>
            </div>

            {RULES.map((r, i) => (
              <div key={i} className="card" style={{
                background: C.card, borderRadius: 16, padding: "16px 18px",
                marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 14,
                border: `1px solid ${C.line}`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                animationDelay: `${i * 0.08}s`,
              }}>
                <span style={{
                  fontSize: 22, background: C.sageSoft,
                  borderRadius: 12, padding: "8px 10px", flexShrink: 0,
                }}>{r.icon}</span>
                <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.65, paddingTop: 4 }}>
                  {r.text}
                </div>
              </div>
            ))}

            {/* 계완 대표 역할 안내 */}
            <div className="card" style={{
              background: C.warm, borderRadius: 18, padding: "18px 20px",
              border: `1px solid #E0D5C5`, marginTop: 6,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                📋 계완 대표님 역할
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
                대표님은 <b style={{ color: C.ink }}>매장 전체 관리</b>에 집중해요.<br/>
                시술 서브 요청은 <b style={{ color: C.sageDeep }}>서희·민경·하늘·지유</b>님께 부탁해요 🙏<br/>
                <br/>
                대표님이 편하게 매장 관리에만 집중할 수 있도록<br/>
                디자이너분들이 서로 먼저 챙겨주세요 💛
              </div>
            </div>

            {/* 격려 */}
            <div className="card" style={{
              background: C.card, borderRadius: 18, padding: "20px",
              border: `1px solid ${C.line}`, marginTop: 14, textAlign: "center",
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🌸</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
                매일의 작은 마음이 모여
              </div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
                먼저 살피는 시선,<br/>
                고맙다는 한 마디,<br/>
                함께 가꾸는 공간 —<br/>
                이런 매일이 모여 우리만의 색이 돼요 ✨
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
