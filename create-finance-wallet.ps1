# Create Thirdweb wallet for finance-advisor agent

$CLIENT_ID = "3be66bd3d16cdac7ef72e0e6439b6e3e"
$ACCESS_TOKEN = "2c3Cb7CULh5Qm0NnnN6jULJUYdbs7AZBWGYt_osWTy2-pzFKvIV3sXklNsKD9vgzks-vWx3F_ZX-RrpKfnYVGA"
$API_URL = "https://api.thirdweb.com/v1/wallets/server"

Write-Host "Creating Thirdweb wallet for finance-advisor..." -ForegroundColor Cyan

$body = @{
    identifier = "finance-advisor"
    chain = "base-sepolia"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Post `
        -Headers @{
            "Content-Type" = "application/json"
            "x-client-id" = $CLIENT_ID
            "x-secret-key" = $ACCESS_TOKEN
        } `
        -Body $body

    $walletAddress = $response.result.address
    Write-Host "`nSuccess! Created wallet for finance-advisor" -ForegroundColor Green
    Write-Host "Wallet Address: $walletAddress" -ForegroundColor Yellow
    Write-Host "Smart Wallet Address: $($response.result.smartWalletAddress)" -ForegroundColor Cyan

    Write-Host "`n================================" -ForegroundColor Cyan
    Write-Host "Copy this address for SQL:" -ForegroundColor Cyan
    Write-Host $walletAddress -ForegroundColor White
    Write-Host "================================" -ForegroundColor Cyan
}
catch {
    Write-Host "`nError creating wallet: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Message)" -ForegroundColor Red
}
