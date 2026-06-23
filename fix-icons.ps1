$replacements = @{
    "ðŸ‘‰" = "👉"
    "ðŸ”¥" = "🔥"
    "â ³" = "⏳"
    "â‚¹" = "₹"
    "â€“" = "–"
    "â€”" = "—"
    "â€™" = "’"
    "â€¦" = "…"
    "ðŸ˜" = "😊"
    "ðŸ‘‹" = "👋"
    "ðŸ“‰" = "📈"
}

$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    # Read as UTF8
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    $original = $content
    
    foreach ($key in $replacements.Keys) {
        $content = $content.Replace($key, $replacements[$key])
    }
    
    if ($original -ne $content) {
        # Write as UTF8
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed icons in $($file.Name)"
    }
}
