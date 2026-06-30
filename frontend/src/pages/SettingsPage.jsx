import React, { useState, useEffect, useRef } from 'react';
import { Settings, Mic, Square, Play, Trash2, HeartPulse, Activity } from 'lucide-react';
import { voiceAlertService, ALERT_TYPES } from '../services/voiceAlert.service';
import styles from './SettingsPage.module.css';

const ALERT_CONFIG = [
  {
    id: ALERT_TYPES.MED_ALL,
    title: 'Nhắc uống thuốc',
    desc: 'Phát khi đến giờ uống thuốc (tự động đọc tên thuốc)',
    icon: <Settings size={18} />
  },
  {
    id: ALERT_TYPES.SUGAR_HIGH,
    title: 'Cảnh báo đường huyết TĂNG',
    desc: 'Phát khi đường huyết sát ngưỡng nguy hiểm',
    icon: <Activity size={18} />
  },
  {
    id: ALERT_TYPES.SUGAR_LOW,
    title: 'Cảnh báo đường huyết GIẢM',
    desc: 'Phát khi đường huyết quá thấp',
    icon: <Activity size={18} />
  },
  {
    id: ALERT_TYPES.BP_LOW,
    title: 'Cảnh báo tụt huyết áp',
    desc: 'Phát khi huyết áp thấp, nhắc nhở bình tĩnh',
    icon: <HeartPulse size={18} />
  }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [recordingId, setRecordingId] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await voiceAlertService.getAllSettings();
    setSettings(data);
  };

  const startRecording = async (alertType) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await voiceAlertService.saveVoice(alertType, audioBlob);
        loadSettings();
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingId(alertType);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Không thể truy cập Micro. Vui lòng cấp quyền trong cài đặt trình duyệt.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecordingId(null);
  };

  const playVoice = (alertType) => {
    voiceAlertService.playAlert(alertType);
  };

  const deleteVoice = async (alertType) => {
    if (window.confirm("Bạn có chắc muốn xóa giọng nói này?")) {
      await voiceAlertService.deleteVoice(alertType);
      loadSettings();
    }
  };

  const toggleCustomVoice = async (alertType, isChecked) => {
    await voiceAlertService.toggleCustomVoice(alertType, isChecked);
    loadSettings();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Settings size={24} />
          <h1>Cài đặt giọng nói</h1>
        </div>
        <p>Ghi âm giọng nói của người nhà để tạo sự thân thuộc khi ứng dụng nhắc nhở</p>
      </div>

      <div className={styles.alertList}>
        {ALERT_CONFIG.map((item) => {
          const setting = settings[item.id] || {};
          const hasVoice = !!setting.audioBase64;
          const useCustom = hasVoice && setting.useCustomVoice !== false;
          const isRecording = recordingId === item.id;

          return (
            <div key={item.id} className={styles.alertCard}>
              <div className={styles.alertHeader}>
                <h3 className={styles.alertTitle}>{item.title}</h3>
                {hasVoice && (
                  <div className={styles.toggleGroup}>
                    <span>Dùng giọng người nhà</span>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={useCustom}
                        onChange={(e) => toggleCustomVoice(item.id, e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                )}
              </div>
              <p className={styles.alertDesc}>{item.desc}</p>
              
              <div className={styles.controls}>
                <div className={styles.recordGroup}>
                  {isRecording ? (
                    <button className={`${styles.iconBtn} ${styles.recording}`} onClick={stopRecording}>
                      <Square size={16} fill="currentColor" />
                    </button>
                  ) : (
                    <button className={`${styles.iconBtn} ${styles.recordBtn}`} onClick={() => startRecording(item.id)}>
                      <Mic size={20} />
                    </button>
                  )}
                  
                  <button className={`${styles.iconBtn} ${styles.playBtn}`} onClick={() => playVoice(item.id)}>
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
                
                {hasVoice && (
                  <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => deleteVoice(item.id)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
