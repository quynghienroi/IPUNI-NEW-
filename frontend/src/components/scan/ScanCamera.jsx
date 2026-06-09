import { useRef } from 'react';
import { Camera } from 'lucide-react';
import styles from './ScanCamera.module.css';

export default function ScanCamera({ onImageScan }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraSectionRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageScan(file);
    }
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      videoRef.current.srcObject = stream;
      cameraSectionRef.current?.classList.add(styles.cameraActive);
    } catch (err) {
      console.error('Camera error:', err);
      fileInputRef.current?.click();
    }
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], 'prescription.jpg', { type: 'image/jpeg' });
      onImageScan(file);

      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      cameraSectionRef.current?.classList.remove(styles.cameraActive);
    });
  };

  return (
    <div className={styles.container}>
      <div ref={cameraSectionRef} className={styles.cameraSection}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          playsInline
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={430}
          height={600}
        />

        <div className={styles.controls}>
          <button onClick={handleCapture} className={styles.captureBtn}>
            <Camera size={24} />
            Chụp
          </button>
        </div>
      </div>

      <div className={styles.fallback}>
        <div className={styles.fallbackContent}>
          <Camera size={48} />
          <h3>Chọn ảnh đơn thuốc</h3>
          <p>Chụp ảnh hoặc chọn ảnh từ thư viện</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadBtn}
          >
            Chọn ảnh
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}
