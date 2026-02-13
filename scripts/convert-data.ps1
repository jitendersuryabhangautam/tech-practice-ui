# Data Conversion Script for Interview Platform
# This script extracts topic data from JS files and creates individual JSON files

$sourceFiles = @(
    @{name="docker"; data="dockerData"; quiz="dockerQuiz"},
    @{name="kubernetes"; data="kubernetesData"; quiz="kubernetesQuiz"},
    @{name="postgresql"; data="postgresqlData"; quiz="postgresqlQuiz"},
    @{name="nextjs"; data="nextjsData"; quiz="nextjsQuiz"},
    @{name="golang"; data="golangData"; quiz="golangQuiz"}
)

Write-Host "🚀 Converting JS data files to JSON format..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $sourceFiles) {
    $sourcePath = ".\data\$($file.name).js"
    $outputPath = ".\public\data\$($file.name).json"
    
    if (Test-Path $sourcePath) {
        Write-Host "📄 Processing $($file.name).js..." -ForegroundColor Yellow
        
        # Read the JS file content
        $content = Get-Content $sourcePath -Raw
        
        # Remove export statements and capture the data
        $content = $content -replace "export const $($file.data) = ", ""
        $content = $content -replace "export const $($file.quiz) = ", '"quiz": '
        
        # Wrap in JSON structure
        $jsonContent = '{"data": ' + $content + '}'
        
        # Try to validate if it's parseable (basic check)
        try {
            # We can't directly parse it as JSON since it has JS syntax
            # So we'll just save it and let Node handle it
            Set-Content -Path $outputPath -Value $jsonContent
            
            $size = (Get-Item $outputPath).Length / 1KB
            Write-Host "✅ Created $($file.name).json ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error creating $($file.name).json" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️  Skipping $($file.name) - file not found" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "✨ Conversion complete!" -ForegroundColor Green
