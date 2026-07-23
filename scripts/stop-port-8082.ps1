$p = (Get-NetTCPConnection -LocalPort 8082 -ErrorAction SilentlyContinue).OwningProcess
if ($p) {
  Write-Output "Killing PID $p"
  Stop-Process -Id $p -Force
} else {
  Write-Output "No process listening on port 8082"
}
