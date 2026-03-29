import { pageMediaSections } from "./pageMedia";

const tr = {
  meta: {
    title: "Configuro | Dijital Ürün Stüdyosu",
    description:
      "Configuro, 3D ürün web siteleri, interaktif yapılandırıcılar ve sürükleyici web deneyimleri konusunda uzmanlaşmış bir dijital ürün stüdyosudur.",
  },
  common: {
    brandName: "Configuro",
    homeAriaLabel: "Configuro ana sayfa",
    primaryNavAriaLabel: "Ana menü",
    languageSwitcherLabel: "Dil",
    productExamplesAriaLabel: "Ürün yapılandırıcı örnekleri",
    mobileNavOpenLabel: "Gezinme menüsünü aç",
    mobileNavCloseLabel: "Gezinme menüsünü kapat",
  },
  nav: {
    home: "Ana Sayfa",
    services: "Hizmetler",
    playground: "Playground",
    work: "Çalışmalar",
    pricing: "Fiyatlandırma",
    about: "Hakkımızda",
    contact: "İletişim",
    cta: "Proje başlat",
  },
  // ── ANA SAYFA ──
  hero: {
    headline: "İnsanların gerçekten keşfetmek istediği ürünler yapıyoruz.",
    subline:
      "Configuro bir dijital ürün stüdyosudur. Unutulmayı reddeden markalar için 3D web siteleri, interaktif yapılandırıcılar ve lansman deneyimleri tasarlıyor ve geliştiriyoruz.",
    primaryCta: "Proje başlat",
    secondaryCta: "Çalışmalarımızı gör",
  },
  valueProps: {
    eyebrow: "Neden Configuro",
    items: [
      {
        title: "İnteraktif, dekoratif değil",
        copy: "Her 3D öğe alıcıya hizmet eder. Yapılandırma, karşılaştırma, keşif — sadece göz zevki değil.",
      },
      {
        title: "Üretim için tasarlandı",
        copy: "Three.js, optimize edilmiş varlıklar, duyarlı düzenler. Hızlı yayınlanır, sorunsuz çalışır, temiz ölçeklenir.",
      },
      {
        title: "Uçtan uca teslimat",
        copy: "Strateji, tasarım, 3D, ön yüz, lansman. Tek ekip, tek süreç, aktarım boşlukları yok.",
      },
    ],
  },
  servicesPreview: {
    eyebrow: "Ne yapıyoruz",
    title: "Konseptten lansmana kadar her şeyi biz yönetiyoruz.",
    items: [
      { title: "3D Yapılandırıcılar", copy: "Müşterileriniz kendi ürünlerini oluştursun." },
      { title: "Ürün Web Siteleri", copy: "Sadece etkilemekle kalmayan, dönüşüm sağlayan hikaye anlatımı." },
      { title: "Lansman Deneyimleri", copy: "Ürün lansmanları ve kampanyalar için sürükleyici sayfalar." },
    ],
    cta: "Tüm hizmetler",
  },
  portfolioPreview: {
    eyebrow: "Seçili çalışmalar",
    title: "Hayata geçirdiğimiz ürünler.",
    projects: [
      {
        name: "Açık Hava Yaşam Yapılandırıcısı",
        type: "Pergola Sistemi",
        result: "Müşteriler boyut, kaplama, aydınlatma ve aksesuarları yönlendirilmiş bir 3D akışta yapılandırıyor. Satış öncesi soruları yarıya indirdi.",
      },
      {
        name: "Tüketici Elektroniği Lansmanı",
        type: "Ürün Web Sitesi",
        result: "Sayfada geçirilen süreyi 3 kat artıran ve demo taleplerinde ölçülebilir artış sağlayan interaktif özellik turu.",
      },
    ],
    cta: "Tüm çalışmaları gör",
  },
  trust: {
    eyebrow: "Sonuçlar",
    items: [
      { metric: "3×", label: "ortalama sayfa süresi artışı" },
      { metric: "50%", label: "daha az satış öncesi destek sorusu" },
      { metric: "40%", label: "ürün sayfalarında daha yüksek dönüşüm" },
    ],
  },
  homeContact: {
    eyebrow: "Hızlı soru",
    title: "Aklınızda bir proje mi var?",
    copy: "Bize yazın. 48 saat içinde dönüş yapacağız.",
    fields: {
      name: { label: "Ad", placeholder: "Ali Yılmaz" },
      email: { label: "E-posta", placeholder: "ali@sirket.com" },
      message: { label: "Mesaj", placeholder: "Projeniz hakkında kısaca bilgi verin..." },
    },
    submit: "Mesaj gönder",
    successTitle: "Gönderildi!",
    successCopy: "En kısa sürede sizinle iletişime geçeceğiz.",
  },
  homeCta: {
    headline: "Ürününüzü unutulmaz kılmaya hazır mısınız?",
    copy: "Bize ne üzerinde çalıştığınızı anlatın. Nelerin mümkün olduğunu gösterelim.",
    button: "İletişime geç",
  },
  ...pageMediaSections.tr,
  mediaSlotsShared: {
    eyebrow: "Medya alanları",
    title: "Görseller ve render videoları için ayrılmış alan.",
    copy: "Bu yer tutucuları final ürün görselleri, lansman hareketleri, turntable render videoları veya kısa walkthrough kayıtları hazır olduğunda kullanabilirsiniz.",
    items: [
      {
        type: "image",
        label: "Görsel alanı",
        title: "Sabit görsel veya render",
        copy: "Ürün fotoğrafları, malzeme yakın planları, anotasyonlu görseller veya güçlü hero render'ları için kullanın.",
      },
      {
        type: "video",
        label: "Render video alanı",
        title: "Hareketli render veya walkthrough",
        copy: "Turntable videoları, özellik anlatımları, UI kayıtları veya kısa lansman sekansları için kullanın.",
      },
    ],
    note: "Bu alanlar, her sayfayı yeniden tasarlamadan son varlıklarla daha sonra değiştirilebilmesi için eklendi.",
  },
  // ── HİZMETLER SAYFASI ──
  servicesPage: {
    eyebrow: "Hizmetler",
    headline: "İnsanların hatırlayacağı bir ürün lansmanı için ihtiyacınız olan her şey.",
    copy: "Strateji, tasarım, 3D mühendislik ve ön yüz geliştirmeyi tek bir odaklı çalışmada birleştiriyoruz. Parça parça tedarikçiler yok, aktarım karmaşası yok.",
    servicesIntro: {
      eyebrow: "Neler inşa edebiliriz",
      title: "Ürününüzün satış biçimine uyan destek.",
      copy: "Bazı projelerin tek ve güçlü bir çıktıya ihtiyacı olur. Bazılarıysa tüm lansman sistemine. Biz netlik, görsel kalite ve etkileşimin en çok önem kazandığı yerde devreye giriyoruz.",
    },
    story: {
      panelLabel: "Müşterilerin genelde ihtiyacı olan",
      title: "Ürünü düşünebilen ve işi gerçekten çıkarabilen bir ortak.",
      copy: "Çoğu ekip bize kusursuz bir brief ile gelmiyor. Ellerinde güçlü bir ürün, yarım kalmış varlıklar, lansman baskısı ve mevcut sunumun yapılan işi tam yansıtmadığı hissi oluyor.",
      points: [
        {
          title: "Güzel çıktılardan önce net düşünce",
          copy: "Deneyimi tasarlamadan önce alıcının neyi görmesi, neyi karşılaştırması ve neye güvenmesi gerektiğini anlıyoruz.",
        },
        {
          title: "Tasarım ve geliştirme aynı odada",
          copy: "Metin, düzen, hareket, 3D ve ön yüz birlikte şekilleniyor; böylece sonuç parça parça değil, tek bir bütün gibi hissediyor.",
        },
        {
          title: "Lansmandan sonra da kullanışlı",
          copy: "Teslimatlar sadece ilk kampanya için değil, satış, pazarlama ve ürün ekiplerinin sonraki kullanımına da hizmet edecek şekilde hazırlanıyor.",
        },
      ],
      note: "Özellikle seçenekli, teknik ayrıntısı yüksek veya fiyatını anlatmak için daha güçlü bir hikaye gerektiren ürünlerde iyi sonuç veriyoruz.",
    },
    services: [
      {
        title: "3D Ürün Yapılandırıcıları",
        copy: "Müşterilerin boyut, kaplama, renk, aksesuar ve ortamı anında görsel geri bildirimle değiştirebildiği, web sitesine entegre yapılandırıcılar. Three.js ile güçlendirilmiş, dönüşüm için tasarlanmış.",
        tags: ["Three.js", "Ürün Mantığı", "Ticarete Hazır"],
      },
      {
        title: "Ürün Lansman Web Siteleri",
        copy: "Ürün anlatısı, kanıt ve dönüşüm yapısını tek bir net yolculukta birleştiren yüksek etkili sayfalar. Ürününüzün dünyayla buluştuğu an için tasarlanmış.",
        tags: ["Lansman", "Hikaye Anlatımı", "Dönüşüm"],
      },
      {
        title: "3D Varlık Üretimi",
        copy: "Optimize edilmiş 3D modeller, stüdyo görselleri, ürün kesit görünümleri ve yapılandırmaya hazır varlık setleri. Web siteniz, kampanyalarınız ve satış materyalleriniz için ihtiyacınız olan her şey.",
        tags: ["Modeller", "Görselleştirme", "WebGL Varlıkları"],
      },
      {
        title: "İnteraktif Ürün Demoları",
        copy: "Müşterilerin bir görüşme planlamadan önce yetenekleri anlamasına yardımcı olan yönlendirilmiş 3D ve hareket odaklı turlar. Baskıyla değil, netlikle satış yapın.",
        tags: ["Demo", "Eğitim", "Self Servis"],
      },
      {
        title: "Teknik Açıklayıcılar",
        copy: "Yalnızca metinle anlatılamayacak kadar karmaşık ürünler için. Karmaşık olanı anlaşılır kılan animasyonlu parça görünümleri, bileşen gösterimleri ve iş akışı görselleştirmeleri.",
        tags: ["Animasyon", "Açıklayıcı", "Karmaşık Ürünler"],
      },
      {
        title: "Ticarete Hazır Sayfalar",
        copy: "Yüksek değerlendirme gerektiren satın almalar için tasarlanmış ürün sayfaları. Müşteri ödeme aşamasına ulaşmadan fiyatı haklı kılan net yapı, güven sinyalleri ve görsel derinlik.",
        tags: ["E-ticaret", "Güven", "Premium"],
      },
    ],
    mediaShowcase: {
      eyebrow: "Hizmet kanıt planı",
      title: "Teklifin gerçekten hak edildiğini hissettiren medya alanları.",
      copy: "Tek bir jenerik satır yerine bu bölüm artık lansman hareketi, detay render'ları, arayüz kayıtları, karşılaştırma kareleri ve teslim kanıtı için daha dolu bir yapı sunuyor.",
      layout: "storyboard",
      highlights: ["5 alan", "Ürün + UX kanıtı", "Gerçek satış görüşmeleri için"],
      items: [
        {
          type: "video",
          label: "Açılış filmi",
          meta: "İlk izlenim",
          title: "Marka açılışı, proje tanıtımı veya kısa walkthrough",
          copy: "Hizmet detaylarına geçmeden önce sayfaya otorite ve hareket kazandıran videoyla başlayın.",
          size: "hero",
        },
        {
          type: "image",
          label: "Detay görseli",
          meta: "Zanaat sinyali",
          title: "Yakın plan render, malzeme ailesi veya yüzey sistemi",
          copy: "Yüzeyler, kaplamalar, yapısal detaylar ve premium ürün kareleri için kullanın.",
          size: "standard",
        },
        {
          type: "video",
          label: "UX kaydı",
          meta: "Etkileşim kanıtı",
          title: "Yapılandırıcı akışı, mobil kullanım veya UI walkthrough",
          copy: "Seçenek değişimleri, kamera hareketi, akış durumları veya kompakt mobil demoyu burada gösterin.",
          size: "tall",
        },
        {
          type: "image",
          label: "Karşılaştırma karesi",
          meta: "Değer anlatımı",
          title: "Önce-sonra ekranı, anotasyon katmanı veya kanıt grafiği",
          copy: "Ticari değeri birkaç saniyede daha anlaşılır kılan görseller için bu alanı ayırın.",
          size: "wide",
        },
        {
          type: "image",
          label: "Teslim panosu",
          meta: "Neler çıkar",
          title: "Asset kütüphanesi, kampanya görselleri veya teslim karesi",
          copy: "Çalışmanın sadece fikir seviyesinde kalmadığını, lansman ve satış için de kullanılabildiğini gösteren bir kareyle bitirin.",
          size: "standard",
        },
      ],
      note: "Bu bölüm, doldurulmayı bekleyen jenerik blok gibi değil, belgelenmiş yetkinlik gibi hissettirmek için tasarlandı.",
    },
    playgroundRedirect: {
      eyebrow: "Playground",
      title: "İnteraktif bölüm artık Playground'da yaşıyor.",
      copy: "Malzemeleri denemek, dosya yüklemek ve ürün seçeneklerini keşfetmek için daha doğru yer orası. Hizmetler sayfası teklifi net anlatmalı, kullanıcı etkileşime hazır olduğunda ise onu özel bir ortama yönlendirmeli.",
      features: [
        {
          title: "Daha temiz bir akış",
          copy: "Ziyaretçi burada hizmeti anlar, denemek istediğinde ise dikkat dağıtmayan ayrı bir arayüze geçer.",
        },
        {
          title: "Keşif için daha fazla alan",
          copy: "Playground yüklemeleri, malzeme değişimlerini, çift renk testlerini ve gelecekteki editör özelliklerini bu sayfayı kalabalıklaştırmadan taşıyabilir.",
        },
        {
          title: "Mobilde daha iyi deneyim",
          copy: "Mobil dostu Playground akışı, uzun bir pazarlama sayfası içindeki gömülü demo yerine etkileşim için çok daha uygun bir yer.",
        },
      ],
      primaryCta: "Playground'u aç",
      secondaryCta: "Proje başlat",
      previewLabel: "Playground önizleme",
      previewTitle: "Hikayeden etkileşime daha güçlü bir geçiş",
      previewCopy: "Sayfanın içine mini bir yapılandırıcı sıkıştırmak yerine, deneyimi önceden gösteriyor ve kullanıcıyı hazır olduğunda tam Playground'a yönlendiriyoruz.",
      previewChips: ["Varlık yükleme", "Malzeme kontrolleri", "Mobil uyumlu"],
      previewCards: [
        {
          title: "Gerçek modeller getirin",
          copy: "Desteklenen 3D dosyaları, yalnızca gezinmek yerine test etmek için tasarlanmış bir alanda inceleyin.",
        },
        {
          title: "Kaplamaları bilinçli ayarlayın",
          copy: "Daha gerçekçi sunumlar için RAL renkleri değiştirin, özel renk seçin ve ana/yardımcı renk kombinasyonlarını deneyin.",
        },
        {
          title: "Arayüze nefes alacak alan verin",
          copy: "Playground, sıkıştırılmış bir demo bloğuna göre genişletmesi daha kolay ve kullanması daha rahat bir ortam sunuyor.",
        },
      ],
    },
    configurator: {
      eyebrow: "Öne çıkan yetenek",
      title: "Gerçekten satış kapatan yapılandırıcılar.",
      copy: "Pergola, mobilya, aydınlatma, ekipman satan markalar için — gerçek seçenekleri olan her şey. Kullanıcıların boyutları, malzemeleri, aksesuarları ve ortamları anında görsel geri bildirimle ayarlayabildiği yönlendirilmiş yapılandırıcılar oluşturuyoruz.",
      features: [
        {
          title: "Önemli olan seçenekler",
          copy: "Boyut, kaplama, renk, eklentiler, aydınlatma — yüksek etkili tercihler, tek temiz bir arayüzde.",
        },
        {
          title: "Sahne duyarlı görselleştirme",
          copy: "Alıcıların ürünü gerçekçi bir ortamda değerlendirmesi için ortamları, kamera açılarını ve bağlamları değiştirin.",
        },
        {
          title: "Varlıklar dahil",
          copy: "Düzgün bir lansman için gereken 3D modelleri, malzemeleri ve optimize edilmiş web varlıklarını teslim ediyoruz.",
        },
        {
          title: "Web için tasarlandı",
          copy: "Duyarlı, performanslı ve fiyatlandırma mantığı, CMS içeriği ve ticaret akışlarıyla bağlantıya hazır.",
        },
      ],
    },
    process: {
      eyebrow: "Nasıl çalışıyoruz",
      title: "Dört aşama. Sıfır belirsizlik.",
      copy: "Her çalışma aynı yapıyı izler. Nerede olduğumuzu, sıradakinin ne olduğunu ve ne alacağınızı her zaman bilirsiniz.",
      steps: [
        {
          step: "01",
          title: "Keşif",
          copy: "Ürün, hedef kitle ve iş hedefi üzerinde uzlaşıyoruz. Varsayım yok — sadece netlik.",
        },
        {
          step: "02",
          title: "Yapılandırma",
          copy: "Bilgi mimarisi, wireframe'ler, hareket niyeti. Üretim başlamadan önce deneyim netleşir.",
        },
        {
          step: "03",
          title: "Geliştirme",
          copy: "Tasarım, 3D, ön yüz, entegrasyonlar. Her şey birlikte yayınlanır, her kırılma noktasında test edilir.",
        },
        {
          step: "04",
          title: "Lansman",
          copy: "Kalite kontrolü, dağıtım ve temiz bir teslim. Ekibiniz güvenle işletebilir ve genişletebilir.",
        },
      ],
    },
    bottomCta: {
      title: "Daha iyi bir dijital hikayeye ihtiyaç duyan bir ürününüz mü var?",
      copy: "Karmaşık olanı daha net, daha güçlü ve satması daha kolay bir deneyime dönüştürelim.",
    },
  },
  // ── ÇALIŞMALAR SAYFASI ──
  workPage: {
    eyebrow: "Çalışmalar",
    headline: "Lansmanına yardımcı olduğumuz ürünler.",
    copy: "Farklı sektörlerden bir seçki. Her biri daha iyi bir hikayeye ihtiyaç duyan bir ürünle başladı.",
    projects: [
      {
        name: "Pergola Yapılandırıcı Sistemi",
        type: "Dış Mekan Ürünleri",
        result: "Tam bir yapılandırıcı deneyimi: boyut, yan seçenekler, aydınlatma, aksesuarlar ve montaj — hepsi tek bir yönlendirilmiş satın alma akışında.",
        details: "Satış öncesi soruları %50 azalttı. Müşteriler ekiple iletişime geçmeden önce güvenle kendi yapılandırmalarını yapıyor.",
      },
      {
        name: "Premium Tüketici Elektroniği",
        type: "Ürün Lansmanı",
        result: "Karmaşık bir ürün yelpazesini anlaşılır kılan interaktif özellik turları ve karşılaştırma görünümleri.",
        details: "Sayfada geçirilen sürede 3 kat artış. İlk ay içinde demo taleplerinde ölçülebilir yükseliş.",
      },
      {
        name: "Kurumsal SaaS Platformu",
        type: "Ürün Web Sitesi",
        result: "Soyut platform değerini karar vericiler ve değerlendiriciler için somut, görsel bir hikayeye dönüştürdü.",
        details: "Potansiyel müşterilere ilk görüşmeden önce ihtiyaç duydukları netliği sağlayarak satış döngüsünü kısalttı.",
      },
      {
        name: "Mobilya Koleksiyonu Lansmanı",
        type: "E-ticaret",
        result: "Kaplama ve ortam değiştirme özellikli 3D ürün görüntüleyici. Müşteriler satın almadan önce her açıyı keşfediyor.",
        details: "Önceki statik ürün sayfalarına kıyasla %40 daha yüksek sepete ekleme oranı.",
      },
      {
        name: "Endüstriyel Ekipman Açıklayıcısı",
        type: "Teknik Ürün",
        result: "Karmaşık makineleri teknik olmayan alıcılar için anlaşılır kılan animasyonlu bileşen görünümleri.",
        details: "Fuarlarda, satış sunumlarında ve ana ürün sitesinde kullanıldı.",
      },
    ],
  },
  // ── FİYATLANDIRMA SAYFASI ──
  pricingPage: {
    eyebrow: "Fiyatlandırma",
    headline: "Şeffaf fiyatlandırma. Sürpriz yok.",
    copy: "Bir başlangıç noktası seçin. Her çalışma ürününüze, zaman çizelgenize ve hedeflerinize göre kapsamlandırılır.",
    badge: "En popüler",
    cta: "Başlayın",
    tiers: [
      {
        tier: "Temel",
        price: "$4,900",
        subtitle: "Odaklı tek bir ürün sayfası veya lansman deneyimi.",
        features: [
          "Keşif atölyesi ve sayfa stratejisi",
          "Bir yüksek etkili ürün sayfası",
          "Bir birincil 3D veya hareket sekansı",
          "Duyarlı kalite kontrolü ve temiz teslim",
        ],
      },
      {
        tier: "Büyüme",
        price: "$14,900",
        subtitle: "Daha derin müşteri yolculuklarıyla çok sayfalı ürün sitesi.",
        features: [
          "Çok bölümlü ürün web sitesi",
          "Özel sahne geçişleri ve hareket",
          "CMS veya API'ye hazır içerik yapısı",
          "Lansman desteği ve optimizasyon geçişi",
        ],
        featured: true,
      },
      {
        tier: "Özel",
        price: "Konuşalım",
        subtitle: "Yapılandırıcılar, karmaşık sistemler ve süregelen ortaklıklar.",
        features: [
          "Veri odaklı 3D ürün sahneleri",
          "Ticaret, CRM veya CMS entegrasyonları",
          "Yeniden kullanılabilir bileşen ve hareket kütüphanesi",
          "Sürekli optimizasyon ve destek",
        ],
      },
    ],
    faq: [
      {
        q: "Her pakete neler dahil?",
        a: "Keşif, tasarım, geliştirme, kalite kontrolü ve dağıtım. Temel özellikler için ekstra ücret almıyoruz.",
      },
      {
        q: "Sonradan yükseltebilir miyim?",
        a: "Kesinlikle. Temel projeler, sonuçlar geldikçe sıklıkla Büyüme veya Özel çalışmalara dönüşür.",
      },
      {
        q: "Tipik bir proje ne kadar sürer?",
        a: "Temel: 2–3 hafta. Büyüme: 4–8 hafta. Özel: karmaşıklığa göre birlikte kapsamlandırılır.",
      },
      {
        q: "Mevcut tasarımlarla çalışıyor musunuz?",
        a: "Evet. Marka sisteminizden yola çıkabiliriz veya sıfırdan tasarlayabiliriz — proje için hangisi mantıklıysa.",
      },
    ],
  },
  // ── HAKKIMIZDA SAYFASI ──
  aboutPage: {
    eyebrow: "Hakkımızda",
    headline: "Ürün ekipleri için kurulmuş bir stüdyo.",
    copy: "Configuro, ürün lansmanlarının şablon siteler ve stok görsellerden daha iyisini hak ettiği için var. Tasarım, mühendislik ve 3D zanaatı tek bir uygulamada birleştiren küçük, odaklı bir ekibiz.",
    principles: [
      {
        title: "Gösteriden önce netlik",
        copy: "Hareket ve 3D'yi açıklamak için kullanıyoruz, süslemek için değil. Alıcının anlamasına yardımcı olmuyorsa yayınlanmaz.",
      },
      {
        title: "Gerçek ekipler için tasarlandı",
        copy: "Teslim ettiğimiz her şey içerik güncellemeleri, duyarlı kalite kontrolü ve uzun vadeli bakım için yapılandırılmıştır. Tek kullanımlık yapılar yok.",
      },
      {
        title: "Tek ekip, tek süreç",
        copy: "Strateji, tasarım, 3D ve kod tek çatı altında yaşar. Daha az aktarım, çeviride kaybolan daha az şey demektir.",
      },
    ],
    story: {
      title: "Nasıl çalışıyoruz",
      copy: "Karmaşık, yapılandırılabilir veya premium ürünler satan şirketlerdeki ürün, pazarlama ve büyüme ekipleriyle ortaklık kuruyoruz. İşimiz, ürünü anlaşılması daha kolay ve unutulması daha zor kılmak — web sitesi deneyiminin kendisi aracılığıyla.",
    },
  },
  // ── İLETİŞİM SAYFASI (çok adımlı sihirbaz) ──
  contactPage: {
    eyebrow: "İletişime geçin",
    headline: "Hatırlanmaya değer bir şey inşa edelim.",
    copy: "Projenizi anlayabilmemiz ve size özel bir teklifle dönebilmemiz için birkaç hızlı adımı tamamlayın.",
    facts: [
      "48 saat içinde yanıt",
      "Şablona dayalı değil, size özel teklif",
      "Zorunluluk yok, baskı yok",
    ],
    wizard: {
      stepLabel: "Adım",
      previous: "Geri",
      next: "Devam",
      submit: "Özeti gönder",
      successTitle: "Özet gönderildi!",
      successCopy: "Detaylar için teşekkürler. 48 saat içinde sonraki adımlarla size dönüş yapacağız.",
      steps: [
        { title: "Hakkınızda", copy: "Bize kim olduğunuzu ve nasıl ulaşacağımızı söyleyin." },
        { title: "Projeniz", copy: "Ne üzerinde çalışıyorsunuz ve hangi aşamada?" },
        { title: "Kapsam ve hedefler", copy: "Neye ihtiyacınız var ve deneyim ne sağlamalı?" },
        { title: "Zaman çizelgesi ve bütçe", copy: "Doğru kapsam belirleyebilmemiz için kısıtlamalarınızı anlamamıza yardımcı olun." },
      ],
    },
    fields: {
      fullName: { label: "Adınız", placeholder: "Ali Yılmaz" },
      email: { label: "İş e-postası", placeholder: "ali@sirket.com" },
      company: { label: "Şirket", placeholder: "Kuzey Sistemleri" },
      website: { label: "Mevcut web sitesi", placeholder: "kuzeysistem.com" },
      productName: { label: "Ürün veya teklif", placeholder: "Modüler pergola serisi" },
      brief: {
        label: "Ek bilgi",
        placeholder: "Satın alma döngüleriniz, lansman zaman çizelgeniz veya teknik kısıtlamalarınız hakkında bilmemiz gereken bir şey var mı?",
      },
    },
    groups: {
      projectType: {
        label: "Ne planlıyorsunuz?",
        description: "Birincil çalışma türünü seçin.",
        multi: false,
        options: [
          { value: "configurator", label: "3D Yapılandırıcı" },
          { value: "product-site", label: "Ürün Web Sitesi" },
          { value: "launch-site", label: "Lansman Deneyimi" },
          { value: "interactive-demo", label: "İnteraktif Demo" },
          { value: "redesign", label: "Site Yeniden Tasarımı" },
        ],
      },
      productStage: {
        label: "Proje bugün nerede?",
        description: "Ürün veya kampanyanın mevcut aşaması.",
        multi: false,
        options: [
          { value: "new-launch", label: "Yeni lansman" },
          { value: "growth", label: "Büyüme hamlesi" },
          { value: "repositioning", label: "Yeniden konumlandırma" },
          { value: "sales-enable", label: "Satış etkinleştirme" },
        ],
      },
      goals: {
        label: "Deneyim neyi yönlendirmeli?",
        description: "Geçerli olanların hepsini seçin.",
        multi: true,
        options: [
          { value: "clarity", label: "Karmaşık bir teklifi netleştir" },
          { value: "show-options", label: "Seçenekleri görsel olarak göster" },
          { value: "lead-quality", label: "Potansiyel müşteri kalitesini artır" },
          { value: "sales-support", label: "Satış görüşmelerini destekle" },
          { value: "launch-momentum", label: "Lansmanı güçlendir" },
        ],
      },
      deliverables: {
        label: "Bizden ne teslim etmemizi istiyorsunuz?",
        description: "Sahiplenmemizi istediğiniz iş akışlarını seçin.",
        multi: true,
        options: [
          { value: "strategy", label: "Strateji ve mesajlaşma" },
          { value: "design-build", label: "UI tasarım ve ön yüz" },
          { value: "threejs", label: "Three.js / WebGL" },
          { value: "models", label: "3D model üretimi" },
          { value: "renders", label: "Görselleştirme ve hareket" },
          { value: "cms", label: "CMS entegrasyonu" },
        ],
      },
      timeline: {
        label: "Tercih edilen zaman çizelgesi",
        description: "Hedeflediğiniz tempoyu seçin.",
        multi: false,
        options: [
          { value: "2-weeks", label: "2 hafta içinde" },
          { value: "1-month", label: "1 ay içinde" },
          { value: "2-3-months", label: "2–3 ay" },
          { value: "flexible", label: "Esnek" },
        ],
      },
      budget: {
        label: "Bütçe aralığı",
        description: "Doğru kapsamı önermemize yardımcı olur.",
        multi: false,
        options: [
          { value: "4900-9900", label: "$4,900 – $9,900" },
          { value: "10000-19900", label: "$10,000 – $19,900" },
          { value: "20000-49900", label: "$20,000 – $49,900" },
          { value: "50000-plus", label: "$50,000+" },
        ],
      },
    },
    stepLayout: [
      { fieldKeys: ["fullName", "email", "company", "website"] },
      { fieldKeys: ["productName"], groupKeys: ["projectType", "productStage"] },
      { groupKeys: ["goals", "deliverables"] },
      { fieldKeys: ["brief"], groupKeys: ["timeline", "budget"] },
    ],
  },
  // ── YAPILANDIRICI DEMO (Hizmetler sayfasında) ──
  configuratorDemo: {
    eyebrow: "Canlı Demo",
    title: "Kendiniz deneyin.",
    copy: "Ürünler arasında geçiş yapın, kaplamaları değiştirin, ölçeği ayarlayın ve özgürce döndürün. Bu gerçek bir WebGL yapılandırıcı — müşterilere teslim ettiğimiz teknolojinin aynısı.",
    sidebar: {
      label: "Bunun kanıtladığı",
      title: "Tek arayüz. Birden fazla ürün tipi.",
      copy: "Aynı yapılandırıcı mimarisi mobilya, tüketici teknolojisi ve XR donanımını destekler — hepsi premium bir web sitesi için yeterince performanslı.",
      points: [
        "Gerçek GLB modelleri",
        "Kaplama ve ölçek ön ayarları",
        "Sahne duyarlı sahneleme",
        "AR / VR hazır",
      ],
    },
    delivery: {
      copy: "Varyant mantığı, fiyatlandırma kuralları, CMS verileri, analitik ve cihaza özel AR/VR aktarımı ile genişletilebilir.",
    },
    shell: {
      label: "Yapılandırıcı",
      title: "Ürün değiştirme ve seçenek mantığı ile canlı 3D görüntüleyici.",
      copy: "Modeli değiştirin, ön ayarları test edin, özgürce döndürün ve desteklenen cihazlarda AR veya VR başlatın.",
      stageBadge: "Canlı önizleme",
      footerPoints: [
        "Gerçek 3D varlıklar",
        "Döndür ve yakınlaştır",
        "Kaplama mantığı",
        "AR / VR hazır",
      ],
      viewer: {
        loading: "Model yükleniyor…",
        error: "Bu model yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.",
        dragHint: "Döndürmek için sürükleyin · Yakınlaştırmak için kaydırın",
        xrNote: "WebXR aracılığıyla desteklenen tarayıcı ve cihazlarda AR ve VR.",
        arLaunch: "AR'ye gir",
        arExit: "AR'den çık",
        arUnsupported: "AR kullanılamıyor",
        vrLaunch: "VR'ye gir",
        vrExit: "VR'den çık",
        vrUnsupported: "VR kullanılamıyor",
      },
    },
  },
  heroConfiguratorProducts: [
    {
      key: "sofa",
      label: "Dinlenme Kanepesi",
      category: "Mobilya",
      previewNote: "Kaplama, alan ve sahneleme ön ayarlarına sahip gerçek kanepe modeli.",
      controls: [
        {
          id: "size",
          label: "Alan",
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
            { value: "lounge", label: "Dinlenme görünümü" },
            { value: "detail", label: "Malzeme detayı" },
            { value: "styling", label: "Stil açısı" },
          ],
        },
        {
          id: "environment",
          label: "Sahne",
          type: "pill",
          options: [
            { value: "loft", label: "Çatı katı" },
            { value: "showroom", label: "Showroom" },
            { value: "editorial", label: "Editöryal" },
          ],
        },
      ],
    },
    {
      key: "phone",
      label: "iPhone 14 Pro Max",
      category: "Tüketici teknolojisi",
      previewNote: "Kaplama, ölçek ve özellik odaklı ön ayarlara sahip gerçek cihaz modeli.",
      controls: [
        {
          id: "size",
          label: "Ölçek",
          type: "pill",
          options: [
            { value: "pocket", label: "Cep" },
            { value: "standard", label: "Standart" },
            { value: "hero", label: "Vitrin çekimi" },
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
            { value: "retail", label: "Mağaza" },
            { value: "night", label: "Gece" },
          ],
        },
      ],
    },
    {
      key: "headset",
      label: "VR Başlık",
      category: "XR donanımı",
      previewNote: "Oturum, kaplama ve mod ön ayarlarına sahip gerçek başlık modeli.",
      controls: [
        {
          id: "size",
          label: "Oturum",
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
            { value: "productivity", label: "Üretkenlik" },
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
            { value: "immersive", label: "Sürükleyici" },
          ],
        },
      ],
    },
  ],
  footer: {
    copy: "3D web siteleri, yapılandırıcılar ve lansman deneyimleri konusunda uzmanlaşmış dijital ürün stüdyosu.",
    cta: "Proje başlat",
    servicesTitle: "Hizmetler",
    services: [
      "3D Yapılandırıcılar",
      "Ürün Web Siteleri",
      "Lansman Deneyimleri",
      "Varlık Üretimi",
    ],
    companyTitle: "Şirket",
    company: ["Hakkımızda", "Çalışmalar", "Fiyatlandırma", "İletişim"],
    contactTitle: "İletişim",
    contactItems: [
      "hello@configuro.studio",
      "Küresel teslimat, uzaktan öncelikli",
    ],
    copyright: "© 2026 Configuro. Tüm hakları saklıdır.",
  },
};

export default tr;
