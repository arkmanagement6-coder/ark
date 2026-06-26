$ErrorActionPreference = 'Stop'

$aboutHtml = [System.IO.File]::ReadAllText("about.html")

$head = [regex]::Match($aboutHtml, '(?is)<head>.*?</head>').Value
$header = [regex]::Match($aboutHtml, '(?is)<header class="header scrolled">.*?</header>').Value
$footer = [regex]::Match($aboutHtml, '(?is)<footer class="footer">.*?</footer>').Value
$scripts = '<script src="js/script.js"></script>'

function Generate-BlogPage($fileName, $title, $heroImg, $bodyContent) {
    $titleTag = "<title>$title | Revanta Growth Media Blog</title>"
    $newHead = $head -replace '(?is)<title>.*?</title>', $titleTag
    
    $html = @"
<!DOCTYPE html>
<html lang="en">
$newHead
<body>
$header

    <section class="inner-hero" style="background: linear-gradient(135deg, rgba(10, 37, 92, 0.95), rgba(10, 37, 92, 0.98)), url('$heroImg') center/cover;">
        <div class="container">
            <h1>$title</h1>
        </div>
    </section>

    <section class="section">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
            <div class="blog-featured-img" style="margin-bottom: 40px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                <img src="$heroImg" alt="$title" style="width: 100%; height: auto; display: block;">
            </div>
            <div class="legal-content">
$bodyContent
                
                <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #ddd;">
                    <h4 style="margin-bottom: 15px; color: var(--primary-blue);">Tags:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <span style="background: #f0f4f8; padding: 5px 15px; border-radius: 50px; font-size: 0.85rem; color: #555;">Digital Marketing Company in India</span>
                        <span style="background: #f0f4f8; padding: 5px 15px; border-radius: 50px; font-size: 0.85rem; color: #555;">Website Development Services</span>
                        <span style="background: #f0f4f8; padding: 5px 15px; border-radius: 50px; font-size: 0.85rem; color: #555;">Google Ads Services</span>
                        <span style="background: #f0f4f8; padding: 5px 15px; border-radius: 50px; font-size: 0.85rem; color: #555;">SEO Services</span>
                        <span style="background: #f0f4f8; padding: 5px 15px; border-radius: 50px; font-size: 0.85rem; color: #555;">Social Media Marketing Agency</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

$footer
$scripts
</body>
</html>
"@
    [System.IO.File]::WriteAllText($fileName, $html, [System.Text.Encoding]::UTF8)
    Write-Host "Created $fileName"
}

$blog1 = @"
            <h2><i class="fa-solid fa-thumbtack" style="margin-right: 8px;"></i> Introduction</h2>
            <p>In today's digital-first world, having a website is no longer optional&mdash;it's essential. Whether you run a small shop or a growing startup, your online presence defines your brand.</p>
            
            <h2><i class="fa-solid fa-globe" style="margin-right: 8px;"></i> 1. Strong First Impression</h2>
            <p>Your website acts as your digital storefront. A professional design builds trust and credibility among potential customers.</p>
            
            <h2><i class="fa-solid fa-chart-line" style="margin-right: 8px;"></i> 2. 24/7 Availability</h2>
            <p>Unlike a physical store, your website works round the clock, allowing customers to explore your services anytime.</p>
            
            <h2><i class="fa-solid fa-sack-dollar" style="margin-right: 8px;"></i> 3. Lead Generation & Sales</h2>
            <p>A well-optimized website helps convert visitors into leads and paying customers.</p>
            
            <h2><i class="fa-solid fa-magnifying-glass" style="margin-right: 8px;"></i> 4. Free Traffic Through SEO</h2>
            <p>With proper SEO, your website can rank on Google and bring organic traffic without spending on ads.</p>
            
            <h2><i class="fa-solid fa-rocket" style="margin-right: 8px;"></i> Conclusion</h2>
            <p>A website is the foundation of your online success. Investing in a professional website is the first step toward business growth.</p>
"@

$blog2 = @"
            <h2><i class="fa-solid fa-thumbtack" style="margin-right: 8px;"></i> Introduction</h2>
            <p>Marketing is essential for every business, but the methods have evolved. Let's compare traditional and digital marketing.</p>
            
            <h2><i class="fa-solid fa-chart-simple" style="margin-right: 8px;"></i> Traditional Marketing</h2>
            <ul>
                <li>TV Ads</li>
                <li>Newspaper Ads</li>
                <li>Hoardings</li>
            </ul>
            <p><i class="fa-solid fa-xmark" style="color: red; margin-right: 8px;"></i> Expensive</p>
            <p><i class="fa-solid fa-xmark" style="color: red; margin-right: 8px;"></i> Hard to measure results</p>
            
            <h2><i class="fa-solid fa-laptop" style="margin-right: 8px;"></i> Digital Marketing</h2>
            <ul>
                <li>Google Ads</li>
                <li>Social Media Marketing</li>
                <li>SEO</li>
            </ul>
            <p><i class="fa-solid fa-check" style="color: green; margin-right: 8px;"></i> Cost-effective</p>
            <p><i class="fa-solid fa-check" style="color: green; margin-right: 8px;"></i> Highly targeted</p>
            <p><i class="fa-solid fa-check" style="color: green; margin-right: 8px;"></i> Measurable results</p>
            
            <h2><i class="fa-solid fa-bullseye" style="margin-right: 8px;"></i> Why Digital Marketing Wins</h2>
            <p>Digital marketing allows you to reach the right audience at the right time with better ROI.</p>
            
            <h2><i class="fa-solid fa-rocket" style="margin-right: 8px;"></i> Conclusion</h2>
            <p>In 2026, digital marketing is not just better&mdash;it's essential for scalable growth.</p>
