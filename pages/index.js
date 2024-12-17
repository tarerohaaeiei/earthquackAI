import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

function EarthquakeAI() {
  const [magnitude, setMagnitude] = useState('');
  const [depth, setDepth] = useState('');
  const [reaction, setReaction] = useState('');
  const [intensity, setIntensity] = useState('');
  const [destruction, setDestruction] = useState('');
  const [intensityDescription, setIntensityDescription] = useState('');
  const [destructionDescription, setDestructionDescription] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); 
  const [selectedYear, setSelectedYear] = useState(''); 
  const [warningMessage, setWarningMessage] = useState(''); // สถานะสำหรับเก็บข้อความเตือน
  
  // ฟังก์ชันเรียก API สำหรับการคำนวณ
  const calculateEarthquake = async (e) => {
    e.preventDefault();

    // ตรวจสอบค่าติดลบ
    if (magnitude < 0 || depth < 0) {
      setWarningMessage('Magnitude , Depth and Reaction must be positive values.');
      return;
    } else {
      setWarningMessage(''); // ล้างข้อความเตือนเมื่อค่าถูกต้อง
    }

    try {
      // เรียกใช้งาน API ด้วย axios
      const response = await axios.post('https://earthquakeai.site/predict', {
        Magnitude: magnitude,
        Depth: depth,
        Reaction: reaction,
      });

      const data = response.data;
      console.log(data);
      setIntensity(data.Intensity);
      setDestruction(data.Destruction);
      setIntensityDescription(data.Intensity_description);
      setDestructionDescription(data.Destruction_description);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ฟังก์ชันดาวน์โหลดไฟล์ JSON
  const handleDownload = async () => {
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      const response = await axios.get(`https://earthquakeai.site/download?year=${selectedYear}&month=${selectedMonth}`, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const blob = new Blob([response.data],{ type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `earthquake-history-${month}-${year}.csv`;
        link.click();
      } else {
        console.error('Error downloading file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="empty-bar"></div>
      <h1>Earthquake</h1>
      <h2>AI</h2>
      <form className="form-container" onSubmit={calculateEarthquake}>
        <div className="form-group">
          <label>Magnitude (ML)</label>
          <input
            type="number"
            value={magnitude}
            onChange={(e) => setMagnitude(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Depth (km)</label>
          <input
            type="number"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Reaction</label>
          <input
            type="text"
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
          />
        </div>
        <button type="submit">submit</button>
        {warningMessage && <p className="warning-message">** {warningMessage}**</p>}
      </form>

      <div className="result">
        <label htmlFor="intensity">Intensity(MMI):</label>
        <textarea onInput="autoResize(this)" type="text" id="intensity" value={`  ${intensity} ${intensityDescription}`} readOnly />

        <label htmlFor="destruction">Destruction:</label>
        <textarea onInput="autoResize(this)" type="text" id="destruction" value={`  ${destruction} ${destructionDescription}`} readOnly />
      </div>
      <div className="month">
        <label htmlFor="month">Month  </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="00">------</option>
          <option value="01">มกราคม</option>
          <option value="02">กุมภาพันธ์</option>
          <option value="03">มีนาคม</option>
          <option value="04">เมษายน</option>
          <option value="05">พฤษภาคม</option>
          <option value="06">มิถุนายน</option>
          <option value="07">กรกฎาคม</option>
          <option value="08">สิงหาคม</option>
          <option value="09">กันยายน</option>
          <option value="10">ตุลาคม</option>
          <option value="11">พฤศจิกายน</option>
          <option value="12">ธันวาคม</option>
        </select>
      </div>
      <div className="year">
        <label htmlFor="year">Year  </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="0000">----</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          {/* เพิ่มปีตามที่คุณต้องการ */}
        </select>
      </div>

      <div className="download-button" onClick={handleDownload}>
        <i className="fa-solid fa-circle-down"></i><span>Download</span>
      </div>
    </div>
  );
}

export default EarthquakeAI;
