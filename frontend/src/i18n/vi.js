const vi = {
  // Nav
  nav: {
    home: 'Tổng quan',
    metrics: 'Chỉ số',
    scan: 'Chụp ảnh',
    medications: 'Thuốc',
    appointments: 'Lịch hẹn',
  },

  // Dashboard
  dashboard: {
    greetNight: 'Chào buổi đêm,',
    greetMorning: 'Chào buổi sáng,',
    greetAfternoon: 'Chào buổi chiều,',
    greetEvening: 'Chào buổi tối,',
    greetNightCute: 'Chúc ngủ ngon,',
    greetMorningCute: 'Chào buổi sáng xinh,',
    greetAfternoonCute: 'Chiều vui vẻ nha,',
    greetEveningCute: 'Buổi tối dễ thương,',
    metricsSection: 'Chỉ số gần nhất',
    metricsSectionCute: '✨ Chỉ số gần nhất',
    viewAll: 'Xem tất cả >',
    viewAllCute: 'Xem tất cả 🔍',
    todayMeds: 'Thuốc hôm nay',
    viewPrescription: 'Xem đơn',
    viewPrescriptionCute: 'Xem đơn 💊',
    noMeds: 'Chưa có đơn thuốc',
    noMedsSubtitle: 'Bác sĩ chưa kê đơn thuốc nào.',
    addMetric: 'Nhập chỉ số',
  },

  // Metrics page
  metrics: {
    title: 'Theo dõi chỉ số',
    subtitle: 'Nhập và xem biểu đồ chỉ số sức khỏe',
    addBtn: 'Nhập chỉ số',
    days7: '7 ngày',
    days14: '14 ngày',
    days30: '30 ngày',
    noData: 'Chưa có dữ liệu',
    noDataSubtitle: 'Hãy nhập chỉ số đầu tiên của bạn.',
    types: {
      fasting: 'Đường huyết lúc đói',
      post_meal_2h: 'Đường huyết sau ăn 2h',
      pre_meal: 'Đường huyết trước ăn',
      pre_sleep: 'Đường huyết trước ngủ',
    },
  },

  // Add metric modal
  addMetric: {
    title: 'Nhập chỉ số',
    typeLabel: 'Loại đường huyết',
    valueLabel: 'Giá trị (mmol/L)',
    valuePlaceholder: 'Ví dụ: 6.5',
    timeLabel: 'Thời gian đo',
    noteLabel: 'Ghi chú (tùy chọn)',
    notePlaceholder: 'Ghi chú...',
    saveBtn: 'Lưu chỉ số',
    saving: 'Đang lưu...',
    invalidValue: 'Vui lòng nhập giá trị hợp lệ (0.1 – 50 mmol/L)',
    errorGeneric: 'Có lỗi xảy ra',
  },

  // Medications page
  medications: {
    title: 'Đơn thuốc & Nhắc uống',
    subtitle: 'Quản lý thuốc từ bác sĩ kê',
    noMeds: 'Chưa có đơn thuốc',
    noMedsSubtitle: 'Bác sĩ chưa kê đơn thuốc nào. Vui lòng liên hệ bác sĩ phụ trách.',
  },

  // Appointments page
  appointments: {
    title: 'Lịch hẹn & Hướng dẫn',
    subtitle: 'Lịch tái khám và chỉ dẫn từ bác sĩ',
    tabAppointments: 'Lịch hẹn',
    tabDoctor: 'Từ bác sĩ',
    noAppointments: 'Chưa có lịch hẹn',
    noAppointmentsSubtitle: 'Bác sĩ sẽ đặt lịch tái khám cho bạn sau mỗi lần khám.',
    noDoctorNotes: 'Chưa có chỉ dẫn',
    noDoctorNotesSubtitle: 'Bác sĩ sẽ ghi chỉ dẫn cho bạn sau mỗi lần khám.',
  },

  // Advice page
  advice: {
    title: 'Lời khuyên sức khỏe',
    subtitle: 'Hướng dẫn chế độ ăn và lối sống',
  },

  // Auth
  auth: {
    loginTitle: 'Đăng nhập',
    loginSubtitle: 'Chào mừng bạn quay trở lại',
    loginBtn: 'Đăng nhập',
    loggingIn: 'Đang đăng nhập...',
    identifierLabel: 'Email / CCCD',
    identifierPlaceholder: 'Email hoặc số CCCD',
    passwordLabel: 'Mật khẩu',
    noAccount: 'Chưa có tài khoản?',
    registerLink: 'Đăng ký ngay',
    loginFailed: 'Đăng nhập thất bại',
    fillAll: 'Vui lòng nhập đầy đủ thông tin',

    registerTitle: 'Đăng ký',
    registerSubtitle: 'Nhập thông tin để tạo tài khoản',
    registerBtn: 'Đăng ký',
    registering: 'Đang đăng ký...',
    cccdLabel: 'Số CCCD',
    phoneLabel: 'Số điện thoại',
    confirmPasswordLabel: 'Nhập lại mật khẩu',
    hasAccount: 'Đã có tài khoản?',
    loginLink: 'Đăng nhập',
    registerFailed: 'Đăng ký thất bại',
    cccdInvalid: 'CCCD phải đúng 12 chữ số',
    phoneInvalid: 'Số điện thoại không hợp lệ',
    passwordTooShort: 'Mật khẩu ít nhất 6 ký tự',
    passwordMismatch: 'Mật khẩu nhập lại không khớp',

    tagline: 'Ứng dụng theo dõi sức khỏe tiểu đường',
    taglineRegister: 'Tạo tài khoản mới\nđể bắt đầu theo dõi sức khỏe',
    taglineLogin: 'Theo dõi sức khỏe tiểu đường\nmọi lúc, mọi nơi',
  },

  // User menu
  userMenu: {
    upgrade: 'Nâng cấp',
    profile: 'Thông Tin',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    settings: 'Cài Đặt',
    logout: 'Đăng Xuất',
  },

  // Settings
  settings: {
    title: 'Cài Đặt',
    sectionTheme: 'Giao diện',
    cuteMode: 'Cute Mode',
    cuteModeDesc: 'Giao diện trẻ trung, màu pastel dễ thương',
    goldTheme: 'Gold Theme',
    goldThemeDesc: 'Giao diện cao cấp dành riêng cho tài khoản Pro',
    sectionNotify: 'Thông báo',
    reminderTitle: 'Nhắc đo đường huyết',
    reminderDesc: 'Nhắc nhở mỗi sáng lúc 7:00 và chiều 17:00',
    sectionOther: 'Khác',
    privacy: 'Quyền riêng tư',
    privacyDesc: 'Quản lý dữ liệu sức khỏe của bạn',
    support: 'Hỗ trợ & Hướng dẫn',
    supportDesc: 'Câu hỏi thường gặp, liên hệ hỗ trợ',
    comingSoon: 'Sắp ra mắt',
    version: 'DIA+ v1.0.0 — Chăm sóc sức khỏe thông minh',
  },

  // Common
  common: {
    loading: 'Đang tải...',
    save: 'Lưu',
    cancel: 'Hủy',
    close: 'Đóng',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    add: 'Thêm',
    back: 'Quay lại',
    success: 'Thành công!',
    error: 'Có lỗi xảy ra',
  },

  // Days of week
  days: ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  dateFormat: (d, m, y) => `${d} tháng ${m} ${y}`,
};

export default vi;
