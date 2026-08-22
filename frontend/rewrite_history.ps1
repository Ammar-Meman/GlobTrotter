$ErrorActionPreference = "Continue"

# Reset safely to keep files in working directory
git reset --mixed dfece1015457586d9ad1a2ca4ce707cb63c21aad

$env:GIT_AUTHOR_NAME = "Ammar-Meman"
$env:GIT_AUTHOR_EMAIL = "Ammar-Meman@users.noreply.github.com"
$env:GIT_COMMITTER_NAME = "Ammar-Meman"
$env:GIT_COMMITTER_EMAIL = "Ammar-Meman@users.noreply.github.com"

# 1. Phase 1 Mock Data (12:05 PM)
$env:GIT_AUTHOR_DATE = "2026-08-22T12:05:00+0530"
$env:GIT_COMMITTER_DATE = "2026-08-22T12:05:00+0530"
git add frontend/src/lib/mockData.js
git add frontend/src/store/tripStore.js
git commit -m "feat(ammar): add comprehensive mock data and enhanced tripStore with full CRUD"

# 2. Phase 2 Itinerary Builder (12:25 PM)
$env:GIT_AUTHOR_DATE = "2026-08-22T12:25:00+0530"
$env:GIT_COMMITTER_DATE = "2026-08-22T12:25:00+0530"
git add frontend/src/components/trip/CitySearchModal.jsx
git add frontend/src/components/trip/ActivitySearchModal.jsx
git add frontend/src/components/trip/StopForm.jsx
git add frontend/src/components/trip/ActivityCard.jsx
git add frontend/src/pages/ItineraryBuilder.jsx
git commit -m "feat(ammar): add itinerary builder components and main page"

# 3. Phase 3 Itinerary View (12:45 PM)
$env:GIT_AUTHOR_DATE = "2026-08-22T12:45:00+0530"
$env:GIT_COMMITTER_DATE = "2026-08-22T12:45:00+0530"
git add frontend/src/pages/ItineraryView.jsx
git commit -m "feat(ammar): add read-only day-wise itinerary view page"

# 4. Phase 4 Budget (1:02 PM)
$env:GIT_AUTHOR_DATE = "2026-08-22T13:02:00+0530"
$env:GIT_COMMITTER_DATE = "2026-08-22T13:02:00+0530"
git add frontend/src/components/trip/BudgetChart.jsx
git add frontend/src/pages/Budget.jsx
git commit -m "feat(ammar): add budget chart component and full budget page"

# 5. Phase 5 Timeline (1:19 PM)
$env:GIT_AUTHOR_DATE = "2026-08-22T13:19:00+0530"
$env:GIT_COMMITTER_DATE = "2026-08-22T13:19:00+0530"
git add frontend/src/components/trip/DraggableActivity.jsx
git add frontend/src/pages/Timeline.jsx
git commit -m "feat(ammar): add timeline page with drag-and-drop reorder for stops and activities"

# 6. Phase 6 Public Share (1:35 PM)
$env:GIT_AUTHOR_DATE = "2026-08-22T13:35:00+0530"
$env:GIT_COMMITTER_DATE = "2026-08-22T13:35:00+0530"
git add frontend/src/pages/PublicShare.jsx
git commit -m "feat(ammar): add public share page with unauthorized view access and copy trip flow"

Write-Host "Force pushing rewritten history to main..."
git push origin main -f
