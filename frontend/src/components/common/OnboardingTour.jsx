import { useState, useEffect, useRef } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import Modal from './Modal';
import useAuthStore from '../../store/authStore';

export default function OnboardingTour() {
  const [showChoice, setShowChoice] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const user = useAuthStore(state => state.user);
  
  useEffect(() => {
    // Wait for user to be loaded from API
    if (user === null) return;

    const isDemoUser = user.is_demo || (user.email && user.email.startsWith('demo_'));
    const forceTour = localStorage.getItem('diaplus_force_tour');
    const hasSeenTour = localStorage.getItem('diaplus_has_seen_tour');
    
    // Check if we need to force the tour (user chose it on landing page or first time demo)
    if (forceTour || (isDemoUser && !hasSeenTour)) {
      // Don't set storage until we ACTUALLY run it, to survive Strict Mode unmounts
      const timer = setTimeout(() => {
        setRunTour(true);
        localStorage.removeItem('diaplus_force_tour');
        localStorage.setItem('diaplus_has_seen_tour', 'true');
      }, 500);
      
      return () => clearTimeout(timer);
    }

    // For normal users who haven't seen the tour, show choice
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
      setRunTour(true);
    }
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
    }
  };

  const steps = [
    {
      target: 'body',
      content: 'Chào mừng bạn đến với DIA+! Cùng tìm hiểu các tính năng chính nhé.',
      placement: 'center',
    },
    {
      target: '[href="/dashboard"]',
      content: 'Đây là trang chủ, nơi tổng hợp tình hình sức khỏe và các nhắc nhở hôm nay.',
    },
    {
      target: '[href="/scan"]',
      content: 'Bấm vào đây để quét ảnh đơn thuốc, AI sẽ tự động đọc tên thuốc và cách dùng!',
    },
    {
      target: '[href="/medications"]',
      content: 'Quản lý lịch uống thuốc và theo dõi xem bạn đã uống đúng giờ hay chưa.',
    },
    {
      target: '[href="/metrics"]',
      content: 'Theo dõi đường huyết và huyết áp của bạn qua biểu đồ trực quan.',
    },
    {
      target: '.user-menu-btn',
      content: 'Vào cài đặt để ghi âm nhắc nhở bằng giọng nói người thân và đổi màu giao diện nhé!',
    }
  ];

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

      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#1B5FA6',
            zIndex: 10000,
          }
        }}
        locale={{
          back: 'Quay lại',
          close: 'Đóng',
          last: 'Hoàn tất',
          next: 'Tiếp theo',
          skip: 'Bỏ qua',
        }}
      />
    </>
  );
}
