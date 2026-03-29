import { pageMediaSections } from "./pageMedia";

const az = {
  meta: {
    title: "Configuro | Rəqəmsal Məhsul Studiyası",
    description:
      "Configuro 3D məhsul saytları, interaktiv konfiquratorlar və immersiv veb təcrübələr üzrə ixtisaslaşmış rəqəmsal məhsul studiyasıdır.",
  },
  common: {
    brandName: "Configuro",
    homeAriaLabel: "Configuro ana səhifə",
    primaryNavAriaLabel: "Əsas",
    languageSwitcherLabel: "Dil",
    productExamplesAriaLabel: "Məhsul konfiqurator nümunələri",
    mobileNavOpenLabel: "Naviqasiya menyusunu aç",
    mobileNavCloseLabel: "Naviqasiya menyusunu bağla",
  },
  nav: {
    home: "Ana səhifə",
    services: "Xidmətlər",
    playground: "Playground",
    work: "İşlər",
    pricing: "Qiymətlər",
    about: "Haqqımızda",
    contact: "Əlaqə",
    cta: "Layihəyə başla",
  },
  // ── ANA SƏHİFƏ ──
  hero: {
    headline: "İnsanların həqiqətən kəşf etmək istədiyi məhsullar yaradırıq.",
    subline:
      "Configuro rəqəmsal məhsul studiyasıdır. Unudulmaz olmaqdan imtina edən brendlər üçün 3D saytlar, interaktiv konfiquratorlar və buraxılış təcrübələri dizayn edir və inkişaf etdiririk.",
    primaryCta: "Layihəyə başla",
    secondaryCta: "İşlərimizə baxın",
  },
  valueProps: {
    eyebrow: "Niyə Configuro",
    items: [
      {
        title: "İnteraktiv, dekorativ deyil",
        copy: "Hər 3D element alıcıya xidmət edir. Konfiqurasiya, müqayisə, kəşf — sadəcə göz ziyafəti deyil.",
      },
      {
        title: "İstehsal üçün mühəndislik edilib",
        copy: "Three.js, optimallaşdırılmış resurslar, responsiv tərtibat. Sürətli yüklənir, rahat işləyir, təmiz miqyaslanır.",
      },
      {
        title: "Tam həcmli təhvil",
        copy: "Strategiya, dizayn, 3D, front-end, buraxılış. Bir komanda, bir proses, heç bir boşluq.",
      },
    ],
  },
  servicesPreview: {
    eyebrow: "Nə edirik",
    title: "Konseptdən buraxılışa qədər hər şeyi biz həll edirik.",
    items: [
      { title: "3D Konfiquratorlar", copy: "Müştərilərinizə öz məhsullarını yaratmağa imkan verin." },
      { title: "Məhsul Saytları", copy: "Sadəcə təsir etməyən, həm də satışa çevirən hekayə." },
      { title: "Buraxılış Təcrübələri", copy: "Məhsul təqdimatları və kampaniyalar üçün immersiv səhifələr." },
    ],
    cta: "Bütün xidmətlər",
  },
  portfolioPreview: {
    eyebrow: "Seçilmiş işlər",
    title: "Həyata keçirdiyimiz məhsullar.",
    projects: [
      {
        name: "Açıq Hava Yaşayış Konfiquratoru",
        type: "Perqola Sistemi",
        result: "Müştərilər idarə olunan 3D axınında ölçü, örtük, işıqlandırma və aksesuarları konfiqurasiya edir. Satışöncəsi sualları yarıya endirdi.",
      },
      {
        name: "İstehlak Elektronikası Buraxılışı",
        type: "Məhsul Saytı",
        result: "Səhifədə qalma müddətini 3 dəfə artıran və demo sorğularında ölçülə bilən artım təmin edən interaktiv xüsusiyyət icmalı.",
      },
    ],
    cta: "Bütün işlərə baxın",
  },
  trust: {
    eyebrow: "Nəticələr",
    items: [
      { metric: "3×", label: "səhifədə qalma müddətində orta artım" },
      { metric: "50%", label: "daha az satışöncəsi dəstək sualı" },
      { metric: "40%", label: "məhsul səhifələrində daha yüksək konversiya" },
    ],
  },
  homeContact: {
    eyebrow: "Sürətli sorğu",
    title: "Ağlınızda layihə var?",
    copy: "Bizə yazın. 48 saat ərzində cavab verəcəyik.",
    fields: {
      name: { label: "Ad", placeholder: "Əli Həsənov" },
      email: { label: "E-poçt", placeholder: "ali@sirket.az" },
      message: { label: "Mesaj", placeholder: "Layihəniz haqqında qısaca məlumat verin..." },
    },
    submit: "Mesaj göndər",
    successTitle: "Göndərildi!",
    successCopy: "Tezliklə sizinlə əlaqə saxlayacağıq.",
  },
  homeCta: {
    headline: "Məhsulunuzu unudulmaz etməyə hazırsınız?",
    copy: "Nə qurduğunuzu bizə deyin. Mümkün olanları sizə göstərək.",
    button: "Əlaqə saxlayın",
  },
  ...pageMediaSections.az,
  mediaSlotsShared: {
    eyebrow: "Media sahələri",
    title: "Şəkillər və render videoları üçün ayrılmış yer.",
    copy: "Bu yer tutucuları yekun məhsul vizualları, buraxılış hərəkətləri, turntable render videoları və ya qısa walkthrough yazıları hazır olduqda istifadə edə bilərsiniz.",
    items: [
      {
        type: "image",
        label: "Şəkil sahəsi",
        title: "Statik şəkil və ya render",
        copy: "Məhsul fotoları, material yaxın planları, anotasiyalı vizuallar və ya güclü hero render-ləri üçün istifadə edin.",
      },
      {
        type: "video",
        label: "Render video sahəsi",
        title: "Hərəkətli render və ya walkthrough",
        copy: "Turntable videoları, xüsusiyyət təqdimatları, UI yazıları və ya qısa buraxılış səhnələri üçün istifadə edin.",
      },
    ],
    note: "Bu sahələr hər səhifəni yenidən qurmağa ehtiyac qalmadan son materiallarla sonradan əvəzlənə bilməsi üçün əlavə edilib.",
  },
  // ── XİDMƏTLƏR SƏHİFƏSİ ──
  servicesPage: {
    eyebrow: "Xidmətlər",
    headline: "İnsanların yadda saxlayacağı məhsul buraxmaq üçün lazım olan hər şey.",
    copy: "Biz strategiyanı, dizaynı, 3D mühəndisliyi və front-end inkişafını bir fokuslanmış əməkdaşlıqda birləşdiririk. Parça-parça podratçılar yox, təhvil xaosu yox.",
    servicesIntro: {
      eyebrow: "Nə qura bilərik",
      title: "Məhsulunuzun satılma üsuluna uyğun dəstək.",
      copy: "Bəzi layihələrə tək, güclü bir nəticə lazımdır. Bəzilərinə isə bütöv buraxılış sistemi. Biz aydınlığın, vizual keyfiyyətin və interaktivliyin ən vacib olduğu yerdə qoşuluruq.",
    },
    story: {
      panelLabel: "Müştərilərin adətən ehtiyac duyduğu",
      title: "Məhsulu düşünə bilən və işi həqiqətən qura bilən tərəfdaş.",
      copy: "Çox komanda bizə ideal brief ilə gəlmir. Onların əlində güclü məhsul, yarımçıq resurslar, buraxılış təzyiqi və mövcud təqdimatın görülən işi tam göstərmədiyi hissi olur.",
      points: [
        {
          title: "Gözəl görüntüdən əvvəl aydın düşüncə",
          copy: "Təcrübəni dizayn etməzdən əvvəl alıcının nəyi görməli, nəyi müqayisə etməli və nəyə güvənməli olduğunu anlayırıq.",
        },
        {
          title: "Dizayn və qurma eyni axında",
          copy: "Mətn, düzən, hərəkət, 3D və front-end birlikdə formalaşır; buna görə nəticə sonradan yığılmış yox, bütöv görünür.",
        },
        {
          title: "Buraxılışdan sonra da faydalı",
          copy: "Təhvil verilənlər yalnız ilk kampaniya üçün deyil, satış, marketinq və məhsul komandalarının sonradan istifadəsi üçün də yararlı olur.",
        },
      ],
      note: "Xüsusilə seçimli, texniki detallı və ya dəyərini anlatmaq üçün daha güclü hekayə tələb edən məhsullarda yaxşı nəticə veririk.",
    },
    services: [
      {
        title: "3D Məhsul Konfiquratorları",
        copy: "Müştərilərin ani vizual əks-əlaqə ilə ölçü, örtük, rəng, aksesuarlar və mühiti dəyişdirdiyi sayta inteqrasiya olunmuş konfiquratorlar. Three.js ilə işləyir, konversiya üçün dizayn edilib.",
        tags: ["Three.js", "Məhsul Məntiqi", "Ticarətə Hazır"],
      },
      {
        title: "Məhsul Buraxılış Saytları",
        copy: "Məhsul hekayəsini, sübutu və konversiya strukturunu vahid aydın səyahətdə birləşdirən yüksək təsirli səhifələr. Məhsulunuzun dünya ilə tanışdığı an üçün qurulub.",
        tags: ["Buraxılış", "Hekayə", "Konversiya"],
      },
      {
        title: "3D Resurs İstehsalı",
        copy: "Optimallaşdırılmış 3D modellər, studiya renderləri, məhsul kəsikləri və konfiqurasiyaya hazır resurs dəstləri. Saytınızın, kampaniyalarınızın və satış materiallarınızın ehtiyac duyduğu hər şey.",
        tags: ["Modellər", "Renderlər", "WebGL Resursları"],
      },
      {
        title: "İnteraktiv Məhsul Demoları",
        copy: "Müştərilərin zəng etmədən əvvəl imkanları anlamalarına kömək edən idarə olunan 3D və hərəkət əsaslı icmallar. Təzyiqlə deyil, aydınlıqla satın.",
        tags: ["Demo", "Təhsil", "Özünəxidmət"],
      },
      {
        title: "Texniki İzahedicilər",
        copy: "Təkcə mətnlə izah oluna bilməyən məhsullar üçün. Mürəkkəbi anlaşılan edən animasiyalı parçalanmalar, komponent görünüşləri və iş axını vizuallaşdırmaları.",
        tags: ["Animasiya", "İzahedici", "Mürəkkəb Məhsullar"],
      },
      {
        title: "Ticarətə Hazır Səhifələr",
        copy: "Yüksək düşüncə tələb edən alışlar üçün dizayn edilmiş məhsul səhifələri. Müştəri ödənişə çatmadan qiyməti əsaslandıran aydın struktur, etibar siqnalları və vizual dərinlik.",
        tags: ["E-ticarət", "Etibar", "Premium"],
      },
    ],
    mediaShowcase: {
      eyebrow: "Xidmət sübut planı",
      title: "Təklifin həqiqətən əsaslandırıldığını hiss etdirən media sahələri.",
      copy: "Tək bir ümumi sətir əvəzinə bu bölmə indi buraxılış hərəkəti, detal renderləri, interfeys yazıları, müqayisə kadrları və təhvil sübutu üçün daha zəngin quruluş daşıyır.",
      layout: "storyboard",
      highlights: ["5 sahə", "Məhsul + UX sübutu", "Real satış söhbətləri üçün"],
      items: [
        {
          type: "video",
          label: "Açılış filmi",
          meta: "İlk təəssürat",
          title: "Brend açılışı, layihə təqdimatı və ya qısa walkthrough",
          copy: "Xidmət hekayəsi dərinləşməzdən əvvəl səhifəyə çəkisi olan bir video ilə başlayın.",
          size: "hero",
        },
        {
          type: "image",
          label: "Detal şəkli",
          meta: "Ustalıq siqnalı",
          title: "Yaxın plan render, material ailəsi və ya səth sistemi",
          copy: "Səthlər, örtüklər, konstruksiya detalları və premium məhsul kadrları üçün istifadə edin.",
          size: "standard",
        },
        {
          type: "video",
          label: "UX yazısı",
          meta: "İnteraksiya sübutu",
          title: "Konfiqurator axını, mobil istifadə və ya UI walkthrough",
          copy: "Seçim dəyişikliklərini, kamera hərəkətini, axın vəziyyətlərini və ya yığcam mobil demonu burada göstərin.",
          size: "tall",
        },
        {
          type: "image",
          label: "Müqayisə kadrı",
          meta: "Dəyər izahı",
          title: "Əvvəl-sonra ekranı, anotasiya qatı və ya sübut qrafiki",
          copy: "Kommersiya dəyərini saniyələr içində daha aydın göstərən vizuallar üçün bu sahəni ayırın.",
          size: "wide",
        },
        {
          type: "image",
          label: "Təhvil lövhəsi",
          meta: "Nə çıxır",
          title: "Asset kitabxanası, kampaniya şəkilləri və ya təhvil kadrı",
          copy: "İşin təkcə konsept kimi qalmadığını, buraxılış və satış üçün də istifadə oluna bildiyini göstərən kadrla tamamlayın.",
          size: "standard",
        },
      ],
      note: "Bölmə doldurulmağı gözləyən ümumi blok kimi yox, sənədləşdirilmiş bacarıq kimi hiss etdirilmək üçün qurulub.",
    },
    playgroundRedirect: {
      eyebrow: "Playground",
      title: "İnteraktiv hissə indi Playground-da yaşayır.",
      copy: "Materialları sınamaq, fayl yükləmək və məhsul seçimlərini araşdırmaq üçün daha doğru yer oradır. Xidmətlər səhifəsi təklifi aydın izah etməli, istifadəçi qarşılıqlı əlaqəyə hazır olanda isə onu ayrıca mühitə yönləndirməlidir.",
      features: [
        {
          title: "Daha təmiz keçid",
          copy: "İstifadəçi burada xidməti anlayır, sınamaq istəyəndə isə diqqəti dağıtmayan ayrıca interfeysə keçir.",
        },
        {
          title: "Araşdırmaq üçün daha çox yer",
          copy: "Playground yükləmələri, material dəyişikliklərini, iki rəng testlərini və gələcək editor xüsusiyyətlərini bu səhifəni sıxmadan daşıya bilir.",
        },
        {
          title: "Mobildə daha yaxşı təcrübə",
          copy: "Mobil üçün uyğunlaşdırılmış Playground axını, uzun marketinq səhifəsindəki kiçik demo blokundan daha məqsədyönlü mühit yaradır.",
        },
      ],
      primaryCta: "Playground-u aç",
      secondaryCta: "Layihəyə başla",
      previewLabel: "Playground önizləməsi",
      previewTitle: "Hekayədən qarşılıqlı təcrübəyə daha güclü keçid",
      previewCopy: "Səhifənin içinə kiçik konfiqurator yerləşdirmək əvəzinə, təcrübəni öncədən göstərir və istifadəçini hazır olanda tam Playground-a yönləndiririk.",
      previewChips: ["Resurs yükləmə", "Material idarələri", "Mobil uyğunluq"],
      previewCards: [
        {
          title: "Real modellər gətirin",
          copy: "Dəstəklənən 3D faylları sadəcə baxmaq üçün deyil, test etmək üçün qurulmuş məkanda yoxlayın.",
        },
        {
          title: "Səthləri məqsədli tənzimləyin",
          copy: "Daha real təqdimatlar üçün RAL rənglərini dəyişin, fərdi rəng seçin və əsas/köməkçi rəng kombinasiyalarını sınayın.",
        },
        {
          title: "İnterfeysə nəfəs almaq üçün yer verin",
          copy: "Playground sıx demo blokundan daha rahat istifadə olunan və gələcəkdə genişləndirilməsi daha asan olan mühitdir.",
        },
      ],
    },
    configurator: {
      eyebrow: "Əsas imkan",
      title: "Həqiqətən sövdələşmə bağlayan konfiquratorlar.",
      copy: "Perqola, mebel, işıqlandırma, avadanlıq — real seçimləri olan hər şeyi satan brendlər üçün. İstifadəçilərin ölçüləri, materialları, aksesuarları və mühitləri ani vizual əks-əlaqə ilə tənzimlədikləri idarə olunan konfiquratorlar yaradırıq.",
      features: [
        {
          title: "Əhəmiyyətli seçimlər",
          copy: "Ölçü, örtük, rəng, əlavələr, işıqlandırma — yüksək təsirli seçimlər, bir təmiz interfeysdə.",
        },
        {
          title: "Səhnəyə uyğun vizuallaşdırma",
          copy: "Alıcıların məhsulu real mühitdə qiymətləndirməsi üçün mühitləri, kamera bucaqlarını və kontekstləri dəyişdirin.",
        },
        {
          title: "Resurslar daxildir",
          copy: "Düzgün buraxılış üçün lazım olan 3D modellər, materiallar və optimallaşdırılmış veb resursları təhvil veririk.",
        },
        {
          title: "Veb üçün qurulub",
          copy: "Responsiv, yüksək performanslı və qiymət məntiqi, CMS məzmunu və ticarət axınları ilə birləşməyə hazır.",
        },
      ],
    },
    process: {
      eyebrow: "Necə işləyirik",
      title: "Dörd mərhələ. Sıfır qeyri-müəyyənlik.",
      copy: "Hər əməkdaşlıq eyni struktura əməl edir. Həmişə harada olduğumuzu, növbəti addımı və nə alacağınızı bilirsiniz.",
      steps: [
        {
          step: "01",
          title: "Kəşf",
          copy: "Məhsul, auditoriya və biznes məqsədi üzrə razılığa gəlirik. Fərziyyə yox — yalnız aydınlıq.",
        },
        {
          step: "02",
          title: "Struktur",
          copy: "İnformasiya arxitekturası, wireframe-lər, hərəkət niyyəti. İstehsal başlamazdan əvvəl təcrübə aydın olur.",
        },
        {
          step: "03",
          title: "Qurma",
          copy: "Dizayn, 3D, front-end, inteqrasiyalar. Hər şey birlikdə yüklənir, hər ölçüdə test edilir.",
        },
        {
          step: "04",
          title: "Buraxılış",
          copy: "QA, yerləşdirmə və təmiz təhvil. Komandanız əminliklə idarə edə və genişləndirə bilər.",
        },
      ],
    },
    bottomCta: {
      title: "Daha yaxşı rəqəmsal hekayəyə ehtiyacı olan məhsulunuz var?",
      copy: "Mürəkkəb olanı daha aydın, daha güclü və satması daha asan olan təcrübəyə çevirək.",
    },
  },
  // ── İŞLƏR SƏHİFƏSİ ──
  workPage: {
    eyebrow: "İşlər",
    headline: "Buraxılışına kömək etdiyimiz məhsullar.",
    copy: "Müxtəlif sahələrdən layihə seçmələri. Hər biri daha yaxşı hekayəyə ehtiyacı olan məhsulla başladı.",
    projects: [
      {
        name: "Perqola Konfiqurator Sistemi",
        type: "Açıq Hava Məhsulları",
        result: "Tam konfiqurator təcrübəsi: ölçü, yan seçimlər, işıqlandırma, aksesuarlar və montaj — hamısı bir idarə olunan alış axınında.",
        details: "Satışöncəsi sorğuları 50% azaltdı. Müştərilər komanda ilə əlaqə saxlamadan əvvəl əminliklə konfiqurasiya edir.",
      },
      {
        name: "Premium İstehlak Elektronikası",
        type: "Məhsul Buraxılışı",
        result: "Mürəkkəb məhsul xəttini anlaşılan edən interaktiv xüsusiyyət icmalları və müqayisə görünüşləri.",
        details: "Səhifədə qalma müddəti 3 dəfə artdı. İlk ay ərzində demo sorğularında ölçülə bilən artım.",
      },
      {
        name: "Müəssisə SaaS Platforması",
        type: "Məhsul Saytı",
        result: "Mücərrəd platforma dəyərini qərar qəbul edənlər və qiymətləndiricilər üçün konkret, vizual hekayəyə çevirdi.",
        details: "İlk zəngdən əvvəl potensial müştərilərə lazım olan aydınlığı verərək satış dövrünü qısaltdı.",
      },
      {
        name: "Mebel Kolleksiyası Buraxılışı",
        type: "E-ticarət",
        result: "Örtük və mühit dəyişdirmə ilə 3D məhsul görüntüləyicisi. Müştərilər almadan əvvəl hər bucağı araşdırır.",
        details: "Əvvəlki statik məhsul səhifələri ilə müqayisədə səbətə əlavə etmə nisbəti 40% daha yüksək.",
      },
      {
        name: "Sənaye Avadanlığı İzahedicisi",
        type: "Texniki Məhsul",
        result: "Mürəkkəb maşınları texniki olmayan alıcılar üçün anlaşılan edən animasiyalı komponent parçalanmaları.",
        details: "Sərgilər, satış təqdimatları və əsas məhsul saytı üzrə istifadə olunur.",
      },
    ],
  },
  // ── QİYMƏTLƏR SƏHİFƏSİ ──
  pricingPage: {
    eyebrow: "Qiymətlər",
    headline: "Şəffaf qiymətlər. Sürpriz yoxdur.",
    copy: "Başlanğıc nöqtəsi seçin. Hər əməkdaşlıq məhsulunuza, vaxt cədvəlinizə və məqsədlərinizə uyğun planlaşdırılır.",
    badge: "Ən populyar",
    cta: "Başlayın",
    tiers: [
      {
        tier: "Əsas",
        price: "$4,900",
        subtitle: "Bir fokuslanmış məhsul səhifəsi və ya buraxılış təcrübəsi.",
        features: [
          "Kəşf seminarı və səhifə strategiyası",
          "Bir yüksək təsirli məhsul səhifəsi",
          "Bir əsas 3D və ya hərəkət ardıcıllığı",
          "Responsiv QA və təmiz təhvil",
        ],
      },
      {
        tier: "İnkişaf",
        price: "$14,900",
        subtitle: "Daha dərin müştəri səyahətləri ilə çoxsəhifəli məhsul saytı.",
        features: [
          "Çoxbölməli məhsul saytı",
          "Xüsusi səhnə keçidləri və hərəkət",
          "CMS və ya API-yə hazır məzmun strukturu",
          "Buraxılış dəstəyi və optimallaşdırma mərhələsi",
        ],
        featured: true,
      },
      {
        tier: "Xüsusi",
        price: "Danışaq",
        subtitle: "Konfiquratorlar, mürəkkəb sistemlər və davamlı tərəfdaşlıqlar.",
        features: [
          "Verilənlərə əsaslanan 3D məhsul səhnələri",
          "Ticarət, CRM və ya CMS inteqrasiyaları",
          "Təkrar istifadə edilə bilən komponent və hərəkət kitabxanası",
          "Davamlı optimallaşdırma və dəstək",
        ],
      },
    ],
    faq: [
      {
        q: "Hər tarif planına nə daxildir?",
        a: "Kəşf, dizayn, inkişaf, QA və yerləşdirmə. Əsas şeylər üçün əlavə ödəniş tələb etmirik.",
      },
      {
        q: "Sonradan yüksəldə bilərəm?",
        a: "Mütləq. Əsas layihələr nəticələr gəldikcə tez-tez İnkişaf və ya Xüsusi əməkdaşlıqlara çevrilir.",
      },
      {
        q: "Tipik layihə nə qədər vaxt aparır?",
        a: "Əsas: 2–3 həftə. İnkişaf: 4–8 həftə. Xüsusi: mürəkkəbliyə əsasən birlikdə planlaşdırılır.",
      },
      {
        q: "Mövcud dizaynlarla işləyirsiniz?",
        a: "Bəli. Brend sisteminizlə işləyə və ya sıfırdan dizayn edə bilərik — layihə üçün nə uyğundursa.",
      },
    ],
  },
  // ── HAQQIMIZDA SƏHİFƏSİ ──
  aboutPage: {
    eyebrow: "Haqqımızda",
    headline: "Məhsul komandaları üçün qurulmuş studiya.",
    copy: "Configuro mövcuddur, çünki məhsul buraxılışları şablon saytlardan və hazır renderlərdən daha yaxşısına layiqdir. Biz dizaynı, mühəndisliyi və 3D sənətkarlığını bir praktikada birləşdirən kiçik, fokuslanmış komandayıq.",
    principles: [
      {
        title: "Şoua deyil, aydınlığa üstünlük",
        copy: "Hərəkət və 3D-ni izah etmək üçün istifadə edirik, bəzəmək üçün deyil. Alıcıya anlamağa kömək etmirsə, buraxılmır.",
      },
      {
        title: "Real komandalar üçün qurulub",
        copy: "Təhvil verdiyimiz hər şey məzmun yeniləmələri, responsiv QA və uzunmüddətli texniki xidmət üçün strukturlaşdırılıb. Birdəfəlik qurmalar yox.",
      },
      {
        title: "Bir komanda, bir proses",
        copy: "Strategiya, dizayn, 3D və kod bir dam altındadır. Daha az təhvil — daha az itki.",
      },
    ],
    story: {
      title: "Necə işləyirik",
      copy: "Biz mürəkkəb, konfiqurasiya edilə bilən və ya premium məhsullar satan şirkətlərdəki məhsul, marketinq və inkişaf komandaları ilə tərəfdaşlıq edirik. Bizim işimiz məhsulu daha asan anlaşılan və daha çətin unudulan etməkdir — sayt təcrübəsinin özü vasitəsilə.",
    },
  },
  // ── ƏLAQƏ SƏHİFƏSİ (çoxaddımlı sehrbaz) ──
  contactPage: {
    eyebrow: "Əlaqə saxlayın",
    headline: "Yadda qalacaq bir şey quraq.",
    copy: "Layihənizi anlayıb fərdi təklif ilə cavab verə bilməyimiz üçün bir neçə sürətli addımdan keçin.",
    facts: [
      "48 saat ərzində cavab",
      "Şablona deyil, fərdi təklif",
      "Öhdəlik yox, təzyiq yox",
    ],
    wizard: {
      stepLabel: "Addım",
      previous: "Geri",
      next: "Davam et",
      submit: "Brifinqi göndər",
      successTitle: "Brifinq göndərildi!",
      successCopy: "Təfərrüatlar üçün təşəkkür edirik. 48 saat ərzində növbəti addımlarla sizə geri dönəcəyik.",
      steps: [
        { title: "Sizin haqqınızda", copy: "Kim olduğunuzu və sizə necə çatacağımızı söyləyin." },
        { title: "Layihəniz", copy: "Nə qurursunuz və hansı mərhələdədir?" },
        { title: "Həcm və məqsədlər", copy: "Nəyə ehtiyacınız var və təcrübə nəyə nail olmalıdır?" },
        { title: "Vaxt cədvəli və büdcə", copy: "Dəqiq planlaşdıra bilməyimiz üçün məhdudiyyətlərinizi anlamağımıza kömək edin." },
      ],
    },
    fields: {
      fullName: { label: "Adınız", placeholder: "Əli Həsənov" },
      email: { label: "İş e-poçtu", placeholder: "ali@sirket.az" },
      company: { label: "Şirkət", placeholder: "Şimal Sistemləri" },
      website: { label: "Mövcud sayt", placeholder: "simal.az" },
      productName: { label: "Məhsul və ya təklif", placeholder: "Modul perqola seriyası" },
      brief: {
        label: "Əlavə kontekst",
        placeholder: "Alış dövrləriniz, buraxılış vaxt cədvəliniz və ya texniki məhdudiyyətlər haqqında bilməli olduğumuz bir şey var?",
      },
    },
    groups: {
      projectType: {
        label: "Nə planlaşdırırsınız?",
        description: "Əsas əməkdaşlıq növünü seçin.",
        multi: false,
        options: [
          { value: "configurator", label: "3D Konfiqurator" },
          { value: "product-site", label: "Məhsul Saytı" },
          { value: "launch-site", label: "Buraxılış Təcrübəsi" },
          { value: "interactive-demo", label: "İnteraktiv Demo" },
          { value: "redesign", label: "Saytın Yenidən Dizaynı" },
        ],
      },
      productStage: {
        label: "Layihə bu gün hansı mərhələdədir?",
        description: "Məhsulun və ya kampaniyanın cari mərhələsi.",
        multi: false,
        options: [
          { value: "new-launch", label: "Yeni buraxılış" },
          { value: "growth", label: "İnkişaf təkanı" },
          { value: "repositioning", label: "Yenidən mövqeləndirmə" },
          { value: "sales-enable", label: "Satış dəstəyi" },
        ],
      },
      goals: {
        label: "Təcrübə nəyə gətirib çıxarmalıdır?",
        description: "Uyğun olanların hamısını seçin.",
        multi: true,
        options: [
          { value: "clarity", label: "Mürəkkəb təklifi aydınlaşdır" },
          { value: "show-options", label: "Seçimləri vizual göstər" },
          { value: "lead-quality", label: "Lid keyfiyyətini yaxşılaşdır" },
          { value: "sales-support", label: "Satış söhbətlərini dəstəklə" },
          { value: "launch-momentum", label: "Buraxılışı gücləndir" },
        ],
      },
      deliverables: {
        label: "Bizdən nə təhvil verməyimizi istəyirsiniz?",
        description: "Bizim idarə etməyimizi istədiyiniz iş axınlarını seçin.",
        multi: true,
        options: [
          { value: "strategy", label: "Strategiya və mesajlaşma" },
          { value: "design-build", label: "UI dizayn və front-end" },
          { value: "threejs", label: "Three.js / WebGL" },
          { value: "models", label: "3D model istehsalı" },
          { value: "renders", label: "Renderlər və hərəkət" },
          { value: "cms", label: "CMS inteqrasiyası" },
        ],
      },
      timeline: {
        label: "Üstünlük verilən vaxt cədvəli",
        description: "Hədəflədiyiniz tempi seçin.",
        multi: false,
        options: [
          { value: "2-weeks", label: "2 həftə ərzində" },
          { value: "1-month", label: "1 ay ərzində" },
          { value: "2-3-months", label: "2–3 ay" },
          { value: "flexible", label: "Çevik" },
        ],
      },
      budget: {
        label: "Büdcə aralığı",
        description: "Düzgün həcmi tövsiyə etməyimizə kömək edir.",
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
  // ── KONFİQURATOR DEMO (Xidmətlər səhifəsində saxlanılır) ──
  configuratorDemo: {
    eyebrow: "Canlı Demo",
    title: "Özünüz sınayın.",
    copy: "Məhsullar arasında keçid edin, örtükləri dəyişdirin, miqyası tənzimləyin və sərbəst fırladın. Bu real WebGL konfiquratordur — müştərilərə təhvil verdiyimiz eyni texnologiya.",
    sidebar: {
      label: "Bunun nəyi sübut edir",
      title: "Bir interfeys. Çoxsaylı məhsul növləri.",
      copy: "Eyni konfiqurator arxitekturası mebel, istehlak texnologiyası və XR avadanlığını dəstəkləyir — hamısı premium sayt üçün kifayət qədər performanslı.",
      points: [
        "Real GLB modelləri",
        "Örtük və miqyas əvvəlcədən parametrləri",
        "Səhnəyə uyğun səhnələşdirmə",
        "AR / VR hazır",
      ],
    },
    delivery: {
      copy: "Variant məntiqi, qiymət qaydaları, CMS verilənləri, analitika və cihaza xas AR/VR təhvili ilə genişləndirilə bilər.",
    },
    shell: {
      label: "Konfiqurator",
      title: "Məhsul dəyişdirmə və seçim məntiqi ilə canlı 3D görüntüləyici.",
      copy: "Modeli dəyişdirin, əvvəlcədən parametrləri sınayın, sərbəst fırladın və dəstəklənən cihazlarda AR və ya VR-i işə salın.",
      stageBadge: "Canlı önizləmə",
      footerPoints: [
        "Real 3D resurslar",
        "Fırlatma və yaxınlaşdırma",
        "Örtük məntiqi",
        "AR / VR hazır",
      ],
      viewer: {
        loading: "Model yüklənir…",
        error: "Bu model yüklənə bilmədi. Səhifəni yeniləyib yenidən cəhd edin.",
        dragHint: "Fırlatmaq üçün sürükləyin · Yaxınlaşdırmaq üçün sürüşdürün",
        xrNote: "WebXR vasitəsilə dəstəklənən brauzer və cihazlarda AR və VR.",
        arLaunch: "AR-a daxil ol",
        arExit: "AR-dan çıx",
        arUnsupported: "AR mövcud deyil",
        vrLaunch: "VR-a daxil ol",
        vrExit: "VR-dan çıx",
        vrUnsupported: "VR mövcud deyil",
      },
    },
  },
  heroConfiguratorProducts: [
    {
      key: "sofa",
      label: "İstirahət Divanı",
      category: "Mebel",
      previewNote: "Örtük, ölçü və səhnə parametrləri ilə real divan modeli.",
      controls: [
        {
          id: "size",
          label: "Ölçü",
          type: "pill",
          options: [
            { value: "compact", label: "Yığcam" },
            { value: "standard", label: "Standart" },
            { value: "expansive", label: "Geniş" },
          ],
        },
        {
          id: "finish",
          label: "Üzlük",
          type: "swatch",
          options: [
            { value: "graphite", label: "Qrafit", color: "#6f7983" },
            { value: "sand", label: "Qum", color: "#d8d0c6" },
            { value: "sage", label: "Adaçayı", color: "#7d8977" },
          ],
        },
        {
          id: "feature",
          label: "Fokus",
          type: "pill",
          options: [
            { value: "lounge", label: "İstirahət görünüşü" },
            { value: "detail", label: "Material detalı" },
            { value: "styling", label: "Stil bucağı" },
          ],
        },
        {
          id: "environment",
          label: "Səhnə",
          type: "pill",
          options: [
            { value: "loft", label: "Loft" },
            { value: "showroom", label: "Sərgi salonu" },
            { value: "editorial", label: "Redaksiya" },
          ],
        },
      ],
    },
    {
      key: "phone",
      label: "iPhone 14 Pro Max",
      category: "İstehlak texnologiyası",
      previewNote: "Örtük, miqyas və xüsusiyyət fokus parametrləri ilə real cihaz modeli.",
      controls: [
        {
          id: "size",
          label: "Miqyas",
          type: "pill",
          options: [
            { value: "pocket", label: "Cib" },
            { value: "standard", label: "Standart" },
            { value: "hero", label: "Əsas görüntü" },
          ],
        },
        {
          id: "finish",
          label: "Örtük",
          type: "swatch",
          options: [
            { value: "graphite", label: "Qrafit", color: "#5c6470" },
            { value: "silver", label: "Gümüşü", color: "#d4d9e1" },
            { value: "blue", label: "Tünd mavi", color: "#5d708e" },
          ],
        },
        {
          id: "feature",
          label: "Fokus",
          type: "pill",
          options: [
            { value: "camera", label: "Kamera sistemi" },
            { value: "display", label: "Ekran şüşəsi" },
            { value: "frame", label: "Titan çərçivə" },
          ],
        },
        {
          id: "environment",
          label: "Səhnə",
          type: "pill",
          options: [
            { value: "studio", label: "Studiya" },
            { value: "retail", label: "Pərakəndə" },
            { value: "night", label: "Gecə" },
          ],
        },
      ],
    },
    {
      key: "headset",
      label: "VR Qulaqlıq",
      category: "XR avadanlığı",
      previewNote: "Uyğunluq, örtük və rejim parametrləri ilə real qulaqlıq modeli.",
      controls: [
        {
          id: "size",
          label: "Uyğunluq",
          type: "pill",
          options: [
            { value: "compact", label: "Yığcam" },
            { value: "standard", label: "Standart" },
            { value: "extended", label: "Genişləndirilmiş" },
          ],
        },
        {
          id: "finish",
          label: "Örtük",
          type: "swatch",
          options: [
            { value: "carbon", label: "Karbon", color: "#4d5663" },
            { value: "frost", label: "Şaxta", color: "#d6dde6" },
            { value: "neon", label: "Neon", color: "#6f8ffc" },
          ],
        },
        {
          id: "feature",
          label: "Rejim",
          type: "pill",
          options: [
            { value: "gaming", label: "Oyun" },
            { value: "productivity", label: "Məhsuldarlıq" },
            { value: "demo", label: "Demo" },
          ],
        },
        {
          id: "environment",
          label: "Səhnə",
          type: "pill",
          options: [
            { value: "stage", label: "Səhnə" },
            { value: "lab", label: "Laboratoriya" },
            { value: "immersive", label: "İmmersiv" },
          ],
        },
      ],
    },
  ],
  footer: {
    copy: "3D saytlar, konfiquratorlar və buraxılış təcrübələri üzrə ixtisaslaşmış rəqəmsal məhsul studiyası.",
    cta: "Layihəyə başla",
    servicesTitle: "Xidmətlər",
    services: [
      "3D Konfiquratorlar",
      "Məhsul Saytları",
      "Buraxılış Təcrübələri",
      "Resurs İstehsalı",
    ],
    companyTitle: "Şirkət",
    company: ["Haqqımızda", "İşlər", "Qiymətlər", "Əlaqə"],
    contactTitle: "Əlaqə",
    contactItems: [
      "hello@configuro.studio",
      "Qlobal təhvil, uzaqdan iş",
    ],
    copyright: "© 2026 Configuro. Bütün hüquqlar qorunur.",
  },
};

export default az;
