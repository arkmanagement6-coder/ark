$pixelCode = @"
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1428184878228303');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1428184878228303&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
"@

$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    if ($content -notlike "*fbq('init', '1428184878228303')*") {
        # Insert before </head>
        if ($content -match "</head>") {
            $newContent = $content -replace "</head>", "`n$pixelCode`n</head>"
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Added Meta Pixel to $($file.Name)"
        }
    } else {
        Write-Host "Meta Pixel already exists in $($file.Name)"
    }
}
