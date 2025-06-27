
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
document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const profileImage = document.getElementById('profileImage');
    const imageUpload = document.getElementById('imageUpload');

    // عناصر المعلومات
    const infoValues = document.querySelectorAll('.info-value');
    const infoInputs = document.querySelectorAll('.edit-input');

    // حدث النقر على زر التعديل
    editBtn.addEventListener('click', function() {
        // إظهار حقول الإدخال وإخفاء النصوص
        infoValues.forEach(value => value.style.display = 'none');
        infoInputs.forEach(input => input.style.display = 'block');

        // إظهار أزرار الحفظ والإلغاء وإخفاء زر التعديل
        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        cancelBtn.style.display = 'block';
    });

    // حدث النقر على زر الحفظ
    saveBtn.addEventListener('click', function() {
        // تحديث النصوص بقيم حقول الإدخال
        infoValues[0].textContent = document.getElementById('nameInput').value;
        infoValues[1].textContent = document.getElementById('fatherNameInput').value;
        infoValues[2].textContent = document.getElementById('motherNameInput').value;
        infoValues[3].textContent = document.getElementById('phnumInput').value;
        infoValues[4].textContent = document.getElementById('yearInput').value;

        infoValues[5].textContent = document.getElementById('studentIdInput').value;

        // إظهار النصوص وإخفاء حقول الإدخال
        infoValues.forEach(value => value.style.display = 'block');
        infoInputs.forEach(input => input.style.display = 'none');

        // إظهار زر التعديل وإخفاء أزرار الحفظ والإلغاء
        editBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';

        // هنا يمكنك إضافة كود لحفظ البيانات في قاعدة البيانات
        alert('تم حفظ التغييرات بنجاح!');
    });

    // حدث النقر على زر الإلغاء
    cancelBtn.addEventListener('click', function() {
        // إظهار النصوص وإخفاء حقول الإدخال
        infoValues.forEach(value => value.style.display = 'block');
        infoInputs.forEach(input => input.style.display = 'none');

        // إظهار زر التعديل وإخفاء أزرار الحفظ والإلغاء
        editBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    });

    // حدث النقر على صورة البروفايل
    profileImage.addEventListener('click', function() {
        imageUpload.click();
    });

    // حدث تغيير صورة البروفايل
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function(event) {
                profileImage.src = event.target.result;
            }

            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // صورة افتراضية إذا لم يتم تحميل صورة
    profileImage.src = profileImage.src || 'https://via.placeholder.com/150';
});
/*************************announ***********************/
// عرض تاريخ اليوم تلقائيًا (يمكن تعديله لاحقًا من قاعدة البيانات)
document.getElementById('update-date').textContent = new Date().toLocaleDateString('ar-EG');

// هذه الدالة جاهزة لاستخدامها لاحقًا عند ربط قاعدة البيانات
/* function addAnnouncement(title, content, date) {
   const container = document.querySelector('.announcements-container');
   container.innerHTML =
     <div class="announcement-item">
       <h3 class="announcement-title">${title}</h3>
       <p class="announcement-content">${content}</p>
       <div class="announcement-meta">${date}</div>
     </div>
    + container.innerHTML;
 }*/
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


      async function loadProfile() {
        try {
          const response = await fetch('/student/profile', { credentials: 'include' });
          if (!response.ok) throw new Error('Failed to fetch profile');
          const data = await response.json();
          const student = data.student;
  
          document.getElementById('fullName').textContent = student.fullName;
          document.getElementById('email').textContent = student.email;
          document.getElementById('major').textContent = student.major;
          document.getElementById('year').textContent = student.year;
  
        } catch (err) {
          console.error(err);
          alert('Error loading profile. Please try again.');
        }
      }
  
      loadProfile();