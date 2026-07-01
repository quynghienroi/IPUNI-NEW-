import { useState, useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from './Modal';
import useAuthStore from '../../store/authStore';
import './OnboardingTour.css';

export default function OnboardingTour() {
  const [showChoice, setShowChoice] = useState(false);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (user === null) return;

    const isDemoUser = user.is_demo || (user.email && user.email.startsWith('demo_'));
    const forceTour = localStorage.getItem('diaplus_force_tour');
    const hasSeenTour = localStorage.getItem('diaplus_has_seen_tour');
    
    if (forceTour || (isDemoUser && !hasSeenTour)) {
      const timer = setTimeout(() => {
        startTour();
        localStorage.removeItem('diaplus_force_tour');
        localStorage.setItem('diaplus_has_seen_tour', 'true');
      }, 500);
      
      return () => clearTimeout(timer);
    }

    if (!isDemoUser && !hasSeenTour) {
      const timer = setTimeout(() => {
        setShowChoice(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleChoice = (wantTour) => {
    setShowChoice(false);
    localStorage.setItem('diaplus_has_seen_tour', 'true');
    if (wantTour) {
      startTour();
    }
  };

  const steps = [
    {
      element: '.tour-step-1',
      popover: {
        title: 'Thanh công cụ',
        description: 'Ở đây có biểu tượng sách để xem lời khuyên sức khỏe từ chuyên gia, và biểu tượng loa chuông để nhận thông báo nhắc nhở uống thuốc.',
        side: 'bottom',
        align: 'start'
      },
      route: '/dashboard'
    },
    {
      element: '.tour-step-2',
      popover: {
        title: 'Chỉ số sức khỏe',
        description: 'Đây là vùng theo dõi chỉ số sức khỏe. Nơi này hiển thị những lần đo gần nhất mà bạn đã lưu lại như Glucose và Huyết áp.',
        side: 'bottom',
        align: 'start'
      },
      route: '/dashboard'
    },
    {
      element: '.tour-step-3',
      popover: {
        title: 'Thuốc hôm nay',
        description: 'Phần này giúp bạn xem danh sách thuốc cần uống trong ngày và đánh dấu Đã uống hoặc Chưa uống để theo dõi.',
        side: 'bottom',
        align: 'start'
      },
      route: '/dashboard'
    },
    {
      element: '.tour-step-4',
      popover: {
        title: 'Tính năng Chỉ số',
        description: 'Nhập chỉ số đường huyết mỗi khi bạn đo và theo dõi biểu đồ xu hướng qua thời gian.',
        side: 'bottom',
        align: 'start'
      },
      route: '/metrics'
    },
    {
      element: '.tour-step-5',
      popover: {
        title: 'Chụp ảnh AI',
        description: 'Chụp hoặc tải ảnh đơn thuốc, kết quả xét nghiệm liên quan đến tiểu đường để AI tự động phân tích và lưu trữ.',
        side: 'bottom',
        align: 'start'
      },
      route: '/scan'
    },
    {
      element: '.tour-step-6',
      popover: {
        title: 'Quản lý Thuốc',
        description: 'Tab này hiển thị toàn bộ danh sách thuốc bạn đang sử dụng cùng liều lượng và trạng thái.',
        side: 'bottom',
        align: 'start'
      },
      route: '/medications'
    },
    {
      element: '.tour-step-7',
      popover: {
        title: 'Lịch khám Bác sĩ',
        description: 'Xem lịch tái khám tiếp theo và chuẩn bị các thông tin cần thiết.',
        side: 'bottom',
        align: 'start'
      },
      route: '/appointments'
    },
    {
      element: '.tour-step-8',
      popover: {
        title: 'Cài đặt nhắc nhở',
        description: 'Bạn có thể tự ghi âm giọng nói của người thân để làm âm báo nhắc uống thuốc, giúp cảm giác thân thiện hơn thay vì giọng máy.',
        side: 'bottom',
        align: 'start'
      },
      route: '/settings'
    }
  ];

  const startTour = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => initDriver(0), 300);
    } else {
      initDriver(0);
    }
  };

  const initDriver = (startIndex) => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: false,
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      nextBtnText: 'Tiếp theo',
      prevBtnText: 'Quay lại',
      doneBtnText: 'Hoàn tất',
      progressText: 'Bước {{current}} / {{total}}',
      onNextClick: (el, step, opts) => {
        const nextIndex = driverObj.getActiveIndex() + 1;
        if (nextIndex < steps.length) {
          const nextStep = steps[nextIndex];
          if (location.pathname !== nextStep.route) {
            navigate(nextStep.route);
            driverObj.destroy();
            setTimeout(() => initDriver(nextIndex), 400);
          } else {
            driverObj.moveNext();
          }
        } else {
          driverObj.destroy();
        }
      },
      onPrevClick: (el, step, opts) => {
        const prevIndex = driverObj.getActiveIndex() - 1;
        if (prevIndex >= 0) {
          const prevStep = steps[prevIndex];
          if (location.pathname !== prevStep.route) {
            navigate(prevStep.route);
            driverObj.destroy();
            setTimeout(() => initDriver(prevIndex), 400);
          } else {
            driverObj.movePrevious();
          }
        }
      },
      steps: steps.map((step) => ({
        element: step.element,
        popover: step.popover
      }))
    });
    
    const targetEl = steps[startIndex].element;
    if (document.querySelector(targetEl)) {
      driverObj.drive(startIndex);
    } else {
      setTimeout(() => {
        if (document.querySelector(targetEl)) {
          driverObj.drive(startIndex);
        } else {
            console.warn(`Tour step target not found: ${targetEl}`);
        }
      }, 500);
    }
  };

  return (
    <>
      {showChoice && (
        <Modal title="Chào mừng đến với DIA+" onClose={() => handleChoice(false)}>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ marginBottom: 20, color: '#444' }}>
              Bạn muốn bắt đầu sử dụng ngay hay xem qua hướng dẫn các tính năng?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button 
                onClick={() => handleChoice(false)}
                style={{ padding: '10px 20px', borderRadius: 20, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
              >
                Tự trải nghiệm
              </button>
              <button 
                onClick={() => handleChoice(true)}
                style={{ padding: '10px 20px', borderRadius: 20, border: 'none', background: '#1B5FA6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Hướng dẫn dùng app
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
