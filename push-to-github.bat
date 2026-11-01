@echo off
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
echo ====================================================
echo  Pushing Multimodal Attendance Agent to GitHub...
echo  Target: https://github.com/pragativerma27/multimodal-attendance-agent.git
echo ====================================================
git push -u origin main
echo.
pause
