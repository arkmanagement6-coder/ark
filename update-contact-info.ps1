$phonesToReplace = @("7668569852", "8821885577")
$newPhone = "8433206010"

$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    # Read with UTF8 to preserve emojis/icons
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $originalContent = $content

    foreach ($oldPhone in $phonesToReplace) {
        $content = $content.Replace($oldPhone, $newPhone)
    }

    if ($originalContent -ne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated phone in $($file.Name)"
    }
}
