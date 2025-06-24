echo Preparing to Commit and Push %1
git add .
git config --global user.name "Ricky Lian"
git config --global user.email "ricky@neo-fusion.com"
git commit -m %1
git push origin main
@echo off

