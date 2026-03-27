const tr = {
  meta: {
    title: "Morphix | 3D ürün web siteleri ve konfigüratörler",
    description:
      "Morphix teknik ve premium markalar için 3D ürün siteleri, konfigüratörler, lansman sayfaları ve interaktif dijital deneyimler tasarlar ve geliştirir.",
  },
  common: {
    brandName: "Morphix",
    homeAriaLabel: "Morphix ana sayfa",
    primaryNavAriaLabel: "Ana gezinme",
    languageSwitcherLabel: "Dil",
    productExamplesAriaLabel: "Ürün konfigüratörü örnekleri",
  },
  nav: {
    hero: "Hero",
    capabilities: "Yetenekler",
    pricing: "Fiyatlandırma",
    about: "Hakkımızda",
    contact: "İletişim",
    cta: "Ürününüzü konuşalım",
  },
  hero: {
    eyebrow: "3D ürün web siteleri ve konfigüratörler",
    proofline: [
      "Three.js uygulaması",
      "3D modeller ve renderlar dahil",
      "Prodüksiyona hazır front-end teslimi",
    ],
    title: "Karmaşık ürünleri",
    titleAccent: "anlamayı ve yapılandırmayı kolaylaştıran 3D ürün web siteleri.",
    copy:
      "Morphix, konfigürasyona açık, teknik ve premium ürünler için ciddi ve prodüksiyona hazır deneyimler geliştirir. Müşterilerin seçenekleri daha yüksek güvenle ve daha az sürtünmeyle değerlendirebilmesi için net mesajlaşmayı, Three.js etkileşimini, ürün mantığını ve web'e hazır asset teslimini bir araya getiriyoruz.",
    primaryCta: "Konfigüratörünüzü planlayın",
    secondaryCta: "Demo bölümünü görün",
    stats: [
      {
        label: "Kullanım alanları",
        value: "konfigüratörler, lansman sayfaları, ürün anlatımları",
      },
      {
        label: "Ürün mantığı",
        value: "boyut, kaplama, varyantlar, modüller, ekler",
      },
      {
        label: "Teslimat",
        value: "Three.js, assetler, renderlar ve lansman desteği",
      },
    ],
    stage: {
      label: "Lansman için yapılandırıldı",
      title: "Alıcıya fayda sağladığı yerde 3D derinlik kullanan ciddi ürün hikâye anlatımı.",
      copy:
        "Sitenin ikna edici, hızlı ve bakımı kolay kalması için ürün anlatımını, etkileşim modelini ve teslim sistemini birlikte tasarlıyoruz.",
      points: [
        "Net sayfa yapısı",
        "İnteraktif ürün mantığı",
        "3D assetler ve renderlar",
        "Prodüksiyon handoff'u",
      ],
    },
    delivery: {
      chip: "Gerçek ürün ekipleri için tasarlandı",
      copy:
        "Konfigürasyona açık ürünlerde web sitesi arayüzünü, Three.js uygulamasını, 3D asset sürecini ve ekibinizin lansman, kampanya ve satış için ihtiyaç duyduğu görselleri üstlenebiliriz.",
      points: [
        "Ürün sayfaları",
        "Konfigüratör mantığı",
        "Asset üretimi",
        "Lansman desteği",
      ],
    },
  },
  configuratorDemo: {
    eyebrow: "İnteraktif konfigüratör demosu",
    title: "Gerçek ürün modelleriyle çalışan gerçek bir 3D konfigüratör alanı.",
    copy:
      "Koltuk, telefon ve XR başlığı arasında geçiş yapın; ardından gerçek GLB assetleri üzerinde kaplama, ölçek, odak ve sahne presetlerini test edin. Demo artık statik bir illüstrasyon değil, orbit kontrolleri ve WebXR başlatma yetenekleri olan canlı bir WebGL görüntüleyicisidir.",
    sidebar: {
      label: "Bu demonun kanıtladığı",
      title: "Tek arayüz, birden fazla ürün tipi, gerçek 3D assetler.",
      copy:
        "Aynı konfigüratör mimarisi; mobilya, tüketici elektroniği ve XR donanımını desteklerken seçim akışını düzenli tutabilir ve premium bir web sitesi için yeterli performansı koruyabilir.",
      points: [
        "Gerçek GLB model yükleme",
        "Kaplama ve ölçek presetleri",
        "Sahneye uygun ürün sunumu",
        "AR ve VR oturum desteği",
      ],
    },
    delivery: {
      copy:
        "Bu yapı; varyant mantığı, fiyat kuralları, CMS beslemeli ürün verisi, analitik event'leri ve prodüksiyon lansmanları için cihaza özel AR veya VR aktarımlarıyla genişletilebilir.",
    },
    shell: {
      label: "Gerçek zamanlı konfigüratör demosu",
      title: "Ürün geçişi, seçenek mantığı ve XR başlatma kontrolleri olan canlı WebGL görüntüleyicisi.",
      copy:
        "Aktif modeli değiştirin, kaplama ve sahne presetlerini deneyin, asseti serbestçe döndürün ve desteklenen cihazlarda ürün akışından çıkmadan AR veya VR başlatın.",
      stageBadge: "Gerçek model önizlemesi",
      footerPoints: [
        "Gerçek 3D assetler",
        "Orbit ve zoom",
        "Kaplama ve sahne mantığı",
        "AR / VR hazır",
      ],
      viewer: {
        loading: "Model yükleniyor...",
        error: "Bu model şu anda yüklenemedi. Sayfayı yenileyip tekrar deneyin.",
        dragHint: "Orbit için sürükleyin. Yakınlaştırmak için scroll veya pinch kullanın.",
        xrNote: "AR ve VR, WebXR destekleyen tarayıcı ve cihazlarda açılır.",
        arLaunch: "AR başlat",
        arExit: "AR'dan çık",
        arUnsupported: "AR kullanılamıyor",
        vrLaunch: "VR başlat",
        vrExit: "VR'dan çık",
        vrUnsupported: "VR kullanılamıyor",
      },
    },
  },
  heroConfiguratorProducts: [
    {
      key: "sofa",
      label: "Lounge kanepe",
      category: "Mobilya",
      previewNote: "Kaplama, ölçü izi ve sahne presetleri olan gerçek kanepe modeli.",
      controls: [
        {
          id: "size",
          label: "Yerleşim izi",
          type: "pill",
          options: [
            { value: "compact", label: "Kompakt" },
            { value: "standard", label: "Standart" },
            { value: "expansive", label: "Geniş" },
          ],
        },
        {
          id: "finish",
          label: "Döşeme",
          type: "swatch",
          options: [
            { value: "graphite", label: "Grafit", color: "#6f7983" },
            { value: "sand", label: "Kum", color: "#d8d0c6" },
            { value: "sage", label: "Adaçayı", color: "#7d8977" },
          ],
        },
        {
          id: "feature",
          label: "Odak",
          type: "pill",
          options: [
            { value: "lounge", label: "Lounge görünümü" },
            { value: "detail", label: "Malzeme detayı" },
            { value: "styling", label: "Stil açısı" },
          ],
        },
        {
          id: "environment",
          label: "Sahne",
          type: "pill",
          options: [
            { value: "loft", label: "Loft" },
            { value: "showroom", label: "Showroom" },
            { value: "editorial", label: "Editoryal" },
          ],
        },
      ],
    },
    {
      key: "phone",
      label: "iPhone 14 Pro Max",
      category: "Tüketici elektroniği",
      previewNote: "Kaplama, ölçek ve detay odağı presetleri olan gerçek cihaz modeli.",
      controls: [
        {
          id: "size",
          label: "Ölçek",
          type: "pill",
          options: [
            { value: "pocket", label: "Cep" },
            { value: "standard", label: "Standart" },
            { value: "hero", label: "Hero çekim" },
          ],
        },
        {
          id: "finish",
          label: "Kaplama",
          type: "swatch",
          options: [
            { value: "graphite", label: "Grafit", color: "#5c6470" },
            { value: "silver", label: "Gümüş", color: "#d4d9e1" },
            { value: "blue", label: "Koyu mavi", color: "#5d708e" },
          ],
        },
        {
          id: "feature",
          label: "Odak",
          type: "pill",
          options: [
            { value: "camera", label: "Kamera sistemi" },
            { value: "display", label: "Ekran camı" },
            { value: "frame", label: "Titanyum çerçeve" },
          ],
        },
        {
          id: "environment",
          label: "Sahne",
          type: "pill",
          options: [
            { value: "studio", label: "Stüdyo" },
            { value: "retail", label: "Perakende" },
            { value: "night", label: "Gece" },
          ],
        },
      ],
    },
    {
      key: "headset",
      label: "VR başlık",
      category: "XR donanımı",
      previewNote: "Oturma, kaplama ve mod presetleri olan gerçek başlık modeli.",
      controls: [
        {
          id: "size",
          label: "Oturma",
          type: "pill",
          options: [
            { value: "compact", label: "Kompakt" },
            { value: "standard", label: "Standart" },
            { value: "extended", label: "Genişletilmiş" },
          ],
        },
        {
          id: "finish",
          label: "Kaplama",
          type: "swatch",
          options: [
            { value: "carbon", label: "Karbon", color: "#4d5663" },
            { value: "frost", label: "Buz", color: "#d6dde6" },
            { value: "neon", label: "Neon", color: "#6f8ffc" },
          ],
        },
        {
          id: "feature",
          label: "Mod",
          type: "pill",
          options: [
            { value: "gaming", label: "Oyun" },
            { value: "productivity", label: "Verimlilik" },
            { value: "demo", label: "Demo" },
          ],
        },
        {
          id: "environment",
          label: "Sahne",
          type: "pill",
          options: [
            { value: "stage", label: "Sahne" },
            { value: "lab", label: "Laboratuvar" },
            { value: "immersive", label: "İmmersif" },
          ],
        },
      ],
    },
  ],
  servicesSection: {
    eyebrow: "Hizmetler",
    title: "Gerçek alıcılar için tasarlanmış özelleştirilebilir ürün konfigüratörleri ve ürün web siteleri.",
    copy:
      "Müşterilerin satış ekibiyle konuşmadan veya satın alma kararı vermeden önce ne aldığını yapılandırma, karşılaştırma ve anlayış yoluyla netleştiren ürün deneyimleri tasarlıyoruz.",
    showcaseEyebrow: "Konfigüratör sistemleri",
    showcaseTitle: "Gerçek dünya seçeneklerine sahip ürünler için gelişmiş web konfigüratörleri geliştiriyoruz.",
    showcaseCopy:
      "Pergola, mobilya, aydınlatma, ekipman ve diğer konfigürasyona açık ürünleri satan markalar için kullanıcıların ölçüleri, renkleri, malzemeleri, aksesuarları, yan modülleri ve ortam görünümlerini anında görsel geri bildirimle değiştirebildiği yönlendirmeli konfigüratörler oluşturabiliriz.",
    configuratorFeatures: [
      {
        title: "Müşterilerin gerçekten kullandığı seçenek kontrolleri",
        copy:
          "Boyut, kaplama, renk, ürün tipi, ekler, aksesuarlar, yan paneller, aydınlatma ve diğer yüksek etkili seçenekler tek ve net bir arayüzde yönetilebilir.",
      },
      {
        title: "Ortama duyarlı ürün görselleştirme",
        copy:
          "Alıcıların ürünü daha gerçekçi bir bağlamda değerlendirebilmesi için ortamlar, kamera açıları ve bağlamsal sahneler arasında geçiş yapabiliriz.",
      },
      {
        title: "3D assetler dahil",
        copy:
          "Konfigüratörü doğru şekilde yayına almak için gereken 3D modelleri, malzemeleri, optimize edilmiş web assetlerini ve destekleyici renderları sağlayabiliriz.",
      },
      {
        title: "Web için Three.js ile geliştirilir",
        copy:
          "Konfigüratör sistemlerimiz responsive ürün siteleri için tasarlanır ve fiyat mantığı, CMS içeriği ve ticari akışlara entegre edilebilir.",
      },
    ],
    services: [
      {
        title: "Özel Three.js konfigüratörleri",
        copy:
          "Müşterilerin boyut, kaplama, renk, ürün seçenekleri, ekler ve görünümleri anında görsel geri bildirimle değiştirmesine olanak tanıyan, web sitesine entegre konfigüratörler.",
        tags: ["Three.js", "Seçenekler", "Ticaret"],
      },
      {
        title: "Ürün lansman web siteleri",
        copy:
          "Yazılım, donanım ve premium ürünler için ürün hikâyesini, kanıtı ve dönüşüm yapısını tek bir net müşteri yolculuğunda birleştiren lansman sayfaları.",
        tags: ["Launch", "Mesajlaşma", "Dönüşüm"],
      },
      {
        title: "3D model ve render üretimi",
        copy:
          "Web siteleri, kampanyalar ve satış araçları için optimize 3D assetler, stüdyo renderları, ürün kesitleri ve konfigürasyona hazır model setleri üretiyoruz.",
        tags: ["Modeller", "Renderlar", "Assetler"],
      },
      {
        title: "İnteraktif ürün demoları",
        copy:
          "Müşterilerin arama planlamadan veya deneme başlatmadan önce yetenekleri, iş akışlarını ve fark yaratan unsurları anlamasına yardımcı olan yönlendirmeli 3D ve motion odaklı demolari hazırlıyoruz.",
        tags: ["Demo", "Eğitim", "Dönüşüm"],
      },
    ],
    portfolioEyebrow: "Portföy",
    portfolioTitle:
      "Karmaşık veya premium teklif satan ekipler için temsili ürün kullanım senaryoları.",
    portfolio: [
      {
        name: "Pergola konfigüratör sistemi",
        type: "Açık hava ürünleri",
        result:
          "Müşterilerin boyutu, yan seçenekleri, aydınlatmayı, aksesuarları ve montaj tercihlerini tek bir yönlendirmeli satın alma akışında ayarlayabildiği konfigürasyona açık ürün deneyimi.",
      },
      {
        name: "Premium tüketici elektroniği",
        type: "Tüketici ürünü",
        result:
          "Satın alma öncesi anlayışı güçlendirmek için tasarlanmış interaktif özellik anlatımları ve ürün karşılaştırma görünümleri.",
      },
      {
        name: "Kurumsal SaaS platformu",
        type: "Yazılım",
        result:
          "Platformun soyut değerini karar vericiler ve değerlendirme yapan kişiler için somut bir hikâyeye dönüştüren, yüksek netlikte bir site sistemi.",
      },
    ],
  },
  buildSection: {
    eyebrow: "Neler geliştirebiliriz",
    title: "Ürün, pazarlama ve growth ekipleri için neler geliştirebiliriz.",
    copy:
      "Amaç sadece yenilik olsun diye yenilik yapmak değil. Amaç daha net bir ürün hikâyesi, daha iyi müşteri anlayışı ve ekibinizin güvenle yayına alıp yönetebileceği bir site oluşturmaktır.",
    items: [
      {
        title: "Web tabanlı ürün konfigüratörleri",
        copy:
          "Müşterilerin boyut, renk, malzeme, ürün varyantları, aksesuarlar ve ekleri doğrudan site üzerinden değiştirebildiği interaktif ürün sistemleri.",
      },
      {
        title: "Ortam ve VR önizlemeleri",
        copy:
          "Alıcıların uyumu, ölçeği ve sonucu daha iyi hayal edebilmesi için ürünü farklı ortamlara veya immersive bağlamlara yerleştiren görünümler.",
      },
      {
        title: "3D model ve render paketleri",
        copy:
          "Web siteleri, konfigüratörler, kampanyalar ve ürün pazarlama assetleri için prodüksiyona hazır modelleme, kaplama, ışıklandırma ve render çıktıları.",
      },
      {
        title: "Teknik ürün anlatımları",
        copy:
          "Metinle anlatılması zor olan ürünler için iş akışları, sistemler ve bileşen görünümlerini kapsayan yapılı görsel hikâye anlatımı.",
      },
      {
        title: "Ticarete hazır ürün sayfaları",
        copy:
          "Özellikle daha uzun değerlendirme süreci gerektiren ürünlerde satın alma öncesi müşteri anlayışını ve güveni artıran net ürün sayfaları.",
      },
      {
        title: "Satış ve lansman microsite'ları",
        copy:
          "Lansmanlar, ABM kampanyaları, demoları ve sales enablement süreçleri için hikâyenin odaklı ve ikna edici kalması gereken özel sayfalar.",
      },
    ],
  },
  salesSection: {
    eyebrow: "Satışı nasıl artırır",
    title: "Site müşterilerin karara ilerlemesine nasıl yardım eder.",
    copy:
      "İyi ürün pazarlaması belirsizliği azaltır. Daha güçlü bir dijital deneyim ziyaretçilerin teklifi anlamasına, ekibe güvenmesine ve daha emin şekilde ilerlemesine yardım eder.",
    kicker: "Satış sinyali",
    drivers: [
      {
        title: "Ürün belirsizliğini azaltır",
        copy:
          "Müşteriler yoğun veya teknik mesajları çözmek zorunda kalmadan ürünün ne yaptığını, kimin için olduğunu ve neden önemli olduğunu anlar.",
      },
      {
        title: "Karar güvenini artırır",
        copy:
          "Daha net görseller ve yönlendirmeli motion, alıcıların demo talep etmeden, satışla iletişime geçmeden veya checkout'a ilerlemeden önce kendilerini daha emin hissetmesine yardım eder.",
      },
      {
        title: "Daha uzun değerlendirme gerektiren alışları destekler",
        copy:
          "Premium, konfigürasyona açık veya teknik ürünlerde daha güçlü bir ürün hikâyesi dikkati haklı çıkarabilir ve daha uzun bir değerlendirme sürecini destekleyebilir.",
      },
      {
        title: "Lead kalitesini iyileştirir",
        copy:
          "Site daha fazla soruyu önceden yanıtladığında, satış görüşmeleri daha iyi bir bağlam ve daha nitelikli bir niyetle başlar.",
      },
    ],
  },
  processSection: {
    eyebrow: "Sürecimiz",
    title: "Netlik, hız ve temiz handoff için tasarlanmış bir teslim süreci.",
    copy:
      "Her aşama, çalışmanın paydaşlar için anlaşılır ve lansmandan sorumlu ekip için yönetilebilir kalması için tasarlanmıştır.",
    steps: [
      {
        step: "01",
        title: "Keşif ve hedefler",
        copy:
          "Deneyimin müşterilerin teklifi gerçekte nasıl değerlendirdiğini desteklemesi için ürün, hedef kitle, satın alma yolculuğu ve iş hedefi üzerinde hizalanıyoruz.",
      },
      {
        step: "02",
        title: "Yapı ve prototip",
        copy:
          "Tam üretime geçmeden önce deneyimin net olması için bilgi hiyerarşisini, sayfa yapısını, motion niyetini ve içerik akışlarını haritalandırıyoruz.",
      },
      {
        step: "03",
        title: "Geliştirme ve entegrasyon",
        copy:
          "Siteyi geliştiriyor, formları veya ticari akışları bağlıyor ve her sahneyi responsive davranış, performans ve sürdürülebilirlik için optimize ediyoruz.",
      },
      {
        step: "04",
        title: "QA, lansman ve handoff",
        copy:
          "Breakpoint'ler genelinde test ediyor, temiz bir şekilde yayına alıyor ve ekibinizin güvenle işletebileceği ve geliştirebileceği prodüksiyona hazır bir site teslim ediyoruz.",
      },
    ],
  },
  pricingSection: {
    eyebrow: "Fiyatlandırma",
    title: "Lansman işleri ve uzun vadeli ürün pazarlaması için çalışma modelleri.",
    copy:
      "Tek bir odaklı ürün sayfasıyla, çok bölümlü bir siteyle veya ürünün daha karmaşık bir sistem gerektirdiği durumlarda özel bir kapsamla başlayın.",
    badge: "En çok talep edilen",
    cta: "Hemen iletişin",
    tiers: [
      {
        tier: "Foundation",
        price: "$4,900",
        subtitle: "Tek bir odaklı ürün sayfası veya lansman deneyimi için.",
        features: [
          "Keşif atölyeleri ve sayfa planı",
          "Tek bir yüksek etkili ürün sayfası",
          "Tek bir ana 3D motion sekansı",
          "Responsive QA ve handoff",
        ],
      },
      {
        tier: "Growth",
        price: "$14,900",
        subtitle: "Daha derin müşteri yolculukları olan çok bölümlü ürün siteleri için.",
        features: [
          "Çok bölümlü ürün web sitesi",
          "Özel sahne geçişleri ve motion sistemi",
          "CMS veya API'ye hazır içerik yapısı",
          "Lansman desteği ve optimizasyon",
        ],
        featured: true,
      },
      {
        tier: "Custom",
        price: "Özel",
        subtitle:
          "Konfigüratörler, daha kapsamlı site sistemleri ve sürekli ürün pazarlama çalışmaları için.",
        features: [
          "Karmaşık veri odaklı ürün sahneleri",
          "Commerce, CRM veya CMS entegrasyonları",
          "Yeniden kullanılabilir bileşen ve motion sistemi",
          "Sürekli optimizasyon ve destek",
        ],
      },
    ],
  },
  aboutSection: {
    eyebrow: "Hakkımızda",
    title: "Görsel, kullanışlı ve sürdürülebilir ürün pazarlama deneyimleri tasarlıyoruz.",
    copy:
      "Morphix, web sitesinin sadece iyi görünmesinden fazlasına ihtiyaç duyan ekiplerle çalışır. Site ürünü açıklamalı, alıcı yolculuğunu desteklemeli ve gerçek lansman koşullarına dayanacak kadar güçlü olmalıdır.",
    principles: [
      {
        title: "Önce ürünün anlaşılması",
        copy:
          "Motion'u sayfayı süslemek için değil ürünü netleştirmek için kullanıyoruz. Mesaj okunabilir, karar yolu ise net kalır.",
      },
      {
        title: "Bir amacı olan motion",
        copy:
          "Her etkileşim yön bulmaya, açıklamaya veya vurgulamaya hizmet etmelidir. Motion müşteriye yardım etmiyorsa yayına alınmaz.",
      },
      {
        title: "Gerçek ekipler için tasarlandı",
        copy:
          "Nihai site, lansmandan sonra içerik güncellemeleri, responsive QA ve uzun vadeli sürdürülebilirlik için yapılandırılır.",
      },
    ],
  },
  contactSection: {
    eyebrow: "Proje intake'i",
    title: "Doğru 3D deneyimi yönlendirmeli bir intake ile şekillendirin.",
    copy:
      "Birkaç odaklı adımdan geçin ve neyi yayına aldığınızı, kime ulaşmak istediğinizi, hangi yeteneklere ihtiyaç duyduğunuzu ve hangi kısıtları tasarımda dikkate almamız gerektiğini paylaşın.",
    facts: [
      "Adım adım proje keşfi",
      "Kapsam, sistemler ve assetler birlikte ele alınır",
      "Daha hızlı ve daha isabetli teklif süreci",
    ],
    wizard: {
      introLabel: "İnteraktif brief oluşturucu",
      stepLabel: "Adım",
      previous: "Geri",
      next: "Devam et",
      submit: "Teklif isteyin",
      successTitle: "Brief kaydedildi",
      successCopy:
        "Intake girdiniz artık size özel bir follow-up için yapılandırıldı. İsterseniz detayları geliştirebilir veya bunu bir sonraki görüşmenin temeli olarak kullanabilirsiniz.",
      steps: [
        {
          title: "Temeller",
          copy: "Ürün, şirket ve projenin genel yönüyle başlayın.",
        },
        {
          title: "Hedef kitle ve amaçlar",
          copy: "Kimi ikna etmeniz gerektiğini ve deneyimin neyi başarması gerektiğini belirtin.",
        },
        {
          title: "Kapsam ve sistemler",
          copy: "Projede önemli olacak deliverable'ları, entegrasyonları ve assetleri seçin.",
        },
        {
          title: "Zamanlama ve iletişim",
          copy: "Timeline, bütçe ve güçlü bir geri dönüş yapmamız için gereken son bağlamı ekleyin.",
        },
      ],
    },
    fields: {
      company: { label: "Şirket", placeholder: "Northline Systems" },
      productName: { label: "Ürün veya teklif", placeholder: "Modüler pergola serisi" },
      website: { label: "Mevcut web sitesi", placeholder: "northline.com" },
      fullName: { label: "Adınız", placeholder: "Alex Morgan" },
      email: { label: "İş e-postası", placeholder: "alex@northlinesystems.com" },
      brief: {
        label: "Ek bağlam",
        placeholder:
          "Satın alma döngüsü, iç onay süreçleri, lansman baskısı veya teknik karmaşıklık hakkında bilmemiz gereken başka ne var?",
      },
    },
    groups: {
      projectType: {
        label: "Ne planlıyorsunuz?",
        description: "Şu anda ihtiyaç duyduğunuz ana çalışma tipini seçin.",
        multi: false,
        options: [
          { value: "configurator", label: "3D konfigüratör" },
          { value: "product-site", label: "Ürün web sitesi" },
          { value: "launch-site", label: "Lansman microsite'ı" },
          { value: "interactive-demo", label: "İnteraktif demo" },
          { value: "redesign", label: "Site yeniden tasarımı" },
        ],
      },
      productStage: {
        label: "Proje bugün hangi aşamada?",
        description: "Ürün veya pazarlama döngüsündeki mevcut noktayı paylaşın.",
        multi: false,
        options: [
          { value: "new-launch", label: "Yeni lansman" },
          { value: "growth-push", label: "Growth ivmesi gerekiyor" },
          { value: "repositioning", label: "Yeniden konumlandırma" },
          { value: "sales-enable", label: "Satış desteği" },
        ],
      },
      audience: {
        label: "Ana hedef kitle kim?",
        description: "Sitenin güçlü şekilde hizmet etmesi gereken tüm grupları seçin.",
        multi: true,
        options: [
          { value: "end-customers", label: "Son kullanıcılar" },
          { value: "enterprise-buyers", label: "Kurumsal alıcılar" },
          { value: "technical-evaluators", label: "Teknik değerlendiriciler" },
          { value: "partners", label: "Distribütörler ve iş ortakları" },
          { value: "sales-teams", label: "İç satış ekipleri" },
        ],
      },
      goals: {
        label: "Deneyim neyi sağlamalı?",
        description: "Sizin için en önemli sonuçları seçin.",
        multi: true,
        options: [
          { value: "clarity", label: "Karmaşık teklifi netleştirmek" },
          { value: "show-options", label: "Seçenekleri görsel olarak göstermek" },
          { value: "lead-quality", label: "Lead kalitesini artırmak" },
          { value: "sales-support", label: "Satış görüşmelerini desteklemek" },
          { value: "launch-momentum", label: "Lansman kampanyasını güçlendirmek" },
        ],
      },
      deliverables: {
        label: "Bizden ne teslim etmemizi istiyorsunuz?",
        description: "Sahiplenmemizi istediğiniz iş akışlarını seçin.",
        multi: true,
        options: [
          { value: "strategy", label: "Site stratejisi ve mesajlaşma" },
          { value: "design-build", label: "UI tasarımı ve front-end geliştirme" },
          { value: "threejs", label: "Three.js sahneleri ve etkileşimler" },
          { value: "models", label: "3D model üretimi" },
          { value: "renders", label: "Render veya motion asset paketi" },
          { value: "cms", label: "CMS veya içerik yapısı" },
        ],
      },
      integrations: {
        label: "Hangi sistemler önemli?",
        description: "Projenin bağlanması gereken platformları ve mantığı işaretleyin.",
        multi: true,
        options: [
          { value: "cms", label: "CMS" },
          { value: "crm", label: "CRM veya formlar" },
          { value: "commerce", label: "Commerce altyapısı" },
          { value: "pricing", label: "Fiyat veya teklif mantığı" },
          { value: "analytics", label: "Analitik" },
          { value: "localization", label: "Yerelleştirme" },
        ],
      },
      assets: {
        label: "Şu anda elinizde neler var?",
        description: "Hazır olan materyalleri ve hâlâ üretim gerektirenleri belirtin.",
        multi: true,
        options: [
          { value: "brand", label: "Marka sistemi" },
          { value: "copy", label: "Mesajlaşma veya copy" },
          { value: "cad", label: "CAD veya 3D modeller" },
          { value: "renders", label: "Fotoğraf veya renderlar" },
          { value: "team", label: "İç dev veya pazarlama ekibi" },
          { value: "none", label: "Sıfırdan başlıyoruz" },
        ],
      },
      timeline: {
        label: "Tercih edilen timeline",
        description: "Hedeflediğiniz tempoyu seçin.",
        multi: false,
        options: [
          { value: "2-weeks", label: "2 hafta içinde" },
          { value: "1-month", label: "1 ay içinde" },
          { value: "2-3-months", label: "2-3 ay içinde" },
          { value: "flexible", label: "Esnek" },
        ],
      },
      budget: {
        label: "Bütçe aralığı",
        description: "Bu, başlangıçta doğru kapsamı önermemize yardımcı olur.",
        multi: false,
        options: [
          { value: "4900-9900", label: "$4,900 - $9,900" },
          { value: "10000-19900", label: "$10,000 - $19,900" },
          { value: "20000-49900", label: "$20,000 - $49,900" },
          { value: "50000-plus", label: "$50,000+" },
        ],
      },
    },
    summary: {
      title: "Proje özeti",
      empty: "Seçimleriniz burada canlı bir brief olarak oluşacak.",
      labels: {
        projectType: "Proje",
        productStage: "Aşama",
        audience: "Hedef kitle",
        goals: "Amaçlar",
        deliverables: "Deliverable'lar",
        integrations: "Entegrasyonlar",
        assets: "Assetler",
        timeline: "Timeline",
        budget: "Bütçe",
      },
    },
  },
  footer: {
    copy:
      "Ekiplerin karmaşık teklifleri net bir şekilde anlatmasına ve daha iyi müşteri kararlarını desteklemesine yardım eden ürün web siteleri ve interaktif deneyimler geliştiriyoruz.",
    cta: "Bir görüşme başlatın",
    capabilitiesTitle: "Neler geliştiriyoruz",
    capabilities: [
      "Ürün lansman web siteleri",
      "İnteraktif özellik demoları",
      "Konfigüratör yolculukları",
      "Prodüksiyona hazır site sistemleri",
    ],
    outcomesTitle: "İş etkisi",
    outcomes: [
      "Ürünü netleştirin",
      "Alıcı güvenini artırın",
      "Daha nitelikli talepleri destekleyin",
      "Premium konumlanmayı güçlendirin",
    ],
    contactTitle: "İletişim",
    contactItems: [
      "hello@morphix.studio",
      "Uzaktan iş birliği, global teslimat",
      "48 saat içinde teklif geri dönüşü",
    ],
    pricingLink: "Çalışma modellerini görün",
    copyright:
      "Copyright 2026 Morphix. Ürün lansmanları, demoları ve müşteriye dönük site sistemleri için geliştirildi.",
  },
};

export default tr;

