// 1. 다양해진 감정 태그별 콘텐츠 데이터베이스
const contentDB = [
    // [spark] 열정/자극
    { id: 1, title: "위플래쉬", type: "영화", tags: ["spark"], desc: "천재를 갈망하는 학생과 폭군 교수의 광기 어린 대립.", action: "미뤄둔 공부나 작업 25분 집중해서 시작하기" },
    { id: 2, title: "포드 V 페라리", type: "영화", tags: ["spark"], desc: "지루할 틈 없는 두 남자의 뜨거운 서킷 레이싱 도전기.", action: "가벼운 스트레칭이나 스쿼트 20회 하기" },
    { id: 3, title: "미생", type: "드라마", tags: ["spark"], desc: "냉혹한 현실 속에서 고군분투하는 직장인들의 이야기.", action: "내일 해야 할 핵심 업무 리스트 3가지 메모하기" },
    
    // [comfort] 위로/힐링
    { id: 4, title: "리틀 포레스트", type: "영화", tags: ["comfort"], desc: "잠시 일상을 멈추고 고향으로 돌아온 주인공의 사계절.", action: "냉장고 재료를 활용해 따뜻한 요리 직접 해 먹기" },
    { id: 5, title: "어바웃 타임", type: "영화", tags: ["comfort"], desc: "시간 여행을 통해 깨닫는 평범한 하루의 위대함.", action: "소중한 사람에게 안부 문자 한 통 보내기" },
    
    // [laugh] 유쾌/오락
    { id: 6, title: "극한직업", type: "영화", tags: ["laugh"], desc: "낮에는 치킨장사, 밤에는 잠복근무! 마약반의 위장창업.", action: "크게 한 번 웃고 주변 책상이나 방 정리 정돈하기" },
    { id: 7, title: "지구오락실", type: "예능", tags: ["laugh"], desc: "언제 어디서 터질지 모르는 신개념 하이브리드 예능.", action: "신나는 음악 플레이리스트 하나 찾아 저장하기" },

    // [tear] 카타르시스/눈물 
    { id: 8, title: "7번방의 선물", type: "영화", tags: ["tear"], desc: "최악의 상황 속에서 피어나는 가장 따뜻한 부성애 이야기.", action: "미뤄뒀던 감정 표현을 일기장에 솔직하게 털어내기" },
    { id: 9, title: "세상에서 가장 아름다운 이별", type: "드라마", tags: ["tear"], desc: "가족을 위해 헌신해 온 어머니와의 갑작스러운 이별 과정.", action: "부모님께 전화 걸어 사랑한다고 한 마디 건네기" },

    // [calm] 마음 진정/몰입 
    { id: 10, title: "인터스텔라", type: "영화", tags: ["calm"], desc: "우주를 배경으로 펼쳐지는 경이로운 물리 법칙과 가족애.", action: "방 불을 끄고 5분간 명상하거나 심호흡하기" },
    { id: 11, title: "카메라맨", type: "다큐멘터리", tags: ["calm"], desc: "세상의 풍경과 삶의 이면을 담담하게 비추는 시선.", action: "따뜻한 차를 마시며 오늘 찍은 사진첩 정리하기" },

    // [running] 에너지 분출 
    { id: 12, title: "매드맥스: 분노의 도로", type: "영화", tags: ["running"], desc: "물과 기름을 차지하기 위한 끝없는 고속도로 추격전.", action: "신발을 신고 밖으로 나가 15분간 가볍게 뛰고 오기" }
];

// 2. 6가지 기분에 맞춘 후속 질문 딕셔너리
const questions = {
    lethargic: { text: "지금 당신에게 가장 필요한 에너지는?", options: [{ text: "열정을 깨우는 자극", tag: "spark" }, { text: "마음을 달래는 위로", tag: "comfort" }] },
    stressed: { text: "스트레스를 어떻게 해소하고 싶으세요?", options: [{ text: "아무 생각 없이 웃기", tag: "laugh" }, { text: "짜릿한 카타르시스", tag: "running" }] },
    bored: { text: "어떤 분위기로 지루함을 깨고 싶나요?", options: [{ text: "몰입도 높은 스펙타클", tag: "spark" }, { text: "유쾌하고 가벼운 힐링", tag: "laugh" }] },
    sad: { text: "이 슬픈 감정을 어떻게 마주하고 싶나요?", options: [{ text: "펑펑 울며 감정 쏟아내기", tag: "tear" }, { text: "다정한 온기로 위로받기", tag: "comfort" }] },
    anxious: { text: "복잡한 머릿속을 정리하는 방법은?", options: [{ text: "생각을 잠재우는 깊은 몰입", tag: "calm" }, { text: "몸을 움직여 잡생각 날리기", tag: "running" }] },
    happy: { text: "이 좋은 기분을 더 증폭시켜 볼까요?", options: [{ text: "텐션 폭발! 에너제틱", tag: "running" }, { text: "기분 좋게 웃을 수 있는 예능", tag: "laugh" }] }
};

let currentTag = "";
let currentFilteredList = [];

const stepMood = document.getElementById("step-mood");
const stepQuestion = document.getElementById("step-question");
const stepResult = document.getElementById("step-result");

// 기분 버튼 클릭 이벤트
document.querySelectorAll(".btn-mood").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const mood = e.currentTarget.dataset.mood;
        showQuestion(mood);
    });
});

document.getElementById("btn-restart").addEventListener("click", resetService);

function showQuestion(mood) {
    stepMood.classList.remove("active");
    stepQuestion.classList.add("active");

    const qData = questions[mood];
    document.getElementById("question-text").innerText = qData.text;
    
    const optionsDiv = document.getElementById("question-options");
    optionsDiv.innerHTML = "";

    qData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt.text;
        btn.addEventListener("click", () => showResults(opt.tag));
        optionsDiv.appendChild(btn);
    });
}

function showResults(tag) {
    currentTag = tag;
    stepQuestion.classList.remove("active");
    stepResult.classList.add("active");
    renderCards();
}

function renderCards() {
    const watchedList = JSON.parse(localStorage.getItem("watchedContent")) || [];
    currentFilteredList = contentDB.filter(item => item.tags.includes(currentTag) && !watchedList.includes(item.id));

    // 예외 처리: 볼 수 있는 콘텐츠가 모두 소진되었을 때 전체 리스트 오픈
    if (currentFilteredList.length === 0) {
        currentFilteredList = contentDB.filter(item => item.tags.includes(currentTag));
    }

    const container = document.getElementById("result-container");
    container.innerHTML = "";

    const displayList = currentFilteredList.slice(0, 3);

    displayList.forEach(item => {
        const card = document.createElement("div");
        card.className = "result-item";
        card.innerHTML = `
            <div>
                <span class="category">${item.type}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="action-box">
                    <strong>⚡ 시청 후 Action Item</strong>
                    <span>${item.action}</span>
                </div>
            </div>
            <button class="btn-skip" onclick="skipContent(${item.id})">이미 봤어요 (제외)</button>
        `;
        container.appendChild(card);
    });
}

function skipContent(id) {
    const watchedList = JSON.parse(localStorage.getItem("watchedContent")) || [];
    if (!watchedList.includes(id)) {
        watchedList.push(id);
        localStorage.setItem("watchedContent", JSON.stringify(watchedList));
    }
    renderCards();
}

function resetService() {
    stepResult.classList.remove("active");
    stepMood.classList.add("active");
    currentTag = "";
    currentFilteredList = [];
}
