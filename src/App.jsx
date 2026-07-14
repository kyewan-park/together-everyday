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
const DEFAULT_INVENTORY = [
    // ===== 염모제 (사진에서 읽은 실제 제품, 중복 제거) =====
    // 사진1 - 핑크/베이지/그레이/실버 계열
    { id: 101, category: "염모제", name: "6-LuRS",  par: 1, current: 1, fav: false },
    { id: 102, category: "염모제", name: "11-LuRS", par: 1, current: 1, fav: false },
    { id: 103, category: "염모제", name: "11-55",   par: 1, current: 1, fav: false },
    { id: 104, category: "염모제", name: "9-55",    par: 1, current: 1, fav: false },
    { id: 105, category: "염모제", name: "9-60",    par: 1, current: 1, fav: false },
    { id: 106, category: "염모제", name: "8-gLVI",  par: 1, current: 1, fav: false },
    { id: 107, category: "염모제", name: "7-S-Amber", par: 1, current: 1, fav: false },
    { id: 108, category: "염모제", name: "9-S-Amber", par: 1, current: 1, fav: false },
    { id: 109, category: "염모제", name: "7-mCH",   par: 1, current: 1, fav: false },
    { id: 110, category: "염모제", name: "9-mCH",   par: 1, current: 1, fav: false },
    { id: 111, category: "염모제", name: "Brown 7", par: 1, current: 1, fav: false },
    { id: 112, category: "염모제", name: "Brown 9", par: 1, current: 1, fav: false },
    { id: 113, category: "염모제", name: "C8-MT",   par: 1, current: 1, fav: false },
    { id: 114, category: "염모제", name: "PaleOrange", par: 1, current: 1, fav: false },
    { id: 115, category: "염모제", name: "PalePink",   par: 1, current: 1, fav: false },
    { id: 116, category: "염모제", name: "3-GrayPearl", par: 1, current: 1, fav: false },
    { id: 117, category: "염모제", name: "5-GrayPearl", par: 1, current: 1, fav: false },
    { id: 118, category: "염모제", name: "9-GrayPearl", par: 1, current: 1, fav: false },
    { id: 119, category: "염모제", name: "13-GrayPearl", par: 1, current: 1, fav: false },
    { id: 120, category: "염모제", name: "3-Silver", par: 1, current: 1, fav: false },
    { id: 121, category: "염모제", name: "5-Silver", par: 1, current: 1, fav: false },
    { id: 122, category: "염모제", name: "9-Silver", par: 1, current: 1, fav: false },
    { id: 123, category: "염모제", name: "13-Silver", par: 1, current: 1, fav: false },
    { id: 124, category: "염모제", name: "5-BO-Ruby", par: 1, current: 1, fav: false },
    { id: 125, category: "염모제", name: "7-BO-Ruby", par: 1, current: 1, fav: false },
    { id: 126, category: "염모제", name: "9-BO-Ruby", par: 1, current: 1, fav: false },
    { id: 127, category: "염모제", name: "3-NakedSand", par: 1, current: 1, fav: false },
    { id: 128, category: "염모제", name: "9-NakedCoral", par: 1, current: 1, fav: false },
    { id: 129, category: "염모제", name: "7-NakedWarm", par: 1, current: 1, fav: false },
    { id: 130, category: "염모제", name: "3-Sapphire", par: 1, current: 1, fav: false },
    { id: 131, category: "염모제", name: "5-Sapphire", par: 1, current: 1, fav: false },
    { id: 132, category: "염모제", name: "9-Sapphire", par: 1, current: 1, fav: false },
    { id: 133, category: "염모제", name: "13-Sapphire", par: 1, current: 1, fav: false },
    { id: 134, category: "염모제", name: "3-Cobalt-B", par: 1, current: 1, fav: false },
    { id: 135, category: "염모제", name: "5-Cobalt-B", par: 1, current: 1, fav: false },
    { id: 136, category: "염모제", name: "9-Cobalt-B", par: 1, current: 1, fav: false },
    { id: 137, category: "염모제", name: "DeepBlue", par: 1, current: 1, fav: false },
    { id: 138, category: "염모제", name: "DeepSilver", par: 1, current: 1, fav: false },
    { id: 139, category: "염모제", name: "3-Amethyst", par: 1, current: 1, fav: false },
    { id: 140, category: "염모제", name: "5-Amethyst", par: 1, current: 1, fav: false },
    { id: 141, category: "염모제", name: "9-Amethyst", par: 1, current: 1, fav: false },
    { id: 142, category: "염모제", name: "13-Amethyst", par: 1, current: 1, fav: false },
    { id: 143, category: "염모제", name: "5-Emerald", par: 1, current: 1, fav: false },
    { id: 144, category: "염모제", name: "7-Emerald", par: 1, current: 1, fav: false },
    { id: 145, category: "염모제", name: "9-Emerald", par: 1, current: 1, fav: false },
    { id: 146, category: "염모제", name: "PaleBlue", par: 1, current: 1, fav: false },
    { id: 147, category: "염모제", name: "PaleKhaki", par: 1, current: 1, fav: false },
    { id: 148, category: "염모제", name: "GREEN", par: 1, current: 1, fav: false },
    // 사진2 - hHZ/hCN/베이직톤 계열
    { id: 149, category: "염모제", name: "6-hHZ",  par: 1, current: 1, fav: false },
    { id: 150, category: "염모제", name: "7-hHZ",  par: 1, current: 1, fav: false },
    { id: 151, category: "염모제", name: "9-hHZ",  par: 1, current: 1, fav: false },
    { id: 152, category: "염모제", name: "11-hHZ", par: 1, current: 1, fav: false },
    { id: 153, category: "염모제", name: "6-hCN",  par: 1, current: 1, fav: false },
    { id: 154, category: "염모제", name: "7-hCN",  par: 1, current: 1, fav: false },
    { id: 155, category: "염모제", name: "9-hCN",  par: 1, current: 1, fav: false },
    { id: 156, category: "염모제", name: "11-hCN", par: 1, current: 1, fav: false },
    { id: 157, category: "염모제", name: "7-sMA",  par: 1, current: 1, fav: false },
    { id: 158, category: "염모제", name: "7-nGR",  par: 1, current: 1, fav: false },
    { id: 159, category: "염모제", name: "13-gLCA", par: 1, current: 1, fav: false },
    { id: 160, category: "염모제", name: "8-gLAP", par: 1, current: 1, fav: false },
    { id: 161, category: "염모제", name: "6-cLA",  par: 1, current: 1, fav: false },
    { id: 162, category: "염모제", name: "8-cLA",  par: 1, current: 1, fav: false },
    { id: 163, category: "염모제", name: "11-cLA", par: 1, current: 1, fav: false },
    { id: 164, category: "염모제", name: "9-cBL",  par: 1, current: 1, fav: false },
    { id: 165, category: "염모제", name: "11-cBL", par: 1, current: 1, fav: false },
    { id: 166, category: "염모제", name: "7-cBL",  par: 1, current: 1, fav: false },
    { id: 167, category: "염모제", name: "7-wAS",  par: 1, current: 1, fav: false },
    { id: 168, category: "염모제", name: "9-mLA",  par: 1, current: 1, fav: false },
    { id: 169, category: "염모제", name: "11-10",  par: 1, current: 1, fav: false },
    { id: 170, category: "염모제", name: "6-mNV",  par: 1, current: 1, fav: false },
    { id: 171, category: "염모제", name: "8-mNV",  par: 1, current: 1, fav: false },
    { id: 172, category: "염모제", name: "11-mNV", par: 1, current: 1, fav: false },
    { id: 173, category: "염모제", name: "6-nKH",  par: 1, current: 1, fav: false },
    { id: 174, category: "염모제", name: "9-nKH",  par: 1, current: 1, fav: false },
    { id: 175, category: "염모제", name: "11-nKH", par: 1, current: 1, fav: false },
    { id: 176, category: "염모제", name: "13-nKH", par: 1, current: 1, fav: false },
    // 사진3 - FB/RB/NB/BB/Maji 계열
    { id: 177, category: "염모제", name: "9-FB",   par: 1, current: 1, fav: false },
    { id: 178, category: "염모제", name: "11-FB",  par: 1, current: 1, fav: false },
    { id: 179, category: "염모제", name: "6-FB",   par: 1, current: 1, fav: false },
    { id: 180, category: "염모제", name: "9-BB",   par: 1, current: 1, fav: false },
    { id: 181, category: "염모제", name: "6-BB",   par: 1, current: 1, fav: false },
    { id: 182, category: "염모제", name: "6-RB",   par: 1, current: 1, fav: false },
    { id: 183, category: "염모제", name: "7-RB",   par: 1, current: 1, fav: false },
    { id: 184, category: "염모제", name: "9-RB",   par: 1, current: 1, fav: false },
    { id: 185, category: "염모제", name: "5-NB",   par: 1, current: 1, fav: false },
    { id: 186, category: "염모제", name: "6-NB",   par: 1, current: 1, fav: false },
    { id: 187, category: "염모제", name: "7-NB",   par: 1, current: 1, fav: false },
    { id: 188, category: "염모제", name: "9-NB",   par: 1, current: 1, fav: false },
    { id: 189, category: "염모제", name: "Maji-B5.35",  par: 1, current: 1, fav: false },
    { id: 190, category: "염모제", name: "Maji-2.10",   par: 1, current: 1, fav: false },
    { id: 191, category: "염모제", name: "Maji-4.112",  par: 1, current: 1, fav: false },
    { id: 192, category: "염모제", name: "Maji-6.1",    par: 1, current: 1, fav: false },
    { id: 193, category: "염모제", name: "Maji-CC7.11", par: 1, current: 1, fav: false },
    { id: 194, category: "염모제", name: "Maji-CC5.18", par: 1, current: 1, fav: false },
    { id: 195, category: "염모제", name: "Maji-CC6.8",  par: 1, current: 1, fav: false },
    { id: 196, category: "염모제", name: "Maji-CC7.8",  par: 1, current: 1, fav: false },
    { id: 197, category: "염모제", name: "Maji-CUIVRE", par: 1, current: 1, fav: false },
    { id: 198, category: "염모제", name: "Maji-COVER10", par: 1, current: 1, fav: false },
    { id: 199, category: "염모제", name: "Maji-900S",   par: 1, current: 1, fav: false },
    { id: 200, category: "염모제", name: "Maji-13",     par: 1, current: 1, fav: false },
    { id: 201, category: "염모제", name: "Maji-10.08",  par: 1, current: 1, fav: false },
    { id: 202, category: "염모제", name: "Maji-8.45",   par: 1, current: 1, fav: false },
    { id: 203, category: "염모제", name: "Maji-9.22",   par: 1, current: 1, fav: false },
    { id: 204, category: "염모제", name: "Maji-12.26",  par: 1, current: 1, fav: false },
    { id: 205, category: "염모제", name: "Maji-7.44",   par: 1, current: 1, fav: false },
    { id: 206, category: "염모제", name: "Maji-7.43",   par: 1, current: 1, fav: false },
    { id: 207, category: "염모제", name: "Maji-12.4",   par: 1, current: 1, fav: false },
    { id: 208, category: "염모제", name: "Maji-12.6",   par: 1, current: 1, fav: false },
    { id: 209, category: "염모제", name: "Maji-6.66",   par: 1, current: 1, fav: false },
    // 사진4 - NB/CB/PRIMIENCE/BH 계열
    { id: 210, category: "염모제", name: "1-NB",   par: 1, current: 1, fav: false },
    { id: 211, category: "염모제", name: "3-NB",   par: 1, current: 1, fav: false },
    { id: 212, category: "염모제", name: "11-NB",  par: 1, current: 1, fav: false },
    { id: 213, category: "염모제", name: "13-NB",  par: 1, current: 1, fav: false },
    { id: 214, category: "염모제", name: "b9-NB",  par: 1, current: 1, fav: false },
    { id: 215, category: "염모제", name: "5-CB",   par: 1, current: 1, fav: false },
    { id: 216, category: "염모제", name: "6-CB",   par: 1, current: 1, fav: false },
    { id: 217, category: "염모제", name: "9-CB",   par: 1, current: 1, fav: false },
    { id: 218, category: "염모제", name: "11-CB",  par: 1, current: 1, fav: false },
    { id: 219, category: "염모제", name: "13-CB",  par: 1, current: 1, fav: false },
    { id: 220, category: "염모제", name: "PtBe 7", par: 1, current: 1, fav: false },
    { id: 221, category: "염모제", name: "WB 5",   par: 1, current: 1, fav: false },
    { id: 222, category: "염모제", name: "WB 6",   par: 1, current: 1, fav: false },
    { id: 223, category: "염모제", name: "WB 8",   par: 1, current: 1, fav: false },
    { id: 224, category: "염모제", name: "CB 5",   par: 1, current: 1, fav: false },
    { id: 225, category: "염모제", name: "CB 6",   par: 1, current: 1, fav: false },
    { id: 226, category: "염모제", name: "CB 8",   par: 1, current: 1, fav: false },
    { id: 227, category: "염모제", name: "NB 5",   par: 1, current: 1, fav: false },
    { id: 228, category: "염모제", name: "NB 6",   par: 1, current: 1, fav: false },
    { id: 229, category: "염모제", name: "BH9-BB", par: 1, current: 1, fav: false },
    { id: 230, category: "염모제", name: "BH11-BB", par: 1, current: 1, fav: false },
    { id: 231, category: "염모제", name: "BH9-CB", par: 1, current: 1, fav: false },
    { id: 232, category: "염모제", name: "BH11-CB", par: 1, current: 1, fav: false },
    { id: 233, category: "염모제", name: "Gold 9", par: 1, current: 1, fav: false },
    { id: 234, category: "염모제", name: "7NB",    par: 1, current: 1, fav: false },
    { id: 235, category: "염모제", name: "8NB",    par: 1, current: 1, fav: false },
    { id: 236, category: "염모제", name: "15-00",  par: 1, current: 1, fav: false },
    { id: 237, category: "염모제", name: "5.00-NaturalBrown", par: 1, current: 1, fav: false },
];

const ALL_MEMBERS = [
  { id: 5, name: "계완",  role: "대표",     avatar: "📋", canHelp: false },
  { id: 2, name: "민경",  role: "원장",     avatar: "👑", canHelp: true  },
  { id: 4, name: "지유",  role: "디자이너", avatar: "🎨", canHelp: true  },
  { id: 3, name: "해수",  role: "디자이너", avatar: "🌿", canHelp: true  },
  { id: 6, name: "지원",  role: "디자이너", avatar: "🌸", canHelp: true  },
];

