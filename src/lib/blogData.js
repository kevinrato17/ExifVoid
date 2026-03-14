/**
 * Blog posts data store
 * 
 * To add a new post: simply add a new object to the POSTS array below.
 * The slug is used for the URL (e.g., /blog/your-slug)
 * Content supports basic formatting with paragraphs separated by \n\n
 * 
 * SEO Strategy — Three Pillars:
 * 1. Educational: How to remove metadata from specific devices
 * 2. Forensic: Deep dives into EXIF, XMP, IPTC metadata
 * 3. Compliance: GDPR, privacy laws, AI provenance
 */

export const POSTS = [
  {
    slug: 'what-is-exif-data-and-why-should-you-care',
    title: 'What Is EXIF Data and Why Should You Care?',
    description: 'Every photo you take contains hidden metadata that can reveal your location, device, and habits. Learn what EXIF data is and why it matters for your privacy.',
    category: 'Educational',
    date: '2026-03-14',
    readTime: '5 min read',
    content: `Every digital photo you take carries more information than meets the eye. Hidden inside each image file is a block of metadata called EXIF data — short for Exchangeable Image File Format. This data is automatically embedded by your camera or smartphone at the moment you press the shutter button.

EXIF data was originally designed to help photographers organise their work. It records useful technical details like aperture, shutter speed, ISO, focal length, and white balance settings. For professionals reviewing hundreds of shots from a session, this information is genuinely helpful.

**The privacy problem**

The issue is that EXIF data often records far more than camera settings. Modern smartphones embed GPS coordinates accurate to within a few metres, effectively geotagging every photo you take. This means a casual photo of your morning coffee could reveal your home address. A picture of your child at a park could pinpoint the exact playground.

Beyond location, EXIF data can include your device's make and model, unique serial numbers that act as a digital fingerprint for your specific camera, the exact date and time down to the second, software used for editing, and sometimes even your name if it's set in your device's owner field.

**Who can see this data?**

Anyone who has access to the original image file can extract EXIF data in seconds using freely available tools. When you share photos via email, upload them to certain websites, sell items on marketplaces with product photos, or send images through messaging apps that don't strip metadata, all of this hidden information travels with the file.

Some social media platforms like Facebook, Instagram, and Twitter do strip EXIF data when you upload — but many other platforms, forums, marketplaces, and messaging services do not. The safest approach is to remove metadata yourself before sharing, rather than hoping the platform will do it for you.

**What you can do about it**

The simplest solution is to strip EXIF data from your photos before sharing them. ExifVoid does this entirely in your browser — your files never leave your device. You can scan any photo to see exactly what metadata it contains, then remove it with a single click while preserving full image quality.

Being aware of EXIF data is the first step toward better digital privacy. The second step is making metadata removal a habit before sharing any photo online.`,
  },
  {
    slug: 'how-to-remove-location-data-from-iphone-photos',
    title: 'How to Remove Location Data from iPhone Photos',
    description: 'Step-by-step guide to removing GPS coordinates and metadata from iPhone photos before sharing them online.',
    category: 'Educational',
    date: '2026-03-12',
    readTime: '4 min read',
    content: `iPhones are among the most popular cameras in the world, and by default they embed GPS location data into every photo you take. This guide explains how to remove that data before sharing your photos.

**Why iPhones embed location data**

Apple enables location tagging by default because it powers useful features — the Photos app organises images by location, creates travel memories, and lets you search by place. The trade-off is that this GPS data stays embedded in the file when you share it outside the Apple ecosystem.

**Method 1: Disable location tagging in Camera settings**

You can prevent location data from being recorded in the first place. Go to Settings, then Privacy & Security, then Location Services, and find Camera in the list. Set it to Never. This stops future photos from containing GPS data, but it won't remove location from photos you've already taken.

**Method 2: Remove location when sharing from Photos app**

Starting with iOS 15, Apple added a built-in option to strip location when sharing. Open the photo, tap the Share button, then tap Options at the top of the share sheet. Toggle off Location. This removes GPS data from the shared copy while keeping the original intact on your device. However, this only works when sharing through the iOS share sheet — it won't help if you're uploading directly through a website or app.

**Method 3: Use ExifVoid for complete metadata removal**

For thorough metadata removal — not just GPS, but camera serial numbers, timestamps, device information, and all other hidden data — use ExifVoid. Open exifvoid.com in Safari on your iPhone, drop in your photo, scan it to see everything that's embedded, and clean it with one tap. The processing happens entirely on your device, and the cleaned file is ready to share anywhere.

**Which method should you use?**

For casual sharing with friends and family, the built-in iOS sharing option is convenient. For anything going to a public audience — marketplace listings, forum posts, social media on platforms that don't strip metadata, or professional contexts — use ExifVoid for complete removal. The few seconds it takes could prevent your home address from being exposed to strangers.`,
  },
  {
    slug: 'exif-vs-xmp-vs-iptc-metadata-explained',
    title: 'EXIF vs XMP vs IPTC: Photo Metadata Types Explained',
    description: 'A deep dive into the three main types of photo metadata — EXIF, XMP, and IPTC — what each contains, and why they all matter for privacy.',
    category: 'Forensic',
    date: '2026-03-10',
    readTime: '6 min read',
    content: `When we talk about "photo metadata," we're actually referring to several distinct standards that can coexist within a single image file. Understanding the differences matters because removing only one type while leaving others intact can still expose your private information.

**EXIF (Exchangeable Image File Format)**

EXIF is the most well-known metadata standard and the one most directly tied to privacy concerns. It was developed by the Japan Electronic Industries Development Association and is primarily generated by the camera hardware at the moment of capture.

EXIF data includes camera settings like aperture, shutter speed, ISO, and focal length. It also includes GPS coordinates if location services are enabled, device make, model, and unique serial numbers, date and time of capture accurate to the second, thumbnail previews of the image, and orientation information.

EXIF data lives in the APP1 segment of JPEG files and in specific tags within TIFF-based formats. It's the segment most privacy tools target, but it's not the only place sensitive information hides.

**XMP (Extensible Metadata Platform)**

XMP was created by Adobe and uses XML formatting to store metadata. It's more flexible than EXIF and can contain a much wider range of information. XMP data often includes editing history and software used, photographer name and contact details, copyright and licensing information, keywords, ratings, and descriptions, and geographic data duplicated from or supplementing EXIF.

XMP is particularly common in photos that have been processed through Adobe Lightroom, Photoshop, or other professional editing software. It can also appear in the APP1 segment of JPEGs alongside EXIF data, making it important to target both during removal.

**IPTC (International Press Telecommunications Council)**

IPTC metadata was originally designed for news agencies and press photography. It provides standardised fields for editorial information including photographer name and byline, caption and description, location details such as city, state, and country, copyright holder and usage terms, and category and keyword classifications.

IPTC data lives in the APP13 segment of JPEG files. While less common in casual photography, it's frequently present in stock photos, press images, and any photo that's been processed through professional workflows.

**Why all three matter for privacy**

A common mistake is assuming that removing EXIF data is sufficient. In practice, sensitive information can be duplicated across all three standards. GPS coordinates might exist in both EXIF and XMP. Your name might appear in IPTC and XMP but not EXIF. Editing software might add XMP data that reveals your workflow even after EXIF is stripped.

ExifVoid's binary excision approach removes all three metadata types simultaneously by stripping the relevant JPEG segments (APP1 for EXIF and XMP, APP13 for IPTC) in a single pass. This ensures comprehensive removal rather than partial cleanup.

**The bottom line**

If you're serious about photo privacy, you need a tool that addresses all metadata standards — not just EXIF. When scanning a photo with ExifVoid, the Privacy Scan report shows you exactly which types of metadata are present and categorises the risk level of each, giving you full visibility before you clean.`,
  },
  {
    slug: 'gdpr-photo-metadata-what-businesses-need-to-know',
    title: 'GDPR and Photo Metadata: What Businesses Need to Know',
    description: 'How GDPR applies to EXIF data in photos, and what businesses must do to stay compliant when handling images containing personal metadata.',
    category: 'Compliance',
    date: '2026-03-08',
    readTime: '5 min read',
    content: `Photo metadata falls squarely within the scope of GDPR, and many businesses don't realise it. GPS coordinates, device serial numbers, and photographer names embedded in image files all qualify as personal data under the regulation. If your business handles photos — whether from customers, employees, or the public — metadata compliance should be on your radar.

**Is EXIF data personal data under GDPR?**

Yes. The GDPR defines personal data as any information relating to an identified or identifiable natural person. GPS coordinates can pinpoint a person's location. Device serial numbers can be linked to a specific individual. Timestamps combined with location can reveal behavioural patterns. Names and contact details embedded in IPTC or XMP metadata are explicitly personal.

The Article 29 Working Party (now the European Data Protection Board) has confirmed that location data and device identifiers constitute personal data, even when not directly attached to a name.

**Common scenarios where this matters**

E-commerce businesses that accept customer-submitted product photos may be storing GPS coordinates that reveal customer home addresses. Real estate agencies publishing property photos may be exposing agent device information. News organisations distributing press photos may be sharing photographer personal data beyond what's necessary. User-generated content platforms retaining original uploads may be storing metadata indefinitely without a legal basis.

**What the GDPR requires**

Under the data minimisation principle in Article 5(1)(c), organisations should only process personal data that is adequate, relevant, and limited to what is necessary. In most cases, the metadata embedded in a photo is not necessary for the business purpose of using that photo. Stripping it before storage or publication is a straightforward way to comply.

Article 25 requires data protection by design and by default. Building metadata removal into your image handling pipeline — rather than treating it as an afterthought — demonstrates compliance with this principle.

**Practical steps for compliance**

The most effective approach is to implement automated metadata stripping at the point of image ingestion. When a photo enters your system — whether uploaded by a user, received via email, or captured by staff — strip all metadata before storing or processing it further.

For businesses that need to handle this at scale, client-side solutions like ExifVoid ensure that metadata is removed before files even reach your servers, reducing your data protection liability from the outset.

**The cost of getting it wrong**

GDPR fines can reach up to 4% of annual global turnover or 20 million euros, whichever is higher. While enforcement actions specifically targeting photo metadata are still relatively uncommon, regulators are increasingly sophisticated in their understanding of technical data types. Proactive compliance is far cheaper than reactive remediation.`,
  },
  {
    slug: 'how-to-remove-metadata-from-android-photos',
    title: 'How to Remove Metadata from Android Photos',
    description: 'Complete guide to stripping EXIF data, GPS location, and metadata from Android phone photos before sharing.',
    category: 'Educational',
    date: '2026-03-06',
    readTime: '4 min read',
    content: `Android phones embed metadata into every photo by default, including GPS coordinates, device information, and timestamps. Because the Android ecosystem varies significantly across manufacturers, the options for removing this data depend on your specific device and Android version.

**Disabling location tagging on Android**

The exact steps vary by manufacturer, but the general approach is consistent. Open your Camera app, go to its Settings (usually a gear icon), and look for an option called Location tags, Geotagging, or Store location. Toggle it off. On Samsung devices, this is under Camera Settings then Location tags. On Pixel phones, it's under Camera Settings then Save location.

This prevents future photos from containing GPS data, but existing photos will still have their metadata intact.

**The Android sharing limitation**

Unlike iOS, most Android versions do not offer a built-in option to strip metadata when sharing. When you share a photo through most Android apps, the full original file — metadata and all — is sent. Some messaging apps like WhatsApp and Telegram do strip metadata during their own compression process, but you shouldn't rely on this for privacy-critical sharing.

**Using ExifVoid on Android**

The most reliable cross-device solution is ExifVoid. Open Chrome or any browser on your Android phone, navigate to exifvoid.com, and tap the upload area to select a photo from your gallery. The Privacy Scan will show you exactly what metadata is embedded — including GPS coordinates displayed on a map — and you can remove everything with a single tap.

Because ExifVoid runs entirely in your browser, it works the same way regardless of your Android manufacturer, model, or version. There's no app to install, no permissions to grant, and no data sent to any server.

**What about Google Photos?**

Google Photos does strip some metadata when sharing via link, but the behaviour isn't consistent across all sharing methods. If you download a photo from Google Photos and share it manually, the metadata may still be present. For consistent privacy, remove metadata explicitly before sharing rather than relying on platform-specific behaviour.

**Building the habit**

The most effective privacy practice is to make metadata removal part of your sharing routine. Before uploading a product photo to a marketplace, sharing an image in a forum, or sending a photo to someone you don't fully trust — take ten seconds to run it through ExifVoid. That small habit can prevent your home location, daily routine, and device identity from being exposed.`,
  },
  {
    slug: 'ai-image-provenance-c2pa-and-metadata-future',
    title: 'AI Image Provenance: C2PA, Content Credentials, and the Future of Photo Metadata',
    description: 'How new standards like C2PA and Content Credentials are adding provenance metadata to images, and what this means for privacy.',
    category: 'Compliance',
    date: '2026-03-04',
    readTime: '6 min read',
    content: `The rise of AI-generated images has triggered a new wave of metadata standards designed to prove where an image came from and whether it's been altered. While these standards serve a legitimate purpose — combating misinformation and deepfakes — they also raise new privacy questions.

**What is C2PA?**

The Coalition for Content Provenance and Authenticity (C2PA) is an industry standard backed by Adobe, Microsoft, Google, and major camera manufacturers. It defines a way to embed cryptographically signed metadata into image files that records who created the image, what device or software was used, when and where it was created, and every edit made to the image since creation.

This metadata is designed to be tamper-evident — any modification to the image that isn't recorded in the provenance chain will break the cryptographic signature, flagging the file as potentially altered.

**Content Credentials in practice**

Adobe has been the most aggressive in implementing C2PA through its Content Credentials initiative. Photos taken with supported cameras or created in Adobe tools can carry a verifiable chain of custody. Social media platforms are beginning to display this information, showing users whether an image was AI-generated, captured by a camera, or edited.

**The privacy tension**

Here's where it gets complicated for privacy-conscious users. C2PA provenance data can contain the same categories of personal information as traditional EXIF data — location, device identity, creator name, timestamps — but it's specifically designed to resist removal. The whole point of the standard is that the metadata persists and can be verified.

This creates a genuine tension. The standard that helps verify an image hasn't been deepfaked is also the standard that makes it harder to share photos anonymously. A journalist protecting a source, a domestic abuse survivor documenting evidence, or simply a private individual who doesn't want their location tracked — all face potential challenges as provenance metadata becomes more widespread.

**California SB 942 and legislative pressure**

California's SB 942 and similar legislative efforts are pushing for AI-generated content to carry mandatory provenance markers. While aimed at transparency around synthetic media, these laws may have broader implications for all image metadata handling. Businesses operating in California should monitor this space closely.

**What this means for you**

For now, C2PA metadata is still relatively uncommon in casual photography. But as major camera manufacturers (Sony, Leica, Nikon) ship C2PA-enabled hardware and as platforms begin requiring provenance data, it will become increasingly prevalent.

ExifVoid's approach — scanning and removing all metadata segments including newer provenance blocks — gives users the choice of what to share. Understanding what's in your photo files is the first step toward making informed decisions about your digital privacy, regardless of which standards emerge.`,
  },
  {
    slug: 'how-to-remove-metadata-before-selling-on-ebay',
    title: 'How to Remove Photo Metadata Before Selling on eBay',
    description: 'Selling items on eBay? Your product photos may be exposing your home address through hidden GPS data. Learn how to protect yourself.',
    category: 'Educational',
    date: '2026-03-02',
    readTime: '4 min read',
    content: `If you're selling items on eBay, Depop, Facebook Marketplace, or any online platform, the photos you upload may be silently broadcasting your home address to every potential buyer — and every stranger who views your listing.

**The hidden risk in product photos**

When you photograph an item for sale at home, your phone embeds GPS coordinates into the image file. These coordinates are accurate enough to identify your specific house or flat. Unlike platforms like Instagram that strip this data automatically, many marketplace platforms do not remove metadata from uploaded images. Even when they do, the behaviour can be inconsistent.

This means someone browsing your listing for a vintage lamp or a used bicycle could extract your exact location from the product photo in seconds using freely available tools. For high-value items, this creates an obvious security risk.

**What metadata leaks beyond location**

GPS is the most concerning data point, but it's not the only one. Your device make and model tells buyers what phone you own. Timestamps reveal when you took the photo, which can indicate when you're home. Camera serial numbers could theoretically link multiple selling accounts to the same person.

**How to protect yourself**

Before uploading any product photo to a marketplace, run it through ExifVoid. Drop the image into the tool, check the Privacy Scan to see what's embedded, and clean it with one click. The process takes seconds and the cleaned file preserves full image quality — your buyers won't notice any difference, but your address won't be attached to the listing.

**A simple pre-listing routine**

Make it a habit. Photograph your item, run all the photos through ExifVoid at exifvoid.com in your browser, then upload the cleaned versions to your listing. This adds perhaps thirty seconds to your workflow and eliminates the risk of exposing your location to strangers.

**What about taking photos with location disabled?**

You can disable location tagging in your camera settings, but this affects all your photos — including personal ones where you might want location data for your own organisation. A better approach is to keep location enabled for your personal photos and strip it selectively before sharing. This gives you the best of both worlds.`,
  },
  {
    slug: 'can-metadata-be-used-to-track-you',
    title: 'Can Photo Metadata Be Used to Track You? What You Need to Know',
    description: 'Understanding how EXIF data can be used to track your location, identify your devices, and build a profile of your daily life.',
    category: 'Forensic',
    date: '2026-02-28',
    readTime: '5 min read',
    content: `The short answer is yes — photo metadata can absolutely be used to track you. But the specifics of how this works, and how serious the risk actually is, depend on context.

**Location tracking through GPS coordinates**

The most direct tracking risk comes from GPS data embedded in your photos. Modern smartphones record coordinates accurate to within three to five metres. If you regularly share photos taken at home, your residence can be identified. Photos taken at your workplace reveal where you work. Holiday photos establish your travel patterns.

A determined individual could build a map of your regular locations simply by collecting photos you've shared across different platforms — particularly platforms that don't strip metadata from uploads.

**Device fingerprinting through serial numbers**

Even without GPS data, photos can be linked together through device identifiers. Camera body serial numbers, lens serial numbers, and unique image IDs remain consistent across every photo taken with the same device. This means that if you use the same phone to take photos for both a personal blog and an anonymous marketplace listing, the two accounts could theoretically be linked.

This technique is actually used in digital forensics and has been employed in criminal investigations. The same principle applies to anyone who might want to connect your various online identities.

**Temporal patterns from timestamps**

Timestamps might seem innocuous, but in aggregate they reveal patterns. Regular photos taken at 8am and 6pm might indicate your commute times. Photos consistently taken at specific locations on specific days reveal your routine. Combined with GPS data, timestamps create a detailed picture of your daily movements.

**Social engineering using camera and software data**

Knowing that someone uses a specific camera model, editing software, or operating system provides useful information for social engineering attacks. It's not the highest risk, but it contributes to the overall picture an attacker could build.

**How to protect yourself**

The most effective protection is to strip metadata before sharing any photo publicly. ExifVoid removes all categories of trackable data — GPS, serial numbers, timestamps, device information — in a single pass. Making this a habit before any public upload significantly reduces your digital footprint.

It's worth noting that not every photo needs to be cleaned. Sharing photos with trusted friends and family through encrypted messaging apps poses minimal risk. The concern is primarily with photos shared publicly or with people you don't know personally.`,
  },
  {
    slug: 'how-to-remove-metadata-from-photos-on-windows',
    title: 'How to Remove Metadata from Photos on Windows',
    description: 'A complete guide to removing EXIF data and metadata from photos using Windows built-in tools and ExifVoid.',
    category: 'Educational',
    date: '2026-02-26',
    readTime: '4 min read',
    content: `Windows has a built-in way to view and remove some photo metadata, but it has significant limitations. Here's how to use it, and when you'll want a more thorough solution.

**Method 1: Windows File Properties (built-in)**

Right-click any image file and select Properties. Click the Details tab. You'll see a list of metadata fields including camera information, GPS data, dates, and more. At the bottom of this tab, click "Remove Properties and Personal Information."

Windows gives you two options. You can create a copy with all possible properties removed, or you can select specific properties to remove from the original file. The first option is generally safer.

**Limitations of the Windows method**

The built-in tool has some notable gaps. It doesn't remove all metadata — some XMP and IPTC fields may survive the removal process. It only works with files stored locally on your computer, not with files on external drives or network locations in all cases. It doesn't provide any visualisation of what the metadata means — you see raw field names without context about the privacy implications. And it doesn't work on all image formats consistently.

**Method 2: Using ExifVoid in your browser**

For thorough, format-aware metadata removal with zero quality loss, open any browser on your Windows PC and go to exifvoid.com. Drop your image file into the tool. The Privacy Scan will show you everything embedded in the file — including GPS coordinates on a map, which the Windows properties dialog doesn't do. Click clean to remove all metadata and download the sanitised file.

Because ExifVoid uses binary excision for JPEG files, the cleaning process doesn't re-compress the image. The Windows method also avoids re-compression, but ExifVoid is more thorough in what it removes.

**Method 3: Batch removal with PowerShell**

For technical users who need to process many files, Windows PowerShell can be combined with command-line tools like ExifTool. However, this requires installing third-party software, comfort with command-line interfaces, and careful handling to avoid corrupting files. For most users, this is unnecessarily complex.

**Which method should you use?**

For a quick, one-off removal where thoroughness isn't critical, the built-in Windows Properties method works. For anything you're sharing publicly — marketplace photos, forum posts, professional uploads — use ExifVoid for comprehensive removal with the added benefit of seeing exactly what's in your files before cleaning them.`,
  },
  {
    slug: 'how-to-remove-metadata-from-photos-on-mac',
    title: 'How to Remove Metadata from Photos on Mac',
    description: 'Guide to stripping EXIF data and GPS coordinates from photos on macOS using Preview, Photos app, and ExifVoid.',
    category: 'Educational',
    date: '2026-02-24',
    readTime: '4 min read',
    content: `macOS offers several ways to view photo metadata, but removing it completely requires knowing which tools to use and their limitations.

**Viewing metadata on Mac**

The simplest way to view a photo's metadata on Mac is through Preview. Open the image in Preview, then go to Tools and select Show Inspector (or press Command-I). The Exif tab shows camera settings, dates, and GPS information. This is useful for checking what data exists, but Preview cannot remove metadata.

The Photos app also shows location information. Open a photo, click the info button (i), and you'll see where it was taken on a map. You can remove location from individual photos by clicking the location and selecting Remove Location. However, this only removes GPS data — it leaves all other metadata intact.

**The macOS limitation**

Unlike Windows, macOS doesn't have a built-in "remove all properties" feature for image files. The Photos app can remove location but nothing else. Preview can view metadata but can't edit or remove it. This means Mac users who want thorough metadata removal need a third-party solution.

**Using ExifVoid on Mac**

Open Safari, Chrome, or any browser on your Mac and go to exifvoid.com. Drop in your photo — or click to browse from Finder. The Privacy Scan immediately shows everything embedded in the file, with GPS coordinates displayed on a map and all metadata fields categorised by risk level.

Click clean to strip all metadata. The cleaned file downloads with "_clean" appended to the filename, so you can easily distinguish it from the original. For JPEG files, the process uses binary excision — no re-compression, no quality loss.

**What about the Terminal?**

Mac includes Python by default, and command-line tools like ExifTool can be installed via Homebrew. Running something like "exiftool -all= photo.jpg" removes all metadata from the command line. This is effective but requires Homebrew installation, comfort with Terminal commands, and care to avoid accidentally modifying original files. For most Mac users, the browser-based approach is simpler and equally thorough.

**AirDrop and metadata**

One important note for Mac users: AirDrop transfers the original file with all metadata intact. If you AirDrop a photo to someone, they receive all the embedded GPS data, camera serial numbers, and timestamps. Always clean photos before sharing via AirDrop if privacy matters.`,
  },
  {
    slug: 'do-social-media-platforms-strip-metadata',
    title: 'Which Social Media Platforms Strip Photo Metadata? (2026 Guide)',
    description: 'Find out which platforms remove EXIF data and GPS coordinates from your uploads, and which ones leave your metadata exposed.',
    category: 'Forensic',
    date: '2026-02-22',
    readTime: '5 min read',
    content: `Not all platforms handle your photo metadata the same way. Some strip it entirely on upload, while others leave everything intact. Knowing which is which can help you make informed decisions about where and how you share photos.

**Platforms that DO strip metadata**

Facebook removes EXIF data from uploaded photos, including GPS coordinates. However, Facebook stores this data internally and uses it for their own purposes including ad targeting and location-based features. The metadata is stripped from the publicly visible image, but Facebook retains it.

Instagram similarly strips metadata from uploaded photos. Like Facebook (both owned by Meta), the data is likely retained internally even though it's removed from the downloadable image.

Twitter (X) strips EXIF data from uploaded images. GPS coordinates and camera information are removed from the publicly accessible file.

**Platforms with partial or inconsistent behaviour**

WhatsApp strips metadata when sending photos as standard compressed images. However, when sending photos as documents (uncompressed), metadata may be preserved. Users should be aware of which sending mode they're using.

Telegram strips metadata from standard photo messages but preserves it when files are sent as documents. The behaviour depends on the sending method.

iMessage preserves all metadata when sending between Apple devices. Photos shared via iMessage carry full EXIF data including GPS coordinates.

**Platforms that do NOT strip metadata**

Many forums, marketplace platforms, personal websites, and content management systems do not strip metadata. When you upload a photo to a WordPress blog, a forum attachment, an eBay listing, or a Craigslist post, the original file — metadata included — is often what gets stored and served to viewers.

Email attachments always preserve metadata. When you email a photo, the recipient gets the full original file with all embedded data.

Cloud storage services like Google Drive, Dropbox, and iCloud preserve metadata in stored files. Sharing a photo via a cloud storage link gives the recipient access to the complete file.

**Why you shouldn't rely on platform stripping**

Even for platforms that do strip metadata, there are good reasons to remove it yourself first. Platform behaviour can change without notice. You might not remember which platforms strip and which don't. The platform may retain your data internally even if they strip it from the public file. And during the upload process, your original file — metadata and all — is transmitted to and processed by the platform's servers.

**The safest approach**

Strip metadata yourself before uploading anywhere. This way, your privacy doesn't depend on the platform's behaviour, and you have certainty about what data you're sharing. ExifVoid makes this a five-second step — scan, review, clean, download, upload. It works in any browser and never transmits your files.`,
  },
  {
    slug: 'photo-metadata-for-photographers-what-to-keep-and-remove',
    title: 'Photo Metadata for Photographers: What to Keep and What to Remove',
    description: 'A practical guide for photographers on managing EXIF data — which metadata helps your workflow, and which puts your privacy at risk.',
    category: 'Forensic',
    date: '2026-02-20',
    readTime: '5 min read',
    content: `As a photographer, metadata is both a valuable tool and a potential privacy liability. The key is knowing which data serves your workflow and which should be stripped before sharing or publishing.

**Metadata that helps your workflow**

Camera settings — aperture, shutter speed, ISO, focal length, white balance — are invaluable for learning and improving your craft. Being able to review which settings produced your best shots helps you develop consistency. These fields are generally low-risk from a privacy perspective.

Date and time stamps help with organisation, especially when processing large shoots. Sorting by capture time is essential for event photographers. However, timestamps become a privacy concern when photos are shared publicly, as they can reveal patterns in your schedule.

Colour space and resolution information ensures your files display correctly across devices and in print. These fields are safe to keep.

**Metadata that creates privacy risk**

GPS coordinates are the highest risk. Location data embedded in photos taken at client locations, your home studio, or personal locations can expose addresses you'd prefer to keep private. Even landscape photographers might not want their favourite hidden locations broadcasted to every viewer.

Serial numbers — body and lens — create a unique digital fingerprint. If you sell prints through multiple platforms or maintain both personal and professional accounts, serial numbers can link them together. In rare cases, stolen equipment has been identified through serial numbers in photos, which is actually beneficial. But for most privacy purposes, this is information you'd rather not share.

Camera owner name and copyright fields sometimes auto-populate with your real name from device settings. This is fine for professional work where you want attribution, but problematic for personal photos shared casually.

**A practical approach for photographers**

Rather than stripping everything from every photo, consider a tiered approach. For your personal archive and backups, keep all metadata — it's your data on your own storage. For client deliveries, keep camera settings and copyright information, but remove GPS and serial numbers. For social media and public sharing, strip everything except copyright notice if you want attribution. For anonymous or privacy-sensitive sharing, remove all metadata without exception.

ExifVoid's Privacy Scan is particularly useful for photographers because it categorises metadata by risk level. You can see exactly what's in a file before deciding what to remove. For most sharing scenarios, a full clean is the simplest approach — the camera settings can always be referenced from your original files if needed.

**A note on copyright metadata**

Some photographers rely on embedded IPTC copyright metadata to protect their work. While this is understandable, it's worth noting that copyright protection exists whether or not it's embedded in the file. If someone is determined to use your image without permission, removing the copyright tag from a file is trivial. Watermarking and registration provide stronger protection than embedded metadata.`,
  },
]

/**
 * Get all posts sorted by date (newest first)
 */
export function getAllPosts() {
  return [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug) {
  return POSTS.find(p => p.slug === slug) || null
}

/**
 * Get all unique categories
 */
export function getCategories() {
  return [...new Set(POSTS.map(p => p.category))]
}

/**
 * Get related posts (same category, excluding current)
 */
export function getRelatedPosts(slug, limit = 3) {
  const current = getPostBySlug(slug)
  if (!current) return []
  return getAllPosts()
    .filter(p => p.slug !== slug && p.category === current.category)
    .slice(0, limit)
}