"@

$blog3 = @"
            <h2><i class="fa-solid fa-thumbtack" style="margin-right: 8px;"></i> Introduction</h2>
            <p>If you want quick results, Google Ads is one of the most powerful tools available.</p>
            
            <h2><i class="fa-solid fa-bullseye" style="margin-right: 8px;"></i> 1. Instant Visibility</h2>
            <p>Your business can appear at the top of Google search results immediately.</p>
            
            <h2><i class="fa-solid fa-users" style="margin-right: 8px;"></i> 2. Target the Right Audience</h2>
            <p>You can target users based on location, interests, and search behavior.</p>
            
            <h2><i class="fa-solid fa-sack-dollar" style="margin-right: 8px;"></i> 3. Pay for Results</h2>
            <p>You only pay when someone clicks on your ad.</p>
            
            <h2><i class="fa-solid fa-chart-simple" style="margin-right: 8px;"></i> 4. Measurable Performance</h2>
            <p>Track every click, conversion, and ROI in real-time.</p>
            
            <h2><i class="fa-solid fa-rocket" style="margin-right: 8px;"></i> Conclusion</h2>
            <p>Google Ads is ideal for businesses looking for fast growth and immediate leads.</p>
"@

$blog4 = @"
            <h2><i class="fa-solid fa-thumbtack" style="margin-right: 8px;"></i> Introduction</h2>
            <p>Small businesses need smart strategies to compete in the digital space. Here are the top ones:</p>
            
            <h2><i class="fa-solid fa-fire" style="margin-right: 8px;"></i> Strategies</h2>
            
            <h3>1. Website Optimization</h3>
            <p>Ensure your site is fast, mobile-friendly, and user-focused.</p>
            
            <h3>2. SEO</h3>
            <p>Improve your Google rankings for long-term traffic.</p>
            
            <h3>3. Social Media Marketing</h3>
            <p>Engage with your audience on platforms like Instagram and Facebook.</p>
            
            <h3>4. Google Ads</h3>
            <p>Generate instant leads.</p>
            
            <h3>5. Content Marketing</h3>
            <p>Use blogs, videos, and posts to attract customers.</p>
            
            <h3>6. WhatsApp Marketing</h3>
            <p>Communicate directly with your audience.</p>
            
            <h3>7. Email Marketing</h3>
            <p>Build relationships and promote offers.</p>
            
            <h2><i class="fa-solid fa-rocket" style="margin-right: 8px;"></i> Conclusion</h2>
            <p>Applying these strategies consistently can drive strong business growth.</p>
"@

$blog5 = @"
            <h2><i class="fa-solid fa-thumbtack" style="margin-right: 8px;"></i> Introduction</h2>
            <p>Social media has become one of the most powerful tools for brand growth and engagement.</p>
            
            <h2><i class="fa-solid fa-mobile-screen" style="margin-right: 8px;"></i> 1. Brand Awareness</h2>
            <p>Reach thousands of potential customers quickly.</p>
            
            <h2><i class="fa-solid fa-comments" style="margin-right: 8px;"></i> 2. Customer Engagement</h2>
            <p>Interact directly with your audience and build trust.</p>
            
            <h2><i class="fa-solid fa-chart-line" style="margin-right: 8px;"></i> 3. Increase Sales</h2>
            <p>Well-targeted ads can drive conversions and revenue.</p>
            
            <h2><i class="fa-solid fa-bullseye" style="margin-right: 8px;"></i> 4. Precise Targeting</h2>
            <p>Target users based on demographics, interests, and behavior.</p>
            
            <h2><i class="fa-solid fa-rocket" style="margin-right: 8px;"></i> Conclusion</h2>
            <p>Social media marketing is essential for building a strong and recognizable brand.</p>
"@

Generate-BlogPage "blog-1.html" "Why Every Business Needs a Website in 2026" "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" $blog1
Generate-BlogPage "blog-2.html" "Digital Marketing vs Traditional Marketing" "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" $blog2
Generate-BlogPage "blog-3.html" "How Google Ads Can Grow Your Business Fast" "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" $blog3
Generate-BlogPage "blog-4.html" "Top 7 Digital Marketing Strategies for Small Businesses" "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" $blog4
Generate-BlogPage "blog-5.html" "How Social Media Marketing Boosts Your Brand" "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" $blog5

Write-Host "5 Blog pages created successfully."