// ── 도움 항목 ──
const HELP_TASKS = [
  // 🧴 샴푸
  { id: "h1", icon: "🚿", text: "샴푸 - 헹굼",        area: "샴푸" },
  { id: "h2", icon: "💧", text: "샴푸 - 중화",        area: "샴푸" },
  { id: "h3", icon: "🎨", text: "샴푸 - 염색&연화",   area: "샴푸" },
  // ✂️ 함께 시술
  { id: "h4", icon: "💈", text: "함께 시술 - 염색",    area: "함께 시술" },
  { id: "h5", icon: "✨", text: "함께 시술 - 매직",    area: "함께 시술" },
  { id: "h6", icon: "💆", text: "함께 시술 - 서브",    area: "함께 시술" },
  { id: "h7", icon: "💨", text: "함께 시술 - 건조",    area: "함께 시술" },
  // 🪞 다음 시술 준비
  { id: "h8", icon: "🪑", text: "다음 시술 - 자리 정리", area: "다음 시술 준비" },
  { id: "h9", icon: "🧪", text: "다음 시술 - 염색 준비", area: "다음 시술 준비" },
  { id: "h10", icon: "🔥", text: "다음 시술 - 기계",   area: "다음 시술 준비" },
];

const HELP_CATEGORIES = [
  { area: "샴푸",           icon: "🧴", color: "#6FA882" },
  { area: "함께 시술",      icon: "✂️", color: "#D4806A" },
  { area: "다음 시술 준비", icon: "🪞", color: "#C9A052" },
];

// ── 재고 분류 ──
const INV_CATS = ["펌제", "염모제", "탈색제", "산화제", "클리닉", "매장소모품", "점판용"];

// 예전 분류 → 새 분류 자동 변환 (기존 데이터 보존)
function migrateInvItem(it) {
  let cat = it.category;
  if (cat === "탈색·산화") {
    cat = (it.name || "").includes("산화제") ? "산화제" : "탈색제";
  } else {
    cat = ({
      "트리트먼트": "클리닉",
      "두피케어": "클리닉",
      "매장 소모품": "매장소모품",
      "판매용": "점판용",
      "스타일링": "점판용",
    })[cat] || cat;
  }
  return { ...it, category: cat, fav: !!it.fav };
}

const STATUS = {
  free:   { label: "한가해요",   emoji: "🟢", color: "#6FA882", bg: "#EAF3ED" },
  normal: { label: "보통이에요", emoji: "🟡", color: "#C9A052", bg: "#FBF4E4" },
  busy:   { label: "바빠요",     emoji: "🔴", color: "#D4806A", bg: "#FAECEA" },
};

