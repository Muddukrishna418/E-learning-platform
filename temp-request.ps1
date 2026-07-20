$token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInN1YiI6InZlcmlmeTE3ODM0OTE0NjI0MjNAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODM0OTE0NjIsImV4cCI6MTc4MzU3Nzg2Mn0.wMv6tkHBa_J3eS2DMtyTrWzoha4C9K70fObkQSS7on0'
$body = '{"courseId":"1"}'
$headers = @{ 'Content-Type' = 'application/json'; 'Authorization' = "Bearer $token" }
try {
  $response = Invoke-WebRequest -Method Post -Uri 'http://localhost:8081/api/v1/enrollments' -Headers $headers -Body $body -ErrorAction Stop
  Write-Output $response.Content
} catch {
  if ($_.Exception.Response) {
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $content = $reader.ReadToEnd()
    $reader.Dispose()
    Write-Output $content
  } else {
    Write-Output $_.Exception.Message
  }
}
