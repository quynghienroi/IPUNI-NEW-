const lo = {
  // Nav
  nav: {
    home: 'ພາບລວມ',
    metrics: 'ຕົວຊີ້ວັດ',
    scan: 'ສະແກນ',
    medications: 'ຢາ',
    appointments: 'ນັດໝາຍ',
  },

  // Dashboard
  dashboard: {
    greetNight: 'ສະບາຍດີຕອນດຶກ,',
    greetMorning: 'ສະບາຍດີຕອນເຊົ້າ,',
    greetAfternoon: 'ສະບາຍດີຕອນສວຍ,',
    greetEvening: 'ສະບາຍດີຕອນແລງ,',
    greetNightCute: 'ຝັນດີ,',
    greetMorningCute: 'ອາລຸ່ງດີ,',
    greetAfternoonCute: 'ຕອນສວຍທີ່ດີ,',
    greetEveningCute: 'ຕອນແລງທີ່ດີ,',
    metricsSection: 'ຕົວຊີ້ວັດຫຼ້າສຸດ',
    metricsSectionCute: '✨ ຕົວຊີ້ວັດຫຼ້າສຸດ',
    viewAll: 'ເບິ່ງທັງໝົດ >',
    viewAllCute: 'ເບິ່ງທັງໝົດ 🔍',
    todayMeds: 'ຢາວັນນີ້',
    viewPrescription: 'ເບິ່ງໃບສັ່ງຢາ',
    viewPrescriptionCute: 'ເບິ່ງໃບສັ່ງຢາ 💊',
    noMeds: 'ຍັງບໍ່ມີໃບສັ່ງຢາ',
    noMedsSubtitle: 'ທ່ານໝໍຍັງບໍ່ໄດ້ສັ່ງຢາ.',
    addMetric: 'ເພີ່ມຕົວຊີ້ວັດ',
  },

  // Metrics page
  metrics: {
    title: 'ຕິດຕາມຕົວຊີ້ວັດ',
    subtitle: 'ບັນທຶກແລະເບິ່ງກຣາຟສຸຂະພາບ',
    addBtn: 'ເພີ່ມຕົວຊີ້ວັດ',
    days7: '7 ວັນ',
    days14: '14 ວັນ',
    days30: '30 ວັນ',
    noData: 'ຍັງບໍ່ມີຂໍ້ມູນ',
    noDataSubtitle: 'ກະລຸນາເພີ່ມຕົວຊີ້ວັດທຳອິດ.',
    types: {
      fasting: 'ນ້ຳຕານຂະໜາດອົດ',
      post_meal_2h: 'ນ້ຳຕານຫຼັງກິນ 2h',
      pre_meal: 'ນ້ຳຕານກ່ອນກິນ',
      pre_sleep: 'ນ້ຳຕານກ່ອນນອນ',
    },
  },

  // Add metric modal
  addMetric: {
    title: 'ເພີ່ມຕົວຊີ້ວັດ',
    typeLabel: 'ປະເພດນ້ຳຕານ',
    valueLabel: 'ຄ່າ (mmol/L)',
    valuePlaceholder: 'ຕົວຢ່າງ: 6.5',
    timeLabel: 'ເວລາວັດ',
    noteLabel: 'ໝາຍເຫດ (ຕາມຕ້ອງການ)',
    notePlaceholder: 'ໝາຍເຫດ...',
    saveBtn: 'ບັນທຶກ',
    saving: 'ກຳລັງບັນທຶກ...',
    invalidValue: 'ກະລຸນາໃສ່ຄ່າທີ່ຖືກຕ້ອງ (0.1 – 50 mmol/L)',
    errorGeneric: 'ເກີດຂໍ້ຜິດພາດ',
  },

  // Medications page
  medications: {
    title: 'ໃບສັ່ງຢາ & ການເຕືອນ',
    subtitle: 'ຈັດການຢາທີ່ທ່ານໝໍສັ່ງ',
    noMeds: 'ຍັງບໍ່ມີໃບສັ່ງຢາ',
    noMedsSubtitle: 'ທ່ານໝໍຍັງບໍ່ໄດ້ສັ່ງຢາ. ກະລຸນາຕິດຕໍ່ທ່ານໝໍ.',
  },

  // Appointments page
  appointments: {
    title: 'ນັດໝາຍ & ຄຳແນະນຳ',
    subtitle: 'ຕາຕະລາງຕິດຕາມແລະຄຳແນະນຳຈາກທ່ານໝໍ',
    tabAppointments: 'ນັດໝາຍ',
    tabDoctor: 'ຈາກທ່ານໝໍ',
    noAppointments: 'ຍັງບໍ່ມີນັດໝາຍ',
    noAppointmentsSubtitle: 'ທ່ານໝໍຈະນັດໝາຍຫຼັງຈາກກວດ.',
    noDoctorNotes: 'ຍັງບໍ່ມີຄຳແນະນຳ',
    noDoctorNotesSubtitle: 'ທ່ານໝໍຈະຂຽນຄຳແນະນຳຫຼັງຈາກກວດ.',
  },

  // Advice page
  advice: {
    title: 'ຄຳແນະນຳສຸຂະພາບ',
    subtitle: 'ຄຳແນະນຳດ້ານອາຫານແລະວິຖີຊີວິດ',
  },

  // Auth
  auth: {
    loginTitle: 'ເຂົ້າສູ່ລະບົບ',
    loginSubtitle: 'ຍິນດີຕ້ອນຮັບກັບຄືນ',
    loginBtn: 'ເຂົ້າສູ່ລະບົບ',
    loggingIn: 'ກຳລັງເຂົ້າລະບົບ...',
    identifierLabel: 'ອີເມລ / ເລກປ້ຳ',
    identifierPlaceholder: 'ອີເມລ ຫຼື ເລກປ້ຳ',
    passwordLabel: 'ລະຫັດຜ່ານ',
    noAccount: 'ຍັງບໍ່ມີບັນຊີ?',
    registerLink: 'ລົງທະບຽນ',
    loginFailed: 'ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ',
    fillAll: 'ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບ',

    registerTitle: 'ລົງທະບຽນ',
    registerSubtitle: 'ໃສ່ຂໍ້ມູນເພື່ອສ້າງບັນຊີ',
    registerBtn: 'ລົງທະບຽນ',
    registering: 'ກຳລັງລົງທະບຽນ...',
    cccdLabel: 'ເລກປ້ຳ',
    phoneLabel: 'ເບີໂທ',
    confirmPasswordLabel: 'ຢືນຢັນລະຫັດຜ່ານ',
    hasAccount: 'ມີບັນຊີແລ້ວ?',
    loginLink: 'ເຂົ້າສູ່ລະບົບ',
    registerFailed: 'ການລົງທະບຽນບໍ່ສຳເລັດ',
    cccdInvalid: 'ເລກປ້ຳຕ້ອງມີ 12 ໂຕເລກ',
    phoneInvalid: 'ເບີໂທບໍ່ຖືກຕ້ອງ',
    passwordTooShort: 'ລະຫັດຜ່ານຢ່າງໜ້ອຍ 6 ໂຕ',
    passwordMismatch: 'ລະຫັດຜ່ານບໍ່ກົງກັນ',

    tagline: 'ແອັບຕິດຕາມສຸຂະພາບໂລກເບົາຫວານ',
    taglineRegister: 'ສ້າງບັນຊີໃໝ່\nເພື່ອເລີ່ມຕິດຕາມສຸຂະພາບ',
    taglineLogin: 'ຕິດຕາມສຸຂະພາບໂລກເບົາຫວານ\nທຸກທີ່ ທຸກເວລາ',
  },

  // User menu
  userMenu: {
    upgrade: 'ອັບເກຣດ',
    profile: 'ຂໍ້ມູນສ່ວນຕົວ',
    language: 'ພາສາ',
    theme: 'ຮູບລັກສະນະ',
    settings: 'ການຕັ້ງຄ່າ',
    logout: 'ອອກຈາກລະບົບ',
  },

  // Settings
  settings: {
    title: 'ການຕັ້ງຄ່າ',
    sectionTheme: 'ຮູບລັກສະນະ',
    cuteMode: 'ໂໝດໜ້າຮັກ',
    cuteModeDesc: 'ໜ້າຕາສີພາສເທລ ດູໜ້າຮັກ',
    goldTheme: 'ໂທນທອງ',
    goldThemeDesc: 'ໜ້າຕາລະດັບ Premium ສຳລັບ Pro',
    sectionNotify: 'ການແຈ້ງເຕືອນ',
    reminderTitle: 'ເຕືອນວັດນ້ຳຕານ',
    reminderDesc: 'ເຕືອນທຸກເຊົ້າ 7:00 ແລະ 17:00',
    sectionOther: 'ອື່ນໆ',
    privacy: 'ຄວາມເປັນສ່ວນຕົວ',
    privacyDesc: 'ຈັດການຂໍ້ມູນສຸຂະພາບ',
    support: 'ຊ່ວຍເຫຼືອ & ຄຳແນະນຳ',
    supportDesc: 'ຄຳຖາມທີ່ພົບບ່ອຍ, ຕິດຕໍ່',
    comingSoon: 'ໄວໆນີ້',
    version: 'DIA+ v1.0.0 — ດູແລສຸຂະພາບອັດສະລິຍະ',
  },

  // Common
  common: {
    loading: 'ກຳລັງໂຫຼດ...',
    save: 'ບັນທຶກ',
    cancel: 'ຍົກເລີກ',
    close: 'ປິດ',
    delete: 'ລຶບ',
    edit: 'ແກ້ໄຂ',
    add: 'ເພີ່ມ',
    back: 'ກັບຄືນ',
    success: 'ສຳເລັດ!',
    error: 'ເກີດຂໍ້ຜິດພາດ',
  },

  // Days of week
  days: ['ວັນອາທິດ', 'ວັນຈັນ', 'ວັນອັງຄານ', 'ວັນພຸດ', 'ວັນພະຫັດ', 'ວັນສຸກ', 'ວັນເສົາ'],
  dateFormat: (d, m, y) => `${d}/${m}/${y}`,
};

export default lo;