// ── 컨디션 (이모지 + 한글) ──
const BODY_LEVELS = [
  null,
  { v: 1, emoji: "😩", label: "지쳤어요" },
  { v: 2, emoji: "😟", label: "힘들어요" },
  { v: 3, emoji: "😐", label: "보통이에요" },
  { v: 4, emoji: "🙂", label: "괜찮아요" },
  { v: 5, emoji: "💪", label: "쌩쌩해요" },
];
const MIND_LEVELS = [
  null,
  { v: 1, emoji: "😢", label: "많이 힘들어요" },
  { v: 2, emoji: "😔", label: "가라앉아요" },
  { v: 3, emoji: "😌", label: "보통이에요" },
  { v: 4, emoji: "😊", label: "좋아요" },
  { v: 5, emoji: "🥰", label: "행복해요" },
];

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
  const [tab, setTab]           = useState("home");
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
    z1: 2, // 민경
    z2: 4, // 지유
    z3: 3, // 해수
    z4: 6, // 지원
  });
  const [editAssign, setEditAssign] = useState(null); // 편집 중인 zoneId
  const [zoneDone, setZoneDone] = useState({}); // {"2026-05-17": {z1: ['샴푸대 청소', ...]}}
  const [rotationDate, setRotationDate] = useState(
    new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
  );

  // 감사 메시지 (마감 후 작성)
  const [thanks, setThanks] = useState([]);
  const [thanksDraft, setThanksDraft] = useState({ to: null, text: "" });
  const [thanksReplyDraft, setThanksReplyDraft] = useState({}); // {thanksId: "댓글 텍스트"}
  // {id, from, to, text, time, replies: [{id, from, text, time}]}

  // 🙏 고마운 사람 (하루 1번 클릭, 누적)
  const [gratitudes, setGratitudes] = useState([]); // {id, from, to, date}

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
  // 📦 발주 메모 (복사용 공유 메모칸)
  const [orderMemo, setOrderMemo] = useState("");

  // 📊 재고 관리
  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);
  const [invDraft, setInvDraft] = useState({ category: "펌제", name: "", par: 3 });
  const [showInvForm, setShowInvForm] = useState(false);
  const [invShortageOnly, setInvShortageOnly] = useState(false);
  const [editingInvId, setEditingInvId] = useState(null); // 이름 수정 중인 제품
  const [editingInvName, setEditingInvName] = useState(""); // 수정 중 이름
  const [dragInvId, setDragInvId] = useState(null); // 드래그 중인 제품

  // 익명 건의함
  const [suggestions, setSuggestions] = useState([]); // {id, text, time, replies: [{text, time}]}
  const [suggestDraft, setSuggestDraft] = useState("");
  const [replyDraft, setReplyDraft] = useState({});

  // 시간 적립 (늘게 일한 시간 + 일찍 간 시간 차감)
  const [timeBank, setTimeBank] = useState([]);
  const [timeDraft, setTimeDraft] = useState({ type: "earn", minutes: 30, note: "" });
  // 대표가 다른 사람 차감하기
  const [jangnimDeductTarget, setJangnimDeductTarget] = useState(null);
  const [jangnimDeductDraft, setJangnimDeductDraft] = useState({ minutes: 30, note: "" });

  // 개인구매 (매장 제품을 개인적으로 사용했을 때)
  const [personalPurchases, setPersonalPurchases] = useState([]); // {id, memberId, product, note, date, time}
  const [purchaseDraft, setPurchaseDraft] = useState({ product: "", note: "" });

  // 중요 메모 (첫 화면 상단)
  const [importantMemos, setImportantMemos] = useState([]); // {id, memberId, text, done, date, time}
  const [memoDraft, setMemoDraft] = useState("");
  const [showMemoInput, setShowMemoInput] = useState(false);

  // 내 카드 펼침 여부 (컨디션 체크)
  const [myCardExpanded, setMyCardExpanded] = useState(true);

  // 🎁 럭키박스
  const [luckyPrizes, setLuckyPrizes] = useState([
    { id: 1, name: "꽝! 다음 기회에", weight: 9800 },
    { id: 2, name: "시간적립 30분", weight: 150 },
    { id: 3, name: "시간적립 1시간", weight: 40 },
    { id: 4, name: "치킨 기프티콘", weight: 10 },
    { id: 5, name: "10만원 상품권", weight: 1 },
  ]); // {id, name, weight(가중치)}
  const [luckyTickets, setLuckyTickets] = useState({}); // {memberId: 보유티켓수}
  const [luckyClaimed, setLuckyClaimed] = useState({}); // {"memberId-yyyy-mm-dd-mood": true} 중복방지
  const [luckyWins, setLuckyWins] = useState([]); // {id, memberId, prizeName, date, time, used}
  const [prizeDraft, setPrizeDraft] = useState({ name: "", weight: 20 });
  const [boxOpening, setBoxOpening] = useState(false); // 박스 여는 애니메이션
  const [boxResult, setBoxResult] = useState(null); // 방금 뽑은 상품

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
        if (data.members) {
          // ALL_MEMBERS 기준으로 순서·이름·역할 동기화 (저장된 status, helpCount 등은 유지)
          const merged = ALL_MEMBERS.map(base => {
            const saved = data.members.find(s => s.id === base.id);
            return {
              ...base,
              status: saved?.status || "normal",
              helpCount: saved?.helpCount || 0,
              givenCount: saved?.givenCount || 0,
            };
          });
          setMembers(merged);
        }
        if (data.log)          setLog(data.log);
        if (data.zoneAssign)   setZoneAssign(data.zoneAssign);
        if (data.zoneDone)     setZoneDone(data.zoneDone);
        if (data.rotationDate) setRotationDate(data.rotationDate);
        if (data.thanks)       setThanks(data.thanks);
        if (data.gratitudes)   setGratitudes(data.gratitudes);
        if (data.events)       setEvents(data.events);
        if (data.birthdays)    setBirthdays(data.birthdays);
        if (data.moods) {
          setMoods(data.moods);
          // 오늘 이미 컨디션 체크했으면 내 카드 접기
          const todayStr = new Date().toLocaleDateString("ko-KR");
          const myMoodToday = data.moods.find(x => x.memberId === myId && x.date === todayStr);
          if (myMoodToday) setMyCardExpanded(false);
        }
        if (data.orders)       setOrders(data.orders);
        if (typeof data.orderMemo === "string") setOrderMemo(data.orderMemo);
        // 재고: Firebase에 저장된 게 있고 비어있지 않을 때만 불러옴 (비어있으면 코드 기본값 137개 유지)
        if (data.inventory && Array.isArray(data.inventory) && data.inventory.length > 0) {
          setInventory(data.inventory.map(migrateInvItem));
        }
        if (data.suggestions)  setSuggestions(data.suggestions);
        if (data.timeBank)     setTimeBank(data.timeBank);
        if (data.reviewDone)   setReviewDone(data.reviewDone);
        if (data.instaUploads) setInstaUploads(data.instaUploads);
        if (data.luckyPrizes)  setLuckyPrizes(data.luckyPrizes);
        if (data.luckyTickets) setLuckyTickets(data.luckyTickets);
        if (data.luckyClaimed) setLuckyClaimed(data.luckyClaimed);
        if (data.luckyWins)    setLuckyWins(data.luckyWins);
        if (data.personalPurchases) setPersonalPurchases(data.personalPurchases);
        if (data.importantMemos) setImportantMemos(data.importantMemos);
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
          inventory, orderMemo, gratitudes,
          reviewDone, instaUploads, personalPurchases, importantMemos,
          luckyPrizes, luckyTickets, luckyClaimed, luckyWins,
          lastUpdate: Date.now(),
        });
      } catch (err) {
        console.error("Firebase 저장 오류:", err);
      }
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [members, log, zoneAssign, zoneDone, rotationDate, thanks, events, birthdays, moods, orders, suggestions, timeBank, reviewDone, instaUploads, personalPurchases, importantMemos, luckyPrizes, luckyTickets, luckyClaimed, luckyWins, inventory, orderMemo, gratitudes, isLoaded]);

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

  // 🎁 럭키박스 티켓 지급 (중복 방지)
  const giveLuckyTicket = (claimKey, count, reason) => {
    if (luckyClaimed[claimKey]) return false; // 이미 받음
    setLuckyClaimed(p => ({ ...p, [claimKey]: true }));
    setLuckyTickets(p => ({ ...p, [myId]: (p[myId] || 0) + count }));
    showToast(`🎁 럭키박스 ${count}개 획득! (${reason})`);
    return true; // 새로 지급함
  };

  // 🎁 럭키박스 열기 (가중치 랜덤)
  const openLuckyBox = () => {
    const myTickets = luckyTickets[myId] || 0;
    if (myTickets <= 0) {
      showToast("럭키박스가 없어요", "err");
      return;
    }
    if (luckyPrizes.length === 0) {
      showToast("대표님이 상품을 준비 중이에요", "err");
      return;
    }

    setBoxOpening(true);

    setTimeout(() => {
      // 가중치 기반 랜덤
      const totalWeight = luckyPrizes.reduce((s, p) => s + (p.weight || 1), 0);
      let rand = Math.random() * totalWeight;
      let won = luckyPrizes[0];
      for (const prize of luckyPrizes) {
        rand -= (prize.weight || 1);
        if (rand <= 0) { won = prize; break; }
      }

      const now = new Date();
      setLuckyTickets(p => ({ ...p, [myId]: (p[myId] || 0) - 1 }));
      setLuckyWins(p => [...p, {
        id: Date.now(),
        memberId: myId,
        prizeName: won.name,
        date: now.toLocaleDateString("ko-KR"),
        time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        used: false,
      }]);

      // 🕐 시간적립 상품이면 자동으로 시간적립에 추가!
      let autoMinutes = 0;
      if (won.name.includes("30분")) autoMinutes = 30;
      else if (won.name.includes("1시간")) autoMinutes = 60;
      else if (won.name.includes("2시간")) autoMinutes = 120;

      if (autoMinutes > 0) {
        setTimeBank(p => [...p, {
          id: Date.now() + 1,
          memberId: myId,
          type: "earn",
          minutes: autoMinutes,
          note: `🎁 럭키박스 당첨 (${won.name})`,
          date: now.toLocaleDateString("ko-KR"),
          time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        }]);
      }

      setBoxResult({ ...won, autoMinutes });
      setBoxOpening(false);
    }, 1500);
  };

  const completeHelp = (taskId) => {
    const task = HELP_TASKS.find(t => t.id === taskId);
    const toMember = members.find(m => m.id === helpTarget);
    const now = new Date();
    setLog(p => [...p, {
      id: Date.now(), from: myId, toId: helpTarget, taskId, note,
      date: now.toLocaleDateString("ko-KR"),
      time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
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
        @keyframes shake  { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-12deg)} 75%{transform:rotate(12deg)} }
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
                : <div style={{ fontSize: 11, opacity: .75, marginTop: 2 }}>오늘도 함께해요 💛</div>
              }
            </div>
          </div>
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
          { id: "home",    label: "🏠 홈" },
          { id: "thanks",  label: "감사 인사" },
          { id: "daily",   label: "일일 체크" },
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

        {/* ══ 🏠 홈 탭 ══ */}
        {tab === "home" && (
          <div>
            {/* 📌 중요 메모 */}
            <div className="card" style={{
              background: "#FFF5E8",
              borderRadius: 20, padding: "16px 18px", marginBottom: 16,
              border: `2px solid ${C.gold}`,
              boxShadow: "0 4px 16px rgba(201, 160, 82, 0.15)",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
              }}>
                <span style={{ fontSize: 18 }}>📌</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
                    중요 메모
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
                    잊으면 안 되는 내용 · 고객 전달 사항 · 인수인계
                  </div>
                </div>
                <button onClick={() => setShowMemoInput(!showMemoInput)} style={{
                  background: showMemoInput ? C.muted : C.gold,
                  color: "#fff", border: "none", borderRadius: 10,
                  padding: "5px 12px", fontSize: 11, fontWeight: 700,
                  cursor: "pointer",
                }}>
                  {showMemoInput ? "취소" : "+ 추가"}
                </button>
              </div>

              {showMemoInput && (
                <div style={{
                  background: "#fff", borderRadius: 10, padding: "10px",
                  marginBottom: 10, border: `1px solid ${C.gold}`,
                }}>
                  <textarea
                    placeholder="예: 이은비 고객님 6월 5일 예약 확인 부탁 / 김민지 손님 컬러 메뉴 변경 원함"
                    value={memoDraft}
                    onChange={e => setMemoDraft(e.target.value)}
                    rows={2}
                    style={{
                      width: "100%", border: `1px solid ${C.line}`, borderRadius: 8,
                      padding: "8px 10px", fontSize: 12, background: C.bg,
                      outline: "none", color: C.ink, resize: "vertical",
                      fontFamily: "inherit", marginBottom: 8,
                    }}
                  />
                  <button onClick={() => {
                    if (!memoDraft.trim()) {
                      showToast("내용을 입력해주세요", "err");
                      return;
                    }
                    const now = new Date();
                    setImportantMemos(p => [...p, {
                      id: Date.now(),
                      memberId: myId,
                      text: memoDraft.trim(),
                      done: false,
                      date: now.toLocaleDateString("ko-KR"),
                      time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                    }]);
                    setMemoDraft("");
                    setShowMemoInput(false);
                    showToast("메모가 등록됐어요 📌");
                  }} style={{
                    width: "100%", background: C.gold, color: "#fff",
                    border: "none", borderRadius: 8, padding: "8px",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>
                    📌 메모 등록
                  </button>
                </div>
              )}

              {importantMemos.length === 0 ? (
                <div style={{
                  fontSize: 11, color: C.muted, textAlign: "center",
                  padding: "12px", lineHeight: 1.6,
                }}>
                  중요한 메모가 없어요 ✨<br/>
                  까먹지 말아야 할 내용을 적어두세요
                </div>
              ) : (
                <div>
                  {importantMemos.filter(m => !m.done).map(memo => {
                    const author = members.find(m => m.id === memo.memberId);
                    return (
                      <div key={memo.id} style={{
                        background: "#fff", borderRadius: 10, padding: "10px 12px",
                        marginBottom: 6, border: `1px solid ${C.gold}`,
                        borderLeft: `4px solid ${C.gold}`,
                      }}>
                        <div style={{
                          display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6,
                        }}>
                          <span style={{ fontSize: 12, flexShrink: 0 }}>{author?.avatar}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>
                              <b style={{ color: C.ink }}>{author?.name}</b>
                              <span style={{ marginLeft: 6 }}>· {memo.date} {memo.time}</span>
                            </div>
                            <div style={{
                              fontSize: 13, color: C.ink, lineHeight: 1.6,
                              whiteSpace: "pre-wrap", wordBreak: "break-word",
                            }}>
                              {memo.text}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                          <button onClick={() => {
                            setImportantMemos(p => p.map(x =>
                              x.id === memo.id ? { ...x, done: true } : x
                            ));
                            showToast("처리 완료! ✓");
                          }} style={{
                            flex: 1, background: C.sageDeep, color: "#fff",
                            border: "none", borderRadius: 8,
                            padding: "6px", fontSize: 11, fontWeight: 700,
                            cursor: "pointer",
                          }}>
                            ✓ 처리 완료
                          </button>
                          <button onClick={() => {
                            if (window.confirm("이 메모를 삭제하시겠어요?")) {
                              setImportantMemos(p => p.filter(x => x.id !== memo.id));
                              showToast("삭제됐어요");
                            }
                          }} style={{
                            background: C.warm, color: C.muted,
                            border: `1px solid ${C.line}`, borderRadius: 8,
                            padding: "6px 12px", fontSize: 11, fontWeight: 600,
                            cursor: "pointer",
                          }}>
                            삭제
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {importantMemos.filter(m => m.done).length > 0 && (
                    <>
                      <div style={{
                        fontSize: 10, color: C.muted, fontWeight: 600,
                        marginTop: 12, marginBottom: 6, paddingLeft: 4,
                      }}>
                        ✓ 처리 완료 ({importantMemos.filter(m => m.done).length})
                      </div>
                      {importantMemos.filter(m => m.done).map(memo => {
                        const author = members.find(m => m.id === memo.memberId);
                        return (
                          <div key={memo.id} style={{
                            background: "rgba(255,255,255,0.5)",
                            borderRadius: 10, padding: "8px 12px",
                            marginBottom: 5, border: `1px solid ${C.line}`,
                            opacity: 0.55,
                          }}>
                            <div style={{
                              display: "flex", alignItems: "flex-start", gap: 8,
                            }}>
                              <span style={{ fontSize: 11, flexShrink: 0 }}>{author?.avatar}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>
                                  <b>{author?.name}</b>
                                  <span style={{ marginLeft: 4 }}>· {memo.date}</span>
                                  <span style={{ color: C.sageDeep, marginLeft: 6, fontWeight: 700 }}>✓ 처리됨</span>
                                </div>
                                <div style={{
                                  fontSize: 12, color: C.ink, lineHeight: 1.5,
                                  textDecoration: "line-through",
                                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                                }}>
                                  {memo.text}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                                <button onClick={() => {
                                  setImportantMemos(p => p.map(x =>
                                    x.id === memo.id ? { ...x, done: false } : x
                                  ));
                                  showToast("되돌렸어요");
                                }} style={{
                                  background: "none", color: C.muted,
                                  border: `1px solid ${C.line}`, borderRadius: 6,
                                  padding: "2px 7px", fontSize: 10, cursor: "pointer",
                                }}>↩</button>
                                <button onClick={() => {
                                  if (window.confirm("이 메모를 삭제하시겠어요?")) {
                                    setImportantMemos(p => p.filter(x => x.id !== memo.id));
                                  }
                                }} style={{
                                  background: "none", color: C.muted,
                                  border: "none", fontSize: 14, padding: 0,
                                  lineHeight: 1, cursor: "pointer",
                                }}>×</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 오늘의 긍정 메시지 */}
            {(() => {
              const msg = getTodayMessage();
              const today = new Date();
              const dateStr = today.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
              return (
                <div className="card" style={{
                  background: "linear-gradient(135deg, #FBF4E4 0%, #FAEEE9 50%, #EAF3ED 100%)",
                  borderRadius: 20, padding: "22px 22px", marginBottom: 16,
                  border: `1px solid ${C.line}`,
                  position: "relative", overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(201, 160, 82, 0.12)",
                }}>
                  <div style={{
                    position: "absolute", top: -8, right: -8,
                    width: 80, height: 80, borderRadius: "50%",
                    background: "rgba(201, 160, 82, 0.08)",
                  }}/>
                  <div style={{
                    position: "absolute", bottom: -12, left: 30,
                    width: 50, height: 50, borderRadius: "50%",
                    background: "rgba(111, 168, 130, 0.08)",
                  }}/>

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                      fontSize: 10, color: C.muted, fontWeight: 600,
                      letterSpacing: 2, marginBottom: 8,
                    }}>
                      TODAY · {dateStr}
                    </div>
                    <div style={{
                      fontSize: 24, marginBottom: 10,
                    }}>{msg.icon}</div>
                    <div style={{
                      fontSize: 18, fontWeight: 700, color: C.ink,
                      lineHeight: 1.5, marginBottom: 8,
                      letterSpacing: -0.3,
                    }}>
                      {msg.text}
                    </div>
                    <div style={{
                      fontSize: 12, color: C.muted, fontStyle: "italic",
                    }}>
                      — 오늘 하루도 함께 빛나요 —
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 🌅 오늘의 빠른 체크 (모든 멤버 표시) */}
            {(() => {
              const todayDateStr = new Date().toLocaleDateString("ko-KR");
              return (
                <div className="card" style={{
                  background: C.card, borderRadius: 18,
                  border: `1px solid ${C.line}`, padding: 16, marginBottom: 16,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 4 }}>
                    🌅 오늘의 팀 현황
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>
                    각자 오늘 컨디션을 한눈에 확인하세요
                  </div>

                  {/* 전체 멤버 카드 (대표 포함) */}
                  {members.map(m => {
                    const isMe = m.id === myId;
                    const memberMood = moods.find(x => x.memberId === m.id && x.date === todayDateStr);
                    const bodyLv = memberMood ? BODY_LEVELS[memberMood.body] : null;
                    const mindLv = memberMood ? MIND_LEVELS[memberMood.mind] : null;

                    return (
                      <div key={m.id} style={{
                        background: isMe ? C.warm : C.bg,
                        borderRadius: 14, padding: "12px",
                        marginBottom: 8,
                        border: `${isMe ? 2 : 1}px solid ${isMe ? C.sage : C.line}`,
                      }}>
                        {/* 멤버 헤더 */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8,
                          marginBottom: (isMe && myCardExpanded) ? 10 : 6,
                        }}>
                          <span style={{ fontSize: 22 }}>{m.avatar}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>
                              {m.name}
                              {isMe && <span style={{ fontSize: 9, color: C.sage, marginLeft: 4 }}>(나)</span>}
                            </div>
                            <div style={{ fontSize: 10, color: C.muted }}>{m.role}</div>
                          </div>
                          {/* 컨디션 요약 배지 (상태 배지 대체) */}
                          {memberMood ? (
                            <div style={{ display: "flex", gap: 4 }}>
                              <span style={{
                                fontSize: 11, padding: "4px 9px", borderRadius: 10,
                                background: C.roseSoft, color: C.roseDeep, fontWeight: 700,
                                display: "inline-flex", alignItems: "center", gap: 4,
                              }}>
                                <span style={{ fontSize: 15 }}>{bodyLv?.emoji}</span>
                                {bodyLv?.label}
                              </span>
                              <span style={{
                                fontSize: 11, padding: "4px 9px", borderRadius: 10,
                                background: C.sageSoft, color: C.sageDeep, fontWeight: 700,
                                display: "inline-flex", alignItems: "center", gap: 4,
                              }}>
                                <span style={{ fontSize: 15 }}>{mindLv?.emoji}</span>
                                {mindLv?.label}
                              </span>
                            </div>
                          ) : (
                            <span style={{
                              fontSize: 10, padding: "4px 9px", borderRadius: 10,
                              background: C.warm, color: C.muted, fontWeight: 600,
                            }}>
                              아직 체크 전
                            </span>
                          )}
                          {/* 내 카드 펼침/접기 버튼 */}
                          {isMe && (
                            <button onClick={() => setMyCardExpanded(!myCardExpanded)} style={{
                              background: "none", border: "none",
                              color: C.muted, fontSize: 14, cursor: "pointer",
                              padding: "2px 4px", marginLeft: 2,
                            }}>
                              {myCardExpanded ? "\u25b2" : "\u25bc"}
                            </button>
                          )}
                        </div>

                        {/* 내 카드 = 입력 가능 (펼쳤을 때만), 다른 멤버 = 보기만 */}
                        {isMe && myCardExpanded ? (
                          <div style={{ paddingTop: 8, borderTop: `1px dashed ${C.line}` }}>
                            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 8 }}>
                              💗 오늘 컨디션은?
                              {memberMood && (
                                <span style={{ fontSize: 10, color: C.sageDeep, marginLeft: 6 }}>
                                  ✓ 체크됨
                                </span>
                              )}
                            </div>

                            {/* 몸 상태 */}
                            <div style={{ fontSize: 10, color: C.muted, marginBottom: 5, fontWeight: 600 }}>🫀 몸 상태</div>
                            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                              {BODY_LEVELS.slice(1).map(o => (
                                <button key={o.v}
                                  onClick={() => setTodayMood(p => ({ ...p, body: o.v }))}
                                  style={{
                                    flex: 1, background: todayMood.body === o.v ? C.roseSoft : "#fff",
                                    border: `2px solid ${todayMood.body === o.v ? C.rose : C.line}`,
                                    borderRadius: 10, padding: "8px 2px",
                                    cursor: "pointer",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", gap: 3,
                                  }}>
                                  <span style={{ fontSize: 24 }}>{o.emoji}</span>
                                  <span style={{
                                    fontSize: 9, fontWeight: todayMood.body === o.v ? 700 : 500,
                                    color: todayMood.body === o.v ? C.roseDeep : C.muted,
                                    lineHeight: 1.2, wordBreak: "keep-all",
                                  }}>{o.label}</span>
                                </button>
                              ))}
                            </div>

                            {/* 마음 상태 */}
                            <div style={{ fontSize: 10, color: C.muted, marginBottom: 5, fontWeight: 600 }}>🌷 마음 상태</div>
                            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                              {MIND_LEVELS.slice(1).map(o => (
                                <button key={o.v}
                                  onClick={() => setTodayMood(p => ({ ...p, mind: o.v }))}
                                  style={{
                                    flex: 1, background: todayMood.mind === o.v ? C.sageSoft : "#fff",
                                    border: `2px solid ${todayMood.mind === o.v ? C.sage : C.line}`,
                                    borderRadius: 10, padding: "8px 2px",
                                    cursor: "pointer",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", gap: 3,
                                  }}>
                                  <span style={{ fontSize: 24 }}>{o.emoji}</span>
                                  <span style={{
                                    fontSize: 9, fontWeight: todayMood.mind === o.v ? 700 : 500,
                                    color: todayMood.mind === o.v ? C.sageDeep : C.muted,
                                    lineHeight: 1.2, wordBreak: "keep-all",
                                  }}>{o.label}</span>
                                </button>
                              ))}
                            </div>

                            <button onClick={() => {
                              const today = new Date().toLocaleDateString("ko-KR");
                              setMoods(p => [
                                ...p.filter(x => !(x.memberId === myId && x.date === today)),
                                {
                                  ...todayMood,
                                  id: Date.now(),
                                  memberId: myId,
                                  date: today,
                                  time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                                },
                              ]);
                              setMyCardExpanded(false);
                              const got = giveLuckyTicket(`${myId}-${today}-mood`, 1, "오늘 컨디션 체크");
                              if (!got) showToast("컨디션 체크 완료 💗");
                            }} style={{
                              width: "100%", background: C.roseDeep, color: "#fff",
                              border: "none", borderRadius: 10, padding: "10px",
                              fontSize: 13, fontWeight: 700, cursor: "pointer",
                            }}>
                              {memberMood ? "💗 다시 저장" : "💗 저장"}
                            </button>
                          </div>
                        ) : (
                          /* 접힌 상태: 내 카드면 눌러서 펼치기 안내 */
                          isMe && (
                            <div
                              onClick={() => setMyCardExpanded(true)}
                              style={{
                                paddingTop: 6, borderTop: `1px dashed ${C.line}`,
                                cursor: "pointer", textAlign: "center",
                                fontSize: 10, color: C.sage, fontStyle: "italic",
                              }}>
                              {memberMood ? "✏️ 눌러서 컨디션 수정" : "✏️ 눌러서 컨디션 체크하기"}
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* 💛 안내 메시지 (빠른 체크 아래) */}
            <div style={{
              background: C.warm,
              borderRadius: 14, padding: "14px 18px", marginBottom: 16,
              border: `1px solid ${C.line}`,
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 13, color: C.ink, fontWeight: 600, marginBottom: 4,
              }}>
                🌿 잠깐 둘러봐요
              </div>
              <div style={{
                fontSize: 11, color: C.muted, lineHeight: 1.6,
              }}>
                도울 수 있는 일이 있을 거예요<br/>
                <span style={{ fontSize: 10 }}>
                  💌 감사 인사 탭에서 고마운 마음을 전해보세요
                </span>
              </div>
            </div>

            {/* 홈 화면 안내 */}
            <div style={{
              fontSize: 11, color: C.muted, textAlign: "center",
              padding: "20px", lineHeight: 1.8,
            }}>
              💛 위쪽 탭에서 다양한 기능을 사용할 수 있어요 💛<br/>
              <span style={{ fontSize: 10 }}>
                💌 감사 인사 · ✅ 일일 체크 · 🏪 매장 운영
              </span>
            </div>
          </div>
        )}

        {/* ══ 🤝 지금 도울일 탭 (팀 현황 + 도움 체크) ══ */}
        {tab === "now" && (
          <div>

            {/* 대표 뷰 */}
            {isJangnim ? (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #3D6B52, #2A4535)",
                  borderRadius: 18, padding: "20px", color: "#fff", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>📋</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>계완 대표님 모드</div>
                  <div style={{ fontSize: 13, opacity: .9, lineHeight: 1.7 }}>
                    매장 전체 흐름을 봐주시고,<br/>
                    도와주신 일도 자유롭게 체크하세요 💛
                  </div>
                </div>

                {/* 🤝 대표 도움 주기 (간편 방식) */}
                <div className="card" style={{
                  background: C.card, borderRadius: 18,
                  border: `1px solid ${C.line}`, padding: 16, marginBottom: 16,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 12 }}>
                    🤝 누구를 도와줬어요?
                  </div>

                  {/* 1단계: 누구 도왔는지 선택 */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 6, marginBottom: 14,
                  }}>
                    {[
                      { id: "salon", name: "매장", avatar: "🏠", isSalon: true },
                      ...ALL_MEMBERS.filter(m => m.id !== myId && m.canHelp),
                    ].map(m => {
                      const isSelected = helpTarget === m.id;
                      return (
                        <button key={m.id}
                          onClick={() => setHelpTarget(isSelected ? null : m.id)}
                          style={{
                            background: isSelected
                              ? (m.isSalon ? C.gold : C.sageDeep)
                              : (m.isSalon ? C.goldSoft : C.sageSoft),
                            color: isSelected
                              ? "#fff"
                              : (m.isSalon ? "#8A6A20" : C.sageDeep),
                            border: `1.5px solid ${isSelected
                              ? (m.isSalon ? C.gold : C.sageDeep)
                              : (m.isSalon ? "#E8D5A0" : C.sage)}`,
                            borderRadius: 12, padding: "10px 6px",
                            fontSize: 12, fontWeight: isSelected ? 700 : 600,
                            cursor: "pointer", transition: "all .15s",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 4,
                          }}>
                          <span style={{ fontSize: 20 }}>{m.avatar}</span>
                          <span>{m.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 2단계: 누구 선택했으면 카테고리 표시 */}
                  {helpTarget !== null && (
                    <div style={{ animation: "fadeUp .2s ease" }}>
                      <div style={{
                        fontSize: 11, color: C.muted, fontWeight: 600,
                        marginBottom: 8, letterSpacing: 0.5,
                      }}>
                        어떤 일을 도왔어요?
                      </div>
                      {HELP_CATEGORIES.map(cat => {
                        const tasks = HELP_TASKS.filter(t => t.area === cat.area);
                        return (
                          <div key={cat.area} style={{ marginBottom: 12 }}>
                            <div style={{
                              fontSize: 11, fontWeight: 700,
                              color: cat.color, marginBottom: 6,
                              display: "flex", alignItems: "center", gap: 5,
                            }}>
                              <span style={{ fontSize: 14 }}>{cat.icon}</span>
                              <span>{cat.area}</span>
                            </div>
                            <div style={{
                              display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
                              gap: 6,
                            }}>
                              {tasks.map(task => (
                                <button key={task.id}
                                  onClick={() => completeHelp(task.id)}
                                  style={{
                                    background: C.bg,
                                    border: `1px solid ${C.line}`,
                                    borderRadius: 10, padding: "9px 8px",
                                    fontSize: 11, color: C.ink, cursor: "pointer",
                                    transition: "all .15s",
                                    display: "flex", alignItems: "center", gap: 5,
                                    textAlign: "left", fontWeight: 500,
                                  }}>
                                  <span style={{ fontSize: 16 }}>{task.icon}</span>
                                  <span>{task.text.replace(`${cat.area} - `, "")}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      <div style={{
                        fontSize: 10, color: C.muted, textAlign: "center",
                        marginTop: 8, fontStyle: "italic",
                      }}>
                        💡 항목 누르면 바로 기록돼요
                      </div>
                    </div>
                  )}
                </div>


                {/* 대표님이 한 도움 */}
                {(() => {
                  const todayStr = new Date().toLocaleDateString("ko-KR");
                  const myLogs = log.filter(l => l.from === myId && (l.date === todayStr || !l.date));
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
                  <div style={{ fontSize: 12, opacity: .88, lineHeight: 1.7 }}>
                    {myStatus === "free"
                      ? "\"괜찮아요\" 말하지 않아도 돼요.\n그냥 같이 해요 💛"
                      : myStatus === "normal"
                      ? "말하기 전에 먼저 움직이는 게 우리 약속이에요 🌿"
                      : "작은 거 하나씩만 함께 해도 팀이 달라져요 ✨"}
                  </div>
                </div>

                {/* 🔴 오늘 바쁜 동료 (최상단) */}
                {busyMembers.length > 0 && (
                  <div className="card" style={{
                    background: "linear-gradient(135deg, #FDF2EE, #FFF8F5)",
                    borderRadius: 16, padding: "14px 16px",
                    border: `1.5px solid ${C.rose}`, marginBottom: 14,
                    boxShadow: "0 2px 12px rgba(212, 128, 106, 0.15)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.roseDeep, marginBottom: 10 }}>
                      🔴 오늘 바쁜 동료 — 도움이 필요해요
                    </div>
                    {busyMembers.map(m => (
                      <div key={m.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 12px", background: "#fff",
                        borderRadius: 12, marginBottom: 6,
                        border: `1px solid ${C.roseSoft}`,
                      }}>
                        <span style={{ fontSize: 22 }}>{m.avatar}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{m.name}</div>
                          <div style={{ fontSize: 10, color: C.muted }}>{m.role}</div>
                        </div>
                        <button onClick={() => {
                          setHelpTarget(m.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }} style={{
                          background: C.rose, color: "#fff",
                          borderRadius: 10, padding: "6px 14px",
                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                        }}>
                          도와주기 →
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 📊 누적 도움 기록 (전체 기간) */}
                <div className="card" style={{
                  background: "linear-gradient(135deg, #F0F9F3, #FFF7ED)",
                  borderRadius: 16, padding: "14px 16px",
                  border: `1px solid ${C.line}`, marginBottom: 14,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 10 }}>
                    📊 누적 도움 기록
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{
                      background: "#fff", borderRadius: 12, padding: "12px",
                      textAlign: "center", border: `1px solid ${C.sageSoft}`,
                    }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: C.sageDeep }}>
                        {log.filter(l => l.from === myId).length}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>🤝 도움 줌</div>
                    </div>
                    <div style={{
                      background: "#fff", borderRadius: 12, padding: "12px",
                      textAlign: "center", border: `1px solid ${C.roseSoft}`,
                    }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: C.roseDeep }}>
                        {log.filter(l => l.toId === myId).length}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>💝 도움 받음</div>
                    </div>
                  </div>
                </div>

                {/* 🆕 간단해진 도움 체크 - 카테고리 카드 항상 표시 */}
                <div className="card" style={{
                  background: C.card, borderRadius: 18,
                  border: `1px solid ${C.line}`, padding: 16, marginBottom: 16,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 12 }}>
                    🤝 누구를 도와줬어요?
                  </div>

                  {/* 1단계: 누구 도왔는지 선택 */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 6, marginBottom: 14,
                  }}>
                    {[
                      { id: "salon", name: "매장", avatar: "🏠", isSalon: true },
                      ...ALL_MEMBERS.filter(m => m.id !== myId && m.canHelp),
                    ].map(m => {
                      const isSelected = helpTarget === m.id;
                      return (
                        <button key={m.id}
                          onClick={() => setHelpTarget(isSelected ? null : m.id)}
                          style={{
                            background: isSelected
                              ? (m.isSalon ? C.gold : C.sageDeep)
                              : (m.isSalon ? C.goldSoft : C.sageSoft),
                            color: isSelected
                              ? "#fff"
                              : (m.isSalon ? "#8A6A20" : C.sageDeep),
                            border: `1.5px solid ${isSelected
                              ? (m.isSalon ? C.gold : C.sageDeep)
                              : (m.isSalon ? "#E8D5A0" : C.sage)}`,
                            borderRadius: 12, padding: "10px 6px",
                            fontSize: 12, fontWeight: isSelected ? 700 : 600,
                            cursor: "pointer", transition: "all .15s",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 4,
                          }}>
                          <span style={{ fontSize: 20 }}>{m.avatar}</span>
                          <span>{m.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 2단계: 누구 선택했으면 카테고리 표시 */}
                  {helpTarget !== null && (
                    <div style={{ animation: "fadeUp .2s ease" }}>
                      <div style={{
                        fontSize: 11, color: C.muted, fontWeight: 600,
                        marginBottom: 8, letterSpacing: 0.5,
                      }}>
                        어떤 일을 도왔어요?
                      </div>
                      {HELP_CATEGORIES.map(cat => {
                        const tasks = HELP_TASKS.filter(t => t.area === cat.area);
                        return (
                          <div key={cat.area} style={{ marginBottom: 12 }}>
                            <div style={{
                              fontSize: 11, fontWeight: 700,
                              color: cat.color, marginBottom: 6,
                              display: "flex", alignItems: "center", gap: 5,
                            }}>
                              <span style={{ fontSize: 14 }}>{cat.icon}</span>
                              <span>{cat.area}</span>
                            </div>
                            <div style={{
                              display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
                              gap: 6,
                            }}>
                              {tasks.map(task => (
                                <button key={task.id}
                                  onClick={() => completeHelp(task.id)}
                                  style={{
                                    background: C.bg,
                                    border: `1px solid ${C.line}`,
                                    borderRadius: 10, padding: "9px 8px",
                                    fontSize: 11, color: C.ink, cursor: "pointer",
                                    transition: "all .15s",
                                    display: "flex", alignItems: "center", gap: 5,
                                    textAlign: "left",
                                    fontWeight: 500,
                                  }}>
                                  <span style={{ fontSize: 16 }}>{task.icon}</span>
                                  <span>{task.text.replace(`${cat.area} - `, "")}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      <div style={{
                        fontSize: 10, color: C.muted, textAlign: "center",
                        marginTop: 8, fontStyle: "italic",
                      }}>
                        💡 항목 누르면 바로 기록돼요
                      </div>
                    </div>
                  )}
                </div>

                {/* 오늘 내가 한 도움 */}
                {(() => {
                  const todayStr = new Date().toLocaleDateString("ko-KR");
                  const myLogs = log.filter(l => l.from === myId && (l.date === todayStr || !l.date));
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
                  const todayStr2 = new Date().toLocaleDateString("ko-KR");
                  const receivedLogs = log.filter(l => l.toId === myId && (l.date === todayStr2 || !l.date));
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

                  {/* 💗 오늘 컨디션 (대표 제외) */}
                  {!isJang && (() => {
                    const todayStr = new Date().toLocaleDateString("ko-KR");
                    const mood = moods.find(x => x.memberId === m.id && x.date === todayStr);
                    const bodyEmojis = ["", "😩", "😟", "😐", "🙂", "💪"];
                    const mindEmojis = ["", "😢", "😔", "😌", "😊", "🥰"];
                    if (!mood) {
                      return (
                        <div style={{
                          marginTop: 10, paddingTop: 10,
                          borderTop: `1px dashed ${C.line}`,
                          fontSize: 10, color: C.muted, textAlign: "center",
                          fontStyle: "italic",
                        }}>
                          💗 아직 오늘 컨디션 체크 전이에요
                        </div>
                      );
                    }
                    return (
                      <div style={{
                        marginTop: 10, paddingTop: 10,
                        borderTop: `1px dashed ${C.line}`,
                      }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8,
                          fontSize: 11,
                        }}>
                          <span style={{ color: C.muted, fontSize: 10, fontWeight: 600 }}>💗 오늘 컨디션</span>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            background: C.roseSoft, color: C.roseDeep,
                            borderRadius: 8, padding: "2px 8px",
                          }}>
                            🫀 <span style={{ fontSize: 14 }}>{bodyEmojis[mood.body]}</span>
                          </span>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            background: C.sageSoft, color: C.sageDeep,
                            borderRadius: 8, padding: "2px 8px",
                          }}>
                            🌷 <span style={{ fontSize: 14 }}>{mindEmojis[mood.mind]}</span>
                          </span>
                        </div>
                        {mood.note && (
                          <div style={{
                            fontSize: 11, color: C.ink, marginTop: 6,
                            fontStyle: "italic", lineHeight: 1.5,
                            background: C.warm, borderRadius: 8, padding: "6px 10px",
                          }}>
                            "{mood.note}"
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
            {/* 매장으로 돌아가기 */}
            <button onClick={() => setTab("salon")} style={{
              background: "none", border: `1px solid ${C.line}`,
              borderRadius: 10, padding: "6px 14px", marginBottom: 12,
              fontSize: 12, color: C.muted, cursor: "pointer", fontWeight: 600,
            }}>
              ← 매장으로
            </button>

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

            {/* 🙏 오늘의 고마운 사람 (원클릭) */}
            {!isJangnim && (() => {
              const todayStr = new Date().toLocaleDateString("ko-KR");
              const myTodayGratitudes = gratitudes.filter(g => g.from === myId && g.date === todayStr);
              const thankedIds = myTodayGratitudes.map(g => g.to);
              return (
                <div className="card" style={{
                  background: C.card, borderRadius: 16, padding: 16, marginBottom: 16,
                  border: `1px solid ${C.gold}`, boxShadow: "0 2px 12px rgba(201,160,82,0.1)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>
                    🙏 오늘 고마웠던 사람
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>
                    가볍게 톡! 하루 한 번씩 마음을 표현해요 (사람당 1일 1회)
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {ALL_MEMBERS.filter(m => m.id !== myId && m.canHelp).map(m => {
                      const alreadyThanked = thankedIds.includes(m.id);
                      return (
                        <button key={m.id}
                          onClick={() => {
                            if (alreadyThanked) {
                              setGratitudes(p => p.filter(g =>
                                !(g.from === myId && g.to === m.id && g.date === todayStr)
                              ));
                              showToast("취소했어요");
                            } else {
                              setGratitudes(p => [...p, {
                                id: Date.now(), from: myId, to: m.id, date: todayStr,
                              }]);
                              showToast(`${m.name}님께 고마움 전달 💛`);
                            }
                          }}
                          style={{
                            background: alreadyThanked ? C.gold : C.bg,
                            color: alreadyThanked ? "#fff" : C.ink,
                            border: `1.5px solid ${alreadyThanked ? C.gold : C.line}`,
                            borderRadius: 12, padding: "12px 8px",
                            fontSize: 13, fontWeight: 600, cursor: "pointer",
                            transition: "all .15s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          }}>
                          <span style={{ fontSize: 18 }}>{m.avatar}</span>
                          <span>{m.name}</span>
                          {alreadyThanked && <span style={{ fontSize: 12 }}>💛</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 🏆 고마움 누적 순위 */}
            {(() => {
              const counts = ALL_MEMBERS.map(m => ({
                ...m,
                count: gratitudes.filter(g => g.to === m.id).length,
              })).filter(m => m.count > 0).sort((a, b) => b.count - a.count);
              if (counts.length === 0) return null;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div className="card" style={{
                  background: "linear-gradient(135deg, #FBF4E4, #FAEEE9)",
                  borderRadius: 16, padding: 16, marginBottom: 16,
                  border: `1px solid ${C.line}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 12 }}>
                    💛 우리가 나눈 고마움
                  </div>
                  {counts.map((m, i) => (
                    <div key={m.id} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 0",
                      borderBottom: i < counts.length - 1 ? `1px solid ${C.line}` : "none",
                    }}>
                      <span style={{ fontSize: 16, minWidth: 24 }}>{medals[i] || `${i + 1}`}</span>
                      <span style={{ fontSize: 18 }}>{m.avatar}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.ink }}>{m.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>💛 {m.count}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

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
                    const replies = t.replies || [];
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

                        {/* 댓글 표시 */}
                        {replies.length > 0 && (
                          <div style={{
                            marginTop: 10, paddingTop: 10,
                            borderTop: `1px solid ${C.rose}`,
                          }}>
                            {replies.map(r => {
                              const replyFrom = members.find(m => m.id === r.from);
                              const isMyReply = r.from === myId;
                              return (
                                <div key={r.id} style={{
                                  display: "flex", alignItems: "flex-start", gap: 6,
                                  fontSize: 11, marginBottom: 4,
                                }}>
                                  <span style={{ fontSize: 13 }}>{replyFrom?.avatar}</span>
                                  <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 700, color: C.ink }}>{replyFrom?.name}</span>
                                    <span style={{ color: C.muted, marginLeft: 5 }}>· {r.time}</span>
                                    <div style={{ color: C.ink, marginTop: 2, lineHeight: 1.5 }}>
                                      {r.text}
                                    </div>
                                  </div>
                                  {isMyReply && (
                                    <button onClick={() => {
                                      if (!window.confirm("댓글을 삭제하시겠어요?")) return;
                                      setThanks(p => p.map(x =>
                                        x.id === t.id
                                          ? { ...x, replies: (x.replies || []).filter(rr => rr.id !== r.id) }
                                          : x
                                      ));
                                      showToast("삭제됐어요");
                                    }} style={{
                                      background: "none", color: C.muted,
                                      fontSize: 14, padding: 0, lineHeight: 1, cursor: "pointer",
                                    }}>×</button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* 댓글 입력 */}
                        <div style={{
                          marginTop: 10, paddingTop: 10,
                          borderTop: `1px solid ${C.rose}`,
                          display: "flex", gap: 5,
                        }}>
                          <input
                            placeholder="댓글 달기..."
                            value={thanksReplyDraft[t.id] || ""}
                            onChange={e => setThanksReplyDraft(p => ({ ...p, [t.id]: e.target.value }))}
                            onKeyPress={e => {
                              if (e.key === "Enter" && (thanksReplyDraft[t.id] || "").trim()) {
                                const now = new Date();
                                setThanks(p => p.map(x =>
                                  x.id === t.id
                                    ? { ...x, replies: [...(x.replies || []), {
                                        id: Date.now(), from: myId,
                                        text: thanksReplyDraft[t.id].trim(),
                                        time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                                      }]}
                                    : x
                                ));
                                setThanksReplyDraft(p => ({ ...p, [t.id]: "" }));
                              }
                            }}
                            style={{
                              flex: 1, border: `1px solid ${C.rose}`, borderRadius: 8,
                              padding: "6px 10px", fontSize: 11, background: "#fff",
                              outline: "none", color: C.ink,
                            }}
                          />
                          <button onClick={() => {
                            if (!(thanksReplyDraft[t.id] || "").trim()) return;
                            const now = new Date();
                            setThanks(p => p.map(x =>
                              x.id === t.id
                                ? { ...x, replies: [...(x.replies || []), {
                                    id: Date.now(), from: myId,
                                    text: thanksReplyDraft[t.id].trim(),
                                    time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                                  }]}
                                : x
                            ));
                            setThanksReplyDraft(p => ({ ...p, [t.id]: "" }));
                          }} style={{
                            background: C.roseDeep, color: "#fff",
                            border: "none", borderRadius: 8,
                            padding: "6px 10px", fontSize: 11, fontWeight: 700,
                            cursor: "pointer",
                          }}>달기</button>
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
                  const replies = t.replies || [];
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

                      {/* 댓글 표시 */}
                      {replies.length > 0 && (
                        <div style={{
                          marginTop: 8, paddingTop: 8,
                          borderTop: `1px solid ${C.line}`,
                        }}>
                          {replies.map(r => {
                            const replyFrom = members.find(m => m.id === r.from);
                            const isMyReply = r.from === myId;
                            return (
                              <div key={r.id} style={{
                                display: "flex", alignItems: "flex-start", gap: 5,
                                fontSize: 11, marginBottom: 3,
                              }}>
                                <span style={{ fontSize: 12 }}>{replyFrom?.avatar}</span>
                                <div style={{ flex: 1 }}>
                                  <span style={{ fontWeight: 700, color: C.ink }}>{replyFrom?.name}</span>
                                  <span style={{ color: C.muted, marginLeft: 4 }}>· {r.time}</span>
                                  <span style={{ color: C.ink, marginLeft: 5 }}>{r.text}</span>
                                </div>
                                {isMyReply && (
                                  <button onClick={() => {
                                    if (!window.confirm("댓글을 삭제하시겠어요?")) return;
                                    setThanks(p => p.map(x =>
                                      x.id === t.id
                                        ? { ...x, replies: (x.replies || []).filter(rr => rr.id !== r.id) }
                                        : x
                                    ));
                                    showToast("삭제됐어요");
                                  }} style={{
                                    background: "none", color: C.muted,
                                    fontSize: 13, padding: 0, lineHeight: 1, cursor: "pointer",
                                  }}>×</button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 댓글 입력 */}
                      <div style={{
                        marginTop: 8, paddingTop: 8,
                        borderTop: `1px solid ${C.line}`,
                        display: "flex", gap: 5,
                      }}>
                        <input
                          placeholder="댓글 달기..."
                          value={thanksReplyDraft[t.id] || ""}
                          onChange={e => setThanksReplyDraft(p => ({ ...p, [t.id]: e.target.value }))}
                          onKeyPress={e => {
                            if (e.key === "Enter" && (thanksReplyDraft[t.id] || "").trim()) {
                              const now = new Date();
                              setThanks(p => p.map(x =>
                                x.id === t.id
                                  ? { ...x, replies: [...(x.replies || []), {
                                      id: Date.now(), from: myId,
                                      text: thanksReplyDraft[t.id].trim(),
                                      time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                                    }]}
                                  : x
                              ));
                              setThanksReplyDraft(p => ({ ...p, [t.id]: "" }));
                            }
                          }}
                          style={{
                            flex: 1, border: `1px solid ${C.line}`, borderRadius: 8,
                            padding: "5px 10px", fontSize: 11, background: C.bg,
                            outline: "none", color: C.ink,
                          }}
                        />
                        <button onClick={() => {
                          if (!(thanksReplyDraft[t.id] || "").trim()) return;
                          const now = new Date();
                          setThanks(p => p.map(x =>
                            x.id === t.id
                              ? { ...x, replies: [...(x.replies || []), {
                                  id: Date.now(), from: myId,
                                  text: thanksReplyDraft[t.id].trim(),
                                  time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                                }]}
                              : x
                          ));
                          setThanksReplyDraft(p => ({ ...p, [t.id]: "" }));
                        }} style={{
                          background: C.sageDeep, color: "#fff",
                          border: "none", borderRadius: 8,
                          padding: "5px 10px", fontSize: 11, fontWeight: 700,
                          cursor: "pointer",
                        }}>달기</button>
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
                { id: "lucky",     label: "럭키박스",  icon: "🎁" },
                { id: "clean",     label: "청소",      icon: "🧹" },
                { id: "time",      label: "시간 적립", icon: "⏰" },
                { id: "orders",    label: "발주 요청", icon: "📦" },
                { id: "stock",     label: "재고",      icon: "📊" },
                { id: "suggest",   label: "건의함",    icon: "💭" },
                { id: "personal",  label: "개인구매",  icon: "🛍️" },
              ].map(s => (
                <button key={s.id} onClick={() => {
                  if (s.id === "clean") { setTab("clean"); }
                  else { setSalonSub(s.id); }
                }} style={{
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
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginBottom: 3, paddingLeft: 2 }}>📅 날짜</div>
                        <input type="date" value={eventDraft.date}
                          onChange={e => setEventDraft(p => ({ ...p, date: e.target.value }))}
                          style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, background: C.bg, outline: "none", color: C.ink }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginBottom: 3, paddingLeft: 2 }}>🕐 시간</div>
                        <input type="time" value={eventDraft.time}
                          onChange={e => setEventDraft(p => ({ ...p, time: e.target.value }))}
                          style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, background: C.bg, outline: "none", color: C.ink }} />
                      </div>
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
                  <div style={{ fontSize: 11, opacity: .9 }}>한 달 동안 받은 고마움으로 산정</div>
                </div>

                {/* 고마움왕 */}
                <div className="card" style={{
                  background: C.card, borderRadius: 16, padding: 14, marginBottom: 12,
                  border: `1px solid ${C.line}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 10 }}>
                    🙏 고마움왕 (받은 고마움)
                  </div>
                  {[...ALL_MEMBERS]
                    .map(m => ({ ...m, count: gratitudes.filter(g => g.to === m.id).length }))
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
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>💛 {m.count}</span>
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
                    {isJangnim && (
                      <span style={{ fontSize: 10, color: C.muted, fontWeight: 500, marginLeft: 6 }}>
                        (대표는 차감 가능)
                      </span>
                    )}
                  </div>
                  {ALL_MEMBERS.map(m => {
                    const bal = timeBank
                      .filter(t => t.memberId === m.id)
                      .reduce((sum, t) => sum + (t.type === "earn" ? t.minutes : -t.minutes), 0);
                    const isExpanded = jangnimDeductTarget === m.id;
                    const canDeduct = isJangnim && m.id !== myId; // 대표가 다른 사람만
                    return (
                      <div key={m.id} className="card" style={{
                        background: C.card, borderRadius: 12,
                        marginBottom: 6,
                        border: `1px solid ${isExpanded ? C.rose : C.line}`,
                      }}>
                        <div style={{
                          padding: "10px 14px",
                          display: "flex", alignItems: "center", gap: 10,
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
                          {canDeduct && (
                            <button onClick={() => {
                              setJangnimDeductTarget(isExpanded ? null : m.id);
                              setJangnimDeductDraft({ minutes: 30, note: "" });
                            }} style={{
                              background: isExpanded ? C.roseDeep : C.roseSoft,
                              color: isExpanded ? "#fff" : C.roseDeep,
                              border: "none", borderRadius: 8,
                              padding: "4px 10px", fontSize: 11, fontWeight: 700,
                              cursor: "pointer",
                            }}>
                              {isExpanded ? "취소" : "차감"}
                            </button>
                          )}
                        </div>

                        {/* 대표 차감 입력 폼 */}
                        {isExpanded && (
                          <div style={{
                            padding: "12px 14px",
                            background: "#FFF5F0",
                            borderTop: `1px solid ${C.rose}`,
                            borderRadius: "0 0 11px 11px",
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.roseDeep, marginBottom: 8 }}>
                              ➖ {m.name}님 시간 차감
                            </div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                              {[30, 60, 90, 120, 150, 180].map(min => (
                                <button key={min}
                                  onClick={() => setJangnimDeductDraft(p => ({ ...p, minutes: min }))}
                                  style={{
                                    flex: "1 0 auto",
                                    background: jangnimDeductDraft.minutes === min ? C.roseDeep : "#fff",
                                    color: jangnimDeductDraft.minutes === min ? "#fff" : C.ink,
                                    borderRadius: 8, padding: "5px 8px", fontSize: 11,
                                    border: `1px solid ${jangnimDeductDraft.minutes === min ? C.roseDeep : C.line}`,
                                    fontWeight: 600, cursor: "pointer",
                                  }}>
                                  {formatMin(min)}
                                </button>
                              ))}
                            </div>
                            <input
                              placeholder="차감 사유 (예: 지각, 조퇴 등)"
                              value={jangnimDeductDraft.note}
                              onChange={e => setJangnimDeductDraft(p => ({ ...p, note: e.target.value }))}
                              style={{
                                width: "100%", border: `1px solid ${C.line}`, borderRadius: 8,
                                padding: "7px 10px", fontSize: 12, background: "#fff", outline: "none",
                                color: C.ink, marginBottom: 8,
                              }}
                            />
                            <button onClick={() => {
                              if (jangnimDeductDraft.minutes > bal) {
                                showToast(`잔액 부족! 현재 ${formatMin(bal)} 적립됨`, "err");
                                return;
                              }
                              if (!window.confirm(
                                `${m.name}님의 시간을 ${formatMin(jangnimDeductDraft.minutes)} 차감하시겠어요?\n\n` +
                                `사유: ${jangnimDeductDraft.note || "(없음)"}`
                              )) return;
                              const today = new Date();
                              setTimeBank(p => [...p, {
                                id: Date.now(),
                                memberId: m.id,
                                type: "use",
                                minutes: jangnimDeductDraft.minutes,
                                note: `[대표 차감] ${jangnimDeductDraft.note || "사유 없음"}`,
                                date: today.toLocaleDateString("ko-KR"),
                                time: today.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                              }]);
                              setJangnimDeductTarget(null);
                              setJangnimDeductDraft({ minutes: 30, note: "" });
                              showToast(`${m.name}님 ${formatMin(jangnimDeductDraft.minutes)} 차감 완료`);
                            }} style={{
                              width: "100%", background: C.roseDeep, color: "#fff",
                              border: "none", borderRadius: 8, padding: "8px",
                              fontSize: 12, fontWeight: 700, cursor: "pointer",
                            }}>
                              ➖ 차감하기
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* 기록 내역 (대표는 전체, 직원은 본인) */}
                  {(() => {
                    const myLogs = isJangnim
                      ? timeBank
                      : timeBank.filter(t => t.memberId === myId);
                    if (myLogs.length === 0) return null;
                    return (
                      <div style={{ marginTop: 18 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                          📋 {isJangnim ? "전체 기록 내역" : "내 기록 내역"}
                        </div>
                        {[...myLogs].reverse().slice(0, 40).map(t => {
                          const isPenalty = t.type === "penalty";
                          const isEarn = t.type === "earn";
                          const recMember = members.find(m => m.id === t.memberId);
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
                                  {isJangnim && (
                                    <span style={{ color: C.ink, fontWeight: 700, marginRight: 5 }}>
                                      {recMember?.avatar} {recMember?.name}
                                    </span>
                                  )}
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


            {/* ─── 발주 요청 (메모) ─── */}
            {salonSub === "orders" && (
              <div>
                <div className="card" style={{
                  background: "linear-gradient(135deg, #7AAEC8, #4E8AAD)",
                  borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 14,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>📦 발주 메모</div>
                  <div style={{ fontSize: 11, opacity: .9, marginTop: 3, lineHeight: 1.6 }}>
                    필요한 제품을 여기 한 칸에 적어두세요<br/>
                    다 적으면 복사해서 거래처에 붙여넣기 하면 돼요
                  </div>
                </div>

                <div className="card" style={{
                  background: C.card, borderRadius: 14, padding: 14, marginBottom: 12,
                  border: `1px solid ${C.line}`,
                }}>
                  <textarea
                    placeholder={"예시)\n새치커버 자연갈색 5개\n산화제 6% 3개\n펌지 2팩"}
                    value={orderMemo}
                    onChange={e => setOrderMemo(e.target.value)}
                    rows={12}
                    style={{
                      width: "100%", border: `1px solid ${C.line}`, borderRadius: 10,
                      padding: "12px 14px", fontSize: 14, background: C.bg, outline: "none",
                      color: C.ink, resize: "vertical", lineHeight: 1.8, marginBottom: 10,
                      fontFamily: "inherit",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => {
                      if (!orderMemo.trim()) { showToast("적힌 내용이 없어요", "err"); return; }
                      const done = () => showToast("발주 메모 복사 완료 📋");
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(orderMemo).then(done).catch(() => {
                          const ta = document.createElement("textarea");
                          ta.value = orderMemo; document.body.appendChild(ta); ta.select();
                          try { document.execCommand("copy"); done(); } catch (e) { showToast("복사 실패 — 길게 눌러 복사해주세요", "err"); }
                          document.body.removeChild(ta);
                        });
                      } else {
                        const ta = document.createElement("textarea");
                        ta.value = orderMemo; document.body.appendChild(ta); ta.select();
                        try { document.execCommand("copy"); done(); } catch (e) { showToast("복사 실패 — 길게 눌러 복사해주세요", "err"); }
                        document.body.removeChild(ta);
                      }
                    }} style={{
                      flex: 2, background: "#4E8AAD", color: "#fff",
                      borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700,
                    }}>📋 전체 복사</button>
                    <button onClick={() => {
                      if (!orderMemo.trim()) return;
                      if (window.confirm("발주 메모를 모두 지울까요?")) {
                        setOrderMemo("");
                        showToast("발주 메모를 비웠어요");
                      }
                    }} style={{
                      flex: 1, background: C.bg, color: C.muted,
                      border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 600,
                    }}>🗑️ 비우기</button>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 1.7 }}>
                  💡 재고 화면에서 <b>📦 발주 추가</b>를 누르면<br/>부족한 제품이 이 메모에 자동으로 적혀요
                </div>
              </div>
            )}

            {/* ─── 재고 관리 ─── */}
            {salonSub === "stock" && (() => {
              const shortageOf = (it) => Math.max((it.par || 0) - (it.current || 0), 0);
              const shortageCount = inventory.filter(it => shortageOf(it) > 0).length;
              const shown = invShortageOnly ? inventory.filter(it => shortageOf(it) > 0) : inventory;
              const setCurrent = (id, delta) => setInventory(p => p.map(it =>
                it.id === id ? { ...it, current: Math.max((it.current || 0) + delta, 0) } : it));
              const setPar = (id, val) => setInventory(p => p.map(it =>
                it.id === id ? { ...it, par: Math.max(parseInt(val) || 0, 0) } : it));
              const addToOrder = (it) => {
                const need = shortageOf(it);
                const line = `${it.name} ${need}개`;
                setOrderMemo(prev => {
                  if (prev.split("\n").some(l => l.trim() === line)) return prev; // 중복 방지
                  return prev.trim() ? `${prev.replace(/\s+$/, "")}\n${line}` : line;
                });
                showToast(`발주 메모에 추가됨 · ${line} 📦`);
              };
              // 하트(자주 시키는 제품) 토글
              const toggleFav = (id) => setInventory(p => p.map(it =>
                it.id === id ? { ...it, fav: !it.fav } : it));
              // 제품 이름 저장
              const saveInvName = (id) => {
                const newName = editingInvName.trim();
                if (newName) {
                  setInventory(p => p.map(it => it.id === id ? { ...it, name: newName } : it));
                  showToast("이름이 수정됐어요 ✏️");
                }
                setEditingInvId(null);
                setEditingInvName("");
              };
              // 드래그로 순서 변경 (같은 분류 안에서)
              const handleDrop = (targetId) => {
                if (dragInvId === null || dragInvId === targetId) { setDragInvId(null); return; }
                setInventory(p => {
                  const arr = [...p];
                  const from = arr.findIndex(x => x.id === dragInvId);
                  const to = arr.findIndex(x => x.id === targetId);
                  if (from < 0 || to < 0) return p;
                  // 같은 분류끼리만 이동 허용
                  if (arr[from].category !== arr[to].category) return p;
                  const [moved] = arr.splice(from, 1);
                  const newTo = arr.findIndex(x => x.id === targetId);
                  arr.splice(newTo, 0, moved);
                  return arr;
                });
                setDragInvId(null);
              };
              // 같은 분류 + 같은 하트 그룹 안에서 위/아래 순서 이동
              const moveItem = (id, dir) => setInventory(p => {
                const arr = [...p];
                const i = arr.findIndex(x => x.id === id);
                if (i < 0) return p;
                const cat = arr[i].category, fav = !!arr[i].fav;
                let j = dir < 0 ? i - 1 : i + 1;
                while (j >= 0 && j < arr.length && !(arr[j].category === cat && !!arr[j].fav === fav)) j += dir;
                if (j < 0 || j >= arr.length) return p;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                return arr;
              });
              // 분류 안에서 하트 누른 제품을 위로 (각 그룹 내 순서는 유지)
              const sortFav = (list) => [...list.filter(it => it.fav), ...list.filter(it => !it.fav)];
              // 알 수 없는(예전) 분류도 빠지지 않게 뒤에 표시
              const allCats = [...INV_CATS, ...shown.map(it => it.category).filter(c => !INV_CATS.includes(c))]
                .filter((c, idx, a) => a.indexOf(c) === idx);
              return (
                <div>
                  <div className="card" style={{
                    background: "linear-gradient(135deg, #6FA882, #4E8A68)",
                    borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>📊 제품 재고</div>
                    <div style={{ fontSize: 11, opacity: .9, marginTop: 3 }}>
                      이름 눌러 수정 ✏️ · ⋮⋮ 드래그로 순서 변경 · ❤️ 자주쓰는건 위로
                    </div>
                  </div>

                  {/* 요약 + 필터 */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <button onClick={() => setInvShortageOnly(false)} style={{
                      flex: 1, background: !invShortageOnly ? C.sageDeep : C.card,
                      color: !invShortageOnly ? "#fff" : C.muted,
                      border: `1px solid ${!invShortageOnly ? C.sageDeep : C.line}`,
                      borderRadius: 10, padding: "8px", fontSize: 12, fontWeight: 700,
                    }}>전체 {inventory.length}</button>
                    <button onClick={() => setInvShortageOnly(true)} style={{
                      flex: 1, background: invShortageOnly ? C.roseDeep : C.card,
                      color: invShortageOnly ? "#fff" : (shortageCount > 0 ? C.roseDeep : C.muted),
                      border: `1px solid ${invShortageOnly ? C.roseDeep : C.line}`,
                      borderRadius: 10, padding: "8px", fontSize: 12, fontWeight: 700,
                    }}>🔴 부족 {shortageCount}</button>
                    <button onClick={() => setShowInvForm(!showInvForm)} style={{
                      background: C.card, color: C.sageDeep,
                      border: `1px solid ${C.line}`, borderRadius: 10,
                      padding: "8px 14px", fontSize: 12, fontWeight: 700,
                    }}>{showInvForm ? "닫기" : "+ 제품"}</button>
                  </div>

                  {/* 염모제 137개 추가 버튼 (아직 염모제 없을 때만 표시) */}
                  {!inventory.some(it => it.category === "염모제") && (
                    <div className="card" style={{
                      background: C.goldSoft, borderRadius: 14, padding: "16px",
                      marginBottom: 14, border: `2px solid ${C.gold}`, textAlign: "center",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
                        📦 염모제 목록 불러오기
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 12, lineHeight: 1.6 }}>
                        사진에서 읽은 염모제 137개를 추가해요<br/>(지금 있는 제품은 그대로 유지돼요)
                      </div>
                      <button onClick={() => {
                        const maxId = inventory.reduce((mx, it) => Math.max(mx, it.id || 0), 0);
                        const toAdd = DEFAULT_INVENTORY.map((it, i) => ({ ...it, id: maxId + 1 + i }));
                        setInventory(prev => [...prev, ...toAdd]);
                        showToast("염모제 137개를 추가했어요! 📦");
                      }} style={{
                        background: C.gold, color: "#fff", border: "none",
                        borderRadius: 10, padding: "12px 24px",
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                      }}>
                        📦 염모제 137개 추가하기
                      </button>
                    </div>
                  )}

                  {/* 제품 추가 폼 */}
                  {showInvForm && (
                    <div className="card" style={{
                      background: C.card, borderRadius: 14, padding: 14, marginBottom: 14,
                      border: `1px solid ${C.line}`,
                    }}>
                      <select value={invDraft.category}
                        onChange={e => setInvDraft(p => ({ ...p, category: e.target.value }))}
                        style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: C.bg, marginBottom: 6, outline: "none", color: C.ink }}>
                        {INV_CATS.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input placeholder="제품명 (예: 새치커버 자연갈색)" value={invDraft.name}
                        onChange={e => setInvDraft(p => ({ ...p, name: e.target.value }))}
                        style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: C.bg, marginBottom: 6, outline: "none", color: C.ink }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>적정재고</span>
                        <input type="number" value={invDraft.par}
                          onChange={e => setInvDraft(p => ({ ...p, par: parseInt(e.target.value) || 0 }))}
                          style={{ width: 70, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: C.bg, outline: "none", color: C.ink, textAlign: "center" }} />
                        <span style={{ fontSize: 11, color: C.muted }}>* 이 수량 아래로 떨어지면 부족 표시</span>
                      </div>
                      <button onClick={() => {
                        if (!invDraft.name.trim()) { showToast("제품명을 입력해주세요", "err"); return; }
                        setInventory(p => [...p, { ...invDraft, id: Date.now(), name: invDraft.name.trim(), current: 0 }]);
                        setInvDraft({ category: invDraft.category, name: "", par: 3 });
                        setShowInvForm(false);
                        showToast("제품이 추가됐어요 📊");
                      }} style={{
                        width: "100%", background: C.sageDeep, color: "#fff",
                        borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: 700,
                      }}>제품 추가</button>
                    </div>
                  )}

                  {/* 분류별 목록 */}
                  {allCats.filter(cat => shown.some(it => it.category === cat)).map(cat => (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 6, paddingLeft: 4 }}>{cat}</div>
                      {sortFav(shown.filter(it => it.category === cat)).map(it => {
                        const need = shortageOf(it);
                        const low = need > 0;
                        const isEditing = editingInvId === it.id;
                        return (
                          <div key={it.id}
                            draggable={!isEditing && !invShortageOnly}
                            onDragStart={() => setDragInvId(it.id)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={() => handleDrop(it.id)}
                            className="card" style={{
                            background: dragInvId === it.id ? C.sageSoft : C.card,
                            borderRadius: 14, padding: "11px 13px", marginBottom: 7,
                            border: `1px solid ${low ? C.roseSoft : C.line}`,
                            borderLeft: `4px solid ${low ? C.roseDeep : C.sage}`,
                            opacity: dragInvId === it.id ? 0.5 : 1,
                            cursor: (!isEditing && !invShortageOnly) ? "grab" : "default",
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              {!invShortageOnly && (
                                <span style={{
                                  fontSize: 14, color: C.muted, marginRight: 4,
                                  cursor: "grab", userSelect: "none",
                                }} title="드래그해서 순서 변경">⋮⋮</span>
                              )}
                              <button onClick={() => toggleFav(it.id)} title="자주 시키는 제품" style={{
                                background: "transparent", border: "none", padding: 0, marginRight: 6,
                                fontSize: 17, lineHeight: 1, cursor: "pointer",
                                filter: it.fav ? "none" : "grayscale(1) opacity(0.45)",
                              }}>{it.fav ? "❤️" : "🤍"}</button>
                              {isEditing ? (
                                <input
                                  autoFocus
                                  value={editingInvName}
                                  onChange={e => setEditingInvName(e.target.value)}
                                  onBlur={() => saveInvName(it.id)}
                                  onKeyDown={e => { if (e.key === "Enter") saveInvName(it.id); }}
                                  style={{
                                    flex: 1, fontSize: 13, fontWeight: 700, color: C.ink,
                                    border: `1.5px solid ${C.sage}`, borderRadius: 8,
                                    padding: "4px 8px", background: "#fff", outline: "none",
                                  }}
                                />
                              ) : (
                                <div
                                  onClick={() => { setEditingInvId(it.id); setEditingInvName(it.name); }}
                                  style={{
                                    fontSize: 13, fontWeight: 700, color: C.ink, flex: 1,
                                    cursor: "text", borderBottom: `1px dashed transparent`,
                                  }}
                                  title="눌러서 이름 수정">
                                  {it.name} <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>✏️</span>
                                </div>
                              )}
                              {low && <span style={{
                                fontSize: 10, padding: "2px 8px", borderRadius: 8,
                                background: C.roseSoft, color: C.roseDeep, fontWeight: 700, marginRight: 6, marginLeft: 6,
                              }}>부족 {need}</span>}
                              {!invShortageOnly && !isEditing && (
                                <>
                                  <button onClick={() => moveItem(it.id, -1)} style={{
                                    background: C.bg, color: C.muted, borderRadius: 8,
                                    padding: "2px 7px", fontSize: 12, border: `1px solid ${C.line}`, marginRight: 3,
                                  }}>↑</button>
                                  <button onClick={() => moveItem(it.id, +1)} style={{
                                    background: C.bg, color: C.muted, borderRadius: 8,
                                    padding: "2px 7px", fontSize: 12, border: `1px solid ${C.line}`, marginRight: 3,
                                  }}>↓</button>
                                </>
                              )}
                              <button onClick={() => {
                                setInventory(p => p.filter(x => x.id !== it.id));
                                showToast(`${it.name} 삭제됨`);
                              }} style={{ background: C.bg, color: C.muted, borderRadius: 8, padding: "2px 8px", fontSize: 13, border: `1px solid ${C.line}` }}>×</button>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <button onClick={() => setCurrent(it.id, -1)} style={{
                                  width: 30, height: 30, borderRadius: 8, background: C.bg,
                                  border: `1px solid ${C.line}`, fontSize: 16, fontWeight: 700, color: C.ink,
                                }}>−</button>
                                <div style={{ minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: 800, color: low ? C.roseDeep : C.ink }}>{it.current}</div>
                                <button onClick={() => setCurrent(it.id, +1)} style={{
                                  width: 30, height: 30, borderRadius: 8, background: C.sageSoft,
                                  border: `1px solid ${C.sage}`, fontSize: 16, fontWeight: 700, color: C.sageDeep,
                                }}>+</button>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.muted }}>
                                적정
                                <input type="number" value={it.par}
                                  onChange={e => setPar(it.id, e.target.value)}
                                  style={{ width: 44, border: `1px solid ${C.line}`, borderRadius: 8, padding: "4px 6px", fontSize: 12, background: C.bg, outline: "none", color: C.ink, textAlign: "center" }} />
                              </div>
                              {low && (
                                <button onClick={() => addToOrder(it)} style={{
                                  marginLeft: "auto", background: "#4E8AAD", color: "#fff",
                                  borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700,
                                }}>📦 발주 추가</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {shown.length === 0 && (
                    <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: "30px 0" }}>
                      {invShortageOnly ? "부족한 제품이 없어요 🌿" : "등록된 제품이 없어요"}
                    </div>
                  )}
                </div>
              );
            })()}

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
                    const got = giveLuckyTicket(`${myId}-${today}-mood`, 1, "오늘 컨디션 체크");
                    if (!got) showToast("컨디션 체크 완료 💗");
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

            {/* ─── 개인구매 ─── */}
            {salonSub === "personal" && (() => {
              const today = new Date();
              const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
              const thisMonthPurchases = personalPurchases.filter(p => p.date.startsWith(thisMonth));

              return (
                <div>
                  {/* 헤더 */}
                  <div className="card" style={{
                    background: "linear-gradient(135deg, #C9A052, #A8843D)",
                    borderRadius: 16, padding: "18px 20px", color: "#fff", marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>🛍️</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>개인구매 기록</div>
                    <div style={{ fontSize: 12, opacity: .9, lineHeight: 1.7 }}>
                      매장에서 개인적으로 사용한 제품을 기록해요<br/>
                      (스타일링 제품, 본인 머리 시술 약품 등)
                    </div>
                  </div>

                  {/* 입력 폼 */}
                  <div className="card" style={{
                    background: C.card, borderRadius: 14, padding: 14, marginBottom: 14,
                    border: `1px solid ${C.line}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                      ✍️ 사용 제품 기록하기
                    </div>

                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>제품명 *</div>
                    <input
                      placeholder="예: 살롱전용 트리트먼트"
                      value={purchaseDraft.product}
                      onChange={e => setPurchaseDraft(p => ({ ...p, product: e.target.value }))}
                      style={{
                        width: "100%", border: `1px solid ${C.line}`, borderRadius: 10,
                        padding: "8px 12px", fontSize: 12, background: C.bg, outline: "none",
                        color: C.ink, marginBottom: 10,
                      }}
                    />

                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>메모 (선택)</div>
                    <input
                      placeholder="예: 본인 머리 시술용, 손님 추천용 등"
                      value={purchaseDraft.note}
                      onChange={e => setPurchaseDraft(p => ({ ...p, note: e.target.value }))}
                      style={{
                        width: "100%", border: `1px solid ${C.line}`, borderRadius: 10,
                        padding: "8px 12px", fontSize: 12, background: C.bg, outline: "none",
                        color: C.ink, marginBottom: 10,
                      }}
                    />

                    <button onClick={() => {
                      if (!purchaseDraft.product.trim()) {
                        showToast("제품명을 입력해주세요", "err");
                        return;
                      }
                      const now = new Date();
                      setPersonalPurchases(p => [...p, {
                        id: Date.now(),
                        memberId: myId,
                        product: purchaseDraft.product.trim(),
                        note: purchaseDraft.note.trim(),
                        date: now.toISOString().slice(0, 10),
                        time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                      }]);
                      setPurchaseDraft({ product: "", note: "" });
                      showToast("기록됐어요 🛍️");
                    }} style={{
                      width: "100%", background: C.gold, color: "#fff",
                      borderRadius: 12, padding: "10px", fontSize: 13, fontWeight: 700,
                    }}>
                      🛍️ 기록하기
                    </button>
                  </div>

                  {/* 이번 달 멤버별 사용 횟수 */}
                  {thisMonthPurchases.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                        📊 이번 달 사용 횟수
                      </div>
                      <div style={{
                        display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6,
                      }}>
                        {ALL_MEMBERS.filter(m => m.canHelp).map(m => {
                          const count = thisMonthPurchases.filter(p => p.memberId === m.id).length;
                          return (
                            <div key={m.id} style={{
                              background: C.card, borderRadius: 10, padding: "8px 12px",
                              border: `1px solid ${C.line}`,
                              display: "flex", alignItems: "center", gap: 8,
                            }}>
                              <span style={{ fontSize: 16 }}>{m.avatar}</span>
                              <div style={{ flex: 1, fontSize: 12, color: C.ink, fontWeight: 600 }}>
                                {m.name}
                              </div>
                              <div style={{
                                fontSize: 13, fontWeight: 700,
                                color: count > 0 ? C.gold : C.muted,
                              }}>
                                {count}회
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 전체 기록 (최신순) */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                    📋 전체 사용 기록 ({personalPurchases.length}건)
                  </div>

                  {personalPurchases.length === 0 ? (
                    <div className="card" style={{
                      background: C.warm, borderRadius: 14, padding: "20px",
                      textAlign: "center", color: C.muted, fontSize: 12, lineHeight: 1.7,
                    }}>
                      아직 기록이 없어요 🛍️<br/>
                      위에서 첫 기록을 남겨보세요
                    </div>
                  ) : (
                    [...personalPurchases].reverse().slice(0, 50).map(p => {
                      const member = members.find(m => m.id === p.memberId);
                      const isMine = p.memberId === myId;
                      return (
                        <div key={p.id} className="card" style={{
                          background: C.card, borderRadius: 12, padding: "10px 14px",
                          marginBottom: 6, border: `1px solid ${isMine ? C.gold : C.line}`,
                          borderLeft: `4px solid ${C.gold}`,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14 }}>{member?.avatar}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>
                              {member?.name}
                              {isMine && <span style={{ fontSize: 9, color: C.gold, marginLeft: 4 }}>(나)</span>}
                            </span>
                            <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>
                              {p.date.slice(5).replace("-", "월 ")}일 {p.time}
                            </span>
                            {isMine && (
                              <button onClick={() => {
                                if (window.confirm("이 기록을 삭제하시겠어요?")) {
                                  setPersonalPurchases(prev => prev.filter(x => x.id !== p.id));
                                  showToast("삭제됐어요");
                                }
                              }} style={{
                                background: "none", color: C.muted,
                                fontSize: 14, padding: 2, cursor: "pointer",
                              }}>×</button>
                            )}
                          </div>
                          <div style={{ fontSize: 13, color: C.ink, fontWeight: 600, marginBottom: p.note ? 4 : 0 }}>
                            🛍️ {p.product}
                          </div>
                          {p.note && (
                            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                              💬 {p.note}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  <div style={{
                    background: C.warm, borderRadius: 12, padding: "12px 14px",
                    fontSize: 11, color: C.muted, lineHeight: 1.7, textAlign: "center",
                    marginTop: 14,
                  }}>
                    💡 정산은 따로 진행됩니다<br/>
                    모두에게 투명하게 공개돼요
                  </div>
                </div>
              );
            })()}

            {/* ─── 🎁 럭키박스 ─── */}
            {salonSub === "lucky" && (() => {
              const myTickets = luckyTickets[myId] || 0;
              const myWins = luckyWins.filter(w => w.memberId === myId);
              return (
                <div>
                  {/* 헤더 */}
                  <div className="card" style={{
                    background: "linear-gradient(135deg, #C9A052, #D4806A)",
                    borderRadius: 18, padding: "20px", color: "#fff", marginBottom: 16,
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🎁</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>럭키박스</div>
                    <div style={{ fontSize: 12, opacity: .9, lineHeight: 1.6 }}>
                      매일 활동하면 럭키박스를 모을 수 있어요!
                    </div>
                  </div>

                  {/* 대표가 아닐 때: 내 박스 */}
                  {!isJangnim && (
                    <>
                      {/* 보유 티켓 + 열기 */}
                      <div className="card" style={{
                        background: C.card, borderRadius: 18,
                        border: `2px solid ${myTickets > 0 ? C.gold : C.line}`,
                        padding: "20px", marginBottom: 16, textAlign: "center",
                        boxShadow: myTickets > 0 ? "0 4px 20px rgba(201,160,82,0.2)" : "none",
                      }}>
                        {boxResult ? (
                          // 당첨 결과 화면
                          <div style={{ animation: "fadeUp .4s ease" }}>
                            <div style={{ fontSize: 50, marginBottom: 10 }}>
                              {boxResult.name.includes("꽝") ? "😢" : "🎉"}
                            </div>
                            <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>
                              {boxResult.name.includes("꽝") ? "아쉬워요!" : "축하해요! 당첨되었어요"}
                            </div>
                            <div style={{
                              fontSize: 20, fontWeight: 800,
                              color: boxResult.name.includes("꽝") ? C.muted : C.goldDeep || "#A8843D",
                              marginBottom: boxResult.autoMinutes > 0 ? 8 : 16,
                            }}>
                              {boxResult.name}
                            </div>
                            {boxResult.autoMinutes > 0 && (
                              <div style={{
                                fontSize: 12, color: C.sageDeep, fontWeight: 700,
                                background: C.sageSoft, borderRadius: 10,
                                padding: "8px 12px", marginBottom: 16,
                              }}>
                                ✅ 시간적립에 자동으로 추가됐어요!
                              </div>
                            )}
                            <button onClick={() => setBoxResult(null)} style={{
                              background: C.ink, color: "#fff", border: "none",
                              borderRadius: 12, padding: "10px 24px",
                              fontSize: 13, fontWeight: 700, cursor: "pointer",
                            }}>
                              확인
                            </button>
                          </div>
                        ) : boxOpening ? (
                          // 여는 중 애니메이션
                          <div>
                            <div style={{
                              fontSize: 60, marginBottom: 10,
                              animation: "shake .4s ease infinite",
                            }}>🎁</div>
                            <div style={{ fontSize: 14, color: C.gold, fontWeight: 700 }}>
                              두근두근... 열어보는 중!
                            </div>
                          </div>
                        ) : (
                          // 기본 화면
                          <div>
                            <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>
                              내가 가진 럭키박스
                            </div>
                            <div style={{
                              fontSize: 40, fontWeight: 800, color: C.gold, marginBottom: 4,
                            }}>
                              {myTickets}개
                            </div>
                            <button
                              onClick={openLuckyBox}
                              disabled={myTickets <= 0}
                              style={{
                                width: "100%", marginTop: 12,
                                background: myTickets > 0 ? "linear-gradient(135deg, #C9A052, #D4806A)" : C.line,
                                color: myTickets > 0 ? "#fff" : C.muted,
                                border: "none", borderRadius: 14, padding: "14px",
                                fontSize: 15, fontWeight: 700,
                                cursor: myTickets > 0 ? "pointer" : "default",
                              }}>
                              {myTickets > 0 ? "🎁 럭키박스 열기!" : "박스가 없어요"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 획득 방법 안내 */}
                      <div className="card" style={{
                        background: C.warm, borderRadius: 14, padding: "14px 16px",
                        marginBottom: 16, border: `1px solid ${C.line}`,
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                          🎯 럭키박스 받는 방법
                        </div>
                        <div style={{ fontSize: 12, color: C.ink, lineHeight: 2 }}>
                          💗 매일 컨디션 체크 → <b style={{ color: C.gold }}>1개</b><br/>
                          ✅ 매일 리뷰 답글 완료 → <b style={{ color: C.gold }}>1개</b><br/>
                          📸 일주일 인스타 2개 달성 → <b style={{ color: C.gold }}>3개</b>
                        </div>
                      </div>

                      {/* 🎁 들어있는 상품 목록 */}
                      <div className="card" style={{
                        background: C.card, borderRadius: 14, padding: "14px 16px",
                        marginBottom: 16, border: `1px solid ${C.gold}`,
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 4 }}>
                          🎁 이번 럭키박스 상품
                        </div>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>
                          어떤 게 나올지는 운에 맡겨요! 🍀
                        </div>
                        {luckyPrizes.filter(p => !p.name.includes("꽝")).length === 0 ? (
                          <div style={{
                            fontSize: 11, color: C.muted, textAlign: "center", padding: "10px",
                          }}>
                            대표님이 상품을 준비 중이에요 🎁
                          </div>
                        ) : (
                          luckyPrizes
                            .filter(p => !p.name.includes("꽝"))
                            .map(prize => {
                              // 상품에 어울리는 이모지 자동 매칭
                              let emoji = "🎁";
                              const n = prize.name;
                              if (n.includes("시간") || n.includes("분") || n.includes("퇴근")) emoji = "⏰";
                              else if (n.includes("치킨")) emoji = "🍗";
                              else if (n.includes("커피") || n.includes("아메") || n.includes("음료")) emoji = "☕";
                              else if (n.includes("상품권") || n.includes("만원") || n.includes("기프티콘")) emoji = "💳";
                              else if (n.includes("간식")) emoji = "🍪";
                              else if (n.includes("케이크") || n.includes("디저트")) emoji = "🍰";
                              return (
                                <div key={prize.id} style={{
                                  display: "flex", alignItems: "center", gap: 10,
                                  background: C.goldSoft, borderRadius: 10,
                                  padding: "10px 12px", marginBottom: 6,
                                }}>
                                  <span style={{ fontSize: 22 }}>{emoji}</span>
                                  <span style={{
                                    flex: 1, fontSize: 13, fontWeight: 700, color: C.ink,
                                  }}>
                                    {prize.name}
                                  </span>
                                </div>
                              );
                            })
                        )}
                      </div>

                      {/* 내 당첨 내역 */}
                      {myWins.length > 0 && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                            🎊 내 당첨 내역
                          </div>
                          {[...myWins].reverse().slice(0, 20).map(w => (
                            <div key={w.id} style={{
                              background: C.card, borderRadius: 10, padding: "10px 14px",
                              marginBottom: 6, border: `1px solid ${C.line}`,
                              display: "flex", alignItems: "center", gap: 10,
                              opacity: w.name?.includes("꽝") || w.prizeName?.includes("꽝") ? 0.5 : 1,
                            }}>
                              <span style={{ fontSize: 18 }}>
                                {w.prizeName.includes("꽝") ? "😢" : "🎉"}
                              </span>
                              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.ink }}>
                                {w.prizeName}
                              </div>
                              <span style={{ fontSize: 10, color: C.muted }}>
                                {w.date.slice(5)} {w.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* 대표 모드: 상품 설정 */}
                  {isJangnim && (
                    <>
                      <div className="card" style={{
                        background: C.card, borderRadius: 16, padding: 16,
                        marginBottom: 16, border: `1px solid ${C.line}`,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>
                          🎁 럭키박스 상품 설정
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>
                          당첨 확률은 가중치로 조절돼요 (높을수록 자주 나옴)
                        </div>

                        {/* 상품 목록 */}
                        {luckyPrizes.map(prize => {
                          const totalW = luckyPrizes.reduce((s, p) => s + (p.weight || 1), 0);
                          const pctNum = (prize.weight || 1) / totalW * 100;
                          // 소수점 표시: 1% 이상은 1자리, 미만은 2자리
                          const pct = pctNum >= 1 ? pctNum.toFixed(1) : pctNum.toFixed(2);
                          return (
                            <div key={prize.id} style={{
                              background: C.bg, borderRadius: 10, padding: "10px 12px",
                              marginBottom: 6, border: `1px solid ${C.line}`,
                              display: "flex", alignItems: "center", gap: 8,
                            }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                                  {prize.name}
                                </div>
                                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                                  확률 약 {pct}% (가중치 {prize.weight})
                                </div>
                              </div>
                              <button onClick={() => {
                                if (window.confirm(`"${prize.name}" 삭제할까요?`)) {
                                  setLuckyPrizes(p => p.filter(x => x.id !== prize.id));
                                }
                              }} style={{
                                background: "none", color: C.muted,
                                border: "none", fontSize: 16, cursor: "pointer",
                              }}>×</button>
                            </div>
                          );
                        })}

                        {/* 상품 추가 */}
                        <div style={{
                          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}`,
                        }}>
                          <input
                            placeholder="상품 이름 (예: 스타벅스 기프티콘)"
                            value={prizeDraft.name}
                            onChange={e => setPrizeDraft(p => ({ ...p, name: e.target.value }))}
                            style={{
                              width: "100%", border: `1px solid ${C.line}`, borderRadius: 10,
                              padding: "9px 12px", fontSize: 12, background: C.bg,
                              outline: "none", color: C.ink, marginBottom: 8,
                            }}
                          />
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: C.muted }}>가중치</span>
                            <input
                              type="number" min="1" max="100000"
                              value={prizeDraft.weight}
                              onChange={e => setPrizeDraft(p => ({ ...p, weight: Number(e.target.value) }))}
                              style={{
                                width: 90, border: `1px solid ${C.line}`, borderRadius: 8,
                                padding: "6px 10px", fontSize: 12, background: C.bg,
                                outline: "none", color: C.ink,
                              }}
                            />
                            <span style={{ fontSize: 10, color: C.muted }}>클수록 자주 당첨</span>
                          </div>
                          <button onClick={() => {
                            if (!prizeDraft.name.trim()) {
                              showToast("상품 이름을 입력해주세요", "err");
                              return;
                            }
                            setLuckyPrizes(p => [...p, {
                              id: Date.now(),
                              name: prizeDraft.name.trim(),
                              weight: prizeDraft.weight || 20,
                            }]);
                            setPrizeDraft({ name: "", weight: 20 });
                            showToast("상품이 추가됐어요 🎁");
                          }} style={{
                            width: "100%", background: C.gold, color: "#fff",
                            border: "none", borderRadius: 10, padding: "10px",
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                          }}>
                            + 상품 추가
                          </button>
                        </div>
                      </div>

                      {/* 팀 보유 현황 */}
                      <div className="card" style={{
                        background: C.card, borderRadius: 16, padding: 16,
                        marginBottom: 16, border: `1px solid ${C.line}`,
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
                          🎟️ 팀 보유 럭키박스
                        </div>
                        {ALL_MEMBERS.filter(m => m.canHelp).map(m => (
                          <div key={m.id} style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "8px 0", borderBottom: `1px solid ${C.line}`,
                          }}>
                            <span style={{ fontSize: 18 }}>{m.avatar}</span>
                            <span style={{ flex: 1, fontSize: 13, color: C.ink, fontWeight: 600 }}>
                              {m.name}
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>
                              {luckyTickets[m.id] || 0}개
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 전체 당첨 내역 */}
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                        🎊 전체 당첨 내역 (정산용)
                      </div>
                      {luckyWins.filter(w => !w.prizeName.includes("꽝")).length === 0 ? (
                        <div className="card" style={{
                          background: C.warm, borderRadius: 12, padding: 16,
                          textAlign: "center", color: C.muted, fontSize: 12,
                        }}>
                          아직 당첨 내역이 없어요
                        </div>
                      ) : (
                        [...luckyWins].reverse()
                          .filter(w => !w.prizeName.includes("꽝"))
                          .slice(0, 50).map(w => {
                          const winner = members.find(m => m.id === w.memberId);
                          return (
                            <div key={w.id} style={{
                              background: C.card, borderRadius: 10, padding: "10px 14px",
                              marginBottom: 6, border: `1px solid ${C.line}`,
                              display: "flex", alignItems: "center", gap: 8,
                            }}>
                              <span style={{ fontSize: 16 }}>{winner?.avatar}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>
                                {winner?.name}
                              </span>
                              <span style={{ flex: 1, fontSize: 12, color: C.gold, fontWeight: 600 }}>
                                🎁 {w.prizeName}
                              </span>
                              <span style={{ fontSize: 10, color: C.muted }}>
                                {w.date.slice(5)}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ 일일 체크 탭 ══ */}
        <div>
            {/* ─── 일일 체크 (리뷰 답글 + 인스타) ─── */}
            {tab === "daily" && (() => {
              const today = new Date();
              const todayKey = today.toLocaleDateString("ko-KR");
              const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

              // 내가 오늘 리뷰 답글 했나?
              const myReviewDone = (reviewDone[todayKey] || []).includes(myId);

              // 이번 주 월요일 구하기
              const _now = new Date();
              const _day = _now.getDay(); // 0=일
              const _diff = _day === 0 ? 6 : _day - 1;
              const weekMonday = new Date(_now);
              weekMonday.setDate(_now.getDate() - _diff);
              weekMonday.setHours(0, 0, 0, 0);

              // 이번 주 내 인스타 업로드 횟수
              const myInstaCount = instaUploads.filter(u =>
                u.memberId === myId && new Date(u.date) >= weekMonday
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
                      인스타 업로드(주 2회)를 체크해 주세요
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
                        const gotR = giveLuckyTicket(`${myId}-${todayKey}-review`, 1, "오늘 리뷰 완료");
                        if (!gotR) showToast("리뷰 답글 완료! 💛");
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

                  {/* 📸 인스타 업로드 (주 2회) - 대표 제외 */}
                  {!isJangnim && <div className="card" style={{
                    background: C.card, borderRadius: 16, padding: "16px 18px",
                    marginBottom: 14, border: `1.5px solid ${myInstaCount >= 2 ? C.sage : C.line}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: myInstaCount >= 2 ? C.sageSoft : C.warm,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                      }}>📸</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
                          내 인스타 업로드 (이번 주)
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                          개인 인스타에 주 2회 이상
                        </div>
                      </div>
                      <div style={{
                        background: myInstaCount >= 2 ? C.sage : C.gold,
                        color: "#fff",
                        borderRadius: 12, padding: "4px 12px",
                        fontSize: 13, fontWeight: 700,
                      }}>
                        {myInstaCount}/2
                      </div>
                    </div>

                    {/* 진행률 바 */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ height: 8, background: C.line, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.min(myInstaCount / 2 * 100, 100)}%`,
                          background: myInstaCount >= 2 ? C.sage : C.gold,
                          transition: "width .4s ease",
                        }} />
                      </div>
                    </div>

                    <button onClick={() => {
                      const nowDate = new Date();
                      // 이번 주 시작 (월요일 기준)
                      const day = nowDate.getDay(); // 0=일
                      const diff = day === 0 ? 6 : day - 1;
                      const monday = new Date(nowDate);
                      monday.setDate(nowDate.getDate() - diff);
                      monday.setHours(0, 0, 0, 0);
                      const weekKey = monday.toISOString().slice(0, 10);

                      // 이번 주 내 업로드 수 (이번 추가 전)
                      const weekCount = instaUploads.filter(u =>
                        u.memberId === myId && new Date(u.date) >= monday
                      ).length;

                      setInstaUploads(p => [...p, {
                        id: Date.now(),
                        memberId: myId,
                        date: today.toISOString().slice(0, 10),
                        time: today.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                      }]);

                      // 이번 추가로 주간 2개 달성하면 럭키박스 3개
                      if (weekCount + 1 === 2) {
                        giveLuckyTicket(`${myId}-${weekKey}-insta2`, 3, "이번 주 인스타 2개 달성");
                      } else {
                        showToast(`📸 ${myInstaCount + 1}번째 업로드 완료!`);
                      }
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
                      💡 일주일에 2번씩 꾸준히 올려봐요
                    </div>

                    {/* 이번 주 업로드 내역 */}
                    {myInstaCount > 0 && (
                      <div style={{
                        marginTop: 12, padding: 10,
                        background: C.bg, borderRadius: 10,
                      }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, fontWeight: 600 }}>
                          이번 주 업로드 ({myInstaCount}회)
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
                      u.memberId === m.id && new Date(u.date) >= weekMonday
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
                            background: memberInstaCount >= 2 ? C.sageSoft : C.warm,
                            fontSize: 11, color: memberInstaCount >= 2 ? C.sageDeep : C.muted,
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            <span>📸</span>
                            <span style={{ fontWeight: 600 }}>
                              인스타: {memberInstaCount}/2
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
        </div>


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
                시술 서브 요청은 <b style={{ color: C.sageDeep }}>민경·지유·해수·지원</b>님께 부탁해요 🙏<br/>
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
