# Regenerates public/Michael-Fillalan-Resume.pdf from the live #/resume route.
# Local/Windows only: builds the site, serves the build with `vite preview`,
# and prints the resume route to PDF via headless Microsoft Edge.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$out  = Join-Path $root 'public\Michael-Fillalan-Resume.pdf'
$port = 4173

$edge = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge not found (required for headless print-to-pdf).' }

Push-Location $root
try {
  & npm run build
  if ($LASTEXITCODE -ne 0) { throw 'build failed' }

  $preview = Start-Process -FilePath 'npm.cmd' `
    -ArgumentList 'run','preview','--','--port',$port,'--strictPort' `
    -PassThru -WindowStyle Hidden
  try {
    for ($i = 0; $i -lt 40; $i++) {
      if ((Test-NetConnection localhost -Port $port -WarningAction SilentlyContinue).TcpTestSucceeded) { break }
      Start-Sleep -Milliseconds 500
    }
    $url = "http://localhost:$port/mfillalan-portfolio/#/resume"
    if (Test-Path $out) { Remove-Item $out -Force }
    # A dedicated --user-data-dir forces a fresh Edge process so the call
    # blocks until the PDF is fully written instead of handing off to a
    # background instance and returning early.
    $profile = Join-Path $env:TEMP 'edge-resume-pdf'
    & $edge --headless --disable-gpu --no-first-run "--user-data-dir=$profile" `
      --run-all-compositor-stages-before-draw `
      --virtual-time-budget=10000 --no-pdf-header-footer "--print-to-pdf=$out" $url
    # Poll until the file lands and its size settles (belt-and-suspenders).
    for ($j = 0; $j -lt 30; $j++) {
      if (Test-Path $out) { $a = (Get-Item $out).Length; Start-Sleep -Milliseconds 300; if ((Get-Item $out).Length -eq $a -and $a -gt 0) { break } }
      else { Start-Sleep -Milliseconds 300 }
    }
  } finally {
    if ($preview -and -not $preview.HasExited) { Stop-Process -Id $preview.Id -Force }
  }
} finally {
  Pop-Location
}

if (Test-Path $out) {
  Write-Host "Resume PDF regenerated -> $out ($([math]::Round((Get-Item $out).Length/1kb)) KB)"
} else {
  throw 'PDF was not produced.'
}
