# PowerShell script to create 5 Thirdweb server wallets for Cloniq agents

$CLIENT_ID = "3be66bd3d16cdac7ef72e0e6439b6e3e"
$ACCESS_TOKEN = "2c3Cb7CULh5Qm0NnnN6jULJUYdbs7AZBWGYt_osWTy2-pzFKvIV3sXklNsKD9vgzks-vWx3F_ZX-RrpKfnYVGA"
$API_URL = "https://api.thirdweb.com/v1/wallets/server"

$agents = @(
    "blockchain-dev",
    "legal-advisor",
    "fitness-coach",
    "content-writer",
    "data-scientist"
)

Write-Host "Creating 5 Thirdweb server wallets..." -ForegroundColor Cyan
Write-Host ""

$walletAddresses = @()

foreach ($agent in $agents) {
    Write-Host "Creating wallet for: $agent" -ForegroundColor Yellow

    $body = @{
        identifier = $agent
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
        Write-Host "  Success: $walletAddress" -ForegroundColor Green
        Write-Host "  Smart Wallet: $($response.result.smartWalletAddress)" -ForegroundColor Cyan
        $walletAddresses += $walletAddress
    }
    catch {
        Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "All Wallet Addresses:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
for ($i = 0; $i -lt $walletAddresses.Length; $i++) {
    Write-Host "$($i + 1). $($agents[$i]): $($walletAddresses[$i])" -ForegroundColor White
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy these addresses"
Write-Host "2. Open seed-agents.sql"
Write-Host "3. Replace WALLET_ADDRESS_HERE_1 through WALLET_ADDRESS_HERE_5"
Write-Host "4. Run the SQL in Supabase"
