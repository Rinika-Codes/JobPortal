Write-Host "DBMS Job Portal Project Runner" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

Write-Host "Starting Machine Learning Service (Port 5001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ml; .\venv\Scripts\python main.py"

Write-Host "Starting Express Backend (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Write-Host "Starting React Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "All applications are booting up! You will see 3 external windows open." -ForegroundColor Yellow
Write-Host "To stop the servers, just close those external windows." -ForegroundColor Yellow
