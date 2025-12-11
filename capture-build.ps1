$ErrorActionPreference = "Continue"
$output = & npm run build 2>&1 | Out-String
$output | Out-File -FilePath "build-error.log" -Encoding UTF8
Write-Host $output
