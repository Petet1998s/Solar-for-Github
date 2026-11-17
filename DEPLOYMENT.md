# ติดตั้ง Solar บนคลาวด์ (Hugging Face Spaces)

คู่มือนี้ deploy เว็บแอปเท่านั้น โมเดล AI เรียกผ่านผู้ให้บริการ API ที่รองรับ OpenAI API; ต้องมีบัญชีและ API key ของผู้ให้บริการเอง แอปไม่สามารถตอบ AI ได้จนกว่าจะตั้งค่าคีย์และ model ID ที่ใช้งานได้

## 1. เตรียม Space

1. เข้าบัญชี Hugging Face แล้วสร้าง Space แบบ **Docker**
2. เลือก hardware ฟรี (CPU ใช้รันเว็บ ไม่ได้รันโมเดลภาษาใหญ่)
3. เชื่อม Space กับ GitHub repo นี้ หรือ push โค้ดจาก branch `copilot/solar-chatbot-mvp` เข้า repository ของ Space
4. เปิดแท็บ **Settings → Variables and secrets**

## 2. เพิ่มค่าตั้งค่า

เพิ่มรายการต่อไปนี้ใน Settings ของ Space ห้าม commit ค่าลับลง GitHub:

| ชื่อ | ประเภท | ค่า |
|---|---|---|
| `SECRET_KEY` | Secret | สุ่มค่าอย่างน้อย 32 ตัวอักษร เช่น `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `APP_USERNAME` | Secret | ชื่อผู้ใช้ส่วนตัว (อย่างน้อย 3 ตัวอักษร) |
| `APP_PASSWORD` | Secret | รหัสผ่านไม่ซ้ำที่ยาวอย่างน้อย 16 ตัวอักษร |
| `OPENAI_API_KEY` | Secret | API key ของผู้ให้บริการโมเดลที่เลือก |
| `OPENAI_BASE_URL` | Variable | HTTPS OpenAI-compatible endpoint ของ provider ลงท้าย `/v1` |
| `OPENAI_MODEL` | Variable | model ID ที่ provider ระบุและบัญชีของคุณเรียกใช้ได้ |
| `COOKIE_SECURE` | Variable | `true` |

อย่าใช้ URL/model ID ตัวอย่างโดยไม่ตรวจเอกสาร provider ก่อน ราคา โควตาฟรี และชื่อโมเดลเปลี่ยนได้ ตรวจสอบเงื่อนไขการเก็บข้อมูลของ provider เพราะ prompt ถูกส่งไปให้ provider ประมวลผล

## 3. Build และทดสอบ

รอให้ Space build สำเร็จ จากนั้นเปิด URL ของ Space แล้วลองเข้าสู่ระบบและส่งข้อความสั้น ๆ ถ้าแอปขึ้นแต่แชตใช้ไม่ได้ ให้ตรวจ build/runtime logs ของ Space และยืนยัน endpoint, model ID, API key และโควตากับ provider โดยไม่เปิดเผยค่า key ใน log หรือในแชต

`/health` ตอบ `{"status":"ok"}` เฉพาะเมื่อเว็บ process ทำงาน ไม่ได้ตรวจว่า API key/model ใช้งานได้จริง

## ความปลอดภัยและข้อจำกัด

- ตั้ง Space เป็น private หรือเพิ่ม access control หากมี; source repository นี้เป็น public และผู้ใช้ที่เข้าถึงเว็บได้อาจใช้โควตา API ของเจ้าของ key
- ใช้รหัสผ่านสุ่มที่ไม่ใช้ซ้ำ และเก็บ secrets ใน Space settings เท่านั้น
- Free hosting และ model API อาจพักเครื่อง จำกัดโควตา หรือไม่พร้อมใช้งาน; ไม่มีการรับประกันฟรีไม่จำกัดหรือปลอดภัย 100%
- ระบบ login ปัจจุบันเป็นบัญชีร่วมหนึ่งชุด ไม่ใช่ระบบสมาชิก SaaS; rate limit ในหน่วยความจำไม่เหมาะกับหลาย instance/production
- ทดสอบก่อนใช้จริง และอย่าใส่ข้อมูลลับหรือข้อมูลลูกค้า จนกว่าจะเพิ่มระบบสมาชิก, rate limiting แบบ shared, monitoring และทำ security review

การ deploy ให้เสร็จจริงต้องทำในบัญชี Hugging Face ของเจ้าของ Space vàบัญชี provider เพราะผู้ช่วยนี้ไม่มีสิทธิ์เข้าถึงบัญชีหรือ secrets เหล่านั้น.
