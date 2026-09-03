/**
 * 스마트 양평 클린가이드 - 메인 애플리케이션 코어 로직
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. App State
  // ------------------------------------------------------------------------
  let savedFavs = [];
  try {
    savedFavs = JSON.parse(localStorage.getItem('yp_favorites')) || [];
  } catch (e) {
    savedFavs = [];
  }

  const state = {
    selectedTownId: localStorage.getItem('yp_town') || 'yangpyeong',
    activeCategory: 'general',
    theme: localStorage.getItem('yp_theme') || 'light',
    searchQuery: '',
    selectedCalcItems: savedCalc, // { name, fee, qty }
    favoriteItems: savedFavs, // Array of favorited item names
    showOnlyFavorites: false
  };

  // ------------------------------------------------------------------------
  // Supabase Database Integration for 'yptrash_items'
  // ------------------------------------------------------------------------
  let supabaseClient = null;
  if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY &&
      window.SUPABASE_URL !== 'https://your-project-id.supabase.co') {
    try {
      supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    } catch (err) {
      console.warn('Supabase initialization waiting for configuration credentials:', err.message);
    }
  }

  let deviceId = localStorage.getItem('yp_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('yp_device_id', deviceId);
  }

  function saveAppState() {
    localStorage.setItem('yp_town', state.selectedTownId);
    localStorage.setItem('yp_theme', state.theme);
    localStorage.setItem('yp_calc_items', JSON.stringify(state.selectedCalcItems));
    localStorage.setItem('yp_favorites', JSON.stringify(state.favoriteItems));

    if (supabaseClient) {
      supabaseClient
        .from('yptrash_items')
        .upsert({
          device_id: deviceId,
          selected_town: state.selectedTownId,
          theme: state.theme,
          calc_items: state.selectedCalcItems,
          favorite_items: state.favoriteItems,
          updated_at: new Date().toISOString()
        }, { onConflict: 'device_id' })
        .then(({ error }) => {
          if (error) console.warn('Supabase DB sync note:', error.message);
        });
    }
  }

  async function syncFromSupabase() {
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('yptrash_items')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (data && !error) {
        if (data.selected_town) state.selectedTownId = data.selected_town;
        if (data.theme) state.theme = data.theme;
        if (data.calc_items && Array.isArray(data.calc_items)) state.selectedCalcItems = data.calc_items;
        if (data.favorite_items && Array.isArray(data.favorite_items)) state.favoriteItems = data.favorite_items;

        initTheme();
        renderTownSelector();
        renderLiveStatus();
        renderQuickTags();
        renderSearchResults();
        renderSelectedCalcList();
        renderOfficesGrid();
      }
    } catch (err) {
      console.warn('Supabase fetch fallback to local state:', err);
    }
  }

  // ------------------------------------------------------------------------
  // 2. DOM Elements
  // ------------------------------------------------------------------------
  const townGridEl = document.getElementById('townGrid');
  const selectedTownBadgeEl = document.getElementById('selectedTownBadge');
  const liveStatusCardEl = document.getElementById('liveStatusCard');
  const categoryTabsEl = document.getElementById('categoryTabs');
  const categoryContentEl = document.getElementById('categoryContent');
  const searchInputEl = document.getElementById('searchInput');
  const quickTagsEl = document.getElementById('quickTags');
  const searchResultsGridEl = document.getElementById('searchResultsGrid');
  const calcSearchInputEl = document.getElementById('calcSearchInput');
  const calcItemsListEl = document.getElementById('calcItemsList');
  const selectedCalcListEl = document.getElementById('selectedCalcList');
  const totalPriceEl = document.getElementById('totalPrice');
  const officesGridEl = document.getElementById('officesGrid');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const noticeBtn = document.getElementById('noticeBtn');
  const toastNoticeEl = document.getElementById('toastNotice');

  // ------------------------------------------------------------------------
  // 3. Theme Initialization & Toggle
  // ------------------------------------------------------------------------
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    themeToggleBtn.innerHTML = state.theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    initTheme();
    saveAppState();
    showToast(`테마가 ${state.theme === 'dark' ? '다크' : '라이트'} 모드로 변경되었습니다.`);
  });

  // Toast Notification
  function showToast(msg) {
    toastNoticeEl.textContent = msg;
    toastNoticeEl.classList.add('show');
    setTimeout(() => {
      toastNoticeEl.classList.remove('show');
    }, 2800);
  }

  noticeBtn.addEventListener('click', () => {
    const currentTown = YANGPYEONG_DATA.towns.find(t => t.id === state.selectedTownId);
    showToast(`🔔 [${currentTown.name}] 쓰레기 배출일 일몰(18시) 알림이 등록되었습니다.`);
  });

  // ------------------------------------------------------------------------
  // 4. Render Town Selector Grid
  // ------------------------------------------------------------------------
  function renderTownSelector() {
    townGridEl.innerHTML = '';
    YANGPYEONG_DATA.towns.forEach(town => {
      const card = document.createElement('div');
      card.className = `town-card ${town.id === state.selectedTownId ? 'active' : ''}`;
      card.innerHTML = `
        <div class="town-name">${town.name}</div>
        <div class="town-zone">${town.zone.split(' ')[0]}</div>
        <div class="town-tel"><i class="fa-solid fa-phone"></i> ${town.tel}</div>
      `;
      card.addEventListener('click', () => {
        state.selectedTownId = town.id;
        saveAppState();
        renderTownSelector();
        renderLiveStatus();
        renderOfficesGrid();
        const t = YANGPYEONG_DATA.towns.find(x => x.id === town.id);
        showToast(`거주 지역이 '${t.name}'(으)로 선택되었습니다.`);
      });
      townGridEl.appendChild(card);
    });

    const currentTown = YANGPYEONG_DATA.towns.find(t => t.id === state.selectedTownId);
    selectedTownBadgeEl.textContent = `${currentTown.name} (${currentTown.zone})`;
  }

  // ------------------------------------------------------------------------
  // 5. Render Today's Live Status (실시간 배출 알리미)
  // ------------------------------------------------------------------------
  function renderLiveStatus() {
    const now = new Date();
    const daysArr = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayIdx = now.getDay();
    const hours = now.getHours();
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${daysArr[dayIdx]})`;

    const rule = YANGPYEONG_DATA.dischargeTimeRules.collectionDaysMap[dayIdx];
    const isEveningWindow = hours >= 18 || hours < 6;

    let statusPillHtml = '';
    let statusNotice = rule.note;

    if (!rule.canDischarge) {
      statusPillHtml = `
        <div class="live-status-pill status-deny">
          <i class="fa-solid fa-circle-xmark"></i> 오늘 저녁 배출 금지 (주말 휴무)
        </div>
      `;
    } else {
      statusPillHtml = `
        <div class="live-status-pill status-allow">
          <i class="fa-solid fa-circle-check"></i> 오늘 저녁 배출 가능
        </div>
      `;
    }

    // Get today's allowed item details
    let itemsHtml = '';
    if (rule.items.length === 0) {
      itemsHtml = `
        <div class="no-results" style="padding: 20px;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem; color: #F59E0B; margin-bottom: 8px;"></i>
          <div>금요일/토요일 저녁은 수거 휴무로 쓰레기를 배출할 수 없습니다.</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">일요일 저녁 일몰(18:00) 이후부터 배출해 주세요.</div>
        </div>
      `;
    } else {
      itemsHtml = rule.items.map(itemId => {
        const cat = YANGPYEONG_DATA.categories.find(c => c.id === itemId);
        return `
          <div class="live-item-box">
            <div class="live-item-icon" style="background: ${cat.color};">
              <i class="fa-solid ${cat.icon}"></i>
            </div>
            <div class="live-item-info">
              <h4>${cat.name}</h4>
              <p>${cat.bagType}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    const currentTown = YANGPYEONG_DATA.towns.find(t => t.id === state.selectedTownId);

    liveStatusCardEl.innerHTML = `
      <div class="live-status-header">
        <div class="live-date-badge">
          <i class="fa-solid fa-calendar-day" style="color: var(--primary);"></i>
          <span>${dateStr}</span>
          <a href="tel:${currentTown.tel}" style="font-size: 0.9rem; font-weight: 700; color: var(--primary); display: inline-flex; align-items: center; gap: 4px; background: var(--primary-light); padding: 4px 10px; border-radius: var(--radius-full);">
            <i class="fa-solid fa-phone"></i> ${currentTown.name} (${currentTown.tel})
          </a>
        </div>
        ${statusPillHtml}
      </div>

      <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 12px;">
        <i class="fa-solid fa-box-open" style="color: var(--primary); margin-right: 6px;"></i>
        오늘 저녁 배출 가능한 쓰레기 품목
      </h3>
      
      <div class="live-items-container">
        ${itemsHtml}
      </div>

      <div class="time-window-banner">
        <div>
          <i class="fa-regular fa-clock" style="margin-right: 6px; color: var(--primary);"></i>
          배출 골든타임: <strong>수거 전일 일몰 후(18:00) ~ 수거 당일 일출 전(06:00)</strong>
        </div>
        <div>${statusNotice}</div>
      </div>
    `;
  }

  // ------------------------------------------------------------------------
  // 6. Render Categories & Schedules Tab View
  // ------------------------------------------------------------------------
  function renderCategoryTabs() {
    categoryTabsEl.innerHTML = YANGPYEONG_DATA.categories.map(cat => `
      <button class="tab-btn ${cat.id === state.activeCategory ? 'active' : ''}" data-cat="${cat.id}">
        <i class="fa-solid ${cat.icon}"></i>
        ${cat.name}
      </button>
    `).join('');

    const tabBtns = categoryTabsEl.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.activeCategory = e.currentTarget.dataset.cat;
        renderCategoryTabs();
        renderCategoryContent();
      });
    });
  }

  function renderCategoryContent() {
    const cat = YANGPYEONG_DATA.categories.find(c => c.id === state.activeCategory);
    const bagPrices = YANGPYEONG_DATA.bagPrices[cat.id] || null;

    let priceTableHtml = '';
    if (bagPrices) {
      priceTableHtml = `
        <div style="margin-top: 24px;">
          <h4 class="price-table-title">
            <i class="fa-solid fa-tags" style="color: ${cat.color}; margin-right: 6px;"></i>
            양평군 규격 봉투/마대 가격표
          </h4>
          <table class="price-table">
            <thead>
              <tr>
                <th>규격 (용량)</th>
                <th>판매 가격</th>
              </tr>
            </thead>
            <tbody>
              ${bagPrices.map(item => `
                <tr>
                  <td><strong>${item.size}</strong></td>
                  <td>${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    let extraNoticeHtml = cat.notFoodNotice ? `
      <div style="margin-top: 16px; padding: 12px 16px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 6px; font-size: 0.9rem; color: #92400E; font-weight: 700;">
        ${cat.notFoodNotice}
      </div>
    ` : '';

    categoryContentEl.innerHTML = `
      <div class="cat-detail-grid">
        <div class="cat-info-card">
          <span class="cat-badge" style="background: ${cat.color};">
            <i class="fa-solid ${cat.icon}" style="margin-right: 6px;"></i> ${cat.name}
          </span>
          <h3 class="cat-title">${cat.name} 배출 기준</h3>
          <p style="font-size: 1.05rem; color: var(--text-muted);">${cat.summary}</p>
          
          <div class="cat-schedule-box">
            <div class="schedule-row">
              <span>배출 요일</span>
              <strong>${cat.dischargeDays}</strong>
            </div>
            <div class="schedule-row">
              <span>수거 요일</span>
              <strong>${cat.collectionDays}</strong>
            </div>
            <div class="schedule-row">
              <span>배출 용기/봉투</span>
              <strong style="color: ${cat.color};">${cat.bagType}</strong>
            </div>
          </div>

          ${extraNoticeHtml}
          ${priceTableHtml}
        </div>

        <div>
          <h4 class="price-table-title" style="margin-bottom: 16px;">
            <i class="fa-solid fa-list-check" style="color: ${cat.color}; margin-right: 6px;"></i>
            올바른 분리배출 방법
          </h4>
          <ul class="cat-howto-list">
            ${cat.howTo.map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------------------
  // 7. Smart Item Search Engine
  // ------------------------------------------------------------------------
  const QUICK_TAGS = ["치킨 뼈", "깨진 유리", "투명 페트병", "아이스팩", "이불", "폐건전지", "스티로폼", "우유팩", "매트리스", "음식물"];

  function renderQuickTags() {
    const favCount = state.favoriteItems.length;
    const favBtnStyle = state.showOnlyFavorites
      ? 'border-color: #F59E0B; color: white; background: #F59E0B; font-weight: 800;'
      : 'border-color: #F59E0B; color: #D97706; background: rgba(245, 158, 11, 0.12); font-weight: 800;';

    quickTagsEl.innerHTML = `
      <span class="quick-tag-label"><i class="fa-solid fa-fire" style="color: #EF4444;"></i> 추천 필터:</span>
      <button class="tag-btn" id="favFilterBtn" style="${favBtnStyle}">
        <i class="fa-solid fa-star" style="color: ${state.showOnlyFavorites ? 'white' : '#F59E0B'}; margin-right: 4px;"></i> 내 즐겨찾기 (${favCount})
      </button>
      ${QUICK_TAGS.map(tag => `<button class="tag-btn">${tag}</button>`).join('')}
    `;

    const favFilterBtn = document.getElementById('favFilterBtn');
    if (favFilterBtn) {
      favFilterBtn.addEventListener('click', () => {
        state.showOnlyFavorites = !state.showOnlyFavorites;
        state.searchQuery = '';
        searchInputEl.value = '';
        renderQuickTags();
        renderSearchResults();
      });
    }

    quickTagsEl.querySelectorAll('.tag-btn:not(#favFilterBtn)').forEach(btn => {
      btn.addEventListener('click', () => {
        state.showOnlyFavorites = false;
        searchInputEl.value = btn.textContent;
        state.searchQuery = btn.textContent;
        renderQuickTags();
        renderSearchResults();
      });
    });
  }

  searchInputEl.addEventListener('input', (e) => {
    state.showOnlyFavorites = false;
    state.searchQuery = e.target.value.trim();
    renderQuickTags();
    renderSearchResults();
  });

  function renderSearchResults() {
    const q = state.searchQuery.toLowerCase();
    let filtered = YANGPYEONG_DATA.itemsDatabase;

    if (state.showOnlyFavorites) {
      filtered = filtered.filter(item => state.favoriteItems.includes(item.name));
    } else if (q) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.method.toLowerCase().includes(q) ||
        item.bag.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      const msg = state.showOnlyFavorites
        ? '등록된 즐겨찾기 품목이 없습니다. 별 모양(★) 버튼을 눌러 자주 찾는 쓰레기를 추가해 보세요!'
        : `'${state.searchQuery}'에 대한 검색 결과가 없습니다.`;

      searchResultsGridEl.innerHTML = `
        <div class="no-results">
          <i class="fa-solid fa-star" style="font-size: 2rem; margin-bottom: 12px; opacity: 0.4; color: #F59E0B;"></i>
          <div>${msg}</div>
          <div style="font-size: 0.85rem; margin-top: 4px;">정확한 품목명으로 다시 검색하시거나 읍·면사무소에 직접 문의해 보세요.</div>
        </div>
      `;
      return;
    }

    searchResultsGridEl.innerHTML = filtered.map(item => {
      const cat = YANGPYEONG_DATA.categories.find(c => c.id === item.category);
      const isFav = state.favoriteItems.includes(item.name);
      return `
        <div class="item-card">
          <div class="item-card-header">
            <div class="item-name-group">
              <button class="fav-star-btn ${isFav ? 'active' : ''}" data-name="${item.name}" title="${isFav ? '즐겨찾기 삭제' : '즐겨찾기 등록'}">
                <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
              </button>
              <span class="item-name">${item.name}</span>
            </div>
            <span class="item-cat-badge" style="background: ${cat.color};">${cat.name}</span>
          </div>
          <div class="item-detail-row">
            <span>배출 용기:</span> <strong>${item.bag}</strong>
          </div>
          <div class="item-detail-row">
            <span>배출 요일:</span> <strong>${item.day}</strong>
          </div>
          <div class="item-method">
            ${item.method}
          </div>
        </div>
      `;
    }).join('');

    // Attach click events for favorite star buttons
    searchResultsGridEl.querySelectorAll('.fav-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemName = btn.dataset.name;
        const idx = state.favoriteItems.indexOf(itemName);
        if (idx > -1) {
          state.favoriteItems.splice(idx, 1);
          showToast(`⭐ '${itemName}'이(가) 즐겨찾기에서 삭제되었습니다.`);
        } else {
          state.favoriteItems.push(itemName);
          showToast(`⭐ '${itemName}'이(가) 즐겨찾기에 등록되었습니다.`);
        }
        saveAppState();
        renderQuickTags();
        renderSearchResults();
      });
    });
  }

  // ------------------------------------------------------------------------
  // 8. Bulky Waste Calculator Logic
  // ------------------------------------------------------------------------
  function renderCalcItemsList(query = '') {
    const q = query.toLowerCase();
    const filtered = YANGPYEONG_DATA.bulkyFeeItems.filter(item =>
      item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );

    calcItemsListEl.innerHTML = filtered.map(item => `
      <div class="calc-item-row">
        <div>
          <div class="calc-item-name">${item.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${item.category}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="calc-item-fee">${item.fee.toLocaleString()}원</div>
          <button class="add-calc-btn" data-name="${item.name}" data-fee="${item.fee}">+ 추가</button>
        </div>
      </div>
    `).join('');

    calcItemsListEl.querySelectorAll('.add-calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const fee = parseInt(btn.dataset.fee, 10);
        
        const existing = state.selectedCalcItems.find(i => i.name === name);
        if (existing) {
          existing.qty += 1;
        } else {
          state.selectedCalcItems.push({ name, fee, qty: 1 });
        }
        saveAppState();
        renderSelectedCalcList();
      });
    });
  }

  calcSearchInputEl.addEventListener('input', (e) => {
    renderCalcItemsList(e.target.value.trim());
  });

  function renderSelectedCalcList() {
    if (state.selectedCalcItems.length === 0) {
      selectedCalcListEl.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 20px 0; font-size: 0.9rem;">
          선택된 항목이 없습니다.<br>왼쪽에서 대형폐기물 품목을 추가해 주세요.
        </div>
      `;
      totalPriceEl.textContent = '0원';
      return;
    }

    let total = 0;
    selectedCalcListEl.innerHTML = state.selectedCalcItems.map((item, idx) => {
      const itemTotal = item.fee * item.qty;
      total += itemTotal;
      return `
        <div class="selected-item-tag">
          <div>
            <strong>${item.name}</strong>
            <div style="font-size: 0.8rem; color: var(--primary);">${itemTotal.toLocaleString()}원</div>
          </div>
          <div class="qty-control">
            <button class="qty-btn" data-idx="${idx}" data-action="minus">-</button>
            <span style="font-weight: 800; font-size: 0.9rem; padding: 0 4px;">${item.qty}</span>
            <button class="qty-btn" data-idx="${idx}" data-action="plus">+</button>
          </div>
        </div>
      `;
    }).join('');

    totalPriceEl.textContent = `${total.toLocaleString()}원`;

    selectedCalcListEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const action = btn.dataset.action;
        if (action === 'plus') {
          state.selectedCalcItems[idx].qty += 1;
        } else if (action === 'minus') {
          state.selectedCalcItems[idx].qty -= 1;
          if (state.selectedCalcItems[idx].qty <= 0) {
            state.selectedCalcItems.splice(idx, 1);
          }
        }
        saveAppState();
        renderSelectedCalcList();
      });
    });
  }

  // ------------------------------------------------------------------------
  // 9. Town Office Contact Cards
  // ------------------------------------------------------------------------
  function renderOfficesGrid() {
    officesGridEl.innerHTML = YANGPYEONG_DATA.towns.map(town => {
      const isSelected = town.id === state.selectedTownId;
      return `
        <div class="office-card" style="${isSelected ? 'border-color: var(--primary); background: var(--primary-light);' : ''}">
          <div>
            <div class="office-name">
              ${town.office} ${isSelected ? '<span style="font-size: 0.75rem; background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px;">내 동네</span>' : ''}
            </div>
            <div class="office-address">
              <i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i> ${town.address}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
              ${town.description}
            </div>
          </div>
          <a href="tel:${town.tel}" class="office-tel-btn">
            <i class="fa-solid fa-phone"></i> ${town.tel}
          </a>
        </div>
      `;
    }).join('');
  }

  // ------------------------------------------------------------------------
  // 10. Mobile Bottom Navigation & ScrollSpy
  // ------------------------------------------------------------------------
  function initMobileNav() {
    const mobileBottomNavEl = document.getElementById('mobileBottomNav');
    if (!mobileBottomNavEl) return;

    const navItems = mobileBottomNavEl.querySelectorAll('.mobile-nav-item');
    const sections = [
      { id: 'hero', nav: navItems[0] },
      { id: 'dischargeGuide', nav: navItems[1] },
      { id: 'searchSection', nav: navItems[2] },
      { id: 'calcSection', nav: navItems[3] },
      { id: 'officesSection', nav: navItems[4] }
    ];

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const headerOffset = 65;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          navItems.forEach(n => n.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });

    // ScrollSpy to update active item on scroll
    let isTicking = false;
    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 120;
          for (let i = sections.length - 1; i >= 0; i--) {
            const sec = document.getElementById(sections[i].id);
            if (sec && sec.offsetTop <= scrollPos) {
              navItems.forEach(n => n.classList.remove('active'));
              if (sections[i].nav) {
                sections[i].nav.classList.add('active');
              }
              break;
            }
          }
          isTicking = false;
        });
        isTicking = true;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 11. Initial App Launch
  // ------------------------------------------------------------------------
  initTheme();
  renderTownSelector();
  renderLiveStatus();
  renderCategoryTabs();
  renderCategoryContent();
  renderQuickTags();
  renderSearchResults();
  renderCalcItemsList();
  renderSelectedCalcList();
  renderOfficesGrid();
  initMobileNav();
  syncFromSupabase();
});

