
// دالة لإظهار القسم المحدد وإخفاء الباقي
function showContent(sectionId) {
    // إخفاء كل الأقسام أولًا
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });

    // إظهار القسم المحدد فقط
    const activeContent = document.getElementById(sectionId);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// تعطيل السلوك الافتراضي للروابط (منع تحميل صفحة جديدة)
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
    });
});

// عند تحميل الصفحة، تأكد من إظهار القسم الرئيسي فقط
document.addEventListener('DOMContentLoaded', function() {
    showContent('home');
});
/***********************************home**/////////////////////////////////////////
async function fetchFiles() {
    const res = await fetch('/files');
    if (!res.ok) {
      alert('Failed to load files');
      return;
    }
    const files = await res.json();
    const list = document.getElementById('fileList');
    list.innerHTML = '';

    files.forEach(file => {
      const li = document.createElement('li');
      // Link to download endpoint, using file ID
      const link = document.createElement('a');
      link.href = `/download/${file.Id}`;
      link.textContent = `${file.FileName} (uploaded ${new Date(file.UploadDate).toLocaleString()})`;
      link.download = file.FileName; // Hint for browser to download
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  fetchFiles();
//**********************************************************prof*********//******************************//

/*************************announ***********************/
// عرض تاريخ اليوم تلقائيًا (يمكن تعديله لاحقًا من قاعدة البيانات)
document.getElementById('update-date').textContent = new Date().toLocaleDateString('ar-EG');
/**** */
async function loadAds() {
    const res = await fetch('/ads');
    if (!res.ok) {
      document.getElementById('Ads_container').textContent = 'Failed to load ads';
      return;
    }

    const ads = await res.json();
    const container = document.getElementById('Ads_container');
    container.innerHTML = '';

    ads.forEach(ad => {
      const div = document.createElement('div');
      div.style.border = '1px solid #ccc';
      div.style.padding = '10px';
      div.style.marginBottom = '10px';

      const title = document.createElement('h3');
      title.textContent = ad.Title;

      const content = document.createElement('p');
      content.textContent = ad.Content;

      const date = document.createElement('small');
      date.textContent = `Posted:${new Date(ad.UploadDate).toLocaleString()}`;

      div.appendChild(title);
      div.appendChild(content);
      div.appendChild(date);
      container.appendChild(div);
    });
  }

  loadAds();
  /******************************** */
  const studentId = sessionStorage.getItem('studentId');

    fetch(`/marks/${studentId}`)
      .then(res => res.json())
      .then(marks => {
        const table = document.getElementById('marksTable');
        table.innerHTML = '';

        marks.forEach(mark => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${mark.Subject}</td>
            <td>${mark.Exam}</td>
            <td>${mark.Mark} / ${mark.MaxMark}</td>
            <td>${new Date(mark.UploadDate).toLocaleDateString()}</td>
          `;
          table.appendChild(row);
        });
      });
/*********************logout-s***/
      document.getElementById('logout').addEventListener('click',()=>{
        fetch('/logout',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(response =>response.json()).then(data=>{
            if(data.success){window.location.href='../public/index.html'}
        })
      })

/*****************load-save profile******/
      async function loadProfile() {
        const studentId =sessionStorage.getItem('studentId');
        try {
          const response = await fetch(`/student/profile/${studentId}`);
          if (!response.ok) throw new Error('Failed to fetch profile');
          const data = await response.json();
          const student = data.student;
  
          document.getElementById('name').textContent =student.fullName;
          document.getElementById('year').textContent = student.year;
          document.getElementById('studentId').textContent=student.StudentID
  
        } catch (err) {
          console.error(err);
          alert('Error loading profile. Please try again.');
        }
      }
  
      loadProfile();