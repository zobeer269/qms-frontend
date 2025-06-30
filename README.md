# نظام إدارة الجودة الشاملة (QMS) - الواجهة الخلفية

هذا المشروع يمثل الواجهة الخلفية (Backend) لتطبيق نظام إدارة الجودة (QMS) لمكتب علمي متخصص في قطاع الأدوية والمستلزمات الطبية. تم بناؤه باستخدام Django و Django REST Framework.

---

## الميزات الرئيسية

- **نظام مصادقة آمن:** باستخدام JWT (JSON Web Tokens).
- **إدارة المستخدمين والصلاحيات:** نظام أدوار متكامل (RBAC).
- **إدارة الوثائق:** دورة حياة كاملة للوثائق من الإنشاء إلى الأرشفة.
- **إدارة أحداث الجودة:** تسجيل ومتابعة تقارير عدم المطابقة (NCRs).
- **إدارة التدقيق:** تخطيط وجدولة عمليات التدقيق وتسجيل النتائج.
- **إدارة التدريب:** ربط التدريبات بالوثائق وتتبع سجلات الموظفين.
- **واجهة API متكاملة:** واجهات RESTful API لكل وحدات النظام.

---

## التقنيات المستخدمة

* **Python 3.13**
* **Django 5.2**
* **Django REST Framework**
* **Simple JWT** for token authentication
* **django-cors-headers** for handling Cross-Origin requests
* **Gunicorn** for production server

---

## كيفية الإعداد والتشغيل المحلي

لتشغيل هذا المشروع على جهازك المحلي، اتبع الخطوات التالية:

1.  **استنساخ المستودع:**
    ```bash
    git clone [https://github.com/YourUsername/qms-backend.git](https://github.com/YourUsername/qms-backend.git)
    cd qms-backend
    ```

2.  **إنشاء وتفعيل البيئة الافتراضية:**
    ```bash
    python -m venv venv
    # On Windows
    .\venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

3.  **تثبيت المكتبات المطلوبة:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **تطبيق الهجرات على قاعدة البيانات:**
    ```bash
    python manage.py migrate
    ```

5.  **(اختياري) إنشاء مستخدم خارق:**
    ```bash
    python manage.py createsuperuser
    ```

6.  **تشغيل خادم التطوير:**
    ```bash
    python manage.py runserver
    ```
    سيصبح التطبيق متاحًا على `http://127.0.0.1:8000`.
