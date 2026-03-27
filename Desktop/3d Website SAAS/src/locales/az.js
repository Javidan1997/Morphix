const az = {
  meta: {
    title: "Morphix | 3D məhsul veb-saytları və konfiguratorlar",
    description:
      "Morphix texniki və premium brendlər üçün 3D məhsul saytları, konfiguratorlar, təqdimat səhifələri və interaktiv rəqəmsal təcrübələr hazırlayır.",
  },
  common: {
    brandName: "Morphix",
    homeAriaLabel: "Morphix ana səhifəsi",
    primaryNavAriaLabel: "Əsas naviqasiya",
    languageSwitcherLabel: "Dil",
    productExamplesAriaLabel: "Məhsul konfiguratoru nümunələri",
  },
  nav: {
    hero: "Ana blok",
    capabilities: "İmkanlar",
    pricing: "Qiymətlər",
    about: "Haqqımızda",
    contact: "Əlaqə",
    cta: "Məhsulunuzu müzakirə edin",
  },
  hero: {
    eyebrow: "3D məhsul saytları və konfiguratorlar",
    proofline: [
      "Three.js tətbiqi",
      "3D modellər və renderlər daxildir",
      "İstehsala hazır front-end təhvil",
    ],
    title: "Mürəkkəb məhsulları",
    titleAccent: "anlamağı və konfiqurasiya etməyi asanlaşdıran 3D məhsul saytları.",
    copy:
      "Morphix konfiqurasiya olunan, texniki və premium məhsullar üçün ciddi, istehsala hazır rəqəmsal təcrübələr qurur. Aydın mesajlaşmanı, Three.js interaksiyasını, məhsul məntiqini və veb üçün optimallaşdırılmış asset təhvilini bir araya gətiririk ki, müştərilər seçimləri daha çox inamla və daha az sürtünmə ilə dəyərləndirə bilsinlər.",
    primaryCta: "Konfiguratorunuzu planlayın",
    secondaryCta: "Demo bölməsinə baxın",
    stats: [
      {
        label: "İstifadə ssenariləri",
        value: "konfiguratorlar, təqdimat səhifələri, məhsul izahları",
      },
      {
        label: "Məhsul məntiqi",
        value: "ölçü, örtük, variantlar, modullar, əlavələr",
      },
      {
        label: "Təhvil",
        value: "Three.js, assetlər, renderlər və təqdimat dəstəyi",
      },
    ],
    stage: {
      label: "Təqdimata strukturlaşdırılıb",
      title: "Alıcıya fayda verdiyi yerdə 3D dərinliyi ilə ciddi məhsul hekayələndirməsi.",
      copy:
        "Məhsul hekayəsini, qarşılıqlı əlaqə modelini və təhvil sistemini birlikdə qururuq ki, sayt həm inandırıcı, həm sürətli, həm də idarəolunan qalsın.",
      points: [
        "Aydın səhifə strukturu",
        "İnteraktiv məhsul məntiqi",
        "3D assetlər və renderlər",
        "İstehsala hazır təhvil",
      ],
    },
    delivery: {
      chip: "Real məhsul komandaları üçün qurulub",
      copy:
        "Konfiqurasiya olunan məhsullar üçün sayt interfeysini, Three.js tətbiqini, 3D asset prosesini və komandanızın təqdimat, kampaniya və satış üçün ehtiyac duyduğu vizualları tam şəkildə üzərimizə götürə bilərik.",
      points: [
        "Məhsul səhifələri",
        "Konfigurator məntiqi",
        "Asset istehsalı",
        "Təqdimat dəstəyi",
      ],
    },
  },
  configuratorDemo: {
    eyebrow: "İnteraktiv konfigurator demosu",
    title: "Real seçimlər və alış məntiqi olan məhsullar üçün xüsusi konfigurator qatı.",
    copy:
      "Bu demo eyni sayt təcrübəsinin müxtəlif məhsul kateqoriyalarına necə uyğunlaşa bildiyini göstərir. Nümunələr arasında keçid edin və müştərilərin eyni struktur daxilində örtükləri, ölçüləri, əlavələri və mühitləri necə dəyişə bildiyini yoxlayın.",
    sidebar: {
      label: "Nələri idarə edə bilir",
      title: "Fərqli konfiqurasiya olunan məhsul tipləri üçün vahid sistem.",
      copy:
        "Eyni əsas axın mebel, açıq hava sistemləri, işıqlandırma, fitinqlər, avadanlıq və saytda istiqamətləndirilmiş seçim prosesi tələb edən digər məhsulları dəstəkləyə bilər.",
      points: [
        "Ölçü və dimensiyalar",
        "Örtüklər və materiallar",
        "Modullar və əlavələr",
        "Mühit dəyişimi",
      ],
    },
    delivery: {
      copy:
        "Konfiguratoru istehsala hazır etmək üçün lazım olan 3D modelləri, materialları, seçim xəritələndirilməsini, render çıxışlarını və Three.js tətbiqini təqdim edə bilərik.",
    },
    shell: {
      label: "İnteraktiv konfigurator demosu",
      title: "Vahid məhsul sistemi, çoxsaylı kateqoriyalar, real seçim idarəetməsi.",
      copy:
        "Məhsul tipini dəyişin və eyni sayt axınının fərqli seçimləri, örtükləri, əlavələri və mühit baxışlarını necə idarə etdiyini sınaqdan keçirin.",
      stageBadge: "İnteraktiv önbaxış",
      footerPoints: [
        "Kateqoriya keçidi",
        "Seçim məntiqi",
        "Mühit önbaxışı",
        "Veb üçün hazır asset təhvili",
      ],
    },
  },
  heroConfiguratorProducts: [
    {
      key: "pergola",
      label: "Pergola",
      category: "Açıq hava sistemləri",
      previewNote: "Ölçü, örtük, işıqlandırma, ekranlar və mühit.",
      controls: [
        {
          id: "size",
          label: "Ölçü",
          type: "pill",
          options: [
            { value: "compact", label: "10 x 10" },
            { value: "standard", label: "14 x 20" },
            { value: "custom", label: "Fərdi" },
          ],
        },
        {
          id: "finish",
          label: "Örtük",
          type: "swatch",
          options: [
            { value: "charcoal", label: "Qrafit", color: "#25303b" },
            { value: "sand", label: "Qum", color: "#d7d3c7" },
            { value: "bronze", label: "Bürünc", color: "#8f7f6b" },
          ],
        },
        {
          id: "feature",
          label: "Əlavələr",
          type: "pill",
          options: [
            { value: "lighting", label: "İşıqlandırma" },
            { value: "screens", label: "Ekranlar" },
            { value: "fans", label: "Ventilyatorlar" },
          ],
        },
        {
          id: "environment",
          label: "Mühit",
          type: "pill",
          options: [
            { value: "outdoor", label: "Açıq hava" },
            { value: "terrace", label: "Teras" },
            { value: "poolside", label: "Hovuz kənarı" },
          ],
        },
      ],
    },
    {
      key: "sofa",
      label: "Modul divan",
      category: "Mebel",
      previewNote: "Modullar, üzlük, əlavələr və otaq konteksti.",
      controls: [
        {
          id: "size",
          label: "Kompozisiya",
          type: "pill",
          options: [
            { value: "compact", label: "2 yerlik" },
            { value: "standard", label: "3 yerlik" },
            { value: "sectional", label: "L forma" },
          ],
        },
        {
          id: "finish",
          label: "Parça",
          type: "swatch",
          options: [
            { value: "graphite", label: "Qrafit", color: "#5a6674" },
            { value: "ivory", label: "Fil sümüyü", color: "#ddd7cf" },
            { value: "olive", label: "Zeytun", color: "#7e8477" },
          ],
        },
        {
          id: "feature",
          label: "Əlavələr",
          type: "pill",
          options: [
            { value: "chaise", label: "Şezlong" },
            { value: "ottoman", label: "Puf" },
            { value: "table", label: "Yan masa" },
          ],
        },
        {
          id: "environment",
          label: "Mühit",
          type: "pill",
          options: [
            { value: "living-room", label: "Qonaq otağı" },
            { value: "studio", label: "Studia" },
            { value: "showroom", label: "Şourum" },
          ],
        },
      ],
    },
    {
      key: "light",
      label: "Asma lampa",
      category: "İşıqlandırma",
      previewNote: "Miqyas, örtük, işıq rejimi və səhnə keçidi.",
      controls: [
        {
          id: "size",
          label: "Ölçü",
          type: "pill",
          options: [
            { value: "small", label: "Kiçik" },
            { value: "medium", label: "Orta" },
            { value: "large", label: "Böyük" },
          ],
        },
        {
          id: "finish",
          label: "Örtük",
          type: "swatch",
          options: [
            { value: "black", label: "Qara", color: "#2b3138" },
            { value: "brass", label: "Pirinç", color: "#b59a63" },
            { value: "stone", label: "Daş", color: "#beb7ae" },
          ],
        },
        {
          id: "feature",
          label: "İşıq rejimi",
          type: "pill",
          options: [
            { value: "warm", label: "İsti" },
            { value: "neutral", label: "Neytral" },
            { value: "dimmable", label: "Tənzimlənən" },
          ],
        },
        {
          id: "environment",
          label: "Mühit",
          type: "pill",
          options: [
            { value: "kitchen", label: "Mətbəx" },
            { value: "dining", label: "Yemək zonası" },
            { value: "retail", label: "Pərakəndə məkan" },
          ],
        },
      ],
    },
  ],
  servicesSection: {
    eyebrow: "Xidmətlər",
    title: "Real alıcılar üçün hazırlanmış fərdiləşdirilə bilən məhsul konfiguratorları və məhsul saytları.",
    copy:
      "Biz müştərilərə satış komandası ilə danışmazdan və ya alış qərarı verməzdən əvvəl məhsulu konfiqurasiya etməyə, müqayisə etməyə və anlamağa kömək edən məhsul təcrübələri qururuq.",
    showcaseEyebrow: "Konfigurator sistemləri",
    showcaseTitle: "Real seçimlərə malik məhsullar üçün inkişaf etmiş sayt konfiguratorları hazırlayırıq.",
    showcaseCopy:
      "Pergola, mebel, işıqlandırma, avadanlıq və digər konfiqurasiya olunan məhsullar satan brendlər üçün istifadəçilərin ölçüləri, rəngləri, materialları, aksesuarları, yan modulları və mühit baxışlarını dərhal vizual geribildirimlə dəyişə bildiyi yönləndirilmiş konfiguratorlar yarada bilərik.",
    configuratorFeatures: [
      {
        title: "Müştərilərin həqiqətən istifadə etdiyi seçim idarəetməsi",
        copy:
          "Ölçü, örtük, rəng, məhsul tipi, əlavələr, aksesuarlar, yan panellər, işıqlandırma və digər yüksək təsirli seçimlər bir aydın interfeysdə idarə oluna bilər.",
      },
      {
        title: "Mühitdən asılı məhsul vizuallaşdırması",
        copy:
          "Alıcıların məhsulu daha real kontekstdə qiymətləndirə bilməsi üçün mühitləri, kamera baxışlarını və səhnələri dəyişə bilərik.",
      },
      {
        title: "3D assetlər daxildir",
        copy:
          "Konfiguratoru düzgün şəkildə istifadəyə vermək üçün tələb olunan 3D modelləri, materialları, optimallaşdırılmış veb assetləri və dəstəkləyici renderləri təqdim edə bilərik.",
      },
      {
        title: "Veb üçün Three.js ilə qurulur",
        copy:
          "Konfigurator sistemlərimiz responsive məhsul saytları üçün hazırlanır və qiymət məntiqi, CMS məzmunu və kommersiya axınları ilə inteqrasiya oluna bilir.",
      },
    ],
    services: [
      {
        title: "Fərdi Three.js konfiguratorları",
        copy:
          "Müştərilərin ölçünü, örtüyü, rəngi, məhsul seçimlərini, əlavələri və baxışları dərhal vizual geribildirimlə dəyişə bildiyi sayt inteqrasiyalı konfiguratorlar.",
        tags: ["Three.js", "Seçimlər", "Kommersiya"],
      },
      {
        title: "Məhsul təqdimat saytları",
        copy:
          "Proqram təminatı, hardware və premium məhsullar üçün məhsul hekayəsini, sübutu və konversiya strukturunu vahid aydın müştəri yolunda birləşdirən təqdimat səhifələri.",
        tags: ["Launch", "Mesajlaşma", "Konversiya"],
      },
      {
        title: "3D model və render istehsalı",
        copy:
          "Saytlar, kampaniyalar və satış alətləri üçün optimallaşdırılmış 3D assetlər, studiya renderləri, məhsul kəsik görüntüləri və konfiguratora hazır model paketləri hazırlayırıq.",
        tags: ["Modellər", "Renderlər", "Assetlər"],
      },
      {
        title: "İnteraktiv məhsul demoları",
        copy:
          "Zəng sifariş etməzdən və ya sınağa başlamazdan əvvəl müştərilərə üstünlükləri, iş axınlarını və fərqləndirici xüsusiyyətləri anlamağa kömək edən yönləndirilmiş 3D və hərəkət əsaslı demolər.",
        tags: ["Demo", "Maarifləndirmə", "Konversiya"],
      },
    ],
    portfolioEyebrow: "Portfolio",
    portfolioTitle:
      "Mürəkkəb və ya premium təkliflər satan komandalar üçün nümayəndə məhsul istifadə ssenariləri.",
    portfolio: [
      {
        name: "Pergola konfigurator sistemi",
        type: "Açıq hava məhsulları",
        result:
          "Müştərilərin ölçünü, yan seçimləri, işıqlandırmanı, aksesuarları və montaj seçimlərini yönləndirilmiş alış axınında tənzimləyə bildiyi konfiqurasiya olunan məhsul təcrübəsi.",
      },
      {
        name: "Premium istehlak elektronikası",
        type: "İstehlak məhsulu",
        result:
          "Alışdan əvvəl anlayışı gücləndirmək üçün hazırlanmış interaktiv xüsusiyyət izahları və məhsul müqayisə baxışları.",
      },
      {
        name: "Enterprise SaaS platforması",
        type: "Proqram təminatı",
        result:
          "Platformanın abstrakt dəyərini qərarverənlər və qiymətləndiricilər üçün konkret hekayəyə çevirən yüksək aydınlıqlı sayt sistemi.",
      },
    ],
  },
  buildSection: {
    eyebrow: "Nələri qura bilərik",
    title: "Məhsul, marketinq və growth komandaları üçün nələr qura bilərik.",
    copy:
      "Məqsəd sadəcə yenilik xatirinə yenilik deyil. Məqsəd daha aydın məhsul hekayəsi, müştərinin daha yaxşı başa düşməsi və komandanızın inamla istifadəyə verə və idarə edə biləcəyi bir saytdır.",
    items: [
      {
        title: "Sayt əsaslı məhsul konfiguratorları",
        copy:
          "Müştərilərin ölçünü, rəngi, materialı, məhsul variantlarını, aksesuarları və əlavələri birbaşa saytda dəyişə bildiyi interaktiv məhsul sistemləri.",
      },
      {
        title: "Mühit və VR önbaxışları",
        copy:
          "Alıcıların uyğunluğu, miqyası və nəticəni daha yaxşı təsəvvür etməsi üçün məhsulu fərqli mühitlərdə və ya immersiv kontekstlərdə göstərən baxışlar.",
      },
      {
        title: "3D model və render paketləri",
        copy:
          "Saytlar, konfiguratorlar, kampaniyalar və məhsul marketinq assetləri üçün istehsala hazır model yaratma, teksturalama, işıqlandırma və render çıxışları.",
      },
      {
        title: "Texniki məhsul izahları",
        copy:
          "Mətnlə izahı çətin olan məhsullar üçün iş axınlarını, sistemləri və komponent baxışlarını əhatə edən strukturlaşdırılmış vizual hekayələndirmə.",
      },
      {
        title: "Kommersiyaya hazır məhsul səhifələri",
        copy:
          "Xüsusilə daha uzun düşünmə mərhələsi tələb edən məhsullar üçün alışdan əvvəl müştəri anlayışını və etibarını artıran yüksək aydınlıqlı məhsul səhifələri.",
      },
      {
        title: "Satış və təqdimat mikrosaytları",
        copy:
          "Təqdimatlar, ABM kampaniyaları, demolər və satış enablement üçün hekayənin fokuslu və inandırıcı qalmalı olduğu xüsusi səhifələr.",
      },
    ],
  },
  salesSection: {
    eyebrow: "Satışa necə təsir edir",
    title: "Sayt müştərini qərara necə yaxınlaşdırır.",
    copy:
      "Yaxşı məhsul marketinqi qarışıqlığı azaldır. Daha güclü rəqəmsal təcrübə ziyarətçilərə təklifi anlamağa, komandaya etibar etməyə və daha çox inamla irəliləməyə kömək edir.",
    kicker: "Satış siqnalı",
    drivers: [
      {
        title: "Məhsul qeyri-müəyyənliyini azaldır",
        copy:
          "Müştərilər sıx və ya texniki mesajları çözmədən məhsulun nə etdiyini, kim üçün olduğunu və niyə vacib olduğunu anlayırlar.",
      },
      {
        title: "Qərar inamını artırır",
        copy:
          "Daha aydın vizuallar və yönləndirilmiş hərəkət alıcıların demo istəməzdən, satışla əlaqə saxlamazdan və ya checkout-a yaxınlaşmazdan əvvəl özlərini daha əmin hiss etməsinə kömək edir.",
      },
      {
        title: "Daha düşünülmüş alışları dəstəkləyir",
        copy:
          "Premium, konfiqurasiya olunan və ya texniki məhsullar üçün daha güclü məhsul hekayəsi diqqəti əsaslandıra və daha uzun qiymətləndirmə prosesini dəstəkləyə bilər.",
      },
      {
        title: "Lead keyfiyyətini yaxşılaşdırır",
        copy:
          "Sayt öncədən daha çox suala cavab verdikdə, satış danışıqları daha yaxşı kontekst və daha uyğun niyyətlə başlayır.",
      },
    ],
  },
  processSection: {
    eyebrow: "Prosesimiz",
    title: "Aydınlıq, sürət və səliqəli təhvil üçün qurulmuş çatdırılma prosesi.",
    copy:
      "Hər mərhələ işi stakeholder-lər üçün anlaşılan, istifadəyə verməyə cavabdeh komanda üçün isə idarəolunan saxlamaq üçün planlaşdırılıb.",
    steps: [
      {
        step: "01",
        title: "Kəşf və məqsədlər",
        copy:
          "Təcrübənin müştərilərin təklifi necə qiymətləndirdiyini dəstəkləməsi üçün məhsul, auditoriya, alış yolu və biznes məqsədi üzrə eyni xəttə gəlirik.",
      },
      {
        step: "02",
        title: "Struktur və prototip",
        copy:
          "Tam istehsal başlamazdan əvvəl təcrübənin aydın olması üçün informasiya iyerarxiyasını, səhifə strukturunu, hərəkət niyyətini və məzmun axınını xəritələndiririk.",
      },
      {
        step: "03",
        title: "Qurma və inteqrasiya",
        copy:
          "Saytı qurur, formaları və ya kommersiya axınlarını bağlayır, hər səhnəni responsive davranış, performans və davamlılıq üçün optimallaşdırırıq.",
      },
      {
        step: "04",
        title: "QA, təqdimat və təhvil",
        copy:
          "Breakpoint-lər üzrə test edirik, səliqəli şəkildə istifadəyə veririk və komandanızın inamla idarə edib genişləndirə biləcəyi istehsala hazır saytı təhvil veririk.",
      },
    ],
  },
  pricingSection: {
    eyebrow: "Qiymətlər",
    title: "Təqdimat işləri və daha uzunmüddətli məhsul marketinqi üçün əməkdaşlıq modelləri.",
    copy:
      "Bir fokuslu məhsul səhifəsi, çox bölməli sayt və ya məhsulun daha mürəkkəb sistem tələb etdiyi hallarda fərdi əməkdaşlıqla başlayın.",
    badge: "Ən çox seçilən",
    cta: "Sorğu göndərin",
    tiers: [
      {
        tier: "Foundation",
        price: "$4,900",
        subtitle: "Bir fokuslu məhsul səhifəsi və ya təqdimat təcrübəsi üçün.",
        features: [
          "Kəşf workshop-u və səhifə planı",
          "Bir yüksək təsirli məhsul səhifəsi",
          "Bir əsas 3D hərəkət ardıcıllığı",
          "Responsive QA və təhvil",
        ],
      },
      {
        tier: "Growth",
        price: "$14,900",
        subtitle: "Daha dərin müştəri səyahəti olan çox bölməli məhsul saytları üçün.",
        features: [
          "Çox bölməli məhsul saytı",
          "Fərdi səhnə keçidləri və hərəkət sistemi",
          "CMS və ya API-yə hazır məzmun strukturu",
          "Təqdimat dəstəyi və optimizasiya",
        ],
        featured: true,
      },
      {
        tier: "Custom",
        price: "Fərdi",
        subtitle:
          "Konfiguratorlar, daha geniş sayt sistemləri və davamlı məhsul marketinqi işləri üçün.",
        features: [
          "Mürəkkəb data əsaslı məhsul səhnələri",
          "Commerce, CRM və ya CMS inteqrasiyaları",
          "Yenidən istifadə oluna bilən komponent və hərəkət sistemi",
          "Davamlı optimizasiya və dəstək",
        ],
      },
    ],
  },
  aboutSection: {
    eyebrow: "Haqqımızda",
    title: "Vizual, istifadəyə yararlı və davamlı məhsul marketinq təcrübələri qururuq.",
    copy:
      "Morphix saytın sadəcə yaxşı görünməsindən daha çoxunu tələb edən komandalarla işləyir. Sayt məhsulu izah etməli, alıcının yolunu dəstəkləməli və real təqdimat şərtlərinə tab gətirəcək qədər güclü olmalıdır.",
    principles: [
      {
        title: "Əvvəlcə məhsulun başa düşülməsi",
        copy:
          "Hərəkəti səhifəni bəzəmək üçün deyil, məhsulu aydınlaşdırmaq üçün istifadə edirik. Mesaj oxunaqlı, qərar yolu isə aydın qalır.",
      },
      {
        title: "Funksiyası olan hərəkət",
        copy:
          "Hər bir interaksiya istiqamət verməli, izah etməli və ya vurğulamalıdır. Əgər hərəkət müştəriyə kömək etmirsə, istifadəyə verilmir.",
      },
      {
        title: "Real komandalar üçün qurulub",
        copy:
          "Yekun sayt istifadəyə verildikdən sonra məzmun yeniləmələri, responsive QA və uzunmüddətli davamlılıq üçün strukturlaşdırılır.",
      },
    ],
  },
  contactSection: {
    eyebrow: "Layihə qəbulu",
    title: "Doğru 3D təcrübəni mərhələli intake prosesi ilə formalaşdırın.",
    copy:
      "Bir neçə fokuslu addımdan keçin və nəyi istifadəyə verdiyinizi, kimə çatmaq istədiyinizi, hansı imkanlara ehtiyac duyduğunuzu və hansı məhdudiyyətləri nəzərə almalı olduğumuzu paylaşın.",
    facts: [
      "Addım-addım layihə kəşfi",
      "Scope, sistemlər və assetlər əhatə olunur",
      "Daha sürətli və daha dəqiq təkliflər",
    ],
    wizard: {
      introLabel: "İnteraktiv brief qurucusu",
      stepLabel: "Addım",
      previous: "Geri",
      next: "Davam et",
      submit: "Təklif istəyin",
      successTitle: "Brief qəbul edildi",
      successCopy:
        "İnputlarınız artıq sizə uyğun follow-up üçün strukturlaşdırılıb. İstəsəniz detalları yeniləyə və ya bunu növbəti müzakirənin əsası kimi istifadə edə bilərsiniz.",
      steps: [
        {
          title: "Baza məlumatları",
          copy: "Məhsul, şirkət və layihənin ümumi istiqaməti ilə başlayın.",
        },
        {
          title: "Auditoriya və məqsədlər",
          copy: "Kimi inandırmalı olduğunuzu və təcrübənin nəyi təmin etməli olduğunu qeyd edin.",
        },
        {
          title: "Scope və sistemlər",
          copy: "Layihəyə daxil olacaq deliverable-ları, inteqrasiyaları və assetləri seçin.",
        },
        {
          title: "Zamanlama və əlaqə",
          copy: "Timeline, büdcə və düzgün cavab verməyimiz üçün vacib olan son konteksti əlavə edin.",
        },
      ],
    },
    fields: {
      company: { label: "Şirkət", placeholder: "Northline Systems" },
      productName: { label: "Məhsul və ya təklif", placeholder: "Modul pergola xətti" },
      website: { label: "Mövcud sayt", placeholder: "northline.com" },
      fullName: { label: "Adınız", placeholder: "Alex Morgan" },
      email: { label: "İş e-poçtu", placeholder: "alex@northlinesystems.com" },
      brief: {
        label: "Əlavə kontekst",
        placeholder:
          "Alış dövrləri, daxili təsdiqlər, təqdimat təzyiqi və ya texniki mürəkkəblik barədə bilməli olduğumuz başqa nə var?",
      },
    },
    groups: {
      projectType: {
        label: "Nə planlaşdırırsınız?",
        description: "Hazırda ehtiyac duyduğunuz əsas işi seçin.",
        multi: false,
        options: [
          { value: "configurator", label: "3D konfigurator" },
          { value: "product-site", label: "Məhsul saytı" },
          { value: "launch-site", label: "Təqdimat mikrosaytı" },
          { value: "interactive-demo", label: "İnteraktiv demo" },
          { value: "redesign", label: "Sayt yenilənməsi" },
        ],
      },
      productStage: {
        label: "Layihə hazırda hansı mərhələdədir?",
        description: "Məhsul və ya marketinq dövrünün indiki mərhələsini qeyd edin.",
        multi: false,
        options: [
          { value: "new-launch", label: "Yeni təqdimat" },
          { value: "growth-push", label: "Growth təkanına ehtiyac var" },
          { value: "repositioning", label: "Yenidən mövqeləndirmə" },
          { value: "sales-enable", label: "Satış dəstəyi" },
        ],
      },
      audience: {
        label: "Əsas auditoriya kimdir?",
        description: "Saytın güclü xidmət etməli olduğu bütün qrupları seçin.",
        multi: true,
        options: [
          { value: "end-customers", label: "Son müştərilər" },
          { value: "enterprise-buyers", label: "Enterprise alıcılar" },
          { value: "technical-evaluators", label: "Texniki qiymətləndiricilər" },
          { value: "partners", label: "Distribyutorlar və partnyorlar" },
          { value: "sales-teams", label: "Daxili satış komandaları" },
        ],
      },
      goals: {
        label: "Təcrübə nəyi təmin etməlidir?",
        description: "Ən vacib nəticələri seçin.",
        multi: true,
        options: [
          { value: "clarity", label: "Mürəkkəb təklifi aydınlaşdırmaq" },
          { value: "show-options", label: "Seçimləri vizual göstərmək" },
          { value: "lead-quality", label: "Lead keyfiyyətini artırmaq" },
          { value: "sales-support", label: "Satış danışığını dəstəkləmək" },
          { value: "launch-momentum", label: "Təqdimat kampaniyasını gücləndirmək" },
        ],
      },
      deliverables: {
        label: "Bizdən nəyi təhvil almaq istəyirsiniz?",
        description: "Sahib olmağımızı istədiyiniz iş axınlarını seçin.",
        multi: true,
        options: [
          { value: "strategy", label: "Sayt strategiyası və mesajlaşma" },
          { value: "design-build", label: "UI dizaynı və front-end qurulması" },
          { value: "threejs", label: "Three.js səhnələri və interaksiyalar" },
          { value: "models", label: "3D model istehsalı" },
          { value: "renders", label: "Render və motion asset paketi" },
          { value: "cms", label: "CMS və ya məzmun strukturu" },
        ],
      },
      integrations: {
        label: "Hansı sistemlər vacibdir?",
        description: "Layihənin qoşulmalı olduğu platformaları və məntiqi qeyd edin.",
        multi: true,
        options: [
          { value: "cms", label: "CMS" },
          { value: "crm", label: "CRM və ya formalar" },
          { value: "commerce", label: "Commerce stack" },
          { value: "pricing", label: "Qiymət və ya quote məntiqi" },
          { value: "analytics", label: "Analitika" },
          { value: "localization", label: "Lokallaşdırma" },
        ],
      },
      assets: {
        label: "Hazırda nələriniz var?",
        description: "Hazır olan və hələ istehsal tələb edən materialları qeyd edin.",
        multi: true,
        options: [
          { value: "brand", label: "Brend sistemi" },
          { value: "copy", label: "Mesajlaşma və ya copy" },
          { value: "cad", label: "CAD və ya 3D modellər" },
          { value: "renders", label: "Foto və ya renderlər" },
          { value: "team", label: "Daxili dev və ya marketinq komandası" },
          { value: "none", label: "Sıfırdan başlayırıq" },
        ],
      },
      timeline: {
        label: "İstədiyiniz timeline",
        description: "Hədəflədiyiniz sürəti seçin.",
        multi: false,
        options: [
          { value: "2-weeks", label: "2 həftə içində" },
          { value: "1-month", label: "1 ay içində" },
          { value: "2-3-months", label: "2-3 ay içində" },
          { value: "flexible", label: "Çevikdir" },
        ],
      },
      budget: {
        label: "Büdcə aralığı",
        description: "Bu, başlanğıcdan düzgün scope tövsiyə etməyimizə kömək edir.",
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
      title: "Layihə xülasəsi",
      empty: "Seçimləriniz burada canlı brief kimi toplanacaq.",
      labels: {
        projectType: "Layihə",
        productStage: "Mərhələ",
        audience: "Auditoriya",
        goals: "Məqsədlər",
        deliverables: "Deliverable-lar",
        integrations: "İnteqrasiyalar",
        assets: "Assetlər",
        timeline: "Timeline",
        budget: "Büdcə",
      },
    },
  },
  footer: {
    copy:
      "Komandalara mürəkkəb təklifləri aydın izah etməyə və daha yaxşı müştəri qərarlarını dəstəkləməyə kömək edən məhsul saytları və interaktiv təcrübələr qururuq.",
    cta: "Söhbətə başlayın",
    capabilitiesTitle: "Nələri qururuq",
    capabilities: [
      "Məhsul təqdimat saytları",
      "İnteraktiv xüsusiyyət demoləri",
      "Konfigurator səyahətləri",
      "İstehsala hazır sayt sistemləri",
    ],
    outcomesTitle: "Biznes təsiri",
    outcomes: [
      "Məhsulu aydınlaşdırın",
      "Alıcı inamını artırın",
      "Daha keyfiyyətli müraciətləri dəstəkləyin",
      "Premium mövqelənməni gücləndirin",
    ],
    contactTitle: "Əlaqə",
    contactItems: [
      "hello@morphix.studio",
      "Uzaqdan əməkdaşlıq, qlobal təhvil",
      "Təklif 48 saat ərzində hazırlanır",
    ],
    pricingLink: "Əməkdaşlıq modellərinə baxın",
    copyright:
      "Copyright 2026 Morphix. Məhsul təqdimatları, demolər və müştəriyə yönəlik sayt sistemləri üçün hazırlanıb.",
  },
};

export default az;
