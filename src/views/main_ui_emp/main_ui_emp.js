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
/********************************home*********/
document.getElementById('gradeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
        subject: document.getElementById('subject').value,
        year: document.getElementById('year').value,
        major: document.getElementById('major').value,
        studentId: document.getElementById('studentId').value,
        grade: document.getElementById('grade').value
    };

    fetch('http://localhost:4200/api/grades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(response => {
            const msg = document.getElementById('resultMessage');
            msg.textContent = "✅ تم حفظ العلامة بنجاح!";
            msg.style.color = "green";
            document.getElementById('gradeForm').reset();
        })
        .catch(error => {
            const msg = document.getElementById('resultMessage');
            msg.textContent = "❌ حدث خطأ أثناء الحفظ.";
            msg.style.color = "red";
            console.error(error);
        });
});

/*******************anoun*****************/

/**********************prof******************/
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
/****/
document.getElementById('adForm').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      title: formData.get('title'),
      content: formData.get('content')
    };

    const res = await fetch('/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Ad posted!');
      e.target.reset();
      loadAds(); // refresh ad list
    } else {
      alert('Failed to post ad');
    }
  });