function createQRSystem() {
  // 创建触发按钮
  const trigger = document.createElement('div');
  trigger.className = 'qr-trigger';
  
  // 获取网站favicon
  const favicon = document.querySelector('link[rel*="icon"]')?.href || 
                 `${window.location.origin}/favicon.ico`;
  
  // 创建logo图片
  const logo = document.createElement('img');
  logo.src = favicon;
  logo.onerror = function() {
    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0NDQ0NDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iNyIgaGVpZ2h0PSI3Ii8+PHJlY3QgeD0iMTQiIHk9IjMiIHdpZHRoPSI3IiBoZWlnaHQ9IjciLz48cmVjdCB4PSIzIiB5PSIxNCIgd2lkdGg9IjciIGhlaWdodD0iNyIvPjxsaW5lIHgxPSIxNCIgeTE9IjE0IiB4Mj0iMjEiIHkyPSIxNCIvPjxsaW5lIHgxPSIxNCIgeTE9IjE3IiB4Mj0iMjEiIHkyPSIxNyIvPjxsaW5lIHgxPSIxNCIgeTE9IjIwIiB4Mj0iMjEiIHkyPSIyMCIvPjwvc3ZnPg==';
  };
  trigger.appendChild(logo);
  
  // 创建QR码容器
  const container = document.createElement('div');
  container.className = 'qr-container';
  
  // 创建关闭按钮
  const closeButton = document.createElement('div');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '×';
  container.appendChild(closeButton);
  
  // 创建QR码图片
  const qrImage = document.createElement('img');
  qrImage.className = 'qr-code';
  
  // 使用 QR Server API 生成QR码
  const currentUrl = encodeURIComponent(window.location.href);
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${currentUrl}`;
  
  // 添加网站名称和标题
  const websiteName = document.createElement('div');
  websiteName.className = 'website-name';
  websiteName.textContent = window.location.hostname;
  
  const pageTitle = document.createElement('div');
  pageTitle.className = 'page-title';
  pageTitle.textContent = document.title.substring(0, 15);
  
  // 获取网页语言
  function getPageLanguage() {
    // 优先使用 html 标签的 lang 属性
    const htmlLang = document.documentElement.lang.toLowerCase();
    // 如果没有 lang 属性，使用 navigator.language
    const browserLang = navigator.language.toLowerCase();
    return htmlLang || browserLang;
  }

  // 获取下载提示文字
  function getDownloadTip() {
    const lang = getPageLanguage();
    
    const tips = {
      'zh': '右键点击可下载二维码',
      'zh-cn': '右键点击可下载二维码',
      'zh-tw': '右鍵點擊可下載 QR 碼',
      'en': 'Right click to download QR code',
      'ja': 'QRコードを保存するには右クリックしてください',
      'ko': 'QR 코드를 다운로드하려면 마우스 오른쪽 버튼을 클릭하세요',
      'fr': 'Clic droit pour télécharger le code QR',
      'de': 'Rechtsklick zum Herunterladen des QR-Codes',
      'es': 'Clic derecho para descargar el código QR',
      'ru': 'Нажмите правой кнопкой мыши, чтобы скачать QR-код',
      'it': 'Clicca con il tasto destro per scaricare il codice QR',
      'pt': 'Clique com o botão direito para baixar o código QR',
      'nl': 'Rechtsklik om de QR-code te downloaden',
      'pl': 'Kliknij prawym przyciskiem myszy, aby pobrać kod QR',
      'tr': 'QR kodu indirmek için sağ tıklayın',
      'ar': 'انقر بزر الماوس الأيمن لتحميل رمز QR',
      'th': 'คลิกขวาเพื่อดาวน์โหลดรหัส QR',
      'vi': 'Nhấp chuột phải để tải mã QR'
    };

    // 处理带地区的语言代码（如 en-US, zh-CN 等）
    const baseLang = lang.split('-')[0];
    
    // 如果找到完整匹配就使用完整匹配，否则使用基础语言匹配，如果都没有就使用英语
    return tips[lang] || tips[baseLang] || tips['en'];
  }

  // 创建下载提示
  const downloadTip = document.createElement('div');
  downloadTip.className = 'download-tip';
  downloadTip.textContent = getDownloadTip();
  
  // 组装容器
  container.appendChild(qrImage);
  container.appendChild(websiteName);
  container.appendChild(pageTitle);
  container.appendChild(downloadTip);
  
  // 添加到页面
  document.body.appendChild(trigger);
  document.body.appendChild(container);
  
  // 创建下载功能
  async function downloadQRCode() {
    try {
      // 创建canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 设置canvas大小（包含二维码和文字区域）
      canvas.width = 256;
      canvas.height = 320;
      
      // 填充白色背景
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制二维码
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 256, 256);
          resolve();
        };
        img.onerror = reject;
        img.src = qrImage.src;
      });
      
      // 绘制网站logo
      if (favicon) {
        try {
          await new Promise((resolve, reject) => {
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.onload = () => {
              // 在二维码中心绘制logo
              const logoSize = 40;
              const logoX = (256 - logoSize) / 2;
              const logoY = (256 - logoSize) / 2;
              
              // 绘制白色背景
              ctx.fillStyle = 'white';
              ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
              
              // 绘制logo
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
              resolve();
            };
            logoImg.onerror = reject;
            logoImg.src = favicon;
          });
        } catch (error) {
          console.error('Logo加载失败:', error);
        }
      }
      
      // 设置文字样式
      ctx.textAlign = 'center';
      
      // 绘制网站名称
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(websiteName.textContent, canvas.width/2, 280);
      
      // 绘制页面标题
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText(pageTitle.textContent, canvas.width/2, 300);
      
      // 转换为图片并下载
      const link = document.createElement('a');
      link.download = `qrcode-${window.location.hostname}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (error) {
      console.error('二维码下载失败:', error);
      alert('二维码下载失败，请稍后重试');
    }
  }
  
  // 添加右键菜单事件
  container.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    downloadQRCode();
  });
  
  // 添加点击事件
  trigger.addEventListener('click', () => {
    container.classList.add('show');
    trigger.style.display = 'none';
  });
  
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    container.classList.remove('show');
    trigger.style.display = 'flex';
  });
}

// 页面加载完成后初始化
window.addEventListener('load', createQRSystem); 