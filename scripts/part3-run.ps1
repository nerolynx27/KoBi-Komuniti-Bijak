param([Parameter(Mandatory=$true)][string]$RunId, [Parameter(Mandatory=$true)][string[]]$Commands)
$ErrorActionPreference = 'Continue'
$runDirectory = Join-Path (Get-Location) "docs/verification/part-3/automated/$RunId"
New-Item -ItemType Directory -Force -Path $runDirectory | Out-Null
$results = @()
foreach ($commandText in $Commands) {
  $index = $results.Count + 1
  $started = Get-Date
  $logPath = Join-Path $runDirectory "$index.log"
  "Command: $commandText`nStarted: $($started.ToString('o'))" | Set-Content $logPath
  & cmd.exe /d /c $commandText 2>&1 | Out-File -Append -FilePath $logPath -Encoding utf8
  $code = $LASTEXITCODE
  $results += [pscustomobject]@{command=$commandText;exit=$code;started=$started.ToString('o');seconds=[math]::Round(((Get-Date)-$started).TotalSeconds,2);log="$index.log"}
  if ($commandText -match 'playwright|test:e2e|test:production') {
    foreach ($artifact in @('playwright-report','playwright-production-report','test-results')) {
      $artifactPath = Join-Path 'artifacts' $artifact
      if (Test-Path -LiteralPath $artifactPath) { Copy-Item -LiteralPath $artifactPath -Destination (Join-Path $runDirectory "$index-$artifact") -Recurse }
    }
  }
  $results | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $runDirectory 'results.json')
  Get-Content $logPath | Select-Object -Last 9
  if ($code -ne 0) { exit $code }
}
