import React, { useState, useMemo } from 'react';
import { Search, CheckCircle, AlertTriangle, Info, FileText, Copy, RefreshCw, BookOpen, ChevronRight, CheckSquare, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const lovablePrompt = `광주 서구청 공무원을 위한 "예산 판단 지원 앱"을 만들어줘.

목적:
지방자치단체 예산 실무에서 공무원이 자주 헷갈리는 ① 세출과목 결정, ② 예산 전용·변경처리, ③ 성립전 예산 편성 가능 여부를 쉽고 빠르게 판단할 수 있도록 돕는 내부용 업무지원 앱을 만드는 것이 목적이다.
특히 광주 서구청 공무원이 실제 사업을 추진하면서 “이걸 어느 목에 편성해야 하지?”, “이건 전용인가 변경사용인가?”, “성립전으로 가능한가?”를 바로 체크할 수 있는 구조여야 한다.

앱 컨셉:
- 대상: 광주 서구청 공무원
- 톤: 깔끔하고 신뢰감 있는 공공행정형 UI
- 스타일: 직관적, 실무형, 카드형 체크리스트 중심
- 분위기: 복잡한 예산 규정을 쉽게 풀어주는 내부 업무 도우미
- 색감: 네이비, 화이트, 슬레이트 중심의 단정한 행정형 디자인

필수 화면 구성:
1. 상단 헤더
- 제목: 광주 서구청 예산 판단 지원 앱
- 부제: 세출과목, 예산 전용·변경, 성립전 예산을 단계별로 점검하는 실무 도우미
- 우측 요약 박스: “사업계획 사전점검 / 예산부서 협의 전 판단정리 / 결재문안 작성 지원”

2. 메인 탭 5개
- 예산 과목 검색 (키워드 기반)
- 세출과목 결정 도우미
- 예산 전용·변경 도우미
- 성립전 예산 편성 도우미
- 러버블 제출용 프롬프트

3. 각 탭 공통 구조
- 좌측: 체크리스트 질문 카드
- 우측: 실시간 추천 방향 / 체크포인트 / 예산업무 활용법 / 실무사례 예시
- 질문마다 “도움말 보기” 버튼을 두고 클릭하면 실무 설명이 열리게 해줘.

세부 기능 요구:
A. 세출과목 결정 도우미
- 이번 지출의 가장 가까운 성격은 무엇인가요? (인건비/일반운영비/행사운영비/자산취득/시설공사·대규모 수선/판단어려움)
- 구입 대상이 소모성인가요, 자산성인가요?
- 평상시 행정운영인가요, 행사 개최를 위한 것인가요?
- 유지보수라면 소규모 수선인가요, 장기간 관리용역인가요, 내용연수 증가형 대규모 수선인가요?

B. 예산 전용·변경 도우미
- 변경하려는 범위가 정책사업 간 / 같은 정책사업 내 단위사업 간 / 같은 단위사업 내 세부사업 간 / 같은 세부사업 내 목·통계목 간 중 어디인지
- 인건비, 시설비, 차입금상환, 업무추진비 등 전용 제한 과목인지 확인

C. 성립전 예산 편성 도우미
- 재원 성격은 국비/시비/기타 외부재원/순수 구비/혼합재원 중 무엇인지
- 소요 전액이 실제로 교부되었는지, 일부 교부인지, 교부결정만 통보인지 (실제 자금 교부 여부 강조)

디자인 요구:
- React 단일 파일로 작성
- Tailwind 기반
- 카드 UI, 라운드 크게, 그림자 은은하게
- 모바일/데스크탑 반응형
- 너무 화려하지 않고 행정업무용 대시보드처럼 정갈하게
- 체크 결과가 오른쪽에 요약되어 보여야 함
- “도움말 보기” 버튼, “이 섹션 초기화” 버튼, “프롬프트 복사” 버튼 포함`;

const searchData = [
  {
    keyword: "현수막",
    tags: ["인쇄물", "홍보", "행사"],
    results: [
      { subject: "사무관리비 (201-01)", desc: "일반적인 기관 안내 및 홍보용 현수막 제작" },
      { subject: "행사운영비 (201-03)", desc: "특정 행사 개최를 위해 직접 소요되는 현수막 제작" }
    ],
    pdfRef: "[지방자치단체 예산편성 운영기준] 일반운영비 > 사무관리비 / 행사운영비"
  },
  {
    keyword: "수선비",
    tags: ["수리", "유지보수", "공사", "보수"],
    results: [
      { subject: "사무관리비 (201-01)", desc: "기계·기구·집기 및 기타 공작물의 소규모 수선비" },
      { subject: "시설장비유지비 (201-02)", desc: "건물, 기계장비 등 시설물의 일반적인 유지관리 및 수리비" },
      { subject: "시설비 (401-01)", desc: "내용연수를 현저히 증가시키는 대규모 수선비" }
    ],
    pdfRef: "내용연수를 현저히 증가시키는 대규모의 수선비는 401-01(시설비)에 계상"
  },
  {
    keyword: "강사료",
    tags: ["교육", "수당", "행사", "초빙"],
    results: [
      { subject: "사무관리비 (201-01)", desc: "공무원 교육, 자체 교육에 초빙한 외래강사료" },
      { subject: "행사운영비 (201-03)", desc: "행사 지원을 위해 초빙한 강사료" }
    ],
    pdfRef: "일반운영비 > 사무관리비 (운영수당) / 행사운영비"
  },
  {
    keyword: "임차료",
    tags: ["대여", "렌탈", "행사", "빌림"],
    results: [
      { subject: "사무관리비 (201-01)", desc: "토지, 건물, 시설, 장비, 물품, 차량 등의 일반적인 임차료" },
      { subject: "행사운영비 (201-03)", desc: "행사 개최를 위한 시설·장비·물품의 임차료" }
    ],
    pdfRef: "일반운영비 > 사무관리비 (임차료) / 행사운영비"
  },
  {
    keyword: "급식비",
    tags: ["식비", "매식비", "특근", "야근", "간식"],
    results: [
      { subject: "사무관리비 (201-01)", desc: "기본업무 수행을 위한 특근급식비, 현안 업무추진 특근매식비, 야간근무자 급식비" },
      { subject: "행사실비 지원금 (301-11)", desc: "교육·세미나·공청회 등에 참석하는 민간인에게 지급하는 급식비(실비)" }
    ],
    pdfRef: "일반운영비 > 사무관리비 (급식비) / 일반보전금 > 행사실비 지원금"
  },
  {
    keyword: "컴퓨터",
    tags: ["PC", "노트북", "모니터", "자산", "비품"],
    results: [
      { subject: "자산취득비 (405-01)", desc: "신규 구입. 단, 내구연한이 경과되지 않은 물품의 단순 신형 교체는 금지됨" }
    ],
    pdfRef: "자산취득비 (405-01) - 내구연한이 경과되지 않은 물품의 교체 금지"
  },
  {
    keyword: "소프트웨어",
    tags: ["SW", "프로그램", "전산", "라이선스"],
    results: [
      { subject: "사무관리비 (201-01)", desc: "범용 S/W 구입비" },
      { subject: "전산개발비 (207-02)", desc: "정보화시스템 구축·운영을 위한 S/W 개발비" }
    ],
    pdfRef: "일반운영비 > 사무관리비 / 연구개발비 > 전산개발비"
  },
  {
    keyword: "보험료",
    tags: ["차량보험", "화재보험", "공제"],
    results: [
      { subject: "공공운영비 (201-02)", desc: "건물 화재보험료, 차량보험료, 배상공제료 등" }
    ],
    pdfRef: "일반운영비 > 공공운영비 (공공요금 및 제세)"
  },
  {
    keyword: "여비",
    tags: ["출장", "교통비", "숙박비"],
    results: [
      { subject: "국내여비 (202-01)", desc: "기본업무수행을 위한 관할구역내 출장여비, 공무원 국내출장여비" },
      { subject: "월액여비 (202-02)", desc: "상시출장을 요하는 공무원 및 공무직에 대하여 월정액 지급" }
    ],
    pdfRef: "여비 (202) - 공무원 여비 규정에 의함"
  }
];

const sections = [
  {
    id: "appropriation",
    title: "세출과목 결정 도우미",
    subtitle: "이 지출을 어느 목에 편성할지 단계별로 점검합니다.",
    color: "from-blue-600 to-cyan-600",
    icon: BookOpen,
    purpose: "사업 담당자가 물품구입, 운영비, 행사비, 시설비, 자산취득비 등을 구분할 때 실무 판단을 돕는 화면입니다.",
    tips: [
      "사업계획서를 작성하기 전, 지출 항목을 하나씩 이 화면에 대입해보면 예산서 작성 오류를 줄일 수 있습니다.",
      "품의 전 단계에서 체크하면 예산부서와의 사전 협의가 빨라집니다.",
      "최종 편성 전에는 반드시 내부 예산부서 기준과 최신 운영기준을 함께 확인하세요."
    ],
    cases: [
      {
        title: "주민설명회 홍보물과 음향 임차",
        body: "주민설명회용 현수막, 책자, 음향장비 임차를 함께 집행하려는 경우, 행사 자체 운영 목적이면 행사운영비(201-03) 성격을 우선 검토합니다. 다만 평상시 홍보물 제작과 섞여 있다면 항목을 분리해 보는 것이 안전합니다."
      },
      {
        title: "컴퓨터·모니터 구입",
        body: "부서 업무용 컴퓨터와 모니터를 신규 구입하는 경우, 장기간 사용하는 자산성 물품인지 먼저 보고 자산취득비(405-01) 성격을 우선 검토합니다. 내구연한이 지나지 않은 물품의 단순 교체는 금지됩니다."
      },
      {
        title: "청사 내 소규모 수선과 대규모 교체",
        body: "단순 보수인지, 내용연수를 늘리는 대규모 교체인지에 따라 사무관리비(201-01)와 시설비(401-01) 판단이 달라집니다. ‘수선’이라는 표현만 보고 같은 과목으로 처리하면 오류가 생기기 쉽습니다."
      }
    ],
    questions: [
      {
        id: "a1",
        type: "choice",
        label: "이번 지출의 가장 주된 성격은 무엇인가요?",
        options: ["인건비성 (보수, 수당)", "소모성 물품 및 일반운영", "행사 개최 및 지원", "자산 취득 (비품, 장비)", "시설 공사 및 대규모 수선", "연구 용역 및 전산 개발"],
        help: "첫 분류가 가장 중요합니다. 사람에게 지급하는지, 운영을 위한 소모성 경비인지, 자산을 새로 사는지, 공사인지부터 나누면 대부분 방향이 잡힙니다."
      },
      {
        id: "a2",
        type: "choice",
        label: "물품 구입인 경우, 자산성인가요 소모성인가요?",
        options: ["소모성 물품 (1년 미만 사용, 소액)", "자산성 물품 (1년 이상 사용, 비품)", "해당 없음 (물품 구입 아님)"],
        help: "프린터 토너, 용지, 소액 소모품은 보통 소모성(사무관리비)으로 접근하고, 장기간 사용하는 컴퓨터·비품·장비는 자산성(자산취득비) 여부를 먼저 검토합니다."
      },
      {
        id: "a3",
        type: "choice",
        label: "수선/유지보수인 경우, 규모가 어떠한가요?",
        options: ["현상 유지를 위한 소규모 수선", "일반적인 시설/장비 유지관리", "내용연수를 현저히 증가시키는 대규모 수선", "해당 없음"],
        help: "작은 수선은 사무관리비, 일반적인 유지관리는 시설장비유지비, 내용연수를 늘리거나 규모가 큰 수선은 시설비(401-01) 검토가 필요합니다."
      },
      {
        id: "a4",
        type: "choice",
        label: "사람에게 지급하는 수당/강사료인가요?",
        options: ["공무원/자체교육 초빙 강사료", "행사 지원을 위한 강사료", "위원회 참석수당 / 심사수당", "해당 없음"],
        help: "자체 교육 강사료나 위원회 수당은 사무관리비(운영수당)에 해당하며, 행사 지원 강사료는 행사운영비에 해당합니다."
      }
    ]
  },
  {
    id: "transfer",
    title: "예산 전용·변경 도우미",
    subtitle: "이 사안이 이용, 전용, 변경사용, 이체, 추경 중 무엇인지 점검합니다.",
    color: "from-violet-600 to-fuchsia-600",
    icon: RefreshCw,
    purpose: "사업 추진 중 당초 계획과 달라져 예산을 옮겨 써야 할 때, 어떤 절차로 접근해야 하는지 확인하는 화면입니다.",
    tips: [
      "집행부서에서 먼저 구조를 잘못 잡으면 예산부서와 여러 번 왕복하게 됩니다.",
      "‘같은 정책사업인지, 같은 단위사업인지, 같은 세부사업인지’만 정확히 따져도 판단 속도가 크게 빨라집니다.",
      "신규사업처럼 보이면 단순 전용이 아니라 추경 검토가 더 적절할 수 있습니다."
    ],
    cases: [
      {
        title: "낙찰차액 활용",
        body: "같은 사업 안에서 집행잔액이나 낙찰차액을 다른 세부 항목에 쓰고 싶을 때는, 세부사업 구조와 목 변경 여부를 먼저 확인해야 합니다. 겉보기엔 단순 조정 같아도 변경사용이 안 되는 경우가 있습니다."
      },
      {
        title: "조직개편으로 업무 이관",
        body: "기존 부서의 업무가 다른 과로 넘어가면서 예산 소관도 함께 이동해야 한다면, 사업내용 변경보다 '이체' 여부를 먼저 검토하는 것이 일반적입니다."
      },
      {
        title: "전용 제한 과목 주의",
        body: "인건비, 시설비 및 부대비, 차입금상환, 업무추진비는 다른 편성목으로 전용할 수 없습니다. (단, 기준인건비 범위 내 편성목간 상호 전용 등 일부 예외 있음)"
      }
    ],
    questions: [
      {
        id: "b1",
        type: "choice",
        label: "변경하려는 예산의 범위는 어디인가요?",
        options: ["정책사업 간", "같은 정책사업 내 단위사업 간", "같은 단위사업 내 세부사업 간", "같은 세부사업 내 편성목(통계목) 간", "구조를 잘 모르겠음"],
        help: "이 질문이 핵심입니다. 정책사업 간은 '이용', 단위사업 간은 '전용', 세부사업 간 또는 편성목 간은 '변경사용'의 대상이 됩니다."
      },
      {
        id: "b2",
        type: "choice",
        label: "전용/변경하려는 대상 예산(줄어드는 예산)이 다음 중 하나에 해당하나요?",
        options: ["인건비", "시설비 및 부대비 (401)", "업무추진비", "해당 없음"],
        help: "[지방재정법 및 운영기준] 인건비, 시설비 및 부대비, 차입금상환, 업무추진비는 다른 편성목으로 전용할 수 없습니다."
      },
      {
        id: "b3",
        type: "choice",
        label: "조직개편이나 부서 신설/폐지로 인한 예산 이관인가요?",
        options: ["예 (조직개편)", "아니오 (사업내용 변경)"],
        help: "조직개편으로 부서 소관만 달라진 경우는 사업 내용 변경과 달리 ‘이체’ 검토가 먼저입니다."
      },
      {
        id: "b4",
        type: "choice",
        label: "의회가 의결한 당초 사업 취지와 완전히 다른 신규 사업을 추진하려는 것인가요?",
        options: ["예 (신규 사업 성격)", "아니오 (기존 사업의 연장/조정)"],
        help: "처음 의회가 의결한 취지와 달라지면 단순 목 조정보다 추경 또는 별도 절차 검토가 필요할 수 있습니다."
      }
    ]
  },
  {
    id: "prebudget",
    title: "성립전 예산 편성 도우미",
    subtitle: "성립전 사용이 가능한지 요건 중심으로 확인합니다.",
    color: "from-emerald-600 to-teal-600",
    icon: CheckSquare,
    purpose: "갑자기 내려온 외부재원이나 재난 관련 경비를 추경 전에 사용할 수 있는지 판단하는 화면입니다.",
    tips: [
      "현장에서는 ‘급하니 성립전’으로 오해하기 쉽지만, 실제로는 법정 요건을 확인해야 합니다.",
      "특히 교부결정 통보와 실제 교부 완료를 구분해서 보도록 안내하면 실수가 줄어듭니다.",
      "성립전 사용이 가능해도 차기 추경 반영 계획까지 함께 관리해야 합니다."
    ],
    cases: [
      {
        title: "시비 보조사업 교부결정만 도착",
        body: "시비 보조사업 공문은 내려왔지만 실제 자금은 아직 송금되지 않은 경우, 단순히 ‘결정 통보가 왔다’는 이유만으로 성립전 판단을 서두르지 않도록 주의해야 합니다. 자금 교부가 완료되어야 원칙적으로 가능합니다."
      },
      {
        title: "재난 관련 복구비 집행",
        body: "재난 대응 예산이라면 일반 사업보다 별도 요건 검토가 중요합니다. 복구계획 확정·통보 문서가 있는지 함께 확인해야 합니다."
      },
      {
        title: "순수 구비 긴급사업",
        body: "급한 사업이라도 순수 구비라면 성립전 예산 편성이 불가합니다. 추경, 전용, 변경사용, 예비비 등 다른 처리경로를 먼저 검토해야 합니다."
      }
    ],
    questions: [
      {
        id: "c1",
        type: "choice",
        label: "재원 성격은 무엇인가요?",
        options: ["국비", "시비", "기타 외부재원", "순수 구비", "혼합재원"],
        help: "성립전 검토는 외부재원(국·시비 등) 여부가 핵심 출발점입니다. 순수 구비 사업이면 성립전 편성이 불가하며 다른 경로를 찾아야 합니다."
      },
      {
        id: "c2",
        type: "choice",
        label: "자금의 교부 상태는 어떠한가요?",
        options: ["전액 자금 교부 완료", "일부 자금만 교부됨", "교부결정 공문만 접수 (자금 미교부)", "확인 중"],
        help: "실무에서 가장 많이 헷갈리는 부분입니다. ‘결정 통보’와 ‘실제 자금 교부’는 다릅니다. 실제 자금이 교부되어야 성립전 사용이 가능합니다."
      },
      {
        id: "c3",
        type: "choice",
        label: "해당 예산의 용도가 명확히 지정되어 있나요?",
        options: ["예 (용도 지정됨)", "아니오 (포괄적 지원)"],
        help: "단순 지원금이 아니라 어떤 용도로 써야 하는지 문서상 지정이 되어 있어야 성립전 편성이 가능합니다."
      },
      {
        id: "c4",
        type: "choice",
        label: "이번 건은 재난구호·복구 관련인가요?",
        options: ["예", "아니오"],
        help: "재난 관련이면 별도 법정 요건과 복구계획 확정·통보 여부가 중요해집니다."
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [openHelp, setOpenHelp] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const activeSection = sections.find((s) => s.id === activeTab);

  const setAnswer = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const toggleHelp = (qid: string) => {
    setOpenHelp((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(lovablePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const resetSection = () => {
    if (!activeSection) return;
    const ids = activeSection.questions.map((q) => q.id);
    setAnswers((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });
    setOpenHelp((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });
  };

  const filteredSearchData = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return searchData.filter(
      (item) =>
        item.keyword.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.results.some((res) => res.subject.toLowerCase().includes(query) || res.desc.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const result = useMemo(() => {
    const get = (id: string) => answers[id] as string;

    if (activeTab === "appropriation") {
      const primary = get("a1");
      const asset = get("a2");
      const maintenance = get("a3");
      const person = get("a4");

      let recommendation = "질문에 답변하여 후보 과목을 좁혀보세요.";
      let caution = "최종 과목 확정 전에는 예산부서와 예산서 편제 구조를 다시 확인하세요.";
      const highlights: string[] = [];

      if (primary === "행사 개최 및 지원") {
        recommendation = "우선 후보: 행사운영비 (201-03)";
        caution = "행사 자체 운영비와 민간참가자 실비지원, 포상금, 민간보조금은 구분해서 편성해야 합니다.";
        highlights.push("행사 목적의 임차료, 홍보물은 행사운영비로 편성");
      } else if (primary === "자산 취득 (비품, 장비)" || asset === "자산성 물품 (1년 이상 사용, 비품)") {
        recommendation = "우선 후보: 자산취득비 (405-01)";
        caution = "내구연한이 경과되지 않은 물품의 단순 신형 교체는 원칙적으로 금지됩니다.";
        highlights.push("정수물품 배정 여부 사전 확인 필요");
      } else if (primary === "시설 공사 및 대규모 수선" || maintenance === "내용연수를 현저히 증가시키는 대규모 수선") {
        recommendation = "우선 후보: 시설비 및 부대비 (401-01)";
        caution = "소규모 수선인지, 내용연수 증가형 대규모 수선인지 경계가 가장 자주 문제됩니다.";
        highlights.push("단순 현상유지 수선은 사무관리비 또는 시설장비유지비로 편성");
      } else if (primary === "인건비성 (보수, 수당)") {
        recommendation = "우선 후보: 인건비 (101) 또는 사무관리비 (201-01 운영수당)";
        caution = "고용 관계가 있는 인건비와, 단순 초빙에 의한 수당(사무관리비)을 명확히 구분하세요.";
        if (person === "공무원/자체교육 초빙 강사료" || person === "위원회 참석수당 / 심사수당") {
          recommendation = "우선 후보: 사무관리비 (201-01 운영수당)";
        } else if (person === "행사 지원을 위한 강사료") {
          recommendation = "우선 후보: 행사운영비 (201-03)";
        }
      } else if (primary === "소모성 물품 및 일반운영" || asset === "소모성 물품 (1년 미만 사용, 소액)") {
        recommendation = "우선 후보: 사무관리비 (201-01) 또는 공공운영비 (201-02)";
        caution = "사무관리비, 공공운영비, 임차료, 관리용역비, 시설장비유지비를 세부적으로 다시 나눠보세요.";
      }

      if (maintenance === "현상 유지를 위한 소규모 수선") {
        recommendation = "우선 후보: 사무관리비 (201-01)";
      } else if (maintenance === "일반적인 시설/장비 유지관리") {
        recommendation = "우선 후보: 시설장비유지비 (201-02)";
      }

      return { recommendation, caution, highlights };
    }

    if (activeTab === "transfer") {
      const scope = get("b1");
      const restricted = get("b2");
      const org = get("b3");
      const newBiz = get("b4");

      let recommendation = "변경 유형을 검토 중입니다.";
      let caution = "의회 의결 취지와 사업 구조를 먼저 확인하세요.";
      const highlights: string[] = [];

      if (org === "예 (조직개편)") {
        recommendation = "우선 후보: 이체 검토";
        caution = "조직개편·소관 변경이면 사업변경이 아니라 예산 주체 이동인지 먼저 판단하세요.";
        highlights.push("지방의회 승인 불필요 (조직개편 조례 통과 전제)");
      } else if (restricted && restricted !== "해당 없음") {
        recommendation = "전용 불가 항목입니다.";
        caution = "인건비, 시설비, 업무추진비 등은 원칙적으로 다른 편성목으로 전용할 수 없습니다.";
        highlights.push("예외 규정(기준인건비 내 상호 전용 등) 해당 여부 예산팀 확인 요망");
      } else if (scope === "정책사업 간") {
        recommendation = "우선 후보: 이용 또는 추경 검토";
        caution = "정책사업 간 이동은 지방의회의 승인(이용)을 얻어야 합니다.";
        highlights.push("사전 의회 승인 절차 필요");
      } else if (scope === "같은 정책사업 내 단위사업 간") {
        recommendation = "우선 후보: 전용 검토";
        caution = "전용 제한 과목 여부와 기존 전용 이력을 함께 확인하세요.";
        highlights.push("지방자치단체장 승인 사항");
      } else if (scope === "같은 단위사업 내 세부사업 간" || scope === "같은 세부사업 내 편성목(통계목) 간") {
        recommendation = "우선 후보: 변경사용 검토";
        caution = "세부사업 구조가 실제로 있는지, 목그룹 변경이 수반되는지 꼭 다시 보세요.";
        highlights.push("실·국장 책임 하에 상호 융통 가능");
      }

      if (newBiz === "예 (신규 사업 성격)") {
        caution = "신규사업 성격이 강하면 전용·변경사용보다 추경 편성이 원칙입니다.";
        highlights.push("의회 의결 취지 훼손 주의");
      }

      return { recommendation, caution, highlights };
    }

    if (activeTab === "prebudget") {
      const source = get("c1");
      const funded = get("c2");
      const designated = get("c3");
      const disaster = get("c4");

      let recommendation = "성립전 요건을 검토 중입니다.";
      let caution = "급하다는 사유만으로는 성립전 판단이 어렵습니다. 요건과 증빙을 함께 보세요.";
      const highlights: string[] = [];

      if (source === "순수 구비") {
        recommendation = "성립전 편성 불가 (다른 경로 검토)";
        caution = "순수 구비 사업은 성립전 예산 편성이 불가합니다. 추경, 전용, 예비비 등을 검토하세요.";
        highlights.push("외부재원(국/시비 등)만 성립전 가능");
      } else if (designated === "아니오 (포괄적 지원)") {
        recommendation = "성립전 편성 보류 (용도 미지정)";
        caution = "용도가 명확히 지정되지 않은 교부금은 성립전 편성이 어렵습니다.";
      } else if (funded === "교부결정 공문만 접수 (자금 미교부)") {
        recommendation = "성립전 편성 대기 (자금 미교부)";
        caution = "교부결정 통보만으로는 부족하며, 실제 자금이 교부된 후에 성립전 편성이 가능합니다.";
        highlights.push("자금 교부 확인 자료 확보 필수");
      } else if ((source === "국비" || source === "시비" || source === "기타 외부재원") && designated === "예 (용도 지정됨)" && funded === "전액 자금 교부 완료") {
        recommendation = "성립전 편성 가능성 높음";
        caution = "차기 추경 예산에 반드시 계상하여 의회의 승인을 받아야 합니다.";
        highlights.push("차기 추경 반영 계획 수립 필수");
      }

      if (disaster === "예") {
        caution += " 재난 관련이면 복구계획 확정·통보 문서도 함께 확인하세요.";
      }

      return { recommendation, caution, highlights };
    }

    return null;
  }, [activeTab, answers]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-6 md:px-12 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                Gwangju Seo-gu
              </span>
              <span className="text-slate-400 text-sm font-medium tracking-widest">BUDGET HELPER</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              광주 서구청 예산 판단 지원 앱
            </h1>
            <p className="mt-3 text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
              지방자치단체 예산 실무에서 헷갈리기 쉬운 세출과목 결정, 예산 전용·변경, 성립전 예산 편성을 
              단계별로 점검하고 관련 규정을 쉽게 찾아볼 수 있는 실무 도우미입니다.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm shrink-0">
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              실무 활용 포인트
            </h3>
            <ul className="text-sm text-slate-400 space-y-1.5">
              <li>• 사업계획 사전점검</li>
              <li>• 예산부서 협의 전 판단정리</li>
              <li>• 결재문안 작성 지원</li>
            </ul>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab("search")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all",
              activeTab === "search" ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            )}
          >
            <Search className="w-4 h-4" />
            예산 과목 검색
          </button>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all",
                  activeTab === section.id ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                )}
              >
                <Icon className="w-4 h-4" />
                {section.title}
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab("prompt")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ml-auto",
              activeTab === "prompt" ? "bg-amber-500 text-white shadow-md" : "bg-white text-amber-600 hover:bg-amber-50 border border-amber-200"
            )}
          >
            <FileText className="w-4 h-4" />
            러버블 프롬프트
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "search" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">예산 과목 키워드 검색</h2>
                <p className="text-slate-500 text-sm">
                  현수막, 강사료, 수선비 등 헷갈리는 지출 항목을 검색하여 올바른 세출과목(통계목)을 확인하세요.
                  <br />(광주 서구청 예산편성 운영기준 PDF 반영)
                </p>
              </div>
              
              <div className="relative mb-10">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="예: 현수막, 강사료, 컴퓨터, 임차료..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {searchQuery.trim() !== "" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">검색 결과</h3>
                  {filteredSearchData.length > 0 ? (
                    filteredSearchData.map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-slate-900">{item.keyword}</span>
                          <div className="flex gap-1.5">
                            {item.tags.map(tag => (
                              <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">#{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                          {item.results.map((res, rIdx) => (
                            <div key={rIdx} className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                              <div>
                                <div className="font-bold text-blue-900 text-sm">{res.subject}</div>
                                <div className="text-slate-600 text-sm mt-1">{res.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                          <BookOpen className="w-4 h-4 shrink-0 text-slate-400" />
                          <span>{item.pdfRef}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                      <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">검색 결과가 없습니다.</p>
                      <p className="text-slate-400 text-sm mt-1">다른 키워드로 검색해보세요.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "prompt" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">러버블 제출용 프롬프트</h2>
                <p className="text-slate-500 text-sm mt-2">앱 제작 요청에 바로 붙여 넣을 수 있는 프롬프트 전문입니다.</p>
              </div>
              <button
                onClick={copyPrompt}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "복사 완료!" : "프롬프트 복사"}
              </button>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto">
              <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                {lovablePrompt}
              </pre>
            </div>
          </div>
        )}

        {activeSection && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Questions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{activeSection.title}</h2>
                    <p className="text-slate-500 text-sm mt-2">{activeSection.subtitle}</p>
                  </div>
                  <button
                    onClick={resetSection}
                    className="text-slate-400 hover:text-slate-700 text-sm font-medium flex items-center gap-1 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    초기화
                  </button>
                </div>

                <div className="space-y-6">
                  {activeSection.questions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Question {idx + 1}</span>
                          <h3 className="text-base font-bold text-slate-800 leading-snug">{q.label}</h3>
                        </div>
                        <button
                          onClick={() => toggleHelp(q.id)}
                          className="shrink-0 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Info className="w-3.5 h-3.5" />
                          도움말
                        </button>
                      </div>

                      {openHelp[q.id] && (
                        <div className="mb-4 bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 leading-relaxed">
                          <strong className="block mb-1 text-blue-700">💡 실무 팁</strong>
                          {q.help}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((option) => {
                          const isSelected = answers[q.id] === option;
                          return (
                            <button
                              key={option}
                              onClick={() => setAnswer(q.id, option)}
                              className={cn(
                                "text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                                isSelected
                                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Results & Tips */}
            <div className="lg:col-span-5 space-y-6">
              {/* Result Card */}
              <div className="bg-slate-900 rounded-3xl shadow-lg p-6 md:p-8 text-white relative overflow-hidden">
                <div className={cn("absolute top-0 left-0 w-full h-2 bg-gradient-to-r", activeSection.color)} />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">실시간 판단 요약</h3>
                
                <div className="mb-6">
                  <div className="text-xl font-bold mb-2 flex items-start gap-2">
                    <ChevronRight className="w-6 h-6 text-blue-400 shrink-0" />
                    <span>{result?.recommendation || "답변을 입력해주세요."}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed pl-8">
                    {result?.caution}
                  </p>
                </div>

                {result?.highlights && result.highlights.length > 0 && (
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                    <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      체크 포인트
                    </h4>
                    <ul className="space-y-2">
                      {result.highlights.map((hl, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  예산 업무 활용법
                </h3>
                <ul className="space-y-3">
                  {activeSection.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-slate-600 leading-relaxed flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cases Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400" />
                  광주 서구청 실무사례
                </h3>
                <div className="space-y-4">
                  {activeSection.cases.map((c, i) => (
                    <div key={i} className="border-l-2 border-blue-500 pl-4 py-1">
                      <h4 className="text-sm font-bold text-slate-800 mb-1">{c.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{c.body}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
